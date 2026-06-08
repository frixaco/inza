# Inza Context

Inza is a modern, open-format, AI-friendly alternative to Anki.

This file captures durable product context for future AI-agent sessions. It is
not an implementation-state report. Inspect the current tree before assuming how
far any app, parser, fixture, or generated deck has progressed.

## Product Direction

Inza should keep the learning and scheduling value of Anki while replacing the
old app experience and opaque deck packaging with a modern local-first system.

Core goals:

- Use Anki's open-source FSRS SDK for scheduling and parameter optimization.
- Provide modern UI and UX across mobile, desktop, and web.
- Use an open deck format instead of opaque `.apkg` files: a deck can be a
  directory or zip, and notes are simple YAML files that humans and tools can
  inspect and edit directly.
- Be AI-friendly by default: local structured files, CLI access, MCP-friendly
  workflows, and predictable machine-readable data.
- Support enough deck flexibility to migrate most existing Anki decks, while
  keeping migration compatibility secondary to a clean, content-first native
  format.
- Prefer a modern tech stack over Anki's Python/Qt desktop architecture.

## Current Priorities

Priority order:

1. Build a functional mobile UI for `stuff/rust-book-cards/` so Rust study can
   continue.
2. Use the migrated Kaishi deck at `stuff/kaishi-open-deck/` so Japanese study
   can continue.
3. Make the mobile app functional first.
4. Add core flashcard-app features: create, edit, customize, sync, and track
   decks, cards, and review stats.
5. Build out the desktop app.
6. Build out the web app.

## Product Principles

- Deck files describe learning content and review intent.
- Apps own rendering, layout, styling, accessibility, interaction, and platform
  behavior.
- `OPEN-DECK_FORMAT.md` is the source of truth for the deck format.
- Keep the deck format simple, local, content-first, and friendly to direct
  editing.
- Prefer generic content blocks, labels, tags, media references, and provenance
  over specialized schema fields.
- Do not add deck-authored HTML templates, CSS, JavaScript, renderer-specific
  layout knobs, exact Anki styling preservation, or import metadata fields just
  because one imported deck needs them.
- Treat Anki migration as important but secondary. Migration should adapt Anki
  data into Inza's model instead of bending the native format around Anki's
  legacy renderer model.

## Repo Anchors

- `OPEN-DECK_FORMAT.md`: canonical deck-format design.
- `stuff/validate-open-deck.ts`: Open Deck directory validator.
- `stuff/rust-book-cards/`: source material for the Rust Book study deck.
- `stuff/kaishi-open-deck/`: migrated Kaishi Japanese deck, likely generated
  local output unless explicitly tracked.
- `stuff/parser/`: Anki `.apkg` import/parsing research. Follow
  `stuff/parser/AGENTS.md` inside this subtree.
- `mobile/`: Expo mobile app, current top app priority.
- `desktop/`: Electron desktop app.
- `web/`: web app.
- `stuff/ref-macos/`: native macOS reference prototype, not canonical deck data.

## Agent Guidance

When starting a fresh session:

1. Read this file and `AGENTS.md`.
2. Inspect the current tree before assuming generated outputs, sample decks, or
   old names still exist.
3. For app work, implement `OPEN-DECK_FORMAT.md` directly rather than treating
   reference code as canonical loader or renderer architecture.
4. Prefer Bun-first tooling for JavaScript and TypeScript.
5. Keep changes scoped to the current priority unless the user explicitly asks
   for broader architecture or product work.
