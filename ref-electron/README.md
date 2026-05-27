# Manki Electron Reference

Fresh Electron 42 reference app with a Vite renderer, sandboxed preload bridge, and `@typescript/native-preview` for typechecking.

## Commands

```sh
mise install
bun install
bun run dev
bun run lint
bun run format
bun run check
bun run typecheck
bun run typecheck:watch
bun run build
bun run start
```

`bun run dev` starts Vite in dev-server mode, watches Electron `main` and `preload`, and restarts Electron when either of those entrypoints changes.

This app intentionally uses `tsgo` from `@typescript/native-preview` instead of depending on the JavaScript TypeScript compiler package.
