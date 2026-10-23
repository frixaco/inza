# Inza

A local-first flashcard app: a modern Anki alternative.

- **Local-first.** Decks, media, and review history live on your device and
  work offline. An account syncs them across devices.
- **FSRS scheduling.** Every answer is recorded, and the scheduler learns from
  your own review history.
- **Open Deck format.** Decks are plain YAML plus media, simple enough to write
  by hand or generate with an AI. Decks hold content only; Inza owns the
  layout, so every deck looks right on every screen. See
  [`OPEN-DECK_FORMAT.md`](OPEN-DECK_FORMAT.md).
- **Safe updates.** Re-importing a newer version of a deck shows what will
  change first. Editing a card never resets its schedule, and cards removed
  from a deck keep their history.
- **Three note types.** Prompt and response (with optional reverse cards),
  cloze, and image occlusion.

## Design

Paper Mono on a character grid, black ink with one red stamp, and a
carbon-copy dark mode. On phones, cards are graded with a flick pad. On tablet
and desktop, an interval-first grade bar uses Anki's keys: 1–4, and Space or
Enter for Good.
