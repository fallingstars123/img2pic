import * as Comlink from "comlink";
import type { PixelWorkerApi } from "./worker/pixel_worker";

export function createPixelWorker() {
  const worker = new Worker(new URL("./worker/pixel_worker.ts", import.meta.url), { type: "module" });
  const api = Comlink.wrap<PixelWorkerApi>(worker);
  return { worker, api };
}