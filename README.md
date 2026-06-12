# Inza

Inza is a deck-format and app-prototype workspace for a modern Anki
alternative.

## Parser

The `stuff/` directory contains the Anki `.apkg` parser and deck conversion
research.

Current split:

- `stuff/index.ts` is the CLI entry point.
- `stuff/parse_anki.ts` is library code.

Keep that boundary intact. `parse_anki.ts` should stay import-safe and must not
perform CLI work as a side effect.

## Parser Rules

- Use Bun-first commands from the repository root.
- Prefer `bun run check`, `bun test stuff`, `bun run typecheck`, and
  `bun stuff/index.ts ...`.
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
bun run check
bun run test
bun run typecheck
bun run parse
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
