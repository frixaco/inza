# Inza

A local-first, FSRS-scheduled flashcard app: a modern Anki alternative.

## Layout

```text
apps/receipt/        The chosen UI design (React, Vite, motion). No app logic yet.
packages/sample/     Sample data the design renders (real Kaishi notes and images).
stuff/               Local-only source decks (*.apkg, ignored by Git).
OPEN-DECK_FORMAT.md  The deck format specification, including import and update rules.
```

## Design

The receipt design: Paper Mono on a character grid, black ink with one red
stamp, carbon-copy dark mode. On phones, cards are graded with a flick pad;
on tablet and desktop, with an interval-first grade bar and Anki's keys
(1–4, Space or Enter for Good).

## Commands

Use Aube through mise for dependencies and scripts:

```bash
aube install
aube run dev           # receipt app on port 5183
aube run build
aube run lint
aube run format:check
```

Do not use npm, pnpm, Yarn, or Bun to change dependencies or the lockfile.
