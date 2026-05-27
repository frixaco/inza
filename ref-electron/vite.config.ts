import { defineConfig } from "vite";

export default defineConfig({
  root: ".",
  clearScreen: false,
  server: {
    host: "127.0.0.1",
    port: 5173,
    strictPort: false,
  },
  build: {
    outDir: "dist/renderer",
    emptyOutDir: true,
    sourcemap: true,
  },
});
