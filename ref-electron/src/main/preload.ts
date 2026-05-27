import { contextBridge, ipcRenderer } from "electron";

interface RuntimeVersions {
  chrome: string;
  electron: string;
  node: string;
}

function isRuntimeVersions(value: unknown): value is RuntimeVersions {
  if (!value || typeof value !== "object") {
    return false;
  }

  return (
    typeof Reflect.get(value, "chrome") === "string" &&
    typeof Reflect.get(value, "electron") === "string" &&
    typeof Reflect.get(value, "node") === "string"
  );
}

const api = {
  async versions() {
    const versions = await ipcRenderer.invoke("app:versions");

    if (!isRuntimeVersions(versions)) {
      throw new TypeError("Unexpected runtime version payload");
    }

    return versions;
  },
};

contextBridge.exposeInMainWorld("manki", api);

export type MankiApi = typeof api;
