import { existsSync } from 'node:fs'
import { copyFile, mkdir, rm, writeFile } from 'node:fs/promises'
import path from 'node:path'

import { stringify } from 'yaml'

import { parseApkg, type Note } from './parse_anki.ts'

type Run = {
  text: string
  strong?: boolean
  highlight?: boolean
  above?: string
  below?: string
  link?: string
}

type MediaRef =
  | { kind: 'image'; src: string; alt: string }
  | { kind: 'audio' | 'video'; src: string; label: string }

type ImportedMedia = {
  filename: string
  fieldName: string
  alt?: string
}

type OpenNote = {
  id: string
  type: 'prompt_response'
  prompt: string
  answer: string
  media: MediaRef[]
}

const defaultDeckPath = 'stuff/Kaishi.1.5k.v2.4.1.apkg'
const defaultOutputDir = 'kaishi-open-deck-mvp-html'
const importWorkDir = '.tmp-kaishi-open-deck-import'
const notesPerFile = 250
const overlineMark = '￣'
const dropMark = '＼'
const answerFields = [
  'Word Meaning',
  'Word Reading',
  'Word Furigana',
  'Sentence Meaning',
  'Sentence Furigana',
  'Notes',
  'Pitch Accent',
  'Pitch Accent Notes',
  'Frequency',
] as const
const expectedFieldNames = new Set([
  'Word',
  'Sentence',
  ...answerFields,
  'Word Audio',
  'Sentence Audio',
  'Picture',
])

function usage(): never {
  console.error('Usage: bun stuff/convert-kaishi-to-open-deck.ts [apkg] [output-dir] [--force]')
  process.exit(2)
}

function parseArgs(): { apkgPath: string; outputDir: string; force: boolean } {
  const positional: string[] = []
  let force = false

  for (const arg of process.argv.slice(2)) {
    if (arg === '--force') {
      force = true
    } else if (arg.startsWith('-')) {
      usage()
    } else {
      positional.push(arg)
    }
  }

  if (positional.length > 2) usage()

  return {
    apkgPath: positional[0] ?? defaultDeckPath,
    outputDir: positional[1] ?? defaultOutputDir,
    force,
  }
}

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')
}

function decodeHtmlEntities(value: string): string {
  return value.replace(/&(#x?[0-9a-fA-F]+|[a-zA-Z]+);/g, (match, entity: string) => {
    if (entity.startsWith('#x')) return String.fromCodePoint(Number.parseInt(entity.slice(2), 16))
    if (entity.startsWith('#')) return String.fromCodePoint(Number.parseInt(entity.slice(1), 10))

    return { amp: '&', gt: '>', lt: '<', nbsp: ' ', quot: '"', apos: "'" }[entity] ?? match
  })
}

function stripMedia(value: string): string {
  return value.replace(/\[sound:[^\]]+]/gi, '').replace(/<img\b[^>]*>/gi, '')
}

function extractAttr(tag: string, name: string): string | undefined {
  const match = tag.match(new RegExp(`\\b${name}=["']([^"']*)["']`, 'i'))
  return match?.[1] ? decodeHtmlEntities(match[1]) : undefined
}

function safeLink(value: string | undefined): string | undefined {
  return value && /^(https?:|mailto:)/i.test(value) ? value : undefined
}

function isReadingBaseChar(char: string): boolean {
  return !/[\s[\]{}()（）「」『』、。,.!?！？;；:："']/u.test(char)
}

function pushTextWithReadings(runs: Run[], value: string, strong: boolean, link?: string): void {
  let buffer = ''

  for (let index = 0; index < value.length; index += 1) {
    if (value[index] !== '[') {
      buffer += value[index]
      continue
    }

    const closeIndex = value.indexOf(']', index + 1)
    if (closeIndex === -1) {
      buffer += value[index]
      continue
    }

    const reading = value.slice(index + 1, closeIndex)
    const chars = Array.from(buffer)
    let start = chars.length
    while (start > 0 && isReadingBaseChar(chars[start - 1] ?? '')) start -= 1
    const prefix = chars
      .slice(0, start)
      .join('')
      .replace(/[ \u00a0]+$/u, '')
    const base = chars.slice(start).join('')

    if (!base || !reading) {
      buffer += value.slice(index, closeIndex + 1)
      index = closeIndex
      continue
    }

    if (prefix) runs.push({ text: prefix, strong, link })
    runs.push({ text: base, strong, link, above: reading })
    buffer = ''
    index = closeIndex
  }

  if (buffer) runs.push({ text: buffer, strong, link })
}

function sourceHtmlToRuns(value: string, readings = false): Run[] {
  const runs: Run[] = []
  let strongDepth = 0
  const linkStack: Array<string | undefined> = []
  let activeLink: string | undefined

  for (const match of stripMedia(value).matchAll(/<[^>]+>|[^<]+/g)) {
    const token = match[0]
    if (token.startsWith('<')) {
      const tag = token.toLowerCase()
      if (/^<\s*br\b/.test(tag) || /^<\s*\/\s*(div|p|li|tr|h[1-6])\s*>/.test(tag)) {
        runs.push({ text: '\n' })
      } else if (/^<\s*(b|strong)\b/.test(tag)) {
        strongDepth += 1
      } else if (/^<\s*\/\s*(b|strong)\s*>/.test(tag)) {
        strongDepth = Math.max(0, strongDepth - 1)
      } else if (/^<\s*a\b/.test(tag)) {
        linkStack.push(activeLink)
        activeLink = safeLink(extractAttr(token, 'href'))
      } else if (/^<\s*\/\s*a\s*>/.test(tag)) {
        activeLink = linkStack.pop()
      }
      continue
    }

    const text = decodeHtmlEntities(token)
    if (readings) pushTextWithReadings(runs, text, strongDepth > 0, activeLink)
    else if (text) runs.push({ text, strong: strongDepth > 0, link: activeLink })
  }

  return runs
}

type PitchSpan = { inlineBlock: boolean; overline: boolean; highlight: boolean; runStart: number }

function pitchAccentToRuns(value: string): Run[] {
  const runs: Run[] = []
  const spans: PitchSpan[] = []

  for (const match of stripMedia(value).matchAll(/<[^>]+>|[^<]+/g)) {
    const token = match[0]
    if (!token.startsWith('<')) {
      const text = decodeHtmlEntities(token)
      if (text) {
        runs.push({
          text,
          above: spans.some((span) => span.overline) ? overlineMark : undefined,
          highlight: spans.some((span) => span.highlight),
        })
      }
      continue
    }

    const tag = token.toLowerCase()
    if (/^<\s*br\b/.test(tag) || /^<\s*\/\s*(div|p|li|tr|h[1-6])\s*>/.test(tag)) {
      runs.push({ text: '\n' })
    } else if (/^<\s*\/\s*span\s*>/.test(tag)) {
      spans.pop()
    } else if (/^<\s*span\b/.test(tag)) {
      const style = extractAttr(token, 'style')?.toLowerCase() ?? ''
      const target = [...spans].reverse().find((span) => span.inlineBlock)
      if (style.includes('border-top') && target) {
        for (let index = target.runStart; index < runs.length; index += 1)
          runs[index]!.above = overlineMark
        if (style.includes('border-right') && runs.length > target.runStart)
          runs[runs.length - 1]!.below = dropMark
      }
      spans.push({
        inlineBlock: style.includes('display:inline-block'),
        overline: style.includes('text-decoration:overline'),
        highlight: /(?:^|;)\s*color\s*:/i.test(style),
        runStart: runs.length,
      })
    }
  }

  return runs
}

function runsToHtml(runs: Run[]): string {
  return runs
    .map((run) => {
      let html = escapeHtml(run.text).replaceAll('\n', '<br>')
      if (run.strong) html = `<strong>${html}</strong>`
      if (run.highlight) html = `<mark>${html}</mark>`
      if (run.above) html = `<ruby>${html}<rt>${escapeHtml(run.above)}</rt></ruby>`
      if (run.below) html += `<sub>${escapeHtml(run.below)}</sub>`
      if (run.link) html = `<a href="${escapeHtml(run.link)}">${html}</a>`
      return html
    })
    .join('')
    .replace(/(?:<br>){3,}/g, '<br><br>')
    .replace(/^(?:<br>)+|(?:<br>)+$/g, '')
}

function fieldHtml(fieldName: string, value: string): string {
  if (
    fieldName === 'Pitch Accent' ||
    (fieldName === 'Pitch Accent Notes' && /<\s*span\b/i.test(value))
  ) {
    return runsToHtml(pitchAccentToRuns(value))
  }

  const readings = fieldName === 'Word Furigana' || fieldName === 'Sentence Furigana'
  return runsToHtml(sourceHtmlToRuns(value, readings))
}

function plainText(value: string): string {
  return sourceHtmlToRuns(value)
    .map((run) => run.text)
    .join('')
    .replace(/\s+/g, ' ')
    .trim()
}

function languageFor(value: string): 'ja' | 'en' {
  const japanese = (
    plainText(value).match(/[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}]/gu) ?? []
  ).length
  const latin = (plainText(value).match(/[A-Za-z]/g) ?? []).length
  return japanese > latin ? 'ja' : 'en'
}

function slugify(value: string): string {
  return (
    value
      .normalize('NFKD')
      .replace(/[^\p{Letter}\p{Number}]+/gu, '-')
      .replace(/^-+|-+$/g, '')
      .toLowerCase() || 'note'
  )
}

function noteId(note: Note, index: number): string {
  return `kaishi-${String(index + 1).padStart(4, '0')}-${slugify(plainText(note.fields.Word ?? '')).slice(0, 48)}`
}

function buildPrompt(fields: Record<string, string>): string {
  const word = fields.Word ?? ''
  const sentence = fields.Sentence ?? ''
  return `<p lang="${languageFor(word)}">${fieldHtml('Word', word)}</p><h2>Sentence</h2><p lang="${languageFor(sentence)}">${fieldHtml('Sentence', sentence)}</p>`
}

function buildAnswer(fields: Record<string, string>): string {
  const entries = answerFields.flatMap((fieldName) => {
    const value = fields[fieldName] ?? ''
    const html = fieldHtml(fieldName, value)
    return html ? [`<dt>${fieldName}</dt><dd lang="${languageFor(value)}">${html}</dd>`] : []
  })

  return `<dl>${entries.join('')}</dl>`
}

function extractMedia(fields: Record<string, string>): ImportedMedia[] {
  const media: ImportedMedia[] = []
  for (const [fieldName, rawValue] of Object.entries(fields)) {
    for (const match of rawValue.matchAll(/\[sound:([^\]]+)]/gi)) {
      if (match[1]) media.push({ filename: match[1], fieldName })
    }
    for (const match of rawValue.matchAll(/<img\b[^>]*>/gi)) {
      const src = extractAttr(match[0], 'src')
      if (src) media.push({ filename: src, fieldName, alt: extractAttr(match[0], 'alt') })
    }
  }
  return media
}

function kindForFilename(filename: string): MediaRef['kind'] {
  const extension = path.extname(filename).toLowerCase()
  if (['.mp3', '.m4a', '.ogg', '.oga', '.wav', '.flac', '.aac'].includes(extension)) return 'audio'
  if (['.mp4', '.webm', '.mov', '.m4v'].includes(extension)) return 'video'
  return 'image'
}

function mediaSubdir(kind: MediaRef['kind']): string {
  return kind === 'audio' ? 'audio' : kind === 'video' ? 'video' : 'images'
}

function buildOpenNote(note: Note, index: number, copiedMedia: Map<string, string>): OpenNote {
  for (const fieldName of Object.keys(note.fields)) {
    if (!expectedFieldNames.has(fieldName))
      throw new Error(`Unexpected Kaishi field "${fieldName}" on note ${note.id}`)
  }

  const word = plainText(note.fields.Word ?? '')
  const media = extractMedia(note.fields).flatMap((item): MediaRef[] => {
    const src = copiedMedia.get(item.filename)
    if (!src) throw new Error(`Missing copied media "${item.filename}" on note ${note.id}`)
    const kind = kindForFilename(item.filename)
    if (kind === 'image') return [{ kind, src, alt: item.alt || `Illustration for ${word}` }]
    return [{ kind, src, label: item.fieldName }]
  })

  return {
    id: noteId(note, index),
    type: 'prompt_response',
    prompt: buildPrompt(note.fields),
    answer: buildAnswer(note.fields),
    media,
  }
}

async function copyReferencedMedia(
  notes: Note[],
  parserMediaDir: string,
  outputDir: string,
): Promise<Map<string, string>> {
  const copied = new Map<string, string>()
  for (const note of notes) {
    for (const item of extractMedia(note.fields)) {
      if (copied.has(item.filename)) continue
      if (path.basename(item.filename) !== item.filename)
        throw new Error(`Unsafe media filename: ${item.filename}`)

      const kind = kindForFilename(item.filename)
      const relativeOutputPath = path.posix.join('assets', mediaSubdir(kind), item.filename)
      const sourcePath = path.join(parserMediaDir, item.filename)
      if (!existsSync(sourcePath)) throw new Error(`Missing media file: ${item.filename}`)

      const outputPath = path.join(outputDir, relativeOutputPath)
      await mkdir(path.dirname(outputPath), { recursive: true })
      await copyFile(sourcePath, outputPath)
      copied.set(item.filename, relativeOutputPath)
    }
  }
  return copied
}

async function writeYaml(filePath: string, value: unknown): Promise<void> {
  await mkdir(path.dirname(filePath), { recursive: true })
  await writeFile(filePath, stringify(value, { lineWidth: 0 }))
}

async function main(): Promise<void> {
  const { apkgPath, outputDir, force } = parseArgs()
  if (existsSync(outputDir)) {
    if (!force)
      throw new Error(`Output directory already exists: ${outputDir}. Pass --force to replace it.`)
    await rm(outputDir, { recursive: true, force: true })
  }

  await rm(importWorkDir, { recursive: true, force: true })
  const parsed = await parseApkg(apkgPath, importWorkDir, { extractMedia: true })
  await mkdir(outputDir, { recursive: true })
  await writeYaml(path.join(outputDir, 'deck.yaml'), {
    format: 'open-deck',
    id: 'kaishi-1-5k',
    title: parsed.meta.deckNames[0] ?? 'Kaishi 1.5k',
  })

  const copiedMedia = await copyReferencedMedia(
    parsed.notes,
    path.join(importWorkDir, 'media'),
    outputDir,
  )
  const openNotes = parsed.notes.map((note, index) => buildOpenNote(note, index, copiedMedia))
  for (let start = 0; start < openNotes.length; start += notesPerFile) {
    const chunk = openNotes.slice(start, start + notesPerFile)
    const first = String(start + 1).padStart(4, '0')
    const last = String(start + chunk.length).padStart(4, '0')
    await writeYaml(path.join(outputDir, 'notes', `${first}-${last}.yaml`), { notes: chunk })
  }

  await rm(importWorkDir, { recursive: true, force: true })
  console.log(`Wrote ${openNotes.length} HTML notes to ${outputDir}`)
  console.log(`Copied ${copiedMedia.size} referenced media files`)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
