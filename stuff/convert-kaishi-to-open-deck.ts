import { existsSync } from "node:fs";
import { copyFile, mkdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";

import { parseApkg, type Note } from "./parser/parse_anki.ts";

type InlineMark = "strong" | "emphasis" | "code" | "strike" | "highlight";
type InlineRun =
  | string
  | {
      text: string;
      marks?: InlineMark[];
      above?: string;
      below?: string;
      link?: string;
    };

type ContentBlock = {
  role: "main" | "context" | "support" | "note";
  label?: string;
  text?: string;
  runs?: InlineRun[];
  language?: string;
  media?: MediaRef[];
};

type DraftContentBlock = ContentBlock & {
  fieldName?: string;
};

type MediaRef = {
  kind: "image" | "audio" | "video";
  src: string;
  role?: "main" | "context" | "support" | "note";
  label?: string;
  alt?: string;
};

type ImportedMedia = {
  filename: string;
  fieldName: string;
  alt?: string;
};

type OpenNote = {
  id: string;
  type: "prompt_response";
  prompt: string | ContentBlock[];
  answer: string | ContentBlock[];
  tags?: string[];
  provenance: {
    importer: string;
    anki_note_id: number;
    anki_guid: string;
    anki_note_type: string;
    anki_mod: number;
  };
};

const defaultDeckPath = "stuff/parser/Kaishi-1.5k-v2.4.apkg";
const defaultOutputDir = "stuff/kaishi-open-deck";
const importWorkDir = ".tmp-kaishi-open-deck-import";
const notesPerFile = 250;

const textFieldOrder = [
  "Word",
  "Sentence",
  "Word Meaning",
  "Word Reading",
  "Word Furigana",
  "Sentence Meaning",
  "Sentence Furigana",
  "Notes",
  "Pitch Accent",
  "Pitch Accent Notes",
  "Frequency",
] as const;

const promptFields = new Set(["Word", "Sentence"]);
const overlineMark = "\uffe3";
const dropMark = "\uff3c";

function usage(): never {
  console.error("Usage: bun stuff/convert-kaishi-to-open-deck.ts [apkg] [output-dir] [--force]");
  process.exit(2);
}

function parseArgs(): { apkgPath: string; outputDir: string; force: boolean } {
  const positional: string[] = [];
  let force = false;

  for (const arg of Bun.argv.slice(2)) {
    if (arg === "--force") {
      force = true;
      continue;
    }

    if (arg.startsWith("-")) {
      usage();
    }

    positional.push(arg);
  }

  if (positional.length > 2) {
    usage();
  }

  return {
    apkgPath: positional[0] ?? defaultDeckPath,
    outputDir: positional[1] ?? defaultOutputDir,
    force,
  };
}

function decodeHtmlEntities(value: string): string {
  return value.replace(/&(#x?[0-9a-fA-F]+|[a-zA-Z]+);/g, (match, entity) => {
    if (entity.startsWith("#x")) {
      return String.fromCodePoint(Number.parseInt(entity.slice(2), 16));
    }

    if (entity.startsWith("#")) {
      return String.fromCodePoint(Number.parseInt(entity.slice(1), 10));
    }

    const named: Record<string, string> = {
      amp: "&",
      gt: ">",
      lt: "<",
      nbsp: " ",
      quot: '"',
      apos: "'",
    };

    return named[entity] ?? match;
  });
}

function stripMedia(value: string): string {
  return value.replace(/\[sound:[^\]]+]/gi, "").replace(/<img\b[^>]*>/gi, "");
}

function htmlToText(value: string): string {
  const withoutMedia = stripMedia(value);
  const withMarkdownLinks = withoutMedia.replace(
    /<a\b[^>]*\bhref=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi,
    (_match, href, label) => `[${htmlToText(label)}](${href})`,
  );

  return decodeHtmlEntities(
    withMarkdownLinks
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/<\/(p|div|li|tr|h[1-6])>/gi, "\n")
      .replace(/<li\b[^>]*>/gi, "- ")
      .replace(/<[^>]+>/g, "")
      .replace(/\r\n?/g, "\n")
      .replace(/[ \t]+\n/g, "\n")
      .replace(/\n[ \t]+/g, "\n")
      .replace(/\n{3,}/g, "\n\n")
      .trim(),
  );
}

type RunAttrs = {
  marks: InlineMark[];
  link?: string;
};

function createTextRun(
  text: string,
  attrs: RunAttrs,
  extra?: { above?: string; below?: string },
): InlineRun {
  const marks = attrs.marks.length > 0 ? [...attrs.marks] : undefined;

  if (!marks && !attrs.link && !extra?.above && !extra?.below) {
    return text;
  }

  const run: Exclude<InlineRun, string> = { text };

  if (marks) {
    run.marks = marks;
  }

  if (attrs.link) {
    run.link = attrs.link;
  }

  if (extra?.above) {
    run.above = extra.above;
  }

  if (extra?.below) {
    run.below = extra.below;
  }

  return run;
}

function pushRun(runs: InlineRun[], run: InlineRun, mergePlainText = true): void {
  if (mergePlainText && typeof run === "string") {
    const previous = runs[runs.length - 1];
    if (typeof previous === "string") {
      runs[runs.length - 1] = `${previous}${run}`;
      return;
    }
  }

  runs.push(run);
}

function isReadingBaseChar(char: string): boolean {
  return !/[\s[\]{}()（）「」『』、。,.!?！？;；:："']/u.test(char);
}

function splitReadingBase(value: string): { prefix: string; base: string } {
  const chars = Array.from(value);
  let start = chars.length;

  while (start > 0 && isReadingBaseChar(chars[start - 1] ?? "")) {
    start -= 1;
  }

  return {
    prefix: chars.slice(0, start).join(""),
    base: chars.slice(start).join(""),
  };
}

function pushTextWithReadings(runs: InlineRun[], value: string, attrs: RunAttrs): void {
  let buffer = "";

  for (let index = 0; index < value.length; index += 1) {
    const char = value[index];

    if (char !== "[") {
      buffer += char;
      continue;
    }

    const closeIndex = value.indexOf("]", index + 1);
    if (closeIndex === -1) {
      buffer += char;
      continue;
    }

    const reading = value.slice(index + 1, closeIndex);
    const { prefix, base } = splitReadingBase(buffer);

    if (!base || !reading) {
      buffer += value.slice(index, closeIndex + 1);
      index = closeIndex;
      continue;
    }

    if (prefix) {
      pushRun(runs, createTextRun(prefix, attrs));
    }

    pushRun(runs, createTextRun(base, attrs, { above: reading }));
    buffer = "";
    index = closeIndex;
  }

  if (buffer) {
    pushRun(runs, createTextRun(buffer, attrs));
  }
}

function isSimpleInlineHtml(value: string): boolean {
  return !/<\s*\/?\s*(p|div|ul|ol|li|table|thead|tbody|tr|td|th|img|audio|video)\b/i.test(value);
}

function inlineHtmlToRuns(value: string): InlineRun[] | undefined {
  if (!isSimpleInlineHtml(value)) {
    return undefined;
  }

  const runs: InlineRun[] = [];
  let strongDepth = 0;
  const linkStack: (string | undefined)[] = [];
  let activeLink: string | undefined;

  for (const match of stripMedia(value).matchAll(/<[^>]+>|[^<]+/g)) {
    const token = match[0];

    if (token.startsWith("<")) {
      const tag = token.toLowerCase();

      if (/^<\s*br\b/.test(tag)) {
        pushRun(runs, "\n");
      } else if (/^<\s*(b|strong)\b/.test(tag)) {
        strongDepth += 1;
      } else if (/^<\s*\/\s*(b|strong)\s*>/.test(tag)) {
        strongDepth = Math.max(0, strongDepth - 1);
      } else if (/^<\s*a\b/.test(tag)) {
        linkStack.push(activeLink);
        activeLink = extractAttr(token, "href") ?? activeLink;
      } else if (/^<\s*\/\s*a\s*>/.test(tag)) {
        activeLink = linkStack.pop();
      }

      continue;
    }

    const marks: InlineMark[] = strongDepth > 0 ? ["strong"] : [];
    pushTextWithReadings(runs, decodeHtmlEntities(token), { marks, link: activeLink });
  }

  return runs.length > 0 ? runs : undefined;
}

type PitchSpan = {
  inlineBlock: boolean;
  overline: boolean;
  highlight: boolean;
  runStart: number;
};

function asObjectRun(run: InlineRun): Exclude<InlineRun, string> {
  return typeof run === "string" ? { text: run } : run;
}

function addAdornment(
  runs: InlineRun[],
  start: number,
  end: number,
  key: "above" | "below",
  value: string,
): void {
  for (let index = start; index < end; index += 1) {
    const run = asObjectRun(runs[index] ?? "");
    run[key] = run[key] ? `${run[key]}${value}` : value;
    runs[index] = run;
  }
}

function pitchAccentToRuns(value: string): InlineRun[] | undefined {
  const runs: InlineRun[] = [];
  const spans: PitchSpan[] = [];

  for (const match of stripMedia(value).matchAll(/<[^>]+>|[^<]+/g)) {
    const token = match[0];

    if (token.startsWith("<")) {
      const tag = token.toLowerCase();

      if (/^<\s*\/\s*span\s*>/.test(tag)) {
        spans.pop();
        continue;
      }

      if (!/^<\s*span\b/.test(tag)) {
        continue;
      }

      const style = extractAttr(token, "style")?.toLowerCase() ?? "";
      const markerTarget = [...spans].reverse().find((span) => span.inlineBlock);

      if (style.includes("border-top") && markerTarget) {
        addAdornment(runs, markerTarget.runStart, runs.length, "above", overlineMark);

        if (style.includes("border-right")) {
          addAdornment(
            runs,
            Math.max(markerTarget.runStart, runs.length - 1),
            runs.length,
            "below",
            dropMark,
          );
        }
      }

      spans.push({
        inlineBlock: style.includes("display:inline-block"),
        overline: style.includes("text-decoration:overline"),
        highlight: style.includes("color:"),
        runStart: runs.length,
      });
      continue;
    }

    const text = decodeHtmlEntities(token);
    const marks: InlineMark[] = spans.some((span) => span.highlight) ? ["highlight"] : [];
    const above = spans.some((span) => span.overline) ? overlineMark : undefined;

    pushRun(runs, createTextRun(text, { marks }, { above }), false);
  }

  return runs.length > 0 ? runs : undefined;
}

function runsForField(fieldName: string, rawValue: string): InlineRun[] | undefined {
  if (fieldName === "Pitch Accent") {
    return pitchAccentToRuns(rawValue);
  }

  if (fieldName === "Word Furigana" || fieldName === "Sentence Furigana") {
    return inlineHtmlToRuns(rawValue);
  }

  if (fieldName === "Sentence" && /<\s*b\b/i.test(rawValue) && isSimpleInlineHtml(rawValue)) {
    return inlineHtmlToRuns(rawValue);
  }

  return undefined;
}

function extractAttr(tag: string, name: string): string | undefined {
  const pattern = new RegExp(`\\b${name}=["']([^"']*)["']`, "i");
  const match = tag.match(pattern);
  return match?.[1] ? decodeHtmlEntities(match[1]) : undefined;
}

function extractMedia(fields: Record<string, string>): ImportedMedia[] {
  const media: ImportedMedia[] = [];

  for (const [fieldName, rawValue] of Object.entries(fields)) {
    for (const match of rawValue.matchAll(/\[sound:([^\]]+)]/gi)) {
      if (match[1]) {
        media.push({ filename: match[1], fieldName });
      }
    }

    for (const match of rawValue.matchAll(/<img\b[^>]*>/gi)) {
      const tag = match[0];
      const src = extractAttr(tag, "src");

      if (src) {
        media.push({
          filename: src,
          fieldName,
          alt: extractAttr(tag, "alt"),
        });
      }
    }
  }

  return media;
}

function kindForFilename(filename: string): MediaRef["kind"] {
  const ext = path.extname(filename).toLowerCase();

  if ([".mp3", ".m4a", ".ogg", ".oga", ".wav", ".flac", ".aac"].includes(ext)) {
    return "audio";
  }

  if ([".mp4", ".webm", ".mov", ".m4v"].includes(ext)) {
    return "video";
  }

  return "image";
}

function mediaSubdir(kind: MediaRef["kind"]): string {
  if (kind === "audio") {
    return "audio";
  }

  if (kind === "video") {
    return "video";
  }

  return "images";
}

function roleForField(fieldName: string): MediaRef["role"] {
  if (fieldName === "Word Audio") {
    return "main";
  }

  if (fieldName === "Sentence Audio") {
    return "context";
  }

  return "support";
}

function blockFieldForMediaField(fieldName: string): string | undefined {
  if (fieldName === "Word Audio") {
    return "Word";
  }

  if (fieldName === "Sentence Audio") {
    return "Sentence";
  }

  return undefined;
}

function roleForTextField(fieldName: string): ContentBlock["role"] {
  if (fieldName === "Word" || fieldName === "Word Meaning") {
    return "main";
  }

  if (fieldName === "Sentence" || fieldName === "Sentence Meaning") {
    return "context";
  }

  if (fieldName === "Notes" || fieldName === "Pitch Accent Notes") {
    return "note";
  }

  return "support";
}

function labelForField(fieldName: string): string | undefined {
  if (fieldName === "Word") {
    return undefined;
  }

  return fieldName;
}

function languageForField(fieldName: string, text: string): string | undefined {
  if (fieldName === "Frequency") {
    return undefined;
  }

  return /[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}]/u.test(text) ? "ja" : "en";
}

function slugify(value: string): string {
  const slug = value
    .normalize("NFKD")
    .replace(/[^\p{Letter}\p{Number}]+/gu, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase();

  return slug || "note";
}

function noteId(note: Note, index: number): string {
  const word = htmlToText(note.fields.Word ?? "");
  return `kaishi-${String(index + 1).padStart(4, "0")}-${slugify(word).slice(0, 48)}`;
}

function blocksForFields(
  fields: Record<string, string>,
  names: readonly string[],
): DraftContentBlock[] {
  const blocks: DraftContentBlock[] = [];

  for (const fieldName of names) {
    const rawValue = fields[fieldName] ?? "";
    const text = htmlToText(rawValue);

    if (!text) {
      continue;
    }

    const runs = runsForField(fieldName, rawValue);
    const language = languageForField(fieldName, text);
    const block: DraftContentBlock = {
      role: roleForTextField(fieldName),
      label: labelForField(fieldName),
      fieldName,
    };

    if (runs) {
      block.runs = runs;
    } else {
      block.text = text;
    }

    if (language) {
      block.language = language;
    }

    blocks.push(block);
  }

  return blocks;
}

function outputBlock(block: DraftContentBlock): ContentBlock {
  const { fieldName: _fieldName, ...output } = block;
  return output;
}

function simplifyContent(blocks: DraftContentBlock[]): string | ContentBlock[] {
  if (blocks.length === 1 && !blocks[0]?.label && blocks[0]?.text && !blocks[0]?.media?.length) {
    return blocks[0].text;
  }

  return blocks.map(outputBlock);
}

function addMediaToBlock(block: DraftContentBlock, media: MediaRef): void {
  block.media = [...(block.media ?? []), media];
}

function attachMediaToBlocks(
  promptBlocks: DraftContentBlock[],
  answerBlocks: DraftContentBlock[],
  fieldName: string,
  media: MediaRef,
): void {
  const targetField = blockFieldForMediaField(fieldName);
  const targetBlock = targetField
    ? [...promptBlocks, ...answerBlocks].find((block) => block.fieldName === targetField)
    : undefined;

  if (targetBlock) {
    addMediaToBlock(targetBlock, media);
    return;
  }

  answerBlocks.push({
    role: roleForField(fieldName) ?? "support",
    label: fieldName,
    media: [media],
  });
}

function buildOpenNote(note: Note, index: number, copiedMedia: Map<string, string>): OpenNote {
  const promptBlocks = blocksForFields(
    note.fields,
    textFieldOrder.filter((fieldName) => promptFields.has(fieldName)),
  );
  const answerBlocks = blocksForFields(
    note.fields,
    textFieldOrder.filter((fieldName) => !promptFields.has(fieldName)),
  );
  const hasMainAnswer = answerBlocks.some((block) => block.role === "main");

  if (!hasMainAnswer) {
    const firstContext = answerBlocks.find((block) => block.role === "context");
    if (firstContext) {
      firstContext.role = "main";
    }
  }

  for (const item of extractMedia(note.fields)) {
    const media = (() => {
      const src = copiedMedia.get(item.filename);

      if (!src) {
        return undefined;
      }

      return {
        kind: kindForFilename(item.filename),
        src,
        role: roleForField(item.fieldName),
        label: item.fieldName,
        alt: item.alt,
      };
    })();

    if (media) {
      attachMediaToBlocks(promptBlocks, answerBlocks, item.fieldName, media);
    }
  }

  return {
    id: noteId(note, index),
    type: "prompt_response",
    prompt: simplifyContent(promptBlocks),
    answer: simplifyContent(answerBlocks),
    tags: note.tags.length > 0 ? note.tags : undefined,
    provenance: {
      importer: "stuff/convert-kaishi-to-open-deck.ts",
      anki_note_id: note.id,
      anki_guid: note.guid,
      anki_note_type: note.noteTypeName,
      anki_mod: note.mod,
    },
  };
}

async function copyReferencedMedia(
  notes: Note[],
  parserMediaDir: string,
  outputDir: string,
): Promise<Map<string, string>> {
  const copied = new Map<string, string>();

  for (const note of notes) {
    for (const item of extractMedia(note.fields)) {
      if (copied.has(item.filename)) {
        continue;
      }

      const kind = kindForFilename(item.filename);
      const relativeOutputPath = path.join("assets", mediaSubdir(kind), item.filename);
      const sourcePath = path.join(parserMediaDir, item.filename);
      const outputPath = path.join(outputDir, relativeOutputPath);

      if (!existsSync(sourcePath)) {
        console.warn(`warning: missing media file referenced by Anki field: ${item.filename}`);
        continue;
      }

      await mkdir(path.dirname(outputPath), { recursive: true });
      await copyFile(sourcePath, outputPath);
      copied.set(item.filename, relativeOutputPath);
    }
  }

  return copied;
}

async function writeYaml(filePath: string, value: unknown): Promise<void> {
  await mkdir(path.dirname(filePath), { recursive: true });
  await writeFile(filePath, `${Bun.YAML.stringify(value, null, 2).trimEnd()}\n`);
}

async function main(): Promise<void> {
  const { apkgPath, outputDir, force } = parseArgs();

  if (existsSync(outputDir)) {
    if (!force) {
      throw new Error(`Output directory already exists: ${outputDir}. Pass --force to replace it.`);
    }

    await rm(outputDir, { recursive: true, force: true });
  }

  await rm(importWorkDir, { recursive: true, force: true });
  const parsed = await parseApkg(apkgPath, importWorkDir, { extractMedia: true });

  await mkdir(outputDir, { recursive: true });

  await writeYaml(path.join(outputDir, "deck.yaml"), {
    format: "open-deck",
    id: "kaishi-1-5k",
    title: parsed.meta.deckNames[0] ?? "Kaishi 1.5k",
    description:
      "Japanese vocabulary cards migrated from the Kaishi Anki deck into Open Deck content blocks.",
    language: "ja",
  });

  const copiedMedia = await copyReferencedMedia(
    parsed.notes,
    path.join(importWorkDir, "media"),
    outputDir,
  );
  const openNotes = parsed.notes.map((note, index) => buildOpenNote(note, index, copiedMedia));

  for (let start = 0; start < openNotes.length; start += notesPerFile) {
    const chunk = openNotes.slice(start, start + notesPerFile);
    const first = String(start + 1).padStart(4, "0");
    const last = String(start + chunk.length).padStart(4, "0");

    await writeYaml(path.join(outputDir, "notes", `${first}-${last}.yaml`), {
      defaults: {
        deck: "kaishi-1-5k",
        answer_mode: "reveal",
      },
      notes: chunk,
    });
  }

  await rm(importWorkDir, { recursive: true, force: true });

  console.log(`Wrote ${openNotes.length} notes to ${outputDir}`);
  console.log(`Copied ${copiedMedia.size} referenced media files`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
