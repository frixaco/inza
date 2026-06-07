# Inza

Inza is a working area for a modern flashcard app and its deck format.

The main goal is a simple, native-feeling deck design that can represent useful
learning content without copying Anki's HTML, CSS, and template model. Anki
import work exists here, but exact Anki compatibility is not the center of the
project.

## What Matters

- `OPEN-DECK_FORMAT.md` defines the current deck format.
- `stuff/validate-open-deck.ts` validates deck directories that follow that
  format.
- `stuff/convert-kaishi-to-open-deck.ts` migrates the local Kaishi `.apkg` into
  an Open Deck directory.
- `stuff/kaishi-open-deck/` is a generated local Open Deck port of Kaishi 1.5k. It is
  ignored by Git and should be regenerated when needed.
- `stuff/rust-book-cards/` contains source YAML flashcards based on The Rust
  Programming Language book.
- `stuff/parser/` contains Anki `.apkg` parser/import experiments.
- `web/` is the web app.
- `desktop/` is the Electron desktop app.
- `mobile/` is the Expo mobile app.
- `stuff/ref-macos/` is a native macOS reference prototype.
- `stuff/math-rendering.md` records current findings for rendering math
  across desktop and mobile.

## Deck Format

An Open Deck is a directory with this basic shape:

```text
my-deck/
  deck.yaml
  notes/
    0001-basics.yaml
  assets/
    images/
    audio/
```

The deck describes content and review intent. The app owns layout, styling,
accessibility, and platform-specific rendering.

Validate a deck directory with:

```sh
bun stuff/validate-open-deck.ts path/to/deck
```

Regenerate the Kaishi Open Deck from the bundled `.apkg` with:

```sh
bun stuff/convert-kaishi-to-open-deck.ts stuff/parser/Kaishi-1.5k-v2.4.apkg stuff/kaishi-open-deck --force
bun stuff/validate-open-deck.ts stuff/kaishi-open-deck
```

Imported Anki decks should become ordinary Open Deck notes. Preserve
learner-facing facts, media, links, and useful provenance; do not preserve Anki
HTML templates, CSS, JavaScript, or exact styling as core deck fields.

## Apps

This is a Bun workspace. Install JavaScript dependencies from the repo root:

```sh
bun install
```

Run app commands from the root:

```sh
bun run web
bun run desktop
bun run mobile
```

Build or check from the root:

```sh
bun run web:build
bun run desktop:build
bun run check:mobile
bun run check
```

`web` is currently a Kaishi stress-test viewer, not a general deck loader. It
expects an Open Deck directory to be available at `web/public/deck` and
currently loads the generated Kaishi note filenames directly.

App-specific notes live in:

- `desktop/README.md`
- `mobile/README.md`
- `stuff/ref-macos/README.md`

## Parser

The parser is for inspecting and extracting Anki `.apkg` decks. Work inside
`stuff/parser/` follows `stuff/parser/AGENTS.md`.

Useful commands:

```sh
cd stuff/parser
bun run check
bun run parse ./Kaishi-1.5k-v2.4.apkg ./tmp_out
```

## Repo Notes

- Use Bun-first tooling where JavaScript or TypeScript is involved.
- Keep JavaScript dependencies and the lockfile at the repo root.
- Do not commit `node_modules`, app build output, CocoaPods output, parser
  extraction output, or large deck/media artifacts unless they are intentionally
  part of the work.
- Check the current tree before assuming old sample decks still exist.
