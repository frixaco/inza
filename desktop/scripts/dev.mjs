import { spawn } from "node:child_process";
import { createRequire } from "node:module";

import { watch } from "rolldown";
import { createServer } from "vite";

import rolldownConfig from "../rolldown.config.mjs";

const require = createRequire(import.meta.url);
const electronBinary = String(require("electron"));
const expectedElectronExits = new WeakSet();

/** @type {import("node:child_process").ChildProcess | undefined} */
let electronProcess;
/** @type {NodeJS.Timeout | undefined} */
let restartTimer;
let buildFailed = false;
let isShuttingDown = false;

function stopElectron() {
  if (
    !electronProcess ||
    electronProcess.exitCode !== null ||
    electronProcess.signalCode !== null
  ) {
    return;
  }

  expectedElectronExits.add(electronProcess);

  if (electronProcess.pid && process.platform !== "win32") {
    process.kill(-electronProcess.pid, "SIGTERM");
    return;
  }

  electronProcess.kill("SIGTERM");
}

/**
 * @param {string} url
 */
function startElectron(url) {
  stopElectron();

  const child = spawn(electronBinary, [process.cwd()], {
    detached: process.platform !== "win32",
    env: {
      ...process.env,
      VITE_DEV_SERVER_URL: url,
    },
    stdio: ["ignore", "inherit", "pipe"],
    windowsHide: false,
  });

  electronProcess = child;

  child.stderr?.on("data", (chunk) => {
    if (!expectedElectronExits.has(child)) {
      process.stderr.write(chunk);
    }
  });

  child.on("exit", (code, signal) => {
    if (expectedElectronExits.has(child) || code === 0) {
      return;
    }

    if (signal) {
      console.error(`Electron exited with signal ${signal}`);
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
  if (isShuttingDown) {
    return;
  }

  isShuttingDown = true;
  clearTimeout(restartTimer);
  stopElectron();
  await Promise.allSettled([watcher.close(), server.close()]);
  process.exit(0);
}

process.on("SIGINT", () => {
  void shutdown();
});

process.on("SIGTERM", () => {
  void shutdown();
});
