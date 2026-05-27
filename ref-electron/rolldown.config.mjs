const external = ["electron", "electron/main", "electron/renderer"];

/** @type {import("rolldown").RolldownOptions[]} */
const config = [
  {
    external,
    input: "src/main/main.ts",
    output: {
      file: "dist/main/main.js",
      format: "esm",
      sourcemap: true,
    },
    platform: "node",
  },
  {
    external,
    input: "src/main/preload.ts",
    output: {
      file: "dist/main/preload.cjs",
      format: "cjs",
      sourcemap: true,
    },
    platform: "node",
  },
];

export default config;
