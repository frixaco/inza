# Fresh Electron + Expo + Rust/FFI Monorepo Checklist

Use this document as the setup brief for a fresh repository.

Target date: May 2026.

## Goal

Create a modern monorepo with:

- Electron desktop app.
- Expo mobile app.
- Rust shared core exposed to desktop, Android, and iOS.
- Optional sync API.
- One clean final setup, no temporary fallback architecture.

## Assumptions

- Package manager: `pnpm@11`.
- Runtime for dev and CI: Node `24.x` LTS.
- Desktop runtime: Electron `42.x` or newer supported stable.
- Mobile runtime: Expo SDK `56`.
- React Native: New Architecture only.
- Rust edition: `2024`.
- Native functionality belongs in one shared Rust core unless there is a clear platform-only reason.
- Generated native folders from Expo prebuild are not committed unless the project intentionally becomes bare.

## Target Repository Shape

Prefer this structure for a new project:

```text
apps/
  desktop/
  mobile/
  sync-api/
packages/
  contracts/
  config/
crates/
  core/
  ffi/
scripts/
```

Use this simpler shape only if the repo will stay very small:

```text
desktop/
mobile/
sync-api/
crates/shared/
scripts/
```

## Root Workspace

- [ ] Initialize Git.
- [ ] Add `packageManager: "pnpm@11.3.0"`.
- [ ] Set root package private.
- [ ] Add `engines.node` pinned to Node `24.x`, not open-ended `>=22`.
- [ ] Add `pnpm-workspace.yaml`.
- [ ] Use `nodeLinker: isolated`.
- [ ] Add explicit `onlyBuiltDependencies` / `allowBuilds` entries for packages that need install scripts.
- [ ] Add root scripts:
  - [ ] `dev-desktop`
  - [ ] `dev-mobile`
  - [ ] `dev-sync-api`
  - [ ] `build-desktop`
  - [ ] `build-native`
  - [ ] `dist-desktop-mac-arm64`
  - [ ] `lint`
  - [ ] `fmt`
  - [ ] `typecheck`
  - [ ] `test`
- [ ] Add `.editorconfig`.
- [ ] Add `.gitignore` for `node_modules`, build output, Expo generated native folders, Cargo targets, logs, env files, and OS clutter.

## TypeScript, Lint, And Format

- [ ] Use strict TypeScript everywhere.
- [ ] Use one shared base `tsconfig`.
- [ ] Use `moduleResolution: "NodeNext"` for Node/Electron packages.
- [ ] Use Expo's base `tsconfig` for mobile.
- [ ] Use `tsgo` / `@typescript/native-preview` only if it passes the project cleanly; otherwise use stable `tsc` until TS native is production-ready for the repo.
- [ ] Use `oxlint` and `oxfmt` if the project wants fast minimal tooling.
- [ ] Keep package-specific lint/typecheck scripts small and composable.

## Desktop App

- [ ] Use Electron latest supported stable, currently Electron `42.x` as of May 2026.
- [ ] Track Electron release cadence and plan routine major upgrades.
- [ ] Align build targets with Electron's embedded runtime:
  - [ ] Node `24`.
  - [ ] Chromium matching the Electron major.
- [ ] Use React `19`.
- [ ] Use either:
  - [ ] Direct Vite for renderer dev/build, plus `tsdown` for Electron main/preload.
  - [ ] `tsdown`/Rollup style bundling if the app wants a very small custom build.
- [ ] Keep main, preload, and renderer as separate build targets.
- [ ] Bundle renderer code.
- [ ] Do not bundle `electron`.
- [ ] Minify renderer production code.
- [ ] Keep sourcemaps out of release artifacts unless explicitly needed.

### Electron Security

- [ ] `contextIsolation: true`.
- [ ] `nodeIntegration: false`.
- [ ] `sandbox: true`.
- [ ] Expose a narrow preload API with `contextBridge`.
- [ ] Validate every IPC payload at the main-process boundary.
- [ ] Validate `event.sender` for privileged IPC handlers.
- [ ] Use a restrictive Content Security Policy.
- [ ] Prefer custom protocols over `file://` for app-owned local resources.
- [ ] Block or explicitly handle unexpected navigation.
- [ ] Block or explicitly handle unexpected new windows.
- [ ] Never call `shell.openExternal` with untrusted or unvalidated URLs.
- [ ] Register Electron fuses in packaged builds:
  - [ ] Disable `runAsNode` unless required.
  - [ ] Enable cookie encryption.
  - [ ] Disable `NODE_OPTIONS`.
  - [ ] Disable Node CLI inspect args.
  - [ ] Enable ASAR integrity where supported.
  - [ ] Enable `onlyLoadAppFromAsar` if compatible with the app.
  - [ ] Disable extra `file://` privileges if the app uses custom protocols.

### Desktop Packaging

- [ ] Use `electron-builder` or Electron Forge deliberately; do not mix patterns casually.
- [ ] If using `electron-builder`, configure fuses directly.
- [ ] Build runtime artifacts first.
- [ ] Stage a minimal release directory.
- [ ] Copy only:
  - [ ] built main/preload files.
  - [ ] built renderer files.
  - [ ] package manifest needed at runtime.
  - [ ] production dependencies that are actually required.
  - [ ] native binaries/libraries.
  - [ ] icons and required resources.
- [ ] Do not package:
  - [ ] workspace source tree.
  - [ ] root `node_modules`.
  - [ ] tests.
  - [ ] sourcemaps.
  - [ ] dev-only scripts.
  - [ ] generated junk.
- [ ] Add macOS signed/notarized build path.
- [ ] Add unsigned local packaging path.
- [ ] Add release size and memory measurement script if app footprint matters.

## Mobile App

- [ ] Create app with Expo SDK `56`.
- [ ] Use Expo Router.
- [ ] Use React `19`.
- [ ] Use React Native version bundled with Expo SDK `56`.
- [ ] Treat New Architecture as required.
- [ ] Use Expo dev client for native module work.
- [ ] Keep generated `ios/` and `android/` folders ignored for CNG unless intentionally bare.
- [ ] Use `app.config.ts` instead of `app.json` when config needs typed plugins or logic.
- [ ] Use typed routes.
- [ ] Use React Compiler only if the dependency set is compatible.
- [ ] Run `npx expo-doctor@latest` and resolve New Architecture/library warnings.
- [ ] Prefer Expo SDK packages over random native dependencies.
- [ ] Prefer Expo Modules API for custom Swift/Kotlin modules.
- [ ] Use Expo UI for native SwiftUI/Jetpack Compose-backed controls where it fits.

## Rust Core

- [ ] Create one Rust core crate for domain logic.
- [ ] Set `edition = "2024"`.
- [ ] Set `rust-version` to the minimum supported stable for Rust 2024, or the project's chosen current stable.
- [ ] Keep the core crate platform-neutral.
- [ ] Put platform-specific bridge code outside the core crate.
- [ ] Add tests for core behavior in Rust.
- [ ] Add golden/snapshot tests for complex serialized output.
- [ ] Keep file system, network, and OS calls behind small Rust module interfaces.

Recommended split:

```text
crates/core/
  Pure domain logic.

crates/ffi/
  C ABI, UniFFI, or Node-API bridge.
```

Small projects may combine them at first only if the public Rust API and FFI exports remain clearly separated.

## Native Binding Strategy

Pick one strategy intentionally.

### Small API, Coarse Calls

Use C ABI plus JSON envelopes.

- [ ] Desktop calls the dynamic library with `koffi`.
- [ ] iOS uses Swift `@_silgen_name` or a generated C header.
- [ ] Android uses JNI.
- [ ] Every exported function returns either a primitive or an owned string.
- [ ] Provide one native `free_string` function.
- [ ] Use `Result` envelopes for error paths.
- [ ] Keep native calls coarse-grained to avoid bridge overhead.

### Growing Cross-Platform API

Use UniFFI.

- [ ] Generate Swift bindings.
- [ ] Generate Kotlin bindings.
- [ ] Wrap generated mobile bindings in a thin Expo Module.
- [ ] Keep TypeScript-facing APIs hand-written and small.
- [ ] Prefer UniFFI once manual Swift/Kotlin/JNI duplication starts growing.

### Desktop-Heavy API

Use Node-API / `napi-rs` for Electron.

- [ ] Prefer Node-API when desktop makes many fine-grained native calls.
- [ ] Build precompiled artifacts per platform/architecture.
- [ ] Keep mobile bindings separate via Expo Modules API or UniFFI.
- [ ] Use C ABI only for simple cross-runtime calls.

## Shared Contracts

- [ ] Add a `packages/contracts` package if desktop, mobile, and API share payload types.
- [ ] Define TypeScript types for app-facing contracts.
- [ ] Define validation schemas for IPC and network boundaries.
- [ ] Do not trust renderer or mobile payloads just because TypeScript compiled.
- [ ] Generate types from Rust only if the generation is part of normal build/test.

## Sync API

- [ ] Add only if the new project actually needs sync or local network behavior.
- [ ] Use Hono or another small fetch-native HTTP framework.
- [ ] Add `/health`.
- [ ] Add graceful shutdown.
- [ ] Keep sync protocol contracts in `packages/contracts`.
- [ ] Do not make the desktop app depend on an always-on local server unless the product truly needs it.

## Build Scripts

- [ ] Add one native build script for desktop artifacts.
- [ ] Build and stage:
  - [ ] macOS arm64.
  - [ ] macOS x64 if needed.
  - [ ] macOS universal only if needed.
  - [ ] Windows x64.
  - [ ] Windows arm64 if needed.
  - [ ] Linux x64.
- [ ] For Android, build Rust from Gradle or a dedicated prebuild step.
- [ ] For iOS, build Rust from a Podspec script phase or a dedicated prebuild step.
- [ ] Cache native build artifacts in CI.
- [ ] Fail clearly when Rust targets, Cargo, Xcode, NDK, or toolchains are missing.

## Testing

- [ ] Rust unit tests for shared core.
- [ ] TypeScript unit tests for pure app logic.
- [ ] IPC contract tests for Electron main/preload boundary.
- [ ] Smoke test desktop production build.
- [ ] Run `expo-doctor`.
- [ ] Smoke test iOS development build.
- [ ] Smoke test Android development build.
- [ ] Add regression tests for every bug that fits cleanly.

## CI

- [ ] Install Node 24.
- [ ] Enable pnpm through Corepack or pinned installer.
- [ ] Cache pnpm store.
- [ ] Install Rust stable.
- [ ] Add Rust mobile targets where needed.
- [ ] Run:
  - [ ] `pnpm fmt`
  - [ ] `pnpm lint`
  - [ ] `pnpm typecheck`
  - [ ] `cargo test --workspace`
  - [ ] `pnpm test`
  - [ ] desktop build
  - [ ] native build
- [ ] Add platform-specific release jobs separately from normal PR checks.

## First Setup Acceptance Criteria

The setup is done only when:

- [ ] `pnpm install` succeeds from a clean clone.
- [ ] `pnpm lint` passes.
- [ ] `pnpm typecheck` passes.
- [ ] `cargo test --workspace` passes.
- [ ] `pnpm build-native` produces desktop native artifacts.
- [ ] `pnpm build-desktop` produces desktop app build output.
- [ ] `pnpm dev-desktop` opens the desktop app.
- [ ] `pnpm dev-mobile` starts the Expo app or opens the selected simulator.
- [ ] `npx expo-doctor@latest` passes or every warning is documented.
- [ ] A native Rust function is callable from desktop.
- [ ] A native Rust function is callable from iOS.
- [ ] A native Rust function is callable from Android.
- [ ] Release packaging includes only staged production artifacts.

## Sources To Check During Setup

- Electron releases: https://releases.electronjs.org/release
- Electron release schedule: https://releases.electronjs.org/schedule
- Electron security: https://www.electronjs.org/docs/latest/tutorial/security
- Electron fuses: https://www.electronjs.org/docs/latest/tutorial/fuses
- electron-builder fuses: https://www.electron.build/docs/tutorials/adding-electron-fuses
- Expo SDK changelog: https://expo.dev/changelog
- Expo SDK 56 docs: https://docs.expo.dev/versions/v56.0.0/
- Expo New Architecture: https://docs.expo.dev/guides/new-architecture/
- Expo Modules API: https://docs.expo.dev/modules/overview/
- Node release schedule: https://github.com/nodejs/release
- Node-API: https://nodejs.org/api/n-api.html
- UniFFI: https://github.com/mozilla/uniffi-rs
- Rust 2024: https://blog.rust-lang.org/2025/02/20/Rust-1.85.0/

## Instruction For The AI Agent

Set up the repository according to this checklist. Make conservative choices that match current official docs. Use the newest stable compatible versions as of the setup date, but do not adopt prerelease tooling unless explicitly requested. Verify every checklist item with commands before marking it done. If a current official version has changed since May 2026, update the checklist in the repo first, then implement against the updated checklist.
