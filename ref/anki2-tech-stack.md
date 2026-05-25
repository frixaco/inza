# Anki2 Tech Stack Recommendation

Status: Draft  
Date: 2026-05-24

## Recommendation

Use **Rust core + Electron desktop + Expo mobile/web + Rust CLI/MCP**.

This is the strongest fit for building quickly with a shared TypeScript product
surface, keeping reliable desktop and mobile apps, and putting the scheduler,
optimizer, storage, sync, and migration logic in Rust where correctness and
performance matter most.

## Product Boundary

This app is not trying to be Anki-compatible at runtime.

Anki support should be limited to migration scripts and import paths. The app
should use its own deck model, custom card design system, storage schema, sync
model, and automation interface. The main Anki behavior to preserve is the
scheduler/optimizer lineage through FSRS and, where useful, migration of review
history into the new review log.

## Stack

- **Core:** Rust
  - custom deck model and validation
  - FSRS scheduling and optimizer integration
  - review history and scheduling state
  - media handling
  - search/indexing primitives
  - sync/conflict logic
  - Anki migration scripts
- **Storage:** SQLite + FTS5
  - local-first runtime database
  - one database per user/profile
  - append-only review log
  - media stored as content-addressed files
  - DSF-like deck sources used for import/export and AI generation, not as the
    runtime database
- **Desktop app:** Electron + React
  - macOS, Windows, and Linux from one desktop codebase
  - reliable packaging and platform behavior
  - Rust core exposed through a sidecar process or native Node binding
  - desktop can run heavy local optimizer jobs without browser constraints
- **Mobile app:** Expo + React Native
  - iOS and Android from one mobile codebase
  - small store download size compared with desktop Electron
  - Rust core reached through native modules only where local performance is
    required
  - can delegate heavyweight optimizer jobs to desktop, CLI, or backend sync
- **Shared product layer:** TypeScript
  - shared deck editing flows, validation messages, design tokens, card preview
    components, API clients, and automation UI
  - keep platform-specific shell code thin
- **Scheduler:** Rust FSRS
  - scheduling is core product behavior
  - optimizer requires a high-quality review log and may be CPU-heavy
  - run optimizer in Rust on desktop/CLI/backend by default; mobile/web can use
    cached parameters and request optimization jobs
- **CLI:** Rust binary
  - `manki migrate-anki`
  - `manki validate`
  - `manki generate`
  - `manki optimize`
  - `manki review-log`
- **MCP:** Rust MCP server
  - likely the same binary as the CLI: `manki mcp`
  - exposes deck creation, validation, migration, search, generation, and
    optimizer jobs

## Why Electron + Expo

Electron + Expo accepts that desktop and mobile are different app shells while
keeping the product language in TypeScript and React.

That tradeoff is acceptable here because the app's hardest shared behavior
belongs in Rust, not in the UI toolkit: deck validation, storage, sync,
scheduling, optimizer jobs, migration, media handling, and automation. The UI
can be split into desktop and mobile shells while sharing domain types, API
clients, editor logic, design tokens, and card rendering conventions.

Electron also avoids the uncertain Windows-native path. Instead of maintaining
SwiftUI, Compose, and WinUI implementations, desktop ships as one reliable app
across macOS, Windows, and Linux.

## Why Not Fully Native UI

SwiftUI, Jetpack Compose, and WinUI 3 would provide the most native platform
surfaces, but they create at least three UI apps plus separate binding, build,
packaging, and QA paths.

That is a good future option only if platform-native feel becomes more important
than iteration speed and product consistency. For the first serious product
shape, native shells would spend too much energy on duplicating the same study,
deck editing, media, automation, and sync workflows across platforms.

## Why Not Flutter

Flutter remains the strongest single-codebase app option across desktop and
mobile, but it moves the product surface into Dart and Flutter widgets.

For this app, TypeScript/React is the better product layer because it aligns
with Electron, Expo, web automation, MCP-adjacent tooling, AI-generated UI work,
and likely future web surfaces. The cost is accepting two app shells instead of
one Flutter shell.

## Why Not Tauri

Tauri is not the right foundation here.

It is desktop-first, webview-based, and its mobile/plugin story adds risk for a
product where mobile support is mandatory. Electron is heavier, but it is the
more boring and reliable desktop choice.

## Architecture Shape

```text
manki/
  crates/
    manki-core/        deck model, cards, validation
    manki-migrate/     Anki import and migration helpers
    manki-scheduler/   FSRS scheduling + optimizer integration
    manki-store/       SQLite, FTS5, media CAS
    manki-ai/          prompt/context -> deck generation pipeline
    manki-sync/        local-first sync primitives
    manki-cli/         CLI + MCP entrypoints
  packages/
    domain/            shared TypeScript types and client contracts
    ui/                shared React components where practical
    card-renderer/     shared card preview/rendering logic
  apps/
    desktop/           Electron + React
    mobile/            Expo + React Native
```

## Rust Boundary

Keep Rust behind stable command-style APIs.

For desktop, prefer a Rust sidecar process first. It keeps Electron packaging
simple, isolates crashes, and lets CLI/MCP reuse the same service code. Native
Node bindings can be added only if sidecar IPC becomes a measured bottleneck.

For mobile, avoid requiring Rust for every UI interaction. Use TypeScript for
interaction-heavy product flows and call Rust only for scheduler, storage,
media, and optimizer work that truly needs native performance.

## Browser And Optimizer Boundary

Browser and mobile web clients should not be required to run full optimizer
jobs locally.

Normal review scheduling is cheap. Optimizing FSRS parameters over large review
histories can be CPU- and memory-heavy, especially in mobile browsers. Treat
browser-local optimization as optional; run the canonical optimizer in Rust on
desktop, CLI, MCP, or backend jobs.

## References Checked

- [Electron supported platforms](https://www.electronjs.org/docs/latest/tutorial/support)
- [Electron Forge](https://www.electronforge.io/)
- [Expo supported platforms](https://docs.expo.dev/workflow/web/)
- [Expo app size](https://docs.expo.dev/distribution/app-size/)
- [Expo Modules API](https://docs.expo.dev/modules/overview/)
- [React Native Windows](https://microsoft.github.io/react-native-windows/)
- [FSRS Rust crate](https://docs.rs/fsrs/)
- [Anki FSRS docs](https://docs.ankiweb.net/deck-options.html)
- [SQLite FTS5](https://www.sqlite.org/fts5.html)
