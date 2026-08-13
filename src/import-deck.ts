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

export async function importDeck(
  files: File[],
  onProgress: (importedBytes: number, totalBytes: number) => void,
) {
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
    importStatus: 'importing',
    importedBytes,
    totalBytes,
    studyDay: 0,
    newStudied: 0,
    reviewsStudied: 0,
  })
  onProgress(importedBytes, totalBytes)

  try {
    const assetFilesByPath = new Map(
      assetFiles.map((file) => [file.webkitRelativePath.slice(`${root}/`.length), file]),
    )
    // Some iOS directory pickers compatibility-normalize filename characters.
    const normalizedAssetFiles = new Map<string, File | null>()
    for (const file of assetFiles) {
      const assetPath = file.webkitRelativePath.slice(`${root}/`.length)
      const normalizedPath = assetPath.normalize('NFKC')
      normalizedAssetFiles.set(
        normalizedPath,
        normalizedAssetFiles.has(normalizedPath) ? null : file,
      )
    }
    const resolveAssetPath = (assetPath: string, issuePath: string): string => {
      const invalid = () =>
        new Error(`${issuePath}: ${assetPath} does not name a file inside assets/`)
      if (!assetPath.startsWith('assets/') || assetPath.split('/').includes('..')) throw invalid()

      const exactFile = assetFilesByPath.get(assetPath)
      if (exactFile) return assetPath

      const normalizedPath = assetPath.normalize('NFKC')
      if (!normalizedPath.startsWith('assets/') || normalizedPath.split('/').includes('..')) {
        throw invalid()
      }

      const normalizedFile = normalizedAssetFiles.get(normalizedPath)
      if (normalizedFile) {
        return normalizedFile.webkitRelativePath.slice(`${root}/`.length)
      }

      throw invalid()
    }

    const noteIds = new Set<string>()

    for (const file of noteFiles) {
      const document = validate(NoteFileSchema, await parseYaml(file), file.webkitRelativePath)
      const notes = document.notes.map((note, index) => {
        if (noteIds.has(note.id)) {
          throw new Error(`${file.webkitRelativePath}.notes.${index}.id: duplicate ${note.id}`)
        }
        noteIds.add(note.id)

        const issuePath = `${file.webkitRelativePath}.notes.${index}`
        const resolvedNote =
          note.type === 'occlusion'
            ? {
                ...note,
                image: { ...note.image, src: resolveAssetPath(note.image.src, issuePath) },
              }
            : {
                ...note,
                media: note.media.map((media) => ({
                  ...media,
                  src: resolveAssetPath(media.src, issuePath),
                })),
              }

        return {
          ...resolvedNote,
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
        await db.decks.update(manifest.id, { importedBytes })
      })
      onProgress(importedBytes, totalBytes)
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
      onProgress(importedBytes, totalBytes)
    }

    await db.decks.update(manifest.id, { importStatus: 'ready', importedBytes: totalBytes })
    onProgress(totalBytes, totalBytes)
    return manifest.id
  } catch (error) {
    await deleteDeck(manifest.id)
    throw error
  }
}
