# Inza Desktop

Electron desktop app with a React 19 + Tailwind CSS v4 Vite renderer and
`@typescript/native-preview` for typechecking.

From the repo root:

```sh
bun run desktop
bun run desktop:build
bun run check:desktop
```

## Commands

```sh
bun run dev
bun run lint
bun run format
bun run check
bun run typecheck
bun run typecheck:watch
bun run build
bun run start
```

`bun run dev` starts Vite in dev-server mode, watches Electron `main`, and restarts Electron when it changes.

Tailwind is wired through the official `@tailwindcss/vite` plugin and imported once from `src/renderer/style.css`.

This app intentionally uses `tsgo` from `@typescript/native-preview` instead of depending on the JavaScript TypeScript compiler package.
