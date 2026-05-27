import { spawn } from "node:child_process";
import { createRequire } from "node:module";

import { watch } from "rolldown";
import { createServer } from "vite";

import rolldownConfig from "../rolldown.config.mjs";

const require = createRequire(import.meta.url);
const electronEntryPath = require.resolve("electron");
const { default: resolvedElectronBinary } = await import(electronEntryPath);

if (typeof resolvedElectronBinary !== "string") {
  throw new TypeError("Expected Electron package to resolve to a binary path");
}

const electronBinary = resolvedElectronBinary;

/** @type {import("node:child_process").ChildProcess | undefined} */
let electronProcess;
/** @type {NodeJS.Timeout | undefined} */
let restartTimer;
let buildFailed = false;

/**
 * @param {string} url
 */
function startElectron(url) {
  electronProcess?.kill();

  electronProcess = spawn(electronBinary, ["."], {
    env: {
      ...process.env,
      VITE_DEV_SERVER_URL: url,
    },
    shell: process.platform === "win32",
    stdio: "inherit",
  });

  electronProcess.on("exit", (code) => {
    if (code === 0 || code === null) {
      return;
    }

    console.error(`Electron exited with code ${code}`);
  });
}

const server = await createServer({
  configFile: "vite.config.ts",
});

await server.listen();
server.printUrls();

const resolvedUrls = server.resolvedUrls?.local ?? [];
const devServerUrl = resolvedUrls[0] ?? "http://127.0.0.1:5173/";

function restartElectron() {
  clearTimeout(restartTimer);
  restartTimer = setTimeout(() => {
    startElectron(devServerUrl);
  }, 80);
}

/**
 * @param {import("rolldown").RolldownWatcherEvent} event
 */
async function handleBundleEvent(event) {
  if (event.code === "BUNDLE_END") {
    await event.result.close();
    return;
  }

  if (event.code === "ERROR") {
    buildFailed = true;
    await event.result.close();
    console.error(event.error);
    return;
  }

  handleWatcherStateEvent(event.code);
}

/**
 * @param {import("rolldown").RolldownWatcherEvent["code"]} code
 */
function handleWatcherStateEvent(code) {
  switch (code) {
    case "START": {
      buildFailed = false;
      return;
    }
    case "END": {
      if (!buildFailed) {
        restartElectron();
      }
      return;
    }
    case "ERROR":
    case "BUNDLE_END":
    case "BUNDLE_START": {
      return;
    }
  }
}

const watcher = watch(rolldownConfig);

watcher.on("event", handleBundleEvent);

async function shutdown() {
  clearTimeout(restartTimer);
  electronProcess?.kill();

  try {
    await Promise.all([watcher.close(), server.close()]);
  } finally {
    process.exit(0);
  }
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
