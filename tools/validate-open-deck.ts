import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";

type Issue = {
  path: string;
  message: string;
};

const noteTypes = new Set(["prompt_response", "cloze", "occlusion"]);
const roles = new Set(["main", "context", "support", "note"]);
const mediaKinds = new Set(["image", "audio", "video"]);

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function parseYamlFile(filePath: string, issues: Issue[]): unknown {
  try {
    return Bun.YAML.parse(readFileSync(filePath, "utf8"));
  } catch (error) {
    issues.push({ path: filePath, message: `invalid YAML: ${error instanceof Error ? error.message : String(error)}` });
    return undefined;
  }
}

function listYamlFiles(dir: string): string[] {
  const result: string[] = [];

  for (const name of readdirSync(dir).sort()) {
    const filePath = path.join(dir, name);
    const stat = statSync(filePath);

    if (stat.isDirectory()) {
      result.push(...listYamlFiles(filePath));
      continue;
    }

    if (/\.ya?ml$/i.test(name)) {
      result.push(filePath);
    }
  }

  return result.sort((left, right) => left.localeCompare(right));
}

function validateAssetPath(deckRoot: string, src: unknown, issuePath: string, issues: Issue[]): void {
  if (typeof src !== "string" || src.trim() === "") {
    issues.push({ path: issuePath, message: "media src must be a non-empty string" });
    return;
  }

  const root = path.resolve(deckRoot);
  const resolved = path.resolve(root, src);

  if (resolved !== root && !resolved.startsWith(`${root}${path.sep}`)) {
    issues.push({ path: issuePath, message: `media src escapes deck root: ${src}` });
    return;
  }

  if (!existsSync(resolved) || !statSync(resolved).isFile()) {
    issues.push({ path: issuePath, message: `media file does not exist: ${src}` });
  }
}

function validateContent(value: unknown, issuePath: string, issues: Issue[]): void {
  if (typeof value === "string") {
    if (value.trim() === "") {
      issues.push({ path: issuePath, message: "content string must not be empty" });
    }
    return;
  }

  if (!Array.isArray(value)) {
    issues.push({ path: issuePath, message: "content must be a string or a block list" });
    return;
  }

  if (value.length === 0) {
    issues.push({ path: issuePath, message: "content block list must not be empty" });
    return;
  }

  value.forEach((block, index) => {
    const blockPath = `${issuePath}[${index}]`;

    if (!isRecord(block)) {
      issues.push({ path: blockPath, message: "content block must be an object" });
      return;
    }

    if (typeof block.role !== "string" || !roles.has(block.role)) {
      issues.push({ path: blockPath, message: "content block role must be one of main, context, support, note" });
    }

    if (typeof block.text !== "string" || block.text.trim() === "") {
      issues.push({ path: blockPath, message: "content block text must be a non-empty string" });
    }

    if (block.label !== undefined && typeof block.label !== "string") {
      issues.push({ path: blockPath, message: "content block label must be a string" });
    }

    if (block.language !== undefined && typeof block.language !== "string") {
      issues.push({ path: blockPath, message: "content block language must be a string" });
    }
  });
}

function validateMedia(deckRoot: string, media: unknown, issuePath: string, issues: Issue[]): void {
  if (media === undefined) {
    return;
  }

  if (!Array.isArray(media)) {
    issues.push({ path: issuePath, message: "media must be a list" });
    return;
  }

  media.forEach((item, index) => {
    const itemPath = `${issuePath}[${index}]`;

    if (!isRecord(item)) {
      issues.push({ path: itemPath, message: "media item must be an object" });
      return;
    }

    if (typeof item.kind !== "string" || !mediaKinds.has(item.kind)) {
      issues.push({ path: itemPath, message: "media kind must be one of image, audio, video" });
    }

    if (item.role !== undefined && (typeof item.role !== "string" || !roles.has(item.role))) {
      issues.push({ path: itemPath, message: "media role must be one of main, context, support, note" });
    }

    if (item.label !== undefined && typeof item.label !== "string") {
      issues.push({ path: itemPath, message: "media label must be a string" });
    }

    if (item.alt !== undefined && typeof item.alt !== "string") {
      issues.push({ path: itemPath, message: "media alt must be a string" });
    }

    validateAssetPath(deckRoot, item.src, `${itemPath}.src`, issues);
  });
}

function validatePromptResponse(note: Record<string, unknown>, issuePath: string, issues: Issue[]): void {
  if (!("prompt" in note)) {
    issues.push({ path: issuePath, message: "prompt_response note requires prompt" });
  } else {
    validateContent(note.prompt, `${issuePath}.prompt`, issues);
  }

  if (!("answer" in note)) {
    issues.push({ path: issuePath, message: "prompt_response note requires answer" });
  } else {
    validateContent(note.answer, `${issuePath}.answer`, issues);
  }
}

function validateCloze(note: Record<string, unknown>, issuePath: string, issues: Issue[]): void {
  if (!("text" in note)) {
    issues.push({ path: issuePath, message: "cloze note requires text" });
    return;
  }

  validateContent(note.text, `${issuePath}.text`, issues);
  const rawText = typeof note.text === "string" ? note.text : JSON.stringify(note.text);

  if (!/\{\{[^}:]+::[^}]+}}/.test(rawText)) {
    issues.push({ path: issuePath, message: "cloze note text must contain at least one cloze marker" });
  }
}

function validateOcclusion(note: Record<string, unknown>, issuePath: string, issues: Issue[]): void {
  if (!isRecord(note.image)) {
    issues.push({ path: `${issuePath}.image`, message: "occlusion note requires image object" });
  } else if (typeof note.image.src !== "string" || note.image.src.trim() === "") {
    issues.push({ path: `${issuePath}.image.src`, message: "occlusion image requires src" });
  }

  if (!Array.isArray(note.masks) || note.masks.length === 0) {
    issues.push({ path: `${issuePath}.masks`, message: "occlusion note requires at least one mask" });
  }
}

function validateDeck(deckRoot: string): { issues: Issue[]; noteCount: number; noteFiles: number } {
  const issues: Issue[] = [];
  const manifestPath = path.join(deckRoot, "deck.yaml");
  const notesDir = path.join(deckRoot, "notes");
  const seenIds = new Map<string, string>();
  let noteCount = 0;

  if (!existsSync(manifestPath)) {
    issues.push({ path: manifestPath, message: "deck.yaml is missing" });
  } else {
    const manifest = parseYamlFile(manifestPath, issues);

    if (!isRecord(manifest)) {
      issues.push({ path: manifestPath, message: "deck.yaml must contain an object" });
    } else {
      if (manifest.format !== "open-deck") {
        issues.push({ path: manifestPath, message: "format must be open-deck" });
      }
      if (typeof manifest.id !== "string" || manifest.id.trim() === "") {
        issues.push({ path: manifestPath, message: "id must be a non-empty string" });
      }
      if (typeof manifest.title !== "string" || manifest.title.trim() === "") {
        issues.push({ path: manifestPath, message: "title must be a non-empty string" });
      }
    }
  }

  if (!existsSync(notesDir) || !statSync(notesDir).isDirectory()) {
    issues.push({ path: notesDir, message: "notes directory is missing" });
    return { issues, noteCount, noteFiles: 0 };
  }

  const noteFiles = listYamlFiles(notesDir);

  if (noteFiles.length === 0) {
    issues.push({ path: notesDir, message: "notes directory has no YAML files" });
  }

  for (const noteFile of noteFiles) {
    const file = parseYamlFile(noteFile, issues);

    if (!isRecord(file)) {
      issues.push({ path: noteFile, message: "note file must contain an object" });
      continue;
    }

    const defaults = isRecord(file.defaults) ? file.defaults : {};

    if (!Array.isArray(file.notes)) {
      issues.push({ path: noteFile, message: "note file requires notes list" });
      continue;
    }

    file.notes.forEach((rawNote, index) => {
      const issuePath = `${noteFile}.notes[${index}]`;

      if (!isRecord(rawNote)) {
        issues.push({ path: issuePath, message: "note must be an object" });
        return;
      }

      const note = { ...defaults, ...rawNote };
      noteCount += 1;

      if (typeof note.id !== "string" || note.id.trim() === "") {
        issues.push({ path: issuePath, message: "note id must be a non-empty string" });
      } else if (seenIds.has(note.id)) {
        issues.push({ path: issuePath, message: `duplicate note id ${note.id}; first seen at ${seenIds.get(note.id)}` });
      } else {
        seenIds.set(note.id, issuePath);
      }

      if (typeof note.type !== "string" || !noteTypes.has(note.type)) {
        issues.push({ path: issuePath, message: "note type must be one of prompt_response, cloze, occlusion" });
      } else if (note.type === "prompt_response") {
        validatePromptResponse(note, issuePath, issues);
      } else if (note.type === "cloze") {
        validateCloze(note, issuePath, issues);
      } else if (note.type === "occlusion") {
        validateOcclusion(note, issuePath, issues);
      }

      validateMedia(deckRoot, note.media, `${issuePath}.media`, issues);
    });
  }

  return { issues, noteCount, noteFiles: noteFiles.length };
}

const deckRoots = Bun.argv.slice(2);

if (deckRoots.length === 0) {
  console.error("Usage: bun tools/validate-open-deck.ts <deck-dir> [deck-dir...]");
  process.exit(2);
}

let failed = false;

for (const deckRoot of deckRoots) {
  const { issues, noteCount, noteFiles } = validateDeck(deckRoot);

  if (issues.length === 0) {
    console.log(`ok: ${deckRoot} (${noteCount} notes in ${noteFiles} files)`);
    continue;
  }

  failed = true;
  console.error(`invalid: ${deckRoot} (${issues.length} issues)`);
  for (const issue of issues) {
    console.error(`  ${issue.path}: ${issue.message}`);
  }
}

if (failed) {
  process.exit(1);
}
