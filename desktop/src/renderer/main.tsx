import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

function Sidebar() {
  return (
    <aside
      className="h-full w-48 border border-white/75 bg-stone-50 shadow-lg shadow-stone-400/10"
      data-window-sidebar
    />
  );
}

function App() {
  return (
    <div className="flex h-full bg-stone-100 p-2 text-stone-950" data-window-shell>
      <Sidebar />
    </div>
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
