import { reflect101 } from "./border";

export function gaussianKernel1d(sigma: number): Float32Array {
  if (sigma <= 0) return new Float32Array([1]);
  const radius = Math.max(1, Math.ceil(3 * sigma));
  const size = radius * 2 + 1;
  const k = new Float32Array(size);
  const s2 = sigma * sigma;
  let sum = 0;
  for (let i = -radius; i <= radius; i++) {
    const v = Math.exp(-(i * i) / (2 * s2));
    k[i + radius] = v;
    sum += v;
  }
  for (let i = 0; i < size; i++) k[i]! /= sum;
  return k;
}

export function convolveSeparable(
  src: Float32Array,
  width: number,
  height: number,
  k: Float32Array
): Float32Array {
  const radius = (k.length - 1) >> 1;
  const tmp = new Float32Array(src.length);
  const dst = new Float32Array(src.length);

  // horizontal
  for (let y = 0; y < height; y++) {
    const row = y * width;
    for (let x = 0; x < width; x++) {
      let acc = 0;
      for (let t = -radius; t <= radius; t++) {
        const xx = reflect101(x + t, width);
        acc += (src[row + xx] || 0) * (k[t + radius] || 0);
      }
      tmp[row + x] = acc;
    }
  }

  // vertical
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let acc = 0;
      for (let t = -radius; t <= radius; t++) {
        const yy = reflect101(y + t, height);
        acc += (tmp[yy * width + x] || 0) * (k[t + radius] || 0);
      }
      dst[y * width + x] = acc;
    }
  }

  return dst;
}

export function sobel(src: Float32Array, width: number, height: number): { gx: Float32Array; gy: Float32Array } {
  const gx = new Float32Array(src.length);
  const gy = new Float32Array(src.length);

  // Sobel kernels
  // Gx = [-1 0 1; -2 0 2; -1 0 1]
  // Gy = [-1 -2 -1; 0 0 0; 1 2 1]
  for (let y = 0; y < height; y++) {
    const y0 = reflect101(y - 1, height);
    const y1 = y;
    const y2 = reflect101(y + 1, height);

    for (let x = 0; x < width; x++) {
      const x0 = reflect101(x - 1, width);
      const x1 = x;
      const x2 = reflect101(x + 1, width);

      const a00 = src[y0 * width + x0]!;
      const a01 = src[y0 * width + x1]!;
      const a02 = src[y0 * width + x2]!;
      const a10 = src[y1 * width + x0]!;
      const a12 = src[y1 * width + x2]!;
      const a20 = src[y2 * width + x0]!;
      const a21 = src[y2 * width + x1]!;
      const a22 = src[y2 * width + x2]!;

      gx[y * width + x] = (-a00 + a02) + (-2 * a10 + 2 * a12) + (-a20 + a22);
      gy[y * width + x] = (-a00 - 2 * a01 - a02) + (a20 + 2 * a21 + a22);
    }
  }
  return { gx, gy };
}