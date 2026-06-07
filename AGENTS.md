# AGENTS.md

## Scope

Applies to the repository root.

More specific `AGENTS.md` files override this file. In particular, follow
`stuff/parser/AGENTS.md` for all work inside `stuff/parser/`.

## Project Shape

Inza is a deck-format and app-prototype workspace for a modern Anki
alternative.

Current center of gravity:

- `OPEN-DECK_FORMAT.md` is the source of truth for the deck design.
- `stuff/validate-open-deck.ts` checks Open Deck directories.
- `stuff/rust-book-cards/` is source material for a native Rust Book deck.
- `stuff/parser/` is Anki `.apkg` import/parsing research.
- `web/` is the web app.
- `desktop/` is the Electron desktop app.
- `mobile/` is the Expo mobile app.
- `stuff/ref-macos/` is a native macOS reference prototype, not canonical deck data.

The repo changes shape quickly. Always inspect the current tree before assuming
sample decks, generated outputs, or old names still exist.

## Working Rules

- Keep the deck format simple and content-first.
- Deck files describe learning content and review intent. Apps own rendering,
  layout, styling, accessibility, and platform behavior.
- Desktop, mobile, and web app work should implement `OPEN-DECK_FORMAT.md`
  directly. Treat old reference code as a starting point, not as canonical
  loader or renderer architecture.
- Avoid deck-authored HTML templates, CSS, JavaScript, and renderer-specific
  layout knobs unless the user explicitly reopens that design.
- Do not add custom markup, exact Anki styling preservation, or import metadata
  fields just because one imported deck needs them.
- Prefer generic content blocks, labels, tags, media references, and provenance
  over specialized schema fields.
- Keep fixtures and examples legitimate. Do not leave debugging edge-case cards
  mixed into normal sample decks unless the sample is explicitly for stress
  testing.
- Do not resurrect deleted or renamed files. Treat current user changes as
  intentional unless the user asks to restore them.
- Use Bun-first tooling for TypeScript and JavaScript projects.
- Keep JavaScript dependencies in the root Bun workspace lockfile.
- Do not add dependencies unless they clearly remove more complexity than they
  introduce.
- Keep generated full-deck outputs such as `stuff/kaishi-open-deck/` local unless the
  user explicitly asks to track them.

## Editing Rules

- Keep edits scoped to the requested area.
- Match existing file style.
- Prefer small, direct changes over framework or schema expansion.
- Update docs when behavior or format expectations change.
- Use `apply_patch` for manual file edits.
- Do not commit generated output such as `node_modules`, `dist`, `.expo`,
  `.build`, parser extraction directories, or temporary deck exports.
- Be cautious with large `.apkg` and media assets. Do not add new large files
  unless the user explicitly wants them tracked.

## Verification

For deck format or validator changes, validate any available Open Deck fixtures:

```sh
bun stuff/validate-open-deck.ts path/to/deck
```

For parser changes, follow `stuff/parser/AGENTS.md`.

For reference app changes, use the local project scripts:

```sh
cd web && bun run build
cd desktop && bun run build
cd mobile && bun run check
cd stuff/ref-macos && swift build
```

Run only the checks relevant to the files changed. If a check cannot run because
the needed fixture or local dependency is missing, say that directly.
