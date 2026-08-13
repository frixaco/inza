# Inza

## MVP

Prove one complete local loop:

```text
choose Open Deck directory -> import -> review -> schedule -> reload -> resume
```

1. Parse `deck.yaml`, `notes/*.yaml`, and local media from a selected directory.
2. Validate and store each note file and media file incrementally in Dexie.
3. Show import progress from Dexie through React live queries.
4. Accept sanitized HTML strings for `prompt_response`, `cloze`, and `occlusion`.
5. Read the deck list and review queue from Dexie.
6. Grade reviews through the Anki FSRS SDK and save the updated state.
7. Verify that imported data and scheduling state survive a browser restart.

Format documents:

- [`OPEN-DECK_MVP_FORMAT.md`](OPEN-DECK_MVP_FORMAT.md) is the strict MVP/v1
  schema. Every defined field is required.
- [`OPEN-DECK_FORMAT.md`](OPEN-DECK_FORMAT.md) preserves the full post-MVP
  format.

Deferred until this loop works: content blocks and inline runs, ZIP and URL
imports, authoring, settings, search, statistics, optimization, PWA packaging,
accounts, servers, and sync.

Inza is currently a local deck-format and app-prototype workspace for a modern
Anki alternative.

## Parser

The `stuff/` directory contains the Anki `.apkg` parser and deck conversion
research.

Current split:

- `stuff/index.ts` is the CLI entry point.
- `stuff/parse_anki.ts` is library code.

Keep that boundary intact. `parse_anki.ts` should stay import-safe and must not
perform CLI work as a side effect.

## Package Manager

Use Aube through mise for dependency and script management:

```bash
aube install
aube add <package>
aube remove <package>
aube run <script>
```

Do not use npm, pnpm, Yarn, or Bun to change dependencies or the lockfile. Use
Bun only to run the parser and its tests directly.

## Parser Rules

- Run package scripts with Aube from the repository root.
- Run parser entry points and tests directly with Bun.
- Add dependencies only when they clearly remove more complexity than they add.
- Preserve support for `collection.anki2`, `collection.anki21`, and
  `collection.anki21b`.
- Preserve media manifest support for JSON and zstd/protobuf-like formats.
- Preserve filename-safe media extraction.

Before editing parser logic, identify the affected input format, legacy versus
modern schema impact, media manifest impact, template rendering impact, and
output JSON compatibility impact.

## Commands

```bash
aube run build
aube run lint
aube run format:check
bun test stuff
```

For CLI-affecting parser changes, smoke test with a local `.apkg` fixture:

```bash
bun stuff/index.ts stuff/Kaishi-1.5k-v2.4.apkg stuff/tmp_out
```

Large `.apkg` fixtures are local-only and ignored by Git.

## Parser Outputs

The parser writes:

- `meta.json`
- `notes.json`
- `cards.json`
- `notetypes.json`
- `media.json`
- `media/`
