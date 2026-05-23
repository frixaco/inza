# Anki2 Tech Stack Recommendation

Status: Draft  
Date: 2026-05-24

## Recommendation

Use **Rust core + Flutter apps + Rust CLI/MCP**.

This is the strongest fit for native code where it matters, reliable
cross-platform apps, and shared product behavior across macOS, Linux, Windows,
Android, iOS, CLI, and MCP.

## Stack

- **Core:** Rust
  - deck model and DSF support
  - Anki import/export
  - scheduler and review history
  - media handling
  - validation
  - search/indexing
  - sync/conflict logic
  - AI deck-generation pipeline
- **Storage:** SQLite + FTS5
  - local-first runtime database
  - one database per user/profile
  - append-only review log
  - media stored as content-addressed files
- **Scheduler:** Rust FSRS
  - FSRS already has Rust ecosystem support
  - Anki has integrated FSRS as an alternative scheduler
- **Apps:** Flutter
  - one UI codebase for Android, iOS, Windows, macOS, Linux, and optional web
  - not webview-based like Electron or Tauri
  - consistent look across platforms
  - solid native integration through platform channels/plugins
- **Rust/UI bridge:** flutter_rust_bridge
  - direct Dart to Rust bindings
  - supports Android, iOS, Windows, Linux, macOS, and web
- **CLI:** Rust binary
  - `manki import`
  - `manki export`
  - `manki validate`
  - `manki generate`
  - `manki review-log`
- **MCP:** Rust MCP server
  - likely the same binary as the CLI: `manki mcp`
  - exposes deck creation, validation, import/export, search, and card generation

## Why Not Fully Native UI

SwiftUI, Jetpack Compose, WinUI, and GTK/Adwaita would provide the most native
surface, but would create four UI apps plus binding, build, and distribution
complexity.

For this product, the hard parts are the deck model, scheduler, Anki
compatibility, sync, media, and AI workflows. Those should be Rust and shared
everywhere. Fully native UI is only worth it if platform-native feel matters
more than shipping the same polished study workflow everywhere.

## Why Not Electron + Expo

Electron + Expo is viable, but it creates two app stacks: React DOM on desktop
and React Native on mobile. They share TypeScript concepts, not a true
UI/runtime. Desktop packages are large, and mobile native-module work still
needs Swift/Kotlin through Expo Modules.

Electron is reliable for desktop, but pairing it with Expo is weaker than a
single Flutter app surface for this product.

## Why Not Tauri

Tauri targets desktop and mobile, but it is still webview-based. Mobile
plugin/platform behavior is the main risk. Given the requirement that mobile is
mandatory and the app should feel reliable, Tauri should not be the foundation.

## Architecture Shape

```text
manki/
  crates/
    manki-core/        deck model, cards, validation
    manki-anki/        .apkg import/export
    manki-scheduler/   FSRS + Anki compatibility behavior
    manki-store/       SQLite, FTS, media CAS
    manki-ai/          prompt -> DSF generation pipeline
    manki-sync/        local-first sync primitives
    manki-cli/         CLI + MCP entrypoints
  apps/
    flutter/           mac/win/linux/android/ios UI
```

## Important Product Boundary

Keep DSF as the authoring/source format, but do **not** make DSF the runtime
database.

DSF should be used for import/export, Git-friendly deck sources, AI generation,
and migration. Review state, scheduling state, sync state, and search indexes
belong in SQLite.

## References Checked

- [Flutter supported platforms](https://docs.flutter.dev/reference/supported-platforms)
- [flutter_rust_bridge](https://pub.dev/packages/flutter_rust_bridge)
- [UniFFI Rust bindings](https://github.com/mozilla/uniffi-rs)
- [FSRS Rust crate](https://docs.rs/crate/fsrs/5.2.0)
- [Anki FSRS docs](https://docs.ankiweb.net/deck-options.html)
- [SQLite FTS5](https://www.sqlite.org/fts5.html)
- [Expo Modules API](https://docs.expo.dev/modules/overview/)
- [Electron Packager platform support](https://packages.electronjs.org/packager)
