import path from "node:path";

import { BrowserWindow, app, ipcMain, nativeTheme, session, shell } from "electron";

const devServerUrl = process.env["VITE_DEV_SERVER_URL"];
const isDev = Boolean(devServerUrl);

let mainWindow: BrowserWindow | null = null;

function showMainWindow() {
  if (mainWindow && !mainWindow.isDestroyed() && !mainWindow.isVisible()) {
    mainWindow.show();
  }
}

async function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: 1120,
    height: 760,
    minWidth: 860,
    minHeight: 620,
    title: "Manki",
    backgroundColor: nativeTheme.shouldUseDarkColors ? "#1b1f23" : "#f5f3ed",
    show: true,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
      preload: path.join(app.getAppPath(), "dist/main/preload.cjs"),
    },
  });

  mainWindow.once("ready-to-show", showMainWindow);
  mainWindow.webContents.once("did-fail-load", handleRendererLoadFailure);
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith("https://")) {
      void shell.openExternal(url);
    }

    return { action: "deny" };
  });

  await loadRenderer(mainWindow);
  showMainWindow();
  mainWindow.focus();
  app.focus({ steal: true });

  if (isDev && process.env["MANKI_OPEN_DEVTOOLS"] === "1") {
    mainWindow.webContents.openDevTools({ mode: "detach" });
  }
}

async function loadRenderer(window: BrowserWindow) {
  if (devServerUrl) {
    await window.loadURL(devServerUrl);
    return;
  }

  await window.loadFile(path.join(app.getAppPath(), "dist/renderer/index.html"));
}

function handleRendererLoadFailure(
  _event: Electron.Event,
  errorCode: number,
  errorDescription: string,
) {
  console.error(`Renderer failed to load: ${errorCode} ${errorDescription}`);
  showMainWindow();
}

async function startApp() {
  await app.whenReady();

  session.defaultSession.setPermissionRequestHandler((_webContents, _permission, callback) => {
    callback(false);
  });

  ipcMain.handle("app:versions", () => ({
    chrome: process.versions.chrome,
    electron: process.versions.electron,
    node: process.versions.node,
  }));

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
