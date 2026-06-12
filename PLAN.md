# Inza Plan

## Purpose

Build Inza as one responsive, installable web app for creating, editing,
syncing, and reviewing Open Deck flashcards.

This plan is a guide for learning and engineering the system, not a recipe.
Prefer small prototypes, written decisions, and measured behavior over copying a
large architecture into place all at once.

## Product Scope

- Import Open Deck ZIP files.
- Create, edit, delete, list, and configure decks.
- Create, edit, delete, suspend, browse, search, and review notes.
- Support global and per-deck review settings.
- Use Anki's FSRS SDK for scheduling and parameter optimization.
- Show daily, weekly, and monthly review statistics.
- Sync decks, notes, settings, scheduling state, review history, and statistics.
- Support full offline browsing, searching, editing, and reviewing.

## Stack Direction

- React responsive PWA for desktop and mobile.
- Vite for the React app.
- One Bun server for the built app, Better Auth, sync endpoints, and media
  endpoints. Keep it as one deployable app, not separate frontend and API
  services.
- PostgreSQL as the authoritative server database.
- Better Auth for authentication; do not build authentication from scratch.
- Dexie over IndexedDB for local structured data.
- Cloudflare R2 for synced media bytes.
- FSRS scheduling and optimization on the user's device.
- Plain TypeScript. Do not introduce Effect, a sync framework, Next.js, or a
  separate API service.

Add after the first local/offline data model works:

- Explicit media prefetching beyond ordinary browser caching.
- Web Worker optimization if FSRS optimization blocks the UI in practice.

Treat this stack as a working hypothesis. Change it only when a prototype shows
that a requirement is meaningfully harder than expected.

## Engineering Principles

- Build the smallest complete path first: one deck, one note type, one review,
  one sync.
- Keep server, local store, and UI responsibilities explicit.
- Make all sync writes idempotent.
- Preserve review history from every device.
- Prefer append-only history plus rebuildable derived state.
- Make every offline state visible to the user.
- Avoid generic sync frameworks, broad abstractions, and clever schema tricks
  until repeated concrete cases justify them.
- Write down decisions when they change the data model, conflict behavior, or
  user-visible guarantees.

## Phase 1: Understand The Domain

Goal: know exactly what Inza is syncing before building sync.

Research and decide:

- What is a deck, note, card, review state, review event, setting, statistic,
  and media object?
- Which records are mutable?
- Which records are append-only?
- Which fields belong to Open Deck content versus Inza app state?
- How does one note produce one or more reviewable cards?
- What happens to scheduling history when a note is edited?

Prototype:

- Load one existing Open Deck fixture.
- Render enough content to review it.
- Manually create one review event and one current card state.

Exit when:

- The core nouns are named consistently in docs and code.
- You can explain which state is content, which state is scheduling, and which
  state is derived.

## Phase 2: Local-First App Skeleton

Goal: prove the app can function from local browser data.

Research and decide:

- What belongs in Dexie?
- What belongs in browser cache or OPFS instead of Dexie?
- How much data can be stored safely on target browsers?
- How does the app detect missing, partial, or outdated local data?

Prototype:

- Store decks, notes, cards, settings, review events, and current review state
  locally.
- Browse, search, edit, and review without a server.
- Show whether local data is synced, pending, or unavailable.

Exit when:

- Full offline editing and reviewing work for a small deck.
- The app can restart and recover the same local state.
- Quota and persistence failures have visible user-facing states.

## Phase 3: Server Authority

Goal: add a simple durable server without changing the local app mental model.

Research and decide:

- How should PostgreSQL represent the same nouns as the local store?
- What constraints prevent impossible states?
- Which server changes need a monotonic sequence for sync?
- How do Better Auth users and sessions connect to Inza users, devices, and
  ownership?

Prototype:

- Add Better Auth.
- Upload local mutations to the server.
- Download server changes into the local store.
- Keep media metadata in PostgreSQL and media bytes in R2.

Exit when:

- One client can create, edit, review, sync, clear local data, and restore from
  the server.
- Every accepted mutation can be safely retried.

## Phase 4: Sync And Conflict Behavior

Goal: implement Anki-style category-specific merging, not a generic magic sync
system.

Research and decide:

- How does Anki merge review logs, cards, notes, and structural changes?
- Which Inza changes are always mergeable?
- Which changes use newer-compatible-record-wins?
- Which changes require explicit replacement or user intervention?
- How are duplicate mutations detected?
- How is convergence tested when clients sync in different orders?

Rules to preserve:

- Review events are append-only and merged from all clients.
- Mutable records use revisions and deterministic conflict rules.
- Incompatible structural changes are rare and explicit.
- Statistics are derived from synced review events and rebuildable aggregates.

Prototype:

- Simulate two offline clients reviewing the same card.
- Simulate two offline clients editing the same note.
- Simulate delete versus edit.
- Sync the same scenarios in different orders and compare final server state.

Exit when:

- The conflict rules are documented.
- The same set of mutations converges to the same result regardless of upload
  order.
- Review history is never lost during normal sync.

## Phase 5: FSRS And Statistics

Goal: integrate scheduling without hiding important state.

Research and decide:

- Which FSRS package/API is appropriate for browser use?
- What exact data does scheduling need per card?
- What exact history does optimization need?
- When should optimization run, and how does the user cancel or retry it?
- Which statistics are raw events versus derived aggregates?

Prototype:

- Run scheduling on review.
- Run optimization on-device without freezing the UI.
- Rebuild daily aggregates from review events.

Exit when:

- Scheduling is deterministic for the same inputs.
- Optimization can fail or be interrupted without corrupting review state.
- Daily, weekly, and monthly stats can be rebuilt from history.

## Phase 6: Import, Export, And Recovery

Goal: make data portable before the app becomes too clever.

Research and decide:

- How should Open Deck ZIP import handle duplicates, partial failure, and media?
- What should an Inza backup include beyond Open Deck content?
- How does account deletion remove database records and R2 media?
- How are orphaned media objects detected and cleaned up?

Prototype:

- Import one Open Deck ZIP into local data.
- Sync imported content to the server.
- Export Open Deck content.
- Export an Inza backup with app state.

Exit when:

- Import either completes cleanly or leaves no broken deck behind.
- A user can recover their synced data on a fresh browser profile.

## Do Not Build Yet

- Native desktop or mobile apps.
- Marketplace or public deck sharing.
- Collaboration.
- AI card generation.
- Full Anki import as a product feature.
- Realtime WebSockets.
- Advanced fuzzy search.
- Sophisticated media prefetching.
- A general-purpose sync framework.
- Effect.

## Open Questions

- What exact subset of Anki settings is required for the complete product?
- Should note editing preserve existing card scheduling by default?
- What is the first supported import path: Open Deck only, or Open Deck plus
  selected Anki parser research?
- What are the storage quotas and warning thresholds for downloaded decks?
- What user-facing language explains sync conflicts without exposing internals?

## Current Constraint

Offline changes must remain usable until synchronized. Synchronization must be
idempotent, preserve review history from multiple clients, and converge to the
same server state regardless of upload order.
