import path from "node:path";
import { pathToFileURL } from "node:url";

import { BrowserWindow, app, session } from "electron";

const localDevHostnames = new Set(["127.0.0.1", "localhost", "::1", "[::1]"]);
const devServerUrl = getLocalDevServerUrl(process.env["VITE_DEV_SERVER_URL"]);
const devServerOrigin = devServerUrl ? new URL(devServerUrl).origin : undefined;

async function createMainWindow() {
  const mainWindow = new BrowserWindow({
    width: 1120,
    height: 760,
    title: "Inza",
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
  });

  await loadRenderer(mainWindow);
}

async function loadRenderer(window: BrowserWindow) {
  if (devServerUrl) {
    await window.loadURL(devServerUrl);
    return;
  }

  await window.loadFile(path.join(app.getAppPath(), "dist/renderer/index.html"));
}

function getLocalDevServerUrl(value: string | undefined) {
  if (!value) {
    return undefined;
  }

  const url = new URL(value);

  if (url.protocol !== "http:" || !localDevHostnames.has(url.hostname)) {
    throw new Error(`Refusing non-local Vite dev server URL: ${value}`);
  }

  return url.toString();
}

function getProductionRendererUrl() {
  return pathToFileURL(path.join(app.getAppPath(), "dist/renderer/index.html")).toString();
}

function isTrustedRendererUrl(value: string) {
  try {
    const url = new URL(value);

    if (devServerOrigin) {
      return url.origin === devServerOrigin;
    }

    const productionRendererUrl = getProductionRendererUrl();

    return url.href === productionRendererUrl || url.href.startsWith(`${productionRendererUrl}#`);
  } catch {
    return false;
  }
}

function registerWebContentsPolicy() {
  app.on("web-contents-created", (_event, contents) => {
    contents.setWindowOpenHandler(() => ({ action: "deny" }));

    contents.on("will-navigate", (event, url) => {
      if (isTrustedRendererUrl(url)) {
        return;
      }

      event.preventDefault();
    });
  });
}

async function startApp() {
  await app.whenReady();
  registerWebContentsPolicy();

  session.defaultSession.setPermissionRequestHandler((_webContents, _permission, callback) => {
    callback(false);
  });

  await createMainWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      void createMainWindow();
    }
  });
}

void startApp();

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
