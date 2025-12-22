import * as Comlink from "comlink";
import type { PipelineParams, PipelineResult, RgbaImage } from "../types";
import { runPipeline as runPipelineImpl } from "../pipeline";

// Worker 封装：调用共享的 pipeline 实现
async function runPipeline(img: RgbaImage, params: PipelineParams): Promise<PipelineResult> {
  // 调用共享的 pipeline，传入 'worker' 上下文
  const result = await runPipelineImpl(img, params, 'worker');

  // Worker 需要使用 Comlink.transfer 来转移 buffer 所有权
  const transfers: Transferable[] = [result.energyU8];
  if (result.pixelArt) {
    transfers.push(result.pixelArt.rgb);
    if (result.pixelArt.rgba) transfers.push(result.pixelArt.rgba);
  }

  return Comlink.transfer(result, transfers);
}

Comlink.expose({ runPipeline });
export type PixelWorkerApi = { runPipeline: typeof runPipeline };
