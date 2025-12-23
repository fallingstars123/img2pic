export type SampleMode = "center" | "average" | "weighted" | "direct";

/**
 * 边缘检测像素化参数
 */
export interface EdgeDetectParams {
  // 边缘检测阈值 (0.0-1.0)，越低检测到的边缘越多
  edgeThreshold: number;
  // 最小网格大小（像素）
  minGridSize: number;
  // 最大网格大小（像素）
  maxGridSize: number;
  // 网格偏移 X（用于微调），支持小数步进
  offsetX: number;
  // 网格偏移 Y（用于微调），支持小数步进
  offsetY: number;
  // 像素大小（手动设置，0=自动检测）
  pixelSize: number;
  // 放大倍数
  upscale: number;
  // 是否使用原生分辨率（1像素=1网格）
  nativeRes: boolean;
  // 采样模式
  sampleMode: SampleMode;
  // 采样权重比例（用于 weighted 模式）
  sampleWeightRatio: number;
}

/**
 * 边缘检测结果
 */
export interface EdgeDetectResult {
  // 检测到的像素大小
  pixelSize: number;
  // 水平网格线位置（y坐标）
  hLines: number[];
  // 垂直网格线位置（x坐标）
  vLines: number[];
}

export interface PipelineParams {
  // WASM 加速开关
  wasmEnabled: boolean;

  sigma: number;

  enhanceEnergy: boolean;
  enhanceDirectional: boolean;
  enhanceHorizontal: number;
  enhanceVertical: number;

  // grid
  gapTolerance: number;
  interpThreshold: number; // 插值线阈值，当间距大于 typical * interpThreshold 时插入插值线
  minEnergy: number;   // 0..1 * max(profile)
  smooth: number;      // 1D 平滑窗口
  windowSize: number;  // 0=auto

  // pixel size detect
  pixelSize: number;   // 0=auto
  minS: number;
  maxS: number;

  // sampling
  sample: boolean;
  sampleMode: SampleMode;
  sampleWeightRatio: number; // 0.1..0.9
  upscale: number;           // 0=use pixelSize; 1=native; >1 custom
  nativeRes: boolean;        // true => 1 pixel per cell
}

export interface RgbaImage {
  width: number;
  height: number;
  // Uint8ClampedArray 的 buffer；通过 transfer 传递
  rgba: ArrayBuffer;
}

export interface PixelArtResult {
  width: number;
  height: number;
  rgb: ArrayBuffer; // Uint8Array length = w*h*3
  rgba?: ArrayBuffer | undefined; // Uint8Array length = w*h*4 - 可选，用于支持透明度
  upscaleFactor: number;
}

export interface PipelineResult {
  width: number;
  height: number;

  detectedPixelSize: number;

  energyU8: ArrayBuffer; // Uint8Array length = w*h

  xLines: number[];
  yLines: number[];
  allXLines: number[];
  allYLines: number[];

  pixelArt?: PixelArtResult | undefined;
}
