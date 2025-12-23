/**
 * 边缘检测像素化算法
 * 使用边缘检测能量图来检测像素大小，然后基于该大小创建均匀采样网格
 */

import { rgbaToGray01 } from "./energy";
import { sobel } from "./filters";
import type { SampleMode } from "./types";

/**
 * 边缘检测结果接口
 */
export interface EdgeDetectResult {
  // 检测到的像素大小
  pixelSize: number;
  // 水平网格线位置（y坐标）
  hLines: number[];
  // 垂直网格线位置（x坐标）
  vLines: number[];
}

/**
 * 边缘检测参数接口
 */
export interface EdgeDetectParams {
  // 边缘检测阈值 (0.0-1.0)，用于过滤弱边缘
  edgeThreshold: number;
  // 像素大小（0=自动检测，>0=手动设置）
  pixelSize: number;
  // 最小检测的像素大小
  minGridSize: number;
  // 最大检测的像素大小
  maxGridSize: number;
  // 网格偏移 X（用于微调）
  offsetX: number;
  // 网格偏移 Y（用于微调）
  offsetY: number;
}

/**
 * 计算边缘能量图（用于检测像素大小）
 * @param rgba - RGBA 图像数据
 * @param width - 图像宽度
 * @param height - 图像高度
 * @param threshold - 边缘阈值
 * @returns 能量图 (0-255)
 */
export function computeEdgeEnergy(
  rgba: Uint8Array | Uint8ClampedArray,
  width: number,
  height: number,
  threshold: number
): Uint8Array {
  // 转换为灰度图
  const gray01 = rgbaToGray01(rgba, width, height);

  // 计算 Sobel 梯度
  const { gx, gy } = sobel(gray01, width, height);

  // 计算边缘能量（梯度和）
  const energy = new Float32Array(width * height);
  for (let i = 0; i < energy.length; i++) {
    energy[i] = Math.abs(gx[i] || 0) + Math.abs(gy[i] || 0);
  }

  // 归一化到 0-1
  let maxEnergy = 0;
  for (let i = 0; i < energy.length; i++) {
    const val = energy[i] || 0;
    if (val > maxEnergy) maxEnergy = val;
  }

  // 应用阈值并转换为 Uint8Array
  const energyU8 = new Uint8Array(width * height);
  for (let i = 0; i < energy.length; i++) {
    let normalized = maxEnergy > 0 ? (energy[i] || 0) / maxEnergy : 0;
    // 只保留高于阈值的边缘
    if (normalized < threshold) normalized = 0;
    energyU8[i] = Math.round(normalized * 255);
  }

  return energyU8;
}

/**
 * 使用自相关方法从能量图中检测像素大小
 * 类似能量模式的 detectPixelSize
 */
function detectPixelSizeFromEnergy(
  energyU8: Uint8Array,
  width: number,
  height: number,
  minSize: number,
  maxSize: number
): number {
  // 投影到一维
  const projectionX = new Float32Array(width);
  const projectionY = new Float32Array(height);

  for (let y = 0; y < height; y++) {
    const row = y * width;
    for (let x = 0; x < width; x++) {
      const v = (energyU8[row + x] || 0) / 255; // 归一化到 0-1
      projectionX[x]! += v;
      projectionY[y]! += v;
    }
  }

  // 归一化投影
  let maxX = 0, maxY = 0;
  for (let i = 0; i < width; i++) {
    if ((projectionX[i] || 0) > maxX) maxX = projectionX[i] || 0;
  }
  for (let i = 0; i < height; i++) {
    if ((projectionY[i] || 0) > maxY) maxY = projectionY[i] || 0;
  }

  for (let i = 0; i < width; i++) {
    projectionX[i] = maxX > 0 ? (projectionX[i] || 0) / maxX : 0;
  }
  for (let i = 0; i < height; i++) {
    projectionY[i] = maxY > 0 ? (projectionY[i] || 0) / maxY : 0;
  }

  // 使用自相关找到最佳像素大小
  let bestSize = minSize;
  let bestScore = -Infinity;

  for (let size = minSize; size <= maxSize; size++) {
    // 计算水平和垂直方向的自相关分数
    let scoreX = 0, scoreY = 0;

    for (let i = 0; i < width - size; i++) {
      scoreX += (projectionX[i] || 0) * (projectionX[i + size] || 0);
    }
    scoreX /= (width - size);

    for (let i = 0; i < height - size; i++) {
      scoreY += (projectionY[i] || 0) * (projectionY[i + size] || 0);
    }
    scoreY /= (height - size);

    const totalScore = scoreX + scoreY;
    if (totalScore > bestScore) {
      bestScore = totalScore;
      bestSize = size;
    }
  }

  return bestSize;
}

/**
 * 创建均匀采样网格
 * @param width - 图像宽度
 * @param height - 图像高度
 * @param pixelSize - 像素大小
 * @param offsetX - 水平偏移
 * @param offsetY - 垂直偏移
 * @returns 网格线位置
 */
export function createUniformGrid(
  width: number,
  height: number,
  pixelSize: number,
  offsetX: number,
  offsetY: number
): { hLines: number[]; vLines: number[] } {
  const hLines: number[] = [];
  const vLines: number[] = [];

  // 应用偏移量
  const startX = offsetX % pixelSize;
  const startY = offsetY % pixelSize;

  // 从起始位置开始，每隔 pixelSize 创建一条网格线
  for (let x = startX; x < width; x += pixelSize) {
    const clampedX = Math.max(0, Math.min(Math.round(x), width));
    vLines.push(clampedX);
  }
  // 确保包含右边界
  if (vLines[vLines.length - 1] !== width) {
    vLines.push(width);
  }

  for (let y = startY; y < height; y += pixelSize) {
    const clampedY = Math.max(0, Math.min(Math.round(y), height));
    hLines.push(clampedY);
  }
  // 确保包含下边界
  if (hLines[hLines.length - 1] !== height) {
    hLines.push(height);
  }

  // 确保从 0 开始
  if (vLines[0] !== 0) vLines.unshift(0);
  if (hLines[0] !== 0) hLines.unshift(0);

  // 去重并排序
  return {
    hLines: Array.from(new Set(hLines)).sort((a, b) => a - b),
    vLines: Array.from(new Set(vLines)).sort((a, b) => a - b),
  };
}

/**
 * 边缘检测像素化主函数
 * 检测像素大小并创建采样网格
 * @param rgba - 原始 RGBA 图像数据
 * @param width - 图像宽度
 * @param height - 图像高度
 * @param params - 边缘检测参数
 * @returns 边缘检测结果（包含网格线）
 */
export function edgeDetectPixelize(
  rgba: Uint8Array | Uint8ClampedArray,
  width: number,
  height: number,
  params: EdgeDetectParams
): EdgeDetectResult {
  // 计算边缘能量图
  const energyU8 = computeEdgeEnergy(rgba, width, height, params.edgeThreshold);

  // 检测像素大小（如果需要自动检测）
  let pixelSize = params.pixelSize;
  if (pixelSize <= 0) {
    // 自动检测
    pixelSize = detectPixelSizeFromEnergy(
      energyU8,
      width,
      height,
      params.minGridSize,
      params.maxGridSize
    );
  }

  // 创建均匀采样网格
  const { hLines, vLines } = createUniformGrid(
    width,
    height,
    pixelSize,
    params.offsetX,
    params.offsetY
  );

  return {
    pixelSize,
    hLines,
    vLines,
  };
}

/**
 * 使用网格线对图像进行采样（生成像素画）
 * @param rgba - 原始 RGBA 图像数据
 * @param width - 图像宽度
 * @param height - 图像高度
 * @param hLines - 水平网格线
 * @param vLines - 垂直网格线
 * @param sampleMode - 采样模式
 * @param weightRatio - 权重比例（用于 weighted 模式）
 * @param upscale - 放大倍数
 * @param nativeRes - 是否使用原生分辨率
 * @returns 像素化结果
 */
export function sampleWithGrid(
  rgba: Uint8Array | Uint8ClampedArray,
  width: number,
  height: number,
  hLines: number[],
  vLines: number[],
  sampleMode: SampleMode,
  weightRatio: number,
  upscale: number,
  nativeRes: boolean
): {
  pixelated: Uint8Array;
  pixelatedWidth: number;
  pixelatedHeight: number;
} {
  const cellW = vLines.length - 1;
  const cellH = hLines.length - 1;

  const outW = nativeRes ? cellW : cellW * upscale;
  const outH = nativeRes ? cellH : cellH * upscale;
  const pixelated = new Uint8Array(outW * outH * 4);

  function getRgba(x: number, y: number): [number, number, number, number] {
    const clampedX = Math.max(0, Math.min(Math.floor(x), width - 1));
    const clampedY = Math.max(0, Math.min(Math.floor(y), height - 1));
    const i = (clampedY * width + clampedX) * 4;
    return [
      rgba[i] || 0,
      rgba[i + 1] || 0,
      rgba[i + 2] || 0,
      rgba[i + 3] || 0,
    ];
  }

  for (let j = 0; j < cellH; j++) {
    const y1 = hLines[j]!;
    const y2 = hLines[j + 1]!;
    const cy = Math.floor((y1 + y2) / 2);

    for (let i = 0; i < cellW; i++) {
      const x1 = vLines[i]!;
      const x2 = vLines[i + 1]!;
      const cx = Math.floor((x1 + x2) / 2);

      let r = 0, g = 0, b = 0, a = 255;

      if (sampleMode === "center") {
        // 中心点采样
        [r, g, b, a] = getRgba(cx, cy);
      } else if (sampleMode === "average") {
        // 平均采样
        let sumR = 0, sumG = 0, sumB = 0, sumA = 0;
        let count = 0;

        for (let y = y1; y < y2; y++) {
          for (let x = x1; x < x2; x++) {
            const [rr, gg, bb, aa] = getRgba(x, y);
            sumR += rr;
            sumG += gg;
            sumB += bb;
            sumA += aa;
            count++;
          }
        }

        if (count > 0) {
          r = Math.round(sumR / count);
          g = Math.round(sumG / count);
          b = Math.round(sumB / count);
          a = Math.round(sumA / count);
        }
      } else if (sampleMode === "weighted") {
        // 加权采样（在中心点周围采样）
        const cellW_px = x2 - x1;
        const cellH_px = y2 - y1;
        const regionW = Math.max(1, Math.floor(cellW_px * weightRatio));
        const regionH = Math.max(1, Math.floor(cellH_px * weightRatio));

        const wx1 = Math.max(0, cx - Math.floor(regionW / 2));
        const wx2 = Math.min(width - 1, cx + Math.floor(regionW / 2));
        const wy1 = Math.max(0, cy - Math.floor(regionH / 2));
        const wy2 = Math.min(height - 1, cy + Math.floor(regionH / 2));

        let sumR = 0, sumG = 0, sumB = 0, sumA = 0;
        let count = 0;

        for (let y = wy1; y <= wy2; y++) {
          for (let x = wx1; x <= wx2; x++) {
            const [rr, gg, bb, aa] = getRgba(x, y);
            sumR += rr;
            sumG += gg;
            sumB += bb;
            sumA += aa;
            count++;
          }
        }

        if (count > 0) {
          r = Math.round(sumR / count);
          g = Math.round(sumG / count);
          b = Math.round(sumB / count);
          a = Math.round(sumA / count);
        }
      } else {
        // direct 模式 - 使用双线性插值
        const fx = (x1 + x2) / 2;
        const fy = (y1 + y2) / 2;
        const x1_f = Math.floor(fx);
        const y1_f = Math.floor(fy);
        const x2_f = Math.min(x1_f + 1, width - 1);
        const y2_f = Math.min(y1_f + 1, height - 1);

        const fx_frac = fx - x1_f;
        const fy_frac = fy - y1_f;

        const [r1, g1, b1, a1] = getRgba(x1_f, y1_f);
        const [r2, g2, b2, a2] = getRgba(x2_f, y1_f);
        const [r3, g3, b3, a3] = getRgba(x1_f, y2_f);
        const [r4, g4, b4, a4] = getRgba(x2_f, y2_f);

        // 双线性插值
        const w1 = (1 - fx_frac) * (1 - fy_frac);
        const w2 = fx_frac * (1 - fy_frac);
        const w3 = (1 - fx_frac) * fy_frac;
        const w4 = fx_frac * fy_frac;

        const avgA = a1 * w1 + a2 * w2 + a3 * w3 + a4 * w4;
        const den = Math.max(avgA, 1);

        r = Math.round((r1 * a1 * w1 + r2 * a2 * w2 + r3 * a3 * w3 + r4 * a4 * w4) / den);
        g = Math.round((g1 * a1 * w1 + g2 * a2 * w2 + g3 * a3 * w3 + g4 * a4 * w4) / den);
        b = Math.round((b1 * a1 * w1 + b2 * a2 * w2 + b3 * a3 * w3 + b4 * a4 * w4) / den);
        a = Math.round(avgA);
      }

      // 输出像素
      if (nativeRes) {
        const o = (j * outW + i) * 4;
        pixelated[o] = r;
        pixelated[o + 1] = g;
        pixelated[o + 2] = b;
        pixelated[o + 3] = a;
      } else {
        // 放大每个像素
        const ox = i * upscale;
        const oy = j * upscale;
        for (let yy = 0; yy < upscale; yy++) {
          for (let xx = 0; xx < upscale; xx++) {
            const o = ((oy + yy) * outW + (ox + xx)) * 4;
            pixelated[o] = r;
            pixelated[o + 1] = g;
            pixelated[o + 2] = b;
            pixelated[o + 3] = a;
          }
        }
      }
    }
  }

  return { pixelated, pixelatedWidth: outW, pixelatedHeight: outH };
}
