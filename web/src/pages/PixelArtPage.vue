<template>
  <q-page class="q-pa-md">
    <div class="row q-gutter-md">
      <!-- 左侧控制面板 -->
      <div class="col-12 col-md-4">
        <q-card>
          <q-card-section>
            <div class="text-h6 q-mb-md">像素化设置</div>

            <!-- 文件上传 -->
            <q-file
              v-model="selectedFile"
              label="选择图片"
              accept="image/*"
              @update:model-value="onFileSelected"
              class="q-mb-md"
            >
              <template v-slot:prepend>
                <q-icon name="image" />
              </template>
            </q-file>

            <!-- 能量算法参数 -->
            <q-expansion-item
              label="能量算法参数"
              default-opened
              class="q-mb-md"
            >
              <q-card flat bordered class="q-pa-md">
                <!-- 基础参数 -->
                <q-slider
                  v-model="params.sigma"
                  :min="0"
                  :max="5"
                  :step="0.1"
                  label
                  label-always
                  class="q-mb-md"
                >
                  <template v-slot:label>
                    高斯模糊 Sigma: {{ params.sigma.toFixed(1) }}
                  </template>
                </q-slider>

                <q-slider
                  v-model="params.gapTolerance"
                  :min="0"
                  :max="10"
                  label
                  label-always
                  class="q-mb-md"
                >
                  <template v-slot:label>
                    网格间隙容差: {{ params.gapTolerance }}px
                  </template>
                </q-slider>

                <q-slider
                  v-model="params.minEnergy"
                  :min="0"
                  :max="1"
                  :step="0.01"
                  label
                  label-always
                  class="q-mb-md"
                >
                  <template v-slot:label>
                    最小能量阈值: {{ params.minEnergy.toFixed(2) }}
                  </template>
                </q-slider>

                <q-slider
                  v-model="params.smooth"
                  :min="1"
                  :max="15"
                  label
                  label-always
                  class="q-mb-md"
                >
                  <template v-slot:label>
                    平滑窗口: {{ params.smooth }}
                  </template>
                </q-slider>

                <!-- 能量增强选项 -->
                <q-toggle
                  v-model="params.enhanceEnergy"
                  label="启用能量增强"
                  class="q-mb-md"
                />

                <template v-if="params.enhanceEnergy">
                  <q-toggle
                    v-model="params.enhanceDirectional"
                    label="方向性增强"
                    class="q-mb-md"
                  />

                  <template v-if="params.enhanceDirectional">
                    <q-slider
                      v-model="params.enhanceHorizontal"
                      :min="0.5"
                      :max="3"
                      :step="0.1"
                      label
                      label-always
                      class="q-mb-md"
                    >
                      <template v-slot:label>
                        水平增强: {{ params.enhanceHorizontal.toFixed(1) }}x
                      </template>
                    </q-slider>

                    <q-slider
                      v-model="params.enhanceVertical"
                      :min="0.5"
                      :max="3"
                      :step="0.1"
                      label
                      label-always
                      class="q-mb-md"
                    >
                      <template v-slot:label>
                        垂直增强: {{ params.enhanceVertical.toFixed(1) }}x
                      </template>
                    </q-slider>
                  </template>
                </template>

                <!-- 像素大小检测 -->
                <q-slider
                  v-model="params.pixelSize"
                  :min="0"
                  :max="20"
                  label
                  label-always
                  class="q-mb-md"
                >
                  <template v-slot:label>
                    像素大小: {{ params.pixelSize === 0 ? '自动检测' : params.pixelSize + 'px' }}
                  </template>
                </q-slider>

                <template v-if="params.pixelSize === 0">
                  <q-slider
                    v-model="params.minS"
                    :min="2"
                    :max="8"
                    label
                    label-always
                    class="q-mb-md"
                  >
                    <template v-slot:label>
                      最小像素: {{ params.minS }}px
                    </template>
                  </q-slider>

                  <q-slider
                    v-model="params.maxS"
                    :min="10"
                    :max="40"
                    label
                    label-always
                    class="q-mb-md"
                  >
                    <template v-slot:label>
                      最大像素: {{ params.maxS }}px
                    </template>
                  </q-slider>
                </template>

                <!-- 采样参数 -->
                <q-toggle
                  v-model="params.sample"
                  label="生成像素画"
                  class="q-mb-md"
                />

                <template v-if="params.sample">
                  <q-select
                    v-model="params.sampleMode"
                    :options="sampleModeOptions"
                    label="采样模式"
                    emit-value
                    map-options
                    class="q-mb-md"
                  />

                  <q-toggle
                    v-model="params.nativeRes"
                    label="原生分辨率 (1像素=1格)"
                    class="q-mb-md"
                  />

                  <template v-if="!params.nativeRes">
                    <q-slider
                      v-model="params.upscale"
                      :min="0"
                      :max="10"
                      label
                      label-always
                      class="q-mb-md"
                    >
                      <template v-slot:label>
                        放大倍数: {{ params.upscale === 0 ? '自动' : params.upscale + 'x' }}
                      </template>
                    </q-slider>
                  </template>

                  <template v-if="params.sampleMode === 'weighted'">
                    <q-slider
                      v-model="params.sampleWeightRatio"
                      :min="0.1"
                      :max="0.9"
                      :step="0.1"
                      label
                      label-always
                      class="q-mb-md"
                    >
                      <template v-slot:label>
                        权重比例: {{ params.sampleWeightRatio.toFixed(1) }}
                      </template>
                    </q-slider>
                  </template>
                </template>
              </q-card>
            </q-expansion-item>

            <!-- 处理按钮 -->
            <q-btn
              color="primary"
              label="开始处理"
              @click="processImage"
              :loading="processing"
              :disable="!selectedFile || processing"
              class="full-width q-mb-md"
            />

            <!-- 显示调试信息 -->
            <q-toggle
              v-model="showDebug"
              label="显示能量图和网格线"
              class="q-mb-md"
            />

            <!-- 状态信息 -->
            <div v-if="result" class="text-body2 text-grey-7">
              <div class="q-mb-sm">检测到像素大小: {{ result.detectedPixelSize }}px</div>
              <div class="q-mb-sm">检测到网格线: {{ result.xLines.length }} × {{ result.yLines.length }}</div>
              <div v-if="result.pixelArt">
                <div>输出尺寸: {{ result.pixelArt.width }} × {{ result.pixelArt.height }}</div>
                <div>放大倍数: {{ result.pixelArt.upscaleFactor }}x</div>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <!-- 右侧图片显示区域 -->
      <div class="col-12 col-md-8">
        <div class="row q-gutter-md">
          <!-- 原始图片 -->
          <div class="col-12" :class="showDebug ? 'col-sm-6' : ''">
            <q-card>
              <q-card-section>
                <div class="text-h6 q-mb-md">原始图片</div>
                <div v-if="originalImage" class="text-center">
                  <canvas ref="originalCanvas" style="max-width: 100%; height: auto;" />
                </div>
                <div v-else class="text-center text-grey-6 q-pa-lg">
                  请选择要处理的图片
                </div>
              </q-card-section>
            </q-card>
          </div>

          <!-- 能量图和网格线（调试模式） -->
          <div v-if="showDebug && result" class="col-12 col-sm-6">
            <q-card>
              <q-card-section>
                <div class="text-h6 q-mb-md">能量图和网格线</div>
                <div class="text-center">
                  <canvas ref="debugCanvas" style="max-width: 100%; height: auto;" />
                </div>
              </q-card-section>
            </q-card>
          </div>

          <!-- 像素化结果 -->
          <div v-if="result && result.pixelArt" class="col-12">
            <q-card>
              <q-card-section>
                <div class="text-h6 q-mb-md">像素化结果</div>
                <div class="text-center">
                  <canvas ref="pixelCanvas" style="max-width: 100%; height: auto;" />
                  <div class="q-mt-md">
                    <q-btn
                      color="secondary"
                      label="下载能量图"
                      @click="downloadDebug"
                      icon="download"
                      class="q-mr-md"
                      v-if="showDebug"
                    />
                    <q-btn
                      color="secondary"
                      label="下载像素画"
                      @click="downloadPixelArt"
                      icon="download"
                    />
                  </div>
                </div>
              </q-card-section>
            </q-card>
          </div>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted } from 'vue';
import { useQuasar } from 'quasar';
import { saveAs } from 'file-saver';
import { createPixelWorker } from 'src/pixel/workerApi';
import type { PipelineParams, PipelineResult } from 'src/pixel/types';

const $q = useQuasar();

// 状态变量
const selectedFile = ref<File | null>(null);
const originalImage = ref<HTMLCanvasElement | null>(null);
const debugCanvas = ref<HTMLCanvasElement | null>(null);
const pixelCanvas = ref<HTMLCanvasElement | null>(null);
const processing = ref(false);
const showDebug = ref(false);
const result = ref<PipelineResult | null>(null);
let workerInstance: any = null;

// 能量算法参数
const params = reactive<PipelineParams>({
  sigma: 1.0,
  enhanceEnergy: false,
  enhanceDirectional: false,
  enhanceHorizontal: 1.0,
  enhanceVertical: 1.0,
  gapTolerance: 2,
  minEnergy: 0.15,
  smooth: 3,
  windowSize: 0,
  pixelSize: 0,
  minS: 4,
  maxS: 24,
  sample: true,
  sampleMode: 'center',
  sampleWeightRatio: 0.6,
  upscale: 0,
  nativeRes: false,
});

// 采样模式选项
const sampleModeOptions = [
  { label: '中心采样', value: 'center' },
  { label: '平均采样', value: 'average' },
  { label: '加权平均', value: 'weighted' },
];

// 初始化Worker
onMounted(async () => {
  workerInstance = createPixelWorker();
});

onUnmounted(() => {
  if (workerInstance) {
    workerInstance.worker.terminate();
  }
});

// 文件选择处理
async function onFileSelected(file: File) {
  if (!file || !originalImage.value) return;

  const img = new Image();
  img.onload = () => {
    // 调整canvas大小
    originalImage.value!.width = img.width;
    originalImage.value!.height = img.height;

    // 绘制图片
    const ctx = originalImage.value!.getContext('2d')!;
    ctx.drawImage(img, 0, 0);

    // 重置结果
    result.value = null;
  };
  img.src = URL.createObjectURL(file);
}

// 处理图片
async function processImage() {
  if (!selectedFile.value || !originalImage.value) return;

  processing.value = true;

  try {
    // 获取图片数据
    const ctx = originalImage.value.getContext('2d')!;
    const imageData = ctx.getImageData(0, 0, originalImage.value.width, originalImage.value.height);

    // 准备输入数据
    const input = {
      width: originalImage.value.width,
      height: originalImage.value.height,
      rgba: imageData.data.buffer,
    };

    // 调用Worker处理
    const resultData = await workerInstance.api.runPipeline(input, params);

    // 保存结果
    result.value = resultData;

    // 显示能量图和网格线
    if (showDebug.value) {
      renderDebugImage();
    }

    // 显示像素画
    if (resultData.pixelArt) {
      renderPixelArt();
    }

    $q.notify({
      type: 'positive',
      message: '处理完成！',
    });
  } catch (error) {
    console.error('处理错误:', error);
    $q.notify({
      type: 'negative',
      message: '处理失败：' + error,
    });
  } finally {
    processing.value = false;
  }
}

// 渲染调试图像（能量图+网格线）
function renderDebugImage() {
  if (!result.value || !debugCanvas.value) return;

  const { width, height, energyU8, xLines, yLines, allXLines, allYLines } = result.value;

  debugCanvas.value.width = width;
  debugCanvas.value.height = height;

  const ctx = debugCanvas.value.getContext('2d')!;

  // 绘制能量图
  const energyData = new Uint8Array(energyU8);
  const imageData = ctx.createImageData(width, height);

  for (let i = 0; i < energyData.length; i++) {
    const value = energyData[i];
    const idx = i * 4;
    imageData.data[idx] = value;     // R
    imageData.data[idx + 1] = value; // G
    imageData.data[idx + 2] = value; // B
    imageData.data[idx + 3] = 255;   // A
  }

  ctx.putImageData(imageData, 0, 0);

  // 绘制检测到的网格线（红色）
  ctx.strokeStyle = 'red';
  ctx.lineWidth = 1;

  for (const x of xLines) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }

  for (const y of yLines) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }

  // 绘制插值后的网格线（蓝色）
  ctx.strokeStyle = 'blue';
  ctx.lineWidth = 1;

  for (const x of allXLines) {
    if (!xLines.includes(x)) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
  }

  for (const y of allYLines) {
    if (!yLines.includes(y)) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
  }

  // 绘制网格中心点（绿色）
  ctx.fillStyle = 'green';
  for (let i = 0; i < allXLines.length - 1; i++) {
    const x = (allXLines[i] + allXLines[i + 1]) / 2;
    for (let j = 0; j < allYLines.length - 1; j++) {
      const y = (allYLines[j] + allYLines[j + 1]) / 2;
      ctx.fillRect(x - 1, y - 1, 2, 2);
    }
  }
}

// 渲染像素画
function renderPixelArt() {
  if (!result.value?.pixelArt || !pixelCanvas.value) return;

  const { width, height, rgb } = result.value.pixelArt;

  pixelCanvas.value.width = width;
  pixelCanvas.value.height = height;

  const ctx = pixelCanvas.value.getContext('2d')!;

  // 创建RGB图像数据
  const rgbData = new Uint8Array(rgb);
  const imageData = ctx.createImageData(width, height);

  for (let i = 0; i < rgbData.length / 3; i++) {
    const idx = i * 4;
    const rgbIdx = i * 3;
    imageData.data[idx] = rgbData[rgbIdx];         // R
    imageData.data[idx + 1] = rgbData[rgbIdx + 1]; // G
    imageData.data[idx + 2] = rgbData[rgbIdx + 2]; // B
    imageData.data[idx + 3] = 255;                  // A
  }

  ctx.putImageData(imageData, 0, 0);

  // 如果是像素画，禁用图像平滑以获得清晰的像素效果
  ctx.imageSmoothingEnabled = false;
}

// 下载调试图像
function downloadDebug() {
  if (!debugCanvas.value) return;

  debugCanvas.value.toBlob((blob) => {
    if (blob) {
      saveAs(blob, `energy_debug_${Date.now()}.png`);
    }
  });
}

// 下载像素画
function downloadPixelArt() {
  if (!pixelCanvas.value) return;

  pixelCanvas.value.toBlob((blob) => {
    if (blob) {
      saveAs(blob, `pixel_art_${Date.now()}.png`);
    }
  });
}
</script>