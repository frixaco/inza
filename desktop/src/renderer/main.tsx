import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

function App() {
  return null;
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
