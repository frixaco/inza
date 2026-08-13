import * as v from 'valibot'
import { parse } from 'yaml'
import { createStoredCards, db, dbReady, deleteDeck } from './db'
import { DeckNoteSchema } from './notes'

const RequiredStringSchema = v.pipe(v.string(), v.nonEmpty())
const ManifestSchema = v.strictObject({
  format: v.literal('open-deck'),
  id: RequiredStringSchema,
  title: RequiredStringSchema,
})
const NoteFileSchema = v.strictObject({
  notes: v.array(DeckNoteSchema),
})

function validate<TSchema extends v.BaseSchema<unknown, unknown, v.BaseIssue<unknown>>>(
  schema: TSchema,
  input: unknown,
  filePath: string,
): v.InferOutput<TSchema> {
  const result = v.safeParse(schema, input)
  if (result.success) return result.output

  const issue = result.issues[0]
  const path = v.getDotPath(issue)
  throw new Error(`${filePath}${path ? `.${path}` : ''}: ${issue.message}`)
}

async function parseYaml(file: File) {
  try {
    return parse(await file.text()) as unknown
  } catch (error) {
    throw new Error(
      `${file.webkitRelativePath}: invalid YAML: ${error instanceof Error ? error.message : String(error)}`,
    )
  }
}

export async function importDeck(files: File[]) {
  await dbReady
  const root = files[0]?.webkitRelativePath.split('/')[0]
  if (!root || files.some((file) => !file.webkitRelativePath.startsWith(`${root}/`))) {
    throw new Error('Choose one Open Deck directory')
  }

  const deckFile = files.find((file) => file.webkitRelativePath === `${root}/deck.yaml`)
  const noteFiles = files
    .filter(
      (file) => file.webkitRelativePath.startsWith(`${root}/notes/`) && /\.ya?ml$/i.test(file.name),
    )
    .sort((left, right) => left.webkitRelativePath.localeCompare(right.webkitRelativePath))
  const assetFiles = files.filter((file) => file.webkitRelativePath.startsWith(`${root}/assets/`))
  if (!deckFile || noteFiles.length === 0) {
    throw new Error('Choose an Open Deck directory with deck.yaml and notes/*.yaml')
  }

  const manifest = validate(ManifestSchema, await parseYaml(deckFile), deckFile.webkitRelativePath)
  if (await db.decks.get(manifest.id)) throw new Error(`Deck ${manifest.id} already exists`)

  const totalBytes = [deckFile, ...noteFiles, ...assetFiles].reduce(
    (sum, file) => sum + file.size,
    0,
  )
  let importedBytes = deckFile.size
  await db.decks.add({
    id: manifest.id,
    name: manifest.title,
    done: 0,
    due: 0,
    todo: 0,
    importStatus: 'importing',
    importedBytes,
    totalBytes,
    studyDay: 0,
    newStudied: 0,
    reviewsStudied: 0,
  })

  try {
    const assetPaths = new Set(
      assetFiles.map((file) => file.webkitRelativePath.slice(`${root}/`.length)),
    )
    const noteIds = new Set<string>()

    for (const file of noteFiles) {
      const document = validate(NoteFileSchema, await parseYaml(file), file.webkitRelativePath)
      const notes = document.notes.map((note, index) => {
        if (noteIds.has(note.id)) {
          throw new Error(`${file.webkitRelativePath}.notes.${index}.id: duplicate ${note.id}`)
        }
        noteIds.add(note.id)

        const mediaPaths =
          note.type === 'occlusion' ? [note.image.src] : note.media.map(({ src }) => src)
        for (const path of mediaPaths) {
          if (
            !path.startsWith('assets/') ||
            path.split('/').includes('..') ||
            !assetPaths.has(path)
          ) {
            throw new Error(
              `${file.webkitRelativePath}.notes.${index}: ${path} does not name a file inside assets/`,
            )
          }
        }

        return {
          ...note,
          id: JSON.stringify([manifest.id, note.id]),
          noteId: note.id,
          deckId: manifest.id,
        }
      })

      const cards = notes.flatMap(createStoredCards)
      importedBytes += file.size
      await db.transaction('rw', db.decks, db.notes, db.cards, async () => {
        await db.notes.bulkAdd(notes)
        await db.cards.bulkAdd(cards)
        await db.decks.update(manifest.id, { importedBytes, todo: cards.length })
      })
    }

    for (const file of assetFiles) {
      const path = file.webkitRelativePath.slice(`${root}/`.length)
      const media = {
        id: JSON.stringify([manifest.id, path]),
        deckId: manifest.id,
        path,
        blob: file,
      }
      importedBytes += file.size
      await db.transaction('rw', db.decks, db.media, async () => {
        await db.media.add(media)
        await db.decks.update(manifest.id, { importedBytes })
      })
    }

    await db.decks.update(manifest.id, { importStatus: 'ready', importedBytes: totalBytes })
    return manifest.id
  } catch (error) {
    await deleteDeck(manifest.id)
    throw error
  }
}
