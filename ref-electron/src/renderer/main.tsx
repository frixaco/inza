import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

function App() {
  return (
    <main className="min-h-screen bg-canvas px-8 py-7 text-ink">
      <div className="mx-auto grid min-h-[calc(100vh-3.5rem)] max-w-3xl content-center gap-10">
        <header className="grid gap-4">
          <p className="text-xs font-semibold tracking-wide text-muted uppercase">
            Electron reference
          </p>
          <h1
            className="text-4xl leading-none font-semibold tracking-normal text-ink-strong"
            id="app-title"
          >
            Manki
          </h1>
        </header>

        <section className="grid gap-3" aria-labelledby="app-title">
          <p className="max-w-md text-base leading-7 text-muted">
            React, Tailwind, Vite, tsgo, and a sandboxed Electron renderer.
          </p>
          <p className="text-sm text-soft">Renderer isolated. Local content only.</p>
        </section>
      </div>
    </main>
  );
}

function boot() {
  const app = document.querySelector<HTMLDivElement>("#app");

  if (!app) {
    throw new Error("Missing app mount");
  }

  createRoot(app).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}

boot();
