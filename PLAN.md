# Inza Plan

## Purpose

Build the smallest local app that can import an Open Deck, review its cards, and
resume with the same schedule after a browser restart.

The first release proves this loop:

```text
choose directory -> import deck -> study card -> schedule review -> reload -> resume
```

Anything that does not prove this loop is later work.

## MVP Exit State

The MVP is complete when a user can:

1. Choose one Open Deck directory.
2. See the imported deck in the deck list.
3. Review every supported note type with its local media.
4. Grade a card through the FSRS scheduler.
5. Close and reopen the app without losing the deck or schedule.

## MVP Scope

### Deck input

- Import a directory with `deck.yaml`, `notes/*.yaml`, and local assets.
- Load note files in stable lexical path order.
- Follow the exact required-only schema in
  [`OPEN-DECK_MVP_FORMAT.md`](OPEN-DECK_MVP_FORMAT.md).
- Support `prompt_response`, `cloze`, and rectangular `occlusion` notes.
- Accept Markdown strings for learner-facing text.
- Require `media` on prompt-response and cloze notes; an empty array means no
  media.
- Require `src` and `alt` for images, and `src` and `label` for audio and video.
- Reject missing, unknown, optional, or post-MVP fields with the note ID and file
  path.

The full design remains in [`OPEN-DECK_FORMAT.md`](OPEN-DECK_FORMAT.md) for
post-MVP work. The current Kaishi conversion uses that full format, so it must
be flattened or replaced with one strict MVP-compatible fixture before it can
test this path.

### Local app

- Store decks, notes, cards, review events, scheduling state, and media bytes in
  Dexie over IndexedDB.
- Read the deck list and review queue from Dexie, not bundled sample data.
- Render Markdown and local media during review.
- Use the Anki FSRS SDK for each review grade.
- Persist the updated card state and review event in one local transaction.
- Recover the same state after reload.

### Interface

- Deck import.
- Deck list with due counts.
- Review screen with reveal and grade actions.
- Visible import, storage, and media errors.

## Deferred Until The MVP Loop Works

### Authoring and organization

- Deck and note creation, editing, deletion, suspension, browsing, and search.
- Global and per-deck settings.
- Typed answers.
- Content blocks, inline runs, block roles, and block-level media.

### Import, export, and presentation

- ZIP and URL import.
- Export and backup flows.
- Formula rendering, syntax highlighting, and advanced Markdown extensions.
- Exact imported Anki layout or template preservation.
- Native desktop or mobile apps.

### Accounts and sync

- Authentication and accounts.
- Bun server, PostgreSQL, and Cloudflare R2.
- Cross-device sync, conflict resolution, and recovery from server state.
- Collaboration, public sharing, and a deck marketplace.

### Scheduling and reporting

- FSRS parameter optimization.
- Review setting controls beyond one fixed default.
- Daily, weekly, and monthly statistics.
- Advanced media prefetching or Web Workers.

### Packaging and extras

- Installable PWA work beyond the Vite app.
- Realtime WebSockets.
- AI card generation.
- Advanced fuzzy search.
- A general-purpose sync framework or Effect.

## Build Order

### 1. Directory loader

- Parse `deck.yaml` and `notes/*.yaml`.
- Validate exact object shapes, IDs, note types, required fields, and safe asset
  paths.
- Reject unknown and post-MVP fields with the note ID and file path.
- Load one strict MVP-compatible fixture.

Exit when the loader returns one deck with notes and media or one useful error.

### 2. Local store

- Keep decks, notes, media, cards, review events, and scheduling state in Dexie.
- Commit each validated note file and media file with updated byte progress.
- Render import progress from Dexie through React live queries.
- Remove partial records after failure or an interrupted import.

Exit when an imported deck survives reload and appears in the deck list.

### 3. Review loop

- Build reviewable cards for all three note types.
- Render Markdown and media.
- Pass each grade to FSRS.
- Save the review event and next card state together.

Exit when a grade changes the due state and that state survives reload.

### 4. MVP hardening

- Exercise missing files, invalid YAML, duplicate IDs, unsafe asset paths, missing
  media, and storage failure.
- Keep the previous local state when an import fails.
- Show the failure to the user.

Exit when the full MVP path works with a real directory and failures do not leave
partial decks.

## Stack For This Phase

- React and Vite.
- Plain TypeScript.
- Dexie over IndexedDB.
- Anki FSRS SDK on the user's device.
- One browser app. No server yet.

Add another service, dependency, worker, or abstraction only when the MVP path
cannot work without it.

## Later Product Direction

After the MVP loop works, add features in this order only as needed:

1. ZIP import and basic authoring.
2. Settings, browse/search, statistics, and export.
3. Authentication and one-client backup/restore.
4. Multi-client sync and explicit conflict behavior.
5. Optimization and presentation features proven necessary by real decks.
