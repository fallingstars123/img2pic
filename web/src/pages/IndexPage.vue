<template>
  <q-page class="q-pa-md">
    <!-- Hero Section -->
    <div class="row items-center q-py-xl">
      <div class="col-12 col-md-6 text-center">
        <h1 class="text-h2 text-weight-bold text-primary q-mb-md">
          Img2Pic
        </h1>
        <h2 class="text-h4 text-weight-regular q-mb-lg">
          将AI生成的伪像素画转换成真像素画
        </h2>
        <p class="text-body1 q-mb-xl text-grey-7">
          使用先进的能量算法和边缘检测技术，智能识别图片中的像素网格，
          生成真正的像素艺术作品。支持多种算法和自定义参数。
        </p>
        <q-btn
          color="primary"
          size="lg"
          label="开始转换"
          icon="brush"
          @click="$router.push('/pixel-art')"
          class="q-mr-md"
        />
        <q-btn
          outline
          color="primary"
          size="lg"
          label="了解更多"
          icon="info"
          @click="showFeatures = !showFeatures"
        />
      </div>
      <div class="col-12 col-md-6 text-center">
        <q-icon name="image" size="200px" color="primary" />
      </div>
    </div>

    <!-- Features Section -->
    <div v-if="showFeatures" class="row q-py-xl q-my-xl">
      <div class="col-12 text-center q-mb-xl">
        <h2 class="text-h3 text-weight-bold">功能特点</h2>
      </div>

      <div class="row q-gutter-md justify-center">
        <div class="col-12 col-sm-6 col-md-4">
          <q-card flat bordered class="q-pa-md">
            <q-card-section class="text-center">
              <q-icon name="auto_awesome" size="60px" color="primary" class="q-mb-md" />
              <div class="text-h6 q-mb-md">能量算法</div>
              <p class="text-body2 text-grey-7">
                基于梯度的能量图生成，自动检测像素网格边界，
                支持方向性增强和自定义参数调整。
              </p>
            </q-card-section>
          </q-card>
        </div>

        <div class="col-12 col-sm-6 col-md-4">
          <q-card flat bordered class="q-pa-md">
            <q-card-section class="text-center">
              <q-icon name="edge_detection" size="60px" color="primary" class="q-mb-md" />
              <div class="text-h6 q-mb-md">边缘检测</div>
              <p class="text-body2 text-grey-7">
                使用Sobel算子检测水平和垂直边缘，
                智能识别像素网格线，自动调整网格大小。
              </p>
            </q-card-section>
          </q-card>
        </div>

        <div class="col-12 col-sm-6 col-md-4">
          <q-card flat bordered class="q-pa-md">
            <q-card-section class="text-center">
              <q-icon name="grid_on" size="60px" color="primary" class="q-mb-md" />
              <div class="text-h6 q-mb-md">网格采样</div>
              <p class="text-body2 text-grey-7">
                通过峰值检测创建规律网格，支持多种采样模式，
                包括中心采样、平均采样和加权平均。
              </p>
            </q-card-section>
          </q-card>
        </div>

        <div class="col-12 col-sm-6 col-md-4">
          <q-card flat bordered class="q-pa-md">
            <q-card-section class="text-center">
              <q-icon name="palette" size="60px" color="primary" class="q-mb-md" />
              <div class="text-h6 q-mb-md">颜色量化</div>
              <p class="text-body2 text-grey-7">
                智能颜色量化算法，支持相似颜色合并，
                可自定义颜色数量和相似度阈值。
              </p>
            </q-card-section>
          </q-card>
        </div>

        <div class="col-12 col-sm-6 col-md-4">
          <q-card flat bordered class="q-pa-md">
            <q-card-section class="text-center">
              <q-icon name="tune" size="60px" color="primary" class="q-mb-md" />
              <div class="text-h6 q-mb-md">参数调节</div>
              <p class="text-body2 text-grey-7">
                丰富的参数选项，实时预览效果，
                支持调试模式显示检测到的网格线。
              </p>
            </q-card-section>
          </q-card>
        </div>

        <div class="col-12 col-sm-6 col-md-4">
          <q-card flat bordered class="q-pa-md">
            <q-card-section class="text-center">
              <q-icon name="download" size="60px" color="primary" class="q-mb-md" />
              <div class="text-h6 q-mb-md">一键导出</div>
              <p class="text-body2 text-grey-7">
                处理完成后可直接下载高质量的像素艺术图片，
                支持自定义放大倍数。
              </p>
            </q-card-section>
          </q-card>
        </div>
      </div>
    </div>

    <!-- Quick Start Section -->
    <div class="row q-py-xl q-my-xl bg-grey-1">
      <div class="col-12 text-center q-mb-xl">
        <h2 class="text-h3 text-weight-bold">快速开始</h2>
      </div>

      <div class="row items-center justify-center">
        <div class="col-12 col-md-8">
          <q-stepper v-model="step" vertical color="primary" animated>
            <q-step
              :name="1"
              title="选择图片"
              icon="image"
              :done="step > 1"
            >
              上传您想要转换的图片，支持常见图片格式。
            </q-step>

            <q-step
              :name="2"
              title="选择算法"
              icon="settings"
              :done="step > 2"
            >
              根据您的需求选择合适的算法，并调整参数。
            </q-step>

            <q-step
              :name="3"
              title="处理图片"
              icon="play_arrow"
              :done="step > 3"
            >
              点击处理按钮，系统将自动将图片转换为像素艺术。
            </q-step>

            <q-step
              :name="4"
              title="下载结果"
              icon="download"
            >
              预览结果并下载高质量的像素艺术图片。
            </q-step>
          </q-stepper>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const showFeatures = ref(false);
const step = ref(1);
</script>
