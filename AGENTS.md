# Repository Instructions

## Package Manager

- Use Aube through mise for dependency and script management.
- Use `aube install`, `aube add`, `aube remove`, and `aube run`.
- Do not use npm, pnpm, Yarn, or Bun to change dependencies or `aube-lock.yaml`.

## Web App

- `apps/web` is the app: TanStack Start, TanStack Query, Tailwind CSS v4, and
  shadcn/ui (Base UI, `base-nova` style). Run it with `aube run dev`.
- Add shadcn components from `apps/web` with `aube dlx shadcn@latest add <name>`.
  shadcn installs new dependencies with npm: delete the `package-lock.json` it
  creates and `apps/web/node_modules`, then run `aube install`.
- Railway deploys the root `Dockerfile` on every push to `main`. The service is
  defined in `.railway/railway.ts`; preview changes with `railway config plan`
  before `railway config apply`.

## Product Rules

- `OPEN-DECK_FORMAT.md` is the only deck specification. Sections 1–10 define
  the file format; section 11 defines how Inza must read, import, and update
  decks. Change the spec before changing behavior that contradicts it.
- Deck files describe content; the app owns rendering. Never add templates,
  CSS, JavaScript, layout settings, or scheduling state to the format.
- Inza is local-first. The device holds the data and everything works offline;
  the account, server, and sync sit on top of that, never in the way of it.
- Decks are self-contained packages. Do not load assets from URLs.
- Never reset a card's schedule as a side effect. Content edits and deck
  updates keep scheduling and review history; only an explicit reset action
  changes it.
- Write an answer's review event and the card's new schedule in one
  transaction. Imports and updates apply in one transaction too, so a deck is
  never half-updated.
- Treat deck HTML as untrusted: validate it against the allowlist on import and
  sanitize it again before inserting it into the page.

## Design Rules

- `apps/demo` is the design prototype. It renders sample data and has no app
  logic; do not build real features into it.
- Keep the receipt style: Paper Mono on a character grid, black ink, one red
  stamp color, carbon-copy dark mode.
- Grading: flick pad on phones; on tablet and desktop, the interval-first grade
  bar with keys 1–4 and Space or Enter for Good.
