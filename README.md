# Inza

Inza is a working area for a modern flashcard app and its deck format.

The main goal is a simple, native-feeling deck design that can represent useful
learning content without copying Anki's HTML, CSS, and template model. Anki
import work exists here, but exact Anki compatibility is not the center of the
project.

## What Matters

- `open-deck-format.md` defines the current deck format.
- `tools/validate-open-deck.ts` validates deck directories that follow that
  format.
- `tools/convert-kaishi-to-open-deck.ts` migrates the local Kaishi `.apkg` into
  an Open Deck directory.
- `kaishi-open-deck/` is a generated local Open Deck port of Kaishi 1.5k. It is
  ignored by Git and should be regenerated when needed.
- `rust-book-cards/` contains source YAML flashcards based on The Rust
  Programming Language book.
- `parser/` contains Anki `.apkg` parser/import experiments.
- `ref-web/`, `ref-electron/`, `ref-expo/`, and `ref-macos/` are reference app
  prototypes.
- `deck-math-rendering-notes.md` records current findings for rendering math
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
bun tools/validate-open-deck.ts path/to/deck
```

Regenerate the Kaishi Open Deck from the bundled `.apkg` with:

```sh
bun tools/convert-kaishi-to-open-deck.ts parser/Kaishi-1.5k-v2.4.apkg kaishi-open-deck --force
bun tools/validate-open-deck.ts kaishi-open-deck
```

Imported Anki decks should become ordinary Open Deck notes. Preserve
learner-facing facts, media, links, and useful provenance; do not preserve Anki
HTML templates, CSS, JavaScript, or exact styling as core deck fields.

## Reference Apps

The reference apps are prototypes, not canonical deck data.

```sh
cd ref-web
bun install
bun run dev
```

`ref-web` is a Kaishi stress-test viewer, not a general deck loader. It expects
an Open Deck directory to be available at `ref-web/public/deck` and currently
loads the generated Kaishi note filenames directly.

Other reference app commands live in their local README files:

- `ref-electron/README.md`
- `ref-expo/README.md`
- `ref-macos/README.md`

## Parser

The parser is for inspecting and extracting Anki `.apkg` decks. Work inside
`parser/` follows `parser/AGENTS.md`.

Useful commands:

```sh
cd parser
bun run check
bun run parse ./Kaishi-1.5k-v2.4.apkg ./tmp_out
```

## Repo Notes

- Use Bun-first tooling where JavaScript or TypeScript is involved.
- Do not commit `node_modules`, app build output, parser extraction output, or
  large deck/media artifacts unless they are intentionally part of the work.
- Check the current tree before assuming old sample decks still exist.
