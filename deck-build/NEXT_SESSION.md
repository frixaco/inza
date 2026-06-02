# Next Session Start Instructions

Use this file to start the deck creation task in a new Codex session.

## Start A New Session

From a terminal:

```sh
cd /Users/frixa/Documents/manki
codex -C /Users/frixa/Documents/manki
```

In the new Codex session, first set the goal:

```text
/goal Build a complete Rust Book Anki deck from the official Rust Book in ./rust-book, following ./rust-learning-deck-requirements.md, using ./deck-build as durable state. Produce source-mapped cards, coverage tracking, validation reports, and final Anki-ready output.
```

Then send this task prompt:

```text
Start the Rust Book deck workflow.

Use ./rust-learning-deck-requirements.md as the full source-of-truth spec and ./deck-build/requirements-checklist.md as the compact checklist.

Read ./deck-build/README.md and ./deck-build/coverage.json. Pick the first not_started source section in coverage order. For that section:
1. Read the source file from ./rust-book/src.
2. Extract concrete card content into the appropriate ./deck-build/chapter-notes/chXX.md file.
3. Do not draft final cards yet unless the section extraction is complete and clearly ready.
4. Update ./deck-build/coverage.json and ./deck-build/validation-report.md with exact progress.

Prioritize durable state in files over chat memory.
```

## Normal Resume Prompt

For later sessions, use:

```text
Resume the Rust Book deck workflow from ./deck-build. Read ./deck-build/README.md, ./deck-build/coverage.json, ./deck-build/validation-report.md, and the latest chapter notes/cards. Continue from the first incomplete section. Keep ./rust-learning-deck-requirements.md and ./deck-build/requirements-checklist.md in force.
```

