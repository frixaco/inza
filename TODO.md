# Inza TODO

Last updated: 2026-06-08

Use this as the default "what should I work on next?" checklist. Keep it
realistic: finish the mobile learning loop before expanding platform scope.

## Current Read

- Mobile has the UI language direction landed: warm native-feeling Expo screens,
  deck cards, stat badges, a study screen, reveal animation, haptics, and
  4-button ratings.
- Mobile is still a static prototype: `mobile/src/data.ts` hardcodes decks,
  stats, and five sample cards.
- There is no app-facing Open Deck loader, no persistent review state, no FSRS
  scheduling integration, and no real deck data in the mobile app yet.
- `stuff/kaishi-open-deck/` validates as Open Deck: 1501 notes in 7 note files.
- `stuff/rust-book-cards/` has 946 source cards across 100 YAML files, but those
  files are not yet canonical Open Deck shape.
- Web and desktop are currently static UI/reference surfaces, not reusable deck
  engines.
- `bun run check:mobile` currently fails in `expo-doctor` because Expo dependency
  hygiene needs cleanup.

## Now: Make Mobile Real Enough For Rust Study

- [ ] Fix the mobile check baseline.
  - [ ] Add the missing `expo-font` peer dependency required by `expo-symbols`.
  - [ ] Align `react-native-safe-area-context` with the Expo SDK expected version.
  - [ ] Reinstall/dedupe dependencies if `expo-doctor` still reports duplicate
        `expo-font` native modules.
  - [ ] Verify with `bun run check:mobile`.

- [ ] Convert the Rust Book cards into canonical Open Deck.
  - [ ] Add a small converter script under `stuff/`, for example
        `stuff/convert-rust-book-cards-to-open-deck.ts`.
  - [ ] Input: `stuff/rust-book-cards/*.yaml`.
  - [ ] Output: an Open Deck directory such as `stuff/rust-book-open-deck/`.
  - [ ] Map `front` to `prompt` and `back` to `answer`.
  - [ ] Use `type: prompt_response` and `answer_mode: reveal`.
  - [ ] Preserve chapter/section/card type/compile status/source as tags,
        deck paths, references, or `provenance`; do not add custom core fields.
  - [ ] Split notes in stable lexical order so study order follows the book.
  - [ ] Validate with
        `bun stuff/validate-open-deck.ts stuff/rust-book-open-deck`.

- [ ] Define the minimal app-side Open Deck model for mobile.
  - [ ] Add TypeScript types for manifest, note file, prompt-response note,
        content blocks, inline runs, and media refs.
  - [ ] Keep this inside `mobile/src/` for now unless a second app actually
        consumes it.
  - [ ] Support defaults merging from note files.
  - [ ] Support only `prompt_response` for the first mobile study loop.
  - [ ] Add a small fixture test path or script check so malformed deck data
        fails before it reaches the UI.

- [ ] Get Rust Book data onto the phone.
  - [ ] Add a build/export script that turns a validated Open Deck into compact
        JSON the Expo app can import.
  - [ ] Start with Rust Book because it has no media dependency.
  - [ ] Preserve note IDs, deck path, tags, prompt, answer, and source order.
  - [ ] Decide explicitly whether the generated mobile seed JSON is temporary
        local output or a tracked bootstrap asset.
  - [ ] Replace `mobile/src/data.ts` sample cards with the exported Rust Book
        deck data.

- [ ] Render real Open Deck prompt-response content in mobile.
  - [ ] Render string content.
  - [ ] Render block-list content with labels and role-aware visual hierarchy.
  - [ ] Render inline `runs`, including `above`/`below` for furigana-style text.
  - [ ] Render Markdown text well enough for Rust cards: paragraphs, inline
        code, fenced code blocks, and bullet lists.
  - [ ] Keep deck-authored HTML/CSS/JS unsupported.
  - [ ] Keep the current mobile visual language as the reference.

- [ ] Make the Rust Book study loop usable without FSRS first.
  - [ ] Show the Rust Book deck on the home screen with real card counts.
  - [ ] Start a session in source order or stable deck order.
  - [ ] Reveal answer.
  - [ ] Record `again`, `hard`, `good`, and `easy` actions in local state.
  - [ ] Keep progress when navigating away and returning.
  - [ ] Show a simple session-complete state instead of dropping straight home.

## Next: Persistence And Real Scheduling

- [ ] Choose and add a local persistence layer for mobile.
  - [ ] Prefer SQLite if review logs, card state, and later sync are all going
        into the same store.
  - [ ] Store deck registry, note/card identity, review state, and review log.
  - [ ] Keep imported deck content separate from user review state.

- [ ] Integrate FSRS scheduling.
  - [ ] Verify the current official/open-source FSRS SDK package before adding
        the dependency.
  - [ ] Define the app's review-state model before wiring UI buttons to FSRS.
  - [ ] Map mobile ratings to FSRS ratings.
  - [ ] Calculate next due dates and intervals from real review state.
  - [ ] Update home stats from due counts instead of mock numbers.
  - [ ] Keep optimizer work for later; first goal is correct daily scheduling.

- [ ] Add mobile daily review ergonomics.
  - [ ] Due/new/learning queues.
  - [ ] Basic deck filtering.
  - [ ] Suspend/unsuspend a card.
  - [ ] Bury or skip a card for the current session.
  - [ ] Basic search over cards.

## Then: Japanese / Kaishi Mobile Support

- [ ] Load the validated Kaishi Open Deck through the same Open Deck path.
  - [ ] Do not special-case Kaishi schema fields.
  - [ ] Make sure labels, runs, furigana, pitch accent, frequency, sentence
        blocks, notes, images, and audio all degrade cleanly.

- [ ] Add media support.
  - [ ] Bundle or import image/audio assets for local decks.
  - [ ] Render images as support media without forcing Anki layout.
  - [ ] Play word and sentence audio from block-level media refs.
  - [ ] Handle missing media with a quiet placeholder and a validation/reporting
        path.

- [ ] Make Japanese review feel good.
  - [ ] Script-aware typography and line height.
  - [ ] Tap targets for replaying audio.
  - [ ] Optional reveal ordering if the card has many answer blocks.
  - [ ] Keep the first implementation generic; no Kaishi-only renderer.

## Core App Features After Study Works

- [ ] Deck management.
  - [ ] Add/import a deck directory or zip.
  - [ ] Validate before import.
  - [ ] Show validation errors in a human-readable way.
  - [ ] Remove a deck without deleting unrelated review history accidentally.

- [ ] Editing.
  - [ ] Browse notes/cards.
  - [ ] Edit prompt-response text and tags.
  - [ ] Add a basic prompt-response note.
  - [ ] Preserve YAML/Open Deck output cleanly; do not introduce app-only authoring
        fields into deck content.

- [ ] Stats.
  - [ ] Daily reviews.
  - [ ] Retention.
  - [ ] Due forecast.
  - [ ] Deck-level progress.
  - [ ] FSRS parameter/health visibility.

- [ ] Sync.
  - [ ] Separate deck content sync from review-state sync.
  - [ ] Define conflict behavior for edits before building a sync transport.
  - [ ] Keep local-file workflows first-class.

## Later: Desktop And Web

- [ ] Desktop app.
  - [ ] Reuse the real Open Deck model after mobile proves it.
  - [ ] Add file-system deck import/export.
  - [ ] Add richer editing and diagnostics where desktop has an advantage.

- [ ] Web app.
  - [ ] Treat web as secondary until mobile is useful.
  - [ ] Reuse shared deck logic only after duplication becomes real.
  - [ ] Keep browser constraints separate from the native local-first path.

## Avoid For Now

- [ ] Do not build a general Anki renderer.
- [ ] Do not add deck-authored HTML, CSS, JavaScript, or template preservation.
- [ ] Do not make the mobile app depend on the old static web/desktop prototype
      architecture.
- [ ] Do not start sync before local review state and deck identity are solid.
- [ ] Do not optimize FSRS parameters before basic FSRS scheduling is correct.
