import * as Comlink from "comlink";
import type { PipelineParams, PipelineResult, RgbaImage } from "../types";
import { rgbaToGray01, gradEnergy, enhanceEnergyDirectional, toHeatmapU8 } from "../energy";
import { detectPixelSize, detectGridLines, interpolateLines, completeEdges, samplePixelArt } from "../grid";

function runPipeline(img: RgbaImage, params: PipelineParams): PipelineResult {
  const width = img.width;
  const height = img.height;

  const rgba = new Uint8ClampedArray(img.rgba);

  // 1) energy
  const gray = rgbaToGray01(rgba, width, height);
  let energy = gradEnergy(gray, width, height, params.sigma);

  if (params.enhanceEnergy) {
    if (params.enhanceDirectional) {
      energy = enhanceEnergyDirectional(energy, width, height, params.enhanceHorizontal, params.enhanceVertical);
    } else {
      energy = enhanceEnergyDirectional(energy, width, height, 1.5, 1.5);
    }
  }

  const energyU8 = toHeatmapU8(energy);

  // 2) pixel size detect (if needed)
  let pixelSize = params.pixelSize | 0;
  if (pixelSize <= 0) {
    pixelSize = detectPixelSize(energyU8, width, height, params.minS, params.maxS);
  }

  // 3) grid detect
  const { xLines, yLines } = detectGridLines(
    energyU8,
    width,
    height,
    pixelSize,
    params.gapTolerance,
    params.minEnergy,
    params.smooth,
    params.windowSize
  );

  // 4) interpolate + complete edges
  const allX0 = interpolateLines(xLines, width, pixelSize);
  const allY0 = interpolateLines(yLines, height, pixelSize);

  // Calculate typical gaps
  let typicalX = pixelSize;
  if (allX0.length > 1) {
    let sum = 0;
    for (let i = 1; i < allX0.length; i++) {
      const curr = allX0[i]!;
      const prev = allX0[i-1]!;
      sum += curr - prev;
    }
    typicalX = Math.round(sum / (allX0.length - 1));
  }

  let typicalY = pixelSize;
  if (allY0.length > 1) {
    let sum = 0;
    for (let i = 1; i < allY0.length; i++) {
      const curr = allY0[i]!;
      const prev = allY0[i-1]!;
      sum += curr - prev;
    }
    typicalY = Math.round(sum / (allY0.length - 1));
  }

  const allX = completeEdges(allX0, width, typicalX, params.gapTolerance);
  const allY = completeEdges(allY0, height, typicalY, params.gapTolerance);

  // 5) pixel art (optional)
  let pixelArt: PipelineResult["pixelArt"] = undefined;
  if (params.sample) {
    let upscaleFactor: number;
    if (params.upscale > 0) upscaleFactor = params.upscale;
    else if (params.nativeRes) upscaleFactor = 1;
    else upscaleFactor = pixelSize;

    const nativeRes = upscaleFactor === 1;

    const { outW, outH, outRgb } = samplePixelArt(
      rgba,
      width,
      height,
      allX,
      allY,
      params.sampleMode,
      params.sampleWeightRatio,
      upscaleFactor,
      nativeRes
    );

    pixelArt = {
      width: outW,
      height: outH,
      rgb: outRgb.buffer.slice(0) as ArrayBuffer,
      upscaleFactor,
    };
  }

  const res: PipelineResult = {
    width,
    height,
    detectedPixelSize: pixelSize,
    energyU8: energyU8.buffer.slice(0) as ArrayBuffer,
    xLines,
    yLines,
    allXLines: allX,
    allYLines: allY,
    pixelArt,
  };

  // transfer 大 buffer
  const transfers: Transferable[] = [res.energyU8];
  if (res.pixelArt) transfers.push(res.pixelArt.rgb);

  return Comlink.transfer(res, transfers);
}

Comlink.expose({ runPipeline });
export type PixelWorkerApi = { runPipeline: typeof runPipeline };