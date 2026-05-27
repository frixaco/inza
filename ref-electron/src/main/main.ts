import path from "node:path";

import { BrowserWindow, app, ipcMain, nativeTheme, session, shell } from "electron";

const devServerUrl = process.env["VITE_DEV_SERVER_URL"];
const isDev = Boolean(devServerUrl);

let mainWindow: BrowserWindow | null = null;

function rendererUrl() {
  if (devServerUrl) {
    return devServerUrl;
  }

  return `file://${path.join(import.meta.dirname, "../renderer/index.html")}`;
}

async function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: 1120,
    height: 760,
    minWidth: 860,
    minHeight: 620,
    title: "Manki",
    backgroundColor: nativeTheme.shouldUseDarkColors ? "#1b1f23" : "#f5f3ed",
    show: false,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
      preload: path.join(import.meta.dirname, "preload.cjs"),
    },
  });

  mainWindow.once("ready-to-show", () => {
    mainWindow?.show();
  });

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith("https://")) {
      void shell.openExternal(url);
    }

    return { action: "deny" };
  });

  await mainWindow.loadURL(rendererUrl());

  if (isDev) {
    mainWindow.webContents.openDevTools({ mode: "detach" });
  }
}

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

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
