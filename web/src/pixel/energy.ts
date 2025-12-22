import { gaussianKernel1d, convolveSeparable, sobel } from "./filters";
import { quantileApprox } from "./stats";

export function rgbaToGray01(rgba: Uint8ClampedArray, width: number, height: number): Float32Array {
  const gray = new Float32Array(width * height);
  for (let i = 0, p = 0; p < gray.length; p++, i += 4) {
    const r = (rgba[i] || 0) / 255;
    const g = (rgba[i + 1] || 0) / 255;
    const b = (rgba[i + 2] || 0) / 255;
    // 和你 Python 一致即可；这里用标准亮度系数
    gray[p] = 0.299 * r + 0.587 * g + 0.114 * b;
  }
  return gray;
}

export function gradEnergy(gray01: Float32Array, width: number, height: number, sigma: number): Float32Array {
  let g = gray01;
  if (sigma > 0) {
    const k = gaussianKernel1d(sigma);
    g = convolveSeparable(gray01, width, height, k);
  }
  const { gx, gy } = sobel(g, width, height);

  const e = new Float32Array(g.length);
  for (let i = 0; i < e.length; i++) e[i] = Math.abs(gx[i] || 0) + Math.abs(gy[i] || 0);
  return e;
}

export function enhanceEnergyDirectional(
  energy: Float32Array,
  width: number,
  height: number,
  horizontalFactor: number,
  verticalFactor: number
): Float32Array {
  if (horizontalFactor === 1 && verticalFactor === 1) return energy;

  const { gx, gy } = sobel(energy, width, height);
  const out = new Float32Array(energy.length);

  // 近似复刻你 Python：增强水平边（用 |gy|）/垂直边（用 |gx|）
  for (let i = 0; i < out.length; i++) {
    let v = energy[i] || 0;
    if (horizontalFactor > 1) v += Math.abs(gy[i] || 0) * (horizontalFactor - 1);
    if (verticalFactor > 1) v += Math.abs(gx[i] || 0) * (verticalFactor - 1);
    out[i] = v;
  }

  // clip 到 p99.9（这里同样用近似 quantile）
  const clipV = quantileApprox(out, 0.999);
  for (let i = 0; i < out.length; i++) out[i] = Math.min(out[i] || 0, clipV);

  return out;
}

export function toHeatmapU8(energy: Float32Array): Uint8Array {
  const p99 = quantileApprox(energy, 0.99);
  const denom = p99 + 1e-6;

  const u8 = new Uint8Array(energy.length);
  for (let i = 0; i < u8.length; i++) {
    let v = (energy[i] || 0) / denom;
    if (v < 0) v = 0;
    if (v > 1) v = 1;
    u8[i] = (v * 255) | 0;
  }
  return u8;
}