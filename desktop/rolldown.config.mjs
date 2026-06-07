/** @type {import("rolldown").RolldownOptions} */
const config = {
  external: ["electron"],
  input: "src/main/main.ts",
  output: {
    file: "dist/main/main.mjs",
    format: "esm",
  },
  platform: "node",
};

export default config;
