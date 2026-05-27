type CheckState = "ready" | "locked" | "native";

interface RuntimeVersions {
  chrome: string;
  electron: string;
  node: string;
}

const checks: { label: string; state: CheckState; detail: string }[] = [
  {
    label: "Renderer isolation",
    state: "locked",
    detail: "Node integration is off, context isolation is on, and preload exposes a narrow API.",
  },
  {
    label: "Native typecheck",
    state: "native",
    detail: "The typecheck script runs tsgo from @typescript/native-preview.",
  },
  {
    label: "Local content",
    state: "ready",
    detail: "The app loads Vite output in production and a local Vite server in development.",
  },
];

function pillLabel(state: CheckState) {
  switch (state) {
    case "locked": {
      return "Secure";
    }
    case "native": {
      return "tsgo";
    }
    case "ready": {
      return "Ready";
    }
    default: {
      state satisfies never;
      throw new Error("Unknown check state");
    }
  }
}

function renderVersions(versions: RuntimeVersions) {
  return Object.entries(versions)
    .map(([name, version]) => `<span><strong>${name}</strong>${version}</span>`)
    .join("");
}

async function boot() {
  const versions = await globalThis.manki.versions();
  const app = document.querySelector<HTMLDivElement>("#app");

  if (!app) {
    throw new Error("Missing app mount");
  }

  app.innerHTML = `
    <section class="intro" aria-labelledby="app-title">
      <div class="intro-copy">
        <p class="eyebrow">Electron 42 reference</p>
        <h1 id="app-title">Manki desktop shell</h1>
        <p class="summary">
          A compact Electron baseline with a sandboxed renderer, typed preload bridge,
          Vite renderer build, and native TypeScript preview checks.
        </p>
      </div>
      <div class="runtime" aria-label="Runtime versions">
        ${renderVersions(versions)}
      </div>
    </section>

    <section class="checks" aria-label="Project checks">
      ${checks
        .map(
          (check) => `
            <article class="check">
              <span class="status ${check.state}">${pillLabel(check.state)}</span>
              <h2>${check.label}</h2>
              <p>${check.detail}</p>
            </article>
          `,
        )
        .join("")}
    </section>

    <section class="commands" aria-labelledby="commands-title">
      <h2 id="commands-title">Project commands</h2>
      <dl>
        <div><dt>Develop</dt><dd>bun run dev</dd></div>
        <div><dt>Typecheck</dt><dd>bun run typecheck</dd></div>
        <div><dt>Build</dt><dd>bun run build</dd></div>
      </dl>
    </section>
  `;
}

await boot();
