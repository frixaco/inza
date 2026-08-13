import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs'
import path from 'node:path'

type Issue = {
  path: string
  message: string
}

const noteTypes = new Set(['prompt_response', 'cloze', 'occlusion'])
const roles = new Set(['main', 'context', 'support', 'note'])
const mediaKinds = new Set(['image', 'audio', 'video'])
const inlineMarks = new Set(['strong', 'emphasis', 'code', 'strike', 'highlight'])
const answerModes = new Set(['reveal', 'typed'])
const maskShapes = new Set(['rect', 'ellipse', 'polygon'])
const manifestFields = new Set(['format', 'id', 'title', 'description', 'language', 'license'])
const noteFileFields = new Set(['defaults', 'notes'])
const sharedNoteFields = new Set([
  'id',
  'type',
  'deck',
  'tags',
  'language',
  'answer_mode',
  'media',
  'references',
  'provenance',
])
const promptResponseFields = new Set([...sharedNoteFields, 'prompt', 'answer', 'hint'])
const clozeFields = new Set([...sharedNoteFields, 'text', 'context', 'extra'])
const occlusionFields = new Set([...sharedNoteFields, 'image', 'masks', 'context', 'extra'])
const defaultFields = new Set(['deck', 'tags', 'language', 'answer_mode', 'references'])
const contentBlockFields = new Set(['role', 'label', 'text', 'runs', 'language', 'media'])
const runFields = new Set(['text', 'marks', 'above', 'below', 'link'])
const mediaFields = new Set(['kind', 'src', 'role', 'label', 'alt'])
const referenceFields = new Set(['title', 'url', 'locator'])
const occlusionImageFields = new Set(['src', 'alt', 'width', 'height'])
const occlusionMaskFields = new Set(['id', 'answer', 'hint', 'group', 'shape'])
const rectShapeFields = new Set(['kind', 'x', 'y', 'w', 'h'])
const polygonShapeFields = new Set(['kind', 'points'])

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function parseYamlFile(filePath: string, issues: Issue[]): unknown {
  try {
    return Bun.YAML.parse(readFileSync(filePath, 'utf8'))
  } catch (error) {
    issues.push({
      path: filePath,
      message: `invalid YAML: ${error instanceof Error ? error.message : String(error)}`,
    })
    return undefined
  }
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim() !== ''
}

function validateKnownFields(
  value: Record<string, unknown>,
  allowedFields: Set<string>,
  issuePath: string,
  issues: Issue[],
): void {
  for (const key of Object.keys(value)) {
    if (!allowedFields.has(key)) {
      issues.push({ path: `${issuePath}.${key}`, message: 'unknown field' })
    }
  }
}

function validateStringList(
  value: unknown,
  issuePath: string,
  fieldName: string,
  issues: Issue[],
): void {
  if (value === undefined) {
    return
  }

  if (!Array.isArray(value)) {
    issues.push({ path: issuePath, message: `${fieldName} must be a list` })
    return
  }

  value.forEach((item, index) => {
    if (!isNonEmptyString(item)) {
      issues.push({
        path: `${issuePath}[${index}]`,
        message: `${fieldName} item must be a non-empty string`,
      })
    }
  })
}

function listYamlFiles(dir: string): string[] {
  const result: string[] = []

  for (const name of readdirSync(dir).sort()) {
    const filePath = path.join(dir, name)
    const stat = statSync(filePath)

    if (stat.isDirectory()) {
      result.push(...listYamlFiles(filePath))
      continue
    }

    if (/\.ya?ml$/i.test(name)) {
      result.push(filePath)
    }
  }

  return result.sort((left, right) => left.localeCompare(right))
}

function validateAssetPath(
  deckRoot: string,
  src: unknown,
  issuePath: string,
  issues: Issue[],
): void {
  if (!isNonEmptyString(src)) {
    issues.push({ path: issuePath, message: 'asset src must be a non-empty string' })
    return
  }

  const root = path.resolve(deckRoot)
  const resolved = path.resolve(root, src)

  if (resolved !== root && !resolved.startsWith(`${root}${path.sep}`)) {
    issues.push({ path: issuePath, message: `media src escapes deck root: ${src}` })
    return
  }

  if (!existsSync(resolved) || !statSync(resolved).isFile()) {
    issues.push({ path: issuePath, message: `media file does not exist: ${src}` })
  }
}

function validateContent(
  deckRoot: string,
  value: unknown,
  issuePath: string,
  issues: Issue[],
): void {
  if (typeof value === 'string') {
    if (!isNonEmptyString(value)) {
      issues.push({ path: issuePath, message: 'content string must not be empty' })
    }
    return
  }

  if (!Array.isArray(value)) {
    issues.push({ path: issuePath, message: 'content must be a string or a block list' })
    return
  }

  if (value.length === 0) {
    issues.push({ path: issuePath, message: 'content block list must not be empty' })
    return
  }

  value.forEach((block, index) => {
    const blockPath = `${issuePath}[${index}]`

    if (!isRecord(block)) {
      issues.push({ path: blockPath, message: 'content block must be an object' })
      return
    }

    validateKnownFields(block, contentBlockFields, blockPath, issues)

    if (typeof block.role !== 'string' || !roles.has(block.role)) {
      issues.push({
        path: blockPath,
        message: 'content block role must be one of main, context, support, note',
      })
    }

    const hasText = isNonEmptyString(block.text)
    const hasRuns = Array.isArray(block.runs) && block.runs.length > 0
    const hasMedia = Array.isArray(block.media) && block.media.length > 0

    if (!hasText && !hasRuns && !hasMedia) {
      issues.push({ path: blockPath, message: 'content block must include text, runs, or media' })
    }

    if (block.text !== undefined && block.runs !== undefined) {
      issues.push({
        path: blockPath,
        message: 'content block must not include both text and runs',
      })
    }

    if (block.text !== undefined && typeof block.text !== 'string') {
      issues.push({ path: blockPath, message: 'content block text must be a string' })
    }

    validateRuns(block.runs, `${blockPath}.runs`, issues)

    if (block.label !== undefined && !isNonEmptyString(block.label)) {
      issues.push({ path: blockPath, message: 'content block label must be a non-empty string' })
    }

    if (block.language !== undefined && !isNonEmptyString(block.language)) {
      issues.push({
        path: blockPath,
        message: 'content block language must be a non-empty string',
      })
    }

    validateMedia(deckRoot, block.media, `${blockPath}.media`, issues)
  })
}

function validateRuns(runs: unknown, issuePath: string, issues: Issue[]): void {
  if (runs === undefined) {
    return
  }

  if (!Array.isArray(runs)) {
    issues.push({ path: issuePath, message: 'runs must be a list' })
    return
  }

  if (runs.length === 0) {
    issues.push({ path: issuePath, message: 'runs must not be empty' })
    return
  }

  runs.forEach((run, index) => {
    const runPath = `${issuePath}[${index}]`

    if (typeof run === 'string') {
      if (run === '') {
        issues.push({ path: runPath, message: 'run string must not be empty' })
      }
      return
    }

    if (!isRecord(run)) {
      issues.push({ path: runPath, message: 'run must be a string or an object' })
      return
    }

    validateKnownFields(run, runFields, runPath, issues)

    if (typeof run.text !== 'string' || run.text === '') {
      issues.push({ path: runPath, message: 'run text must be a non-empty string' })
    }

    if (run.above !== undefined && !isNonEmptyString(run.above)) {
      issues.push({ path: runPath, message: 'run above must be a non-empty string' })
    }

    if (run.below !== undefined && !isNonEmptyString(run.below)) {
      issues.push({ path: runPath, message: 'run below must be a non-empty string' })
    }

    if (run.link !== undefined && !isNonEmptyString(run.link)) {
      issues.push({ path: runPath, message: 'run link must be a non-empty string' })
    }

    if (run.marks !== undefined) {
      if (!Array.isArray(run.marks)) {
        issues.push({ path: `${runPath}.marks`, message: 'run marks must be a list' })
        return
      }

      const seenMarks = new Set<string>()
      run.marks.forEach((mark, markIndex) => {
        if (typeof mark !== 'string' || !inlineMarks.has(mark)) {
          issues.push({
            path: `${runPath}.marks[${markIndex}]`,
            message: 'run mark must be one of strong, emphasis, code, strike, highlight',
          })
        } else if (seenMarks.has(mark)) {
          issues.push({
            path: `${runPath}.marks[${markIndex}]`,
            message: `duplicate run mark: ${mark}`,
          })
        } else {
          seenMarks.add(mark)
        }
      })

      if (run.marks.length === 0) {
        issues.push({ path: `${runPath}.marks`, message: 'run marks must not be empty' })
      }
    }
  })
}

function validateMedia(deckRoot: string, media: unknown, issuePath: string, issues: Issue[]): void {
  if (media === undefined) {
    return
  }

  if (!Array.isArray(media)) {
    issues.push({ path: issuePath, message: 'media must be a list' })
    return
  }

  media.forEach((item, index) => {
    const itemPath = `${issuePath}[${index}]`

    if (!isRecord(item)) {
      issues.push({ path: itemPath, message: 'media item must be an object' })
      return
    }

    validateKnownFields(item, mediaFields, itemPath, issues)

    if (typeof item.kind !== 'string' || !mediaKinds.has(item.kind)) {
      issues.push({ path: itemPath, message: 'media kind must be one of image, audio, video' })
    }

    if (item.role !== undefined && (typeof item.role !== 'string' || !roles.has(item.role))) {
      issues.push({
        path: itemPath,
        message: 'media role must be one of main, context, support, note',
      })
    }

    if (item.label !== undefined && !isNonEmptyString(item.label)) {
      issues.push({ path: itemPath, message: 'media label must be a non-empty string' })
    }

    if (item.alt !== undefined && typeof item.alt !== 'string') {
      issues.push({ path: itemPath, message: 'media alt must be a string' })
    }

    validateAssetPath(deckRoot, item.src, `${itemPath}.src`, issues)
  })
}

function validateReferences(value: unknown, issuePath: string, issues: Issue[]): void {
  if (value === undefined) {
    return
  }

  if (!Array.isArray(value)) {
    issues.push({ path: issuePath, message: 'references must be a list' })
    return
  }

  if (value.length === 0) {
    issues.push({ path: issuePath, message: 'references must not be empty' })
    return
  }

  value.forEach((reference, index) => {
    const referencePath = `${issuePath}[${index}]`

    if (!isRecord(reference)) {
      issues.push({ path: referencePath, message: 'reference must be an object' })
      return
    }

    validateKnownFields(reference, referenceFields, referencePath, issues)

    if (reference.title !== undefined && !isNonEmptyString(reference.title)) {
      issues.push({ path: referencePath, message: 'reference title must be a non-empty string' })
    }

    if (reference.url !== undefined && !isNonEmptyString(reference.url)) {
      issues.push({ path: referencePath, message: 'reference url must be a non-empty string' })
    }

    if (reference.locator !== undefined && !isNonEmptyString(reference.locator)) {
      issues.push({ path: referencePath, message: 'reference locator must be a non-empty string' })
    }

    if (
      reference.title === undefined &&
      reference.url === undefined &&
      reference.locator === undefined
    ) {
      issues.push({
        path: referencePath,
        message: 'reference must include title, url, or locator',
      })
    }
  })
}

function validateSharedNoteFields(
  note: Record<string, unknown>,
  issuePath: string,
  issues: Issue[],
): void {
  if (note.deck !== undefined && !isNonEmptyString(note.deck)) {
    issues.push({ path: `${issuePath}.deck`, message: 'deck must be a non-empty string' })
  }

  if (note.language !== undefined && !isNonEmptyString(note.language)) {
    issues.push({ path: `${issuePath}.language`, message: 'language must be a non-empty string' })
  }

  if (
    note.answer_mode !== undefined &&
    (typeof note.answer_mode !== 'string' || !answerModes.has(note.answer_mode))
  ) {
    issues.push({
      path: `${issuePath}.answer_mode`,
      message: 'answer_mode must be one of reveal, typed',
    })
  }

  validateStringList(note.tags, `${issuePath}.tags`, 'tags', issues)
  validateReferences(note.references, `${issuePath}.references`, issues)

  if (note.provenance !== undefined && !isRecord(note.provenance)) {
    issues.push({ path: `${issuePath}.provenance`, message: 'provenance must be an object' })
  }
}

function validatePromptResponse(
  deckRoot: string,
  note: Record<string, unknown>,
  issuePath: string,
  issues: Issue[],
): void {
  validateKnownFields(note, promptResponseFields, issuePath, issues)

  if (!('prompt' in note)) {
    issues.push({ path: issuePath, message: 'prompt_response note requires prompt' })
  } else {
    validateContent(deckRoot, note.prompt, `${issuePath}.prompt`, issues)
  }

  if (!('answer' in note)) {
    issues.push({ path: issuePath, message: 'prompt_response note requires answer' })
  } else {
    validateContent(deckRoot, note.answer, `${issuePath}.answer`, issues)
  }

  if ('hint' in note) {
    validateContent(deckRoot, note.hint, `${issuePath}.hint`, issues)
  }
}

function validateCloze(
  deckRoot: string,
  note: Record<string, unknown>,
  issuePath: string,
  issues: Issue[],
): void {
  validateKnownFields(note, clozeFields, issuePath, issues)

  if (!('text' in note)) {
    issues.push({ path: issuePath, message: 'cloze note requires text' })
    return
  }

  validateContent(deckRoot, note.text, `${issuePath}.text`, issues)
  const rawText = typeof note.text === 'string' ? note.text : JSON.stringify(note.text)

  if (!/\{\{[^}:]+::[^}]+}}/.test(rawText)) {
    issues.push({
      path: issuePath,
      message: 'cloze note text must contain at least one cloze marker',
    })
  }

  if ('context' in note) {
    validateContent(deckRoot, note.context, `${issuePath}.context`, issues)
  }

  if ('extra' in note) {
    validateContent(deckRoot, note.extra, `${issuePath}.extra`, issues)
  }
}

function validateNumber(value: unknown, issuePath: string, issues: Issue[]): void {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    issues.push({ path: issuePath, message: 'must be a finite number' })
  }
}

function validatePositiveNumber(value: unknown, issuePath: string, issues: Issue[]): void {
  if (typeof value !== 'number' || !Number.isFinite(value) || value <= 0) {
    issues.push({ path: issuePath, message: 'must be a positive finite number' })
  }
}

function validateOcclusion(
  deckRoot: string,
  note: Record<string, unknown>,
  issuePath: string,
  issues: Issue[],
): void {
  validateKnownFields(note, occlusionFields, issuePath, issues)

  if (!isRecord(note.image)) {
    issues.push({ path: `${issuePath}.image`, message: 'occlusion note requires image object' })
  } else {
    validateKnownFields(note.image, occlusionImageFields, `${issuePath}.image`, issues)
    validateAssetPath(deckRoot, note.image.src, `${issuePath}.image.src`, issues)

    if (note.image.alt !== undefined && typeof note.image.alt !== 'string') {
      issues.push({
        path: `${issuePath}.image.alt`,
        message: 'occlusion image alt must be a string',
      })
    }

    if (note.image.width !== undefined) {
      validatePositiveNumber(note.image.width, `${issuePath}.image.width`, issues)
    }

    if (note.image.height !== undefined) {
      validatePositiveNumber(note.image.height, `${issuePath}.image.height`, issues)
    }
  }

  if (!Array.isArray(note.masks) || note.masks.length === 0) {
    issues.push({
      path: `${issuePath}.masks`,
      message: 'occlusion note requires at least one mask',
    })
    return
  }

  const seenMaskIds = new Set<string>()

  note.masks.forEach((mask, index) => {
    const maskPath = `${issuePath}.masks[${index}]`

    if (!isRecord(mask)) {
      issues.push({ path: maskPath, message: 'occlusion mask must be an object' })
      return
    }

    validateKnownFields(mask, occlusionMaskFields, maskPath, issues)

    if (!isNonEmptyString(mask.id)) {
      issues.push({
        path: `${maskPath}.id`,
        message: 'occlusion mask id must be a non-empty string',
      })
    } else if (seenMaskIds.has(mask.id)) {
      issues.push({ path: `${maskPath}.id`, message: `duplicate occlusion mask id: ${mask.id}` })
    } else {
      seenMaskIds.add(mask.id)
    }

    if (mask.answer !== undefined && typeof mask.answer !== 'string') {
      issues.push({
        path: `${maskPath}.answer`,
        message: 'occlusion mask answer must be a string',
      })
    }

    if (mask.hint !== undefined && typeof mask.hint !== 'string') {
      issues.push({ path: `${maskPath}.hint`, message: 'occlusion mask hint must be a string' })
    }

    if (mask.group !== undefined && !isNonEmptyString(mask.group)) {
      issues.push({
        path: `${maskPath}.group`,
        message: 'occlusion mask group must be a non-empty string',
      })
    }

    if (!isRecord(mask.shape)) {
      issues.push({ path: `${maskPath}.shape`, message: 'occlusion mask requires shape object' })
      return
    }

    if (mask.shape.kind === 'polygon') {
      validateKnownFields(mask.shape, polygonShapeFields, `${maskPath}.shape`, issues)
    } else {
      validateKnownFields(mask.shape, rectShapeFields, `${maskPath}.shape`, issues)
    }

    if (typeof mask.shape.kind !== 'string' || !maskShapes.has(mask.shape.kind)) {
      issues.push({
        path: `${maskPath}.shape.kind`,
        message: 'occlusion shape kind must be one of rect, ellipse, polygon',
      })
    }

    if (mask.shape.kind === 'polygon') {
      if (!Array.isArray(mask.shape.points) || mask.shape.points.length < 3) {
        issues.push({
          path: `${maskPath}.shape.points`,
          message: 'polygon shape requires at least three points',
        })
      } else {
        mask.shape.points.forEach((point, pointIndex) => {
          if (!Array.isArray(point) || point.length !== 2) {
            issues.push({
              path: `${maskPath}.shape.points[${pointIndex}]`,
              message: 'polygon point must be [x, y]',
            })
            return
          }

          validateNumber(point[0], `${maskPath}.shape.points[${pointIndex}][0]`, issues)
          validateNumber(point[1], `${maskPath}.shape.points[${pointIndex}][1]`, issues)
        })
      }
      return
    }

    for (const key of ['x', 'y']) {
      validateNumber(mask.shape[key], `${maskPath}.shape.${key}`, issues)
    }

    for (const key of ['w', 'h']) {
      validatePositiveNumber(mask.shape[key], `${maskPath}.shape.${key}`, issues)
    }
  })

  if ('context' in note) {
    validateContent(deckRoot, note.context, `${issuePath}.context`, issues)
  }

  if ('extra' in note) {
    validateContent(deckRoot, note.extra, `${issuePath}.extra`, issues)
  }
}

function validateDeck(deckRoot: string): { issues: Issue[]; noteCount: number; noteFiles: number } {
  const issues: Issue[] = []
  const manifestPath = path.join(deckRoot, 'deck.yaml')
  const notesDir = path.join(deckRoot, 'notes')
  const seenIds = new Map<string, string>()
  let noteCount = 0

  if (!existsSync(manifestPath)) {
    issues.push({ path: manifestPath, message: 'deck.yaml is missing' })
  } else {
    const manifest = parseYamlFile(manifestPath, issues)

    if (!isRecord(manifest)) {
      issues.push({ path: manifestPath, message: 'deck.yaml must contain an object' })
    } else {
      validateKnownFields(manifest, manifestFields, manifestPath, issues)

      if (manifest.format !== 'open-deck') {
        issues.push({ path: manifestPath, message: 'format must be open-deck' })
      }
      if (!isNonEmptyString(manifest.id)) {
        issues.push({ path: manifestPath, message: 'id must be a non-empty string' })
      }
      if (!isNonEmptyString(manifest.title)) {
        issues.push({ path: manifestPath, message: 'title must be a non-empty string' })
      }
      if (manifest.description !== undefined && !isNonEmptyString(manifest.description)) {
        issues.push({
          path: `${manifestPath}.description`,
          message: 'description must be a non-empty string',
        })
      }
      if (manifest.language !== undefined && !isNonEmptyString(manifest.language)) {
        issues.push({
          path: `${manifestPath}.language`,
          message: 'language must be a non-empty string',
        })
      }
      if (manifest.license !== undefined && !isNonEmptyString(manifest.license)) {
        issues.push({
          path: `${manifestPath}.license`,
          message: 'license must be a non-empty string',
        })
      }
    }
  }

  if (!existsSync(notesDir) || !statSync(notesDir).isDirectory()) {
    issues.push({ path: notesDir, message: 'notes directory is missing' })
    return { issues, noteCount, noteFiles: 0 }
  }

  const noteFiles = listYamlFiles(notesDir)

  if (noteFiles.length === 0) {
    issues.push({ path: notesDir, message: 'notes directory has no YAML files' })
  }

  for (const noteFile of noteFiles) {
    const file = parseYamlFile(noteFile, issues)

    if (!isRecord(file)) {
      issues.push({ path: noteFile, message: 'note file must contain an object' })
      continue
    }

    validateKnownFields(file, noteFileFields, noteFile, issues)

    let defaults: Record<string, unknown> = {}
    if (file.defaults !== undefined) {
      if (!isRecord(file.defaults)) {
        issues.push({ path: `${noteFile}.defaults`, message: 'defaults must be an object' })
      } else {
        validateKnownFields(file.defaults, defaultFields, `${noteFile}.defaults`, issues)
        validateSharedNoteFields(file.defaults, `${noteFile}.defaults`, issues)
        defaults = file.defaults
      }
    }

    if (!Array.isArray(file.notes)) {
      issues.push({ path: noteFile, message: 'note file requires notes list' })
      continue
    }

    if (file.notes.length === 0) {
      issues.push({ path: `${noteFile}.notes`, message: 'notes list must not be empty' })
      continue
    }

    file.notes.forEach((rawNote, index) => {
      const issuePath = `${noteFile}.notes[${index}]`

      if (!isRecord(rawNote)) {
        issues.push({ path: issuePath, message: 'note must be an object' })
        return
      }

      const note = { ...defaults, ...rawNote }
      noteCount += 1

      if (typeof note.id !== 'string' || note.id.trim() === '') {
        issues.push({ path: issuePath, message: 'note id must be a non-empty string' })
      } else if (seenIds.has(note.id)) {
        issues.push({
          path: issuePath,
          message: `duplicate note id ${note.id}; first seen at ${seenIds.get(note.id)}`,
        })
      } else {
        seenIds.set(note.id, issuePath)
      }

      validateSharedNoteFields(note, issuePath, issues)

      if (typeof note.type !== 'string' || !noteTypes.has(note.type)) {
        issues.push({
          path: issuePath,
          message: 'note type must be one of prompt_response, cloze, occlusion',
        })
      } else if (note.type === 'prompt_response') {
        validatePromptResponse(deckRoot, note, issuePath, issues)
      } else if (note.type === 'cloze') {
        validateCloze(deckRoot, note, issuePath, issues)
      } else if (note.type === 'occlusion') {
        validateOcclusion(deckRoot, note, issuePath, issues)
      }

      validateMedia(deckRoot, note.media, `${issuePath}.media`, issues)
    })
  }

  return { issues, noteCount, noteFiles: noteFiles.length }
}

const deckRoots = Bun.argv.slice(2)

if (deckRoots.length === 0) {
  console.error('Usage: bun stuff/validate-open-deck.ts <deck-dir> [deck-dir...]')
  process.exit(2)
}

let failed = false

for (const deckRoot of deckRoots) {
  const { issues, noteCount, noteFiles } = validateDeck(deckRoot)

  if (issues.length === 0) {
    console.log(`ok: ${deckRoot} (${noteCount} notes in ${noteFiles} files)`)
    continue
  }

  failed = true
  console.error(`invalid: ${deckRoot} (${issues.length} issues)`)
  for (const issue of issues) {
    console.error(`  ${issue.path}: ${issue.message}`)
  }
}

if (failed) {
  process.exit(1)
}
