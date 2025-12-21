import type { SampleMode } from "./types";

export function samplePixelArt(
  rgb: Uint8ClampedArray, // RGBA 输入（这里用 rgba 也行，取前三通道）
  width: number,
  height: number,
  allX: number[],
  allY: number[],
  mode: SampleMode,
  weightRatio: number,
  upscaleFactor: number,     // 1 => native
  nativeRes: boolean
): { outW: number; outH: number; outRgb: Uint8Array } {
  const cellW = allX.length - 1;
  const cellH = allY.length - 1;

  const outW = nativeRes ? cellW : cellW * upscaleFactor;
  const outH = nativeRes ? cellH : cellH * upscaleFactor;
  const outRgb = new Uint8Array(outW * outH * 3);

  function getRgb(x: number, y: number): [number, number, number] {
    const i = (y * width + x) * 4;
    return [rgb[i] || 0, rgb[i + 1] || 0, rgb[i + 2] || 0];
  }

  for (let i = 0; i < cellW; i++) {
    const x1 = allX[i];
    const x2 = allX[i + 1];
    if (x1 === undefined || x2 === undefined) continue;
    const cx = ((x1 + x2) / 2) | 0;

    for (let j = 0; j < cellH; j++) {
      const y1 = allY[j];
      const y2 = allY[j + 1];
      if (y1 === undefined || y2 === undefined) continue;
      const cy = ((y1 + y2) / 2) | 0;

      let r = 0, g = 0, b = 0;

      if (mode === "center") {
        [r, g, b] = getRgb(cx, cy);
      } else if (mode === "average") {
        let cnt = 0;
        for (let y = y1; y < y2; y++) {
          for (let x = x1; x < x2; x++) {
            const [rr, gg, bb] = getRgb(x, y);
            r += rr; g += gg; b += bb; cnt++;
          }
        }
        if (cnt > 0) {
          r = (r / cnt) | 0; g = (g / cnt) | 0; b = (b / cnt) | 0;
        }
      } else {
        const cw = x2 - x1;
        const ch = y2 - y1;
        const ww = Math.max(1, (cw * weightRatio) | 0);
        const hh = Math.max(1, (ch * weightRatio) | 0);
        const wx1 = Math.max(0, cx - (ww >> 1));
        const wx2 = Math.min(width, cx + (ww >> 1));
        const wy1 = Math.max(0, cy - (hh >> 1));
        const wy2 = Math.min(height, cy + (hh >> 1));
        let cnt = 0;
        for (let y = wy1; y < wy2; y++) {
          for (let x = wx1; x < wx2; x++) {
            const [rr, gg, bb] = getRgb(x, y);
            r += rr; g += gg; b += bb; cnt++;
          }
        }
        if (cnt > 0) {
          r = (r / cnt) | 0; g = (g / cnt) | 0; b = (b / cnt) | 0;
        }
      }

      if (nativeRes) {
        const o = (j * outW + i) * 3;
        outRgb[o] = r; outRgb[o + 1] = g; outRgb[o + 2] = b;
      } else {
        const ox = i * upscaleFactor;
        const oy = j * upscaleFactor;
        for (let yy = 0; yy < upscaleFactor; yy++) {
          for (let xx = 0; xx < upscaleFactor; xx++) {
            const o = ((oy + yy) * outW + (ox + xx)) * 3;
            outRgb[o] = r; outRgb[o + 1] = g; outRgb[o + 2] = b;
          }
        }
      }
    }
  }

  return { outW, outH, outRgb };
}