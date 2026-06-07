import path from "node:path";
import { pathToFileURL } from "node:url";

import { BrowserWindow, app, nativeTheme, session } from "electron";

const localDevHostnames = new Set(["127.0.0.1", "localhost", "::1", "[::1]"]);
const devServerUrl = getLocalDevServerUrl(process.env["VITE_DEV_SERVER_URL"]);
const devServerOrigin = devServerUrl ? new URL(devServerUrl).origin : undefined;

function applyThemeToWindow(window: BrowserWindow) {
  const isDark = nativeTheme.shouldUseDarkColors;
  window.setBackgroundColor(isDark ? "#1c1917" : "#f6f4ef");
  window.setTitleBarOverlay({
    color: isDark ? "#1c1917" : "#f6f4ef",
    symbolColor: isDark ? "#e7e5e4" : "#1f1d18",
    height: 32,
  });
}

async function createMainWindow() {
  const isDark = nativeTheme.shouldUseDarkColors;

  const mainWindow = new BrowserWindow({
    width: 640,
    height: 800,
    minWidth: 640,
    minHeight: 800,
    titleBarStyle: "hidden",
    trafficLightPosition: { x: 17, y: 11 },
    titleBarOverlay: {
      color: isDark ? "#1c1917" : "#f6f4ef",
      symbolColor: isDark ? "#e7e5e4" : "#1f1d18",
      height: 32,
    },
    title: "Inza",
    backgroundColor: isDark ? "#1c1917" : "#f6f4ef",
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

  nativeTheme.on("updated", () => {
    for (const window of BrowserWindow.getAllWindows()) {
      applyThemeToWindow(window);
    }
  });

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
