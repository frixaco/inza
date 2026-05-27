import type { MankiApi } from "../main/preload";

declare global {
  var manki: MankiApi;

  interface Window {
    manki: MankiApi;
  }
}

export {};
