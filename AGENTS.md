# AGENTS.md

## Scope

Applies to the repository root.

More specific `AGENTS.md` files override this file. In particular, follow
`parser/AGENTS.md` for all work inside `parser/`.

## Project Shape

Manki is a deck-format and app-prototype workspace for a modern Anki
alternative.

Current center of gravity:

- `open-deck-format.md` is the source of truth for the deck design.
- `tools/validate-open-deck.ts` checks Open Deck directories.
- `rust-book-cards/` is source material for a native Rust Book deck.
- `parser/` is Anki `.apkg` import/parsing research.
- `ref-*` directories are reference app prototypes, not canonical deck data.

The repo changes shape quickly. Always inspect the current tree before assuming
sample decks, generated outputs, or old names still exist.

## Working Rules

- Keep the deck format simple and content-first.
- Deck files describe learning content and review intent. Apps own rendering,
  layout, styling, accessibility, and platform behavior.
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
- Do not add dependencies unless they clearly remove more complexity than they
  introduce.

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
bun tools/validate-open-deck.ts path/to/deck
```

For parser changes, follow `parser/AGENTS.md`.

For reference app changes, use the local project scripts:

```sh
cd ref-web && bun run build
cd ref-electron && bun run build
cd ref-expo && bun run check
cd ref-macos && swift build
```

Run only the checks relevant to the files changed. If a check cannot run because
the needed fixture or local dependency is missing, say that directly.
