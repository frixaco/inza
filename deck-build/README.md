# Rust Book Deck Build Workspace

This directory is the durable working area for building our own Rust Book Anki deck.

Authoritative inputs:

- Requirements: `../rust-learning-deck-requirements.md`
- Official Rust Book source: `../rust-book/src`
- Coverage inventory: `./coverage.json`

Do not rely on chat history as the source of truth. Future sessions should recover from the files in this directory.

## Workflow

1. Read `../rust-learning-deck-requirements.md` only as needed. Use `./requirements-checklist.md` as the compact working checklist.
2. Pick the next incomplete section from `./coverage.json`.
3. Read the corresponding book source file from `../rust-book/src`.
4. Extract card content into `./chapter-notes/chXX.md`.
5. Draft final cards into `./cards/chXX.yaml`.
6. Update `./coverage.json` status for the section.
7. Update `./validation-report.md` with what was checked and what remains.

## Helper Scripts

Regenerate coverage after the Rust Book source changes:

```sh
node deck-build/scripts/build-coverage.mjs
```

Initialize missing chapter notes/card files from coverage:

```sh
node deck-build/scripts/init-workspace-files.mjs
```

These scripts are intentionally simple and dependency-free. Re-running `init-workspace-files.mjs` does not overwrite existing chapter notes or card files.

## Passes

Use two passes per chapter:

- Extraction pass: capture concepts, syntax, failure modes, comparisons, project decisions, and listings that should become cards.
- Card pass: turn extracted items into source-mapped, atomic cards using the schema in `./schema/card.schema.yaml`.

Do not write final cards directly from vague memory. Every card should point back to a book section and requirement references.

## Status Values

Use these section statuses in `coverage.json`:

- `not_started`
- `extracted`
- `cards_drafted`
- `validated`
- `skipped_with_reason`

Skipping should be rare. If a section has no cards, record a concrete reason in `notes`.

## Chapter Completion Gates

A chapter is done only when:

- every section is `validated` or `skipped_with_reason`;
- all cards have source metadata;
- all normal Rust snippets compile or are marked for compile validation;
- all expected failures are marked `compile_fail`;
- no card uses banned vague phrasing;
- `validation-report.md` records the chapter result.
