<template>
  <q-expansion-item
    :label="$t('wasm.title')"
    icon="speed"
    class="q-mb-md"
  >
    <q-card flat bordered class="q-pa-md">
      <!-- WASM 开关 -->
      <div class="row items-center q-mb-md">
        <div class="col">
          <div class="text-body2">{{ $t('wasm.enableWasm') }}</div>
          <div class="text-caption text-grey">{{ $t('wasm.enableWasmDesc') }}</div>
        </div>
        <q-toggle
          v-model="settingsStore.wasmEnabled"
          color="primary"
          :disable="!isSupported"
        />
      </div>

      <!-- 支持状态 -->
      <q-banner
        v-if="!isSupported"
        class="bg-warning text-white q-mb-md"
        dense
      >
        <template v-slot:avatar>
          <q-icon name="warning" />
        </template>
        {{ $t('wasm.notSupported') }}
      </q-banner>

      <!-- 加载状态 -->
      <q-banner
        v-else-if="wasmState === 'loading'"
        class="bg-info text-white q-mb-md"
        dense
      >
        <template v-slot:avatar>
          <q-icon name="download" />
        </template>
        {{ $t('wasm.loading') }}
        <q-spinner-dots class="float-right" />
      </q-banner>

      <!-- 加载成功 -->
      <q-banner
        v-else-if="settingsStore.wasmEnabled && wasmState === 'loaded'"
        class="bg-positive text-white q-mb-md"
        dense
      >
        <template v-slot:avatar>
          <q-icon name="check_circle" />
        </template>
        {{ $t('wasm.loaded') }}
      </q-banner>

      <!-- 加载错误 -->
      <q-banner
        v-else-if="wasmError"
        class="bg-negative text-white q-mb-md"
        dense
      >
        <template v-slot:avatar>
          <q-icon name="error" />
        </template>
        {{ $t('wasm.error') }}: {{ wasmError?.message }}
      </q-banner>

      <!-- 未加载提示 -->
      <q-banner
        v-else-if="settingsStore.wasmEnabled && wasmState === 'unloaded'"
        class="bg-grey-8 text-white q-mb-md"
        dense
      >
        <template v-slot:avatar>
          <q-icon name="info" />
        </template>
        {{ $t('wasm.notLoaded') }}
      </q-banner>

      <!-- 性能提示 -->
      <q-separator class="q-my-md" />

      <div class="text-body2 q-mb-sm">{{ $t('wasm.performanceInfo') }}</div>
      <div class="text-caption text-grey">
        <ul>
          <li>{{ $t('wasm.performanceConvolution') }}</li>
          <li>{{ $t('wasm.performanceSobel') }}</li>
          <li>{{ $t('wasm.performanceSampling') }}</li>
        </ul>
      </div>

      <!-- 预加载按钮 -->
      <q-btn
        v-if="isSupported && wasmState !== 'loaded'"
        :label="$t('wasm.preload')"
        color="secondary"
        outline
        class="q-mt-md"
        :loading="wasmState === 'loading'"
        @click="onPreloadWasm"
      />
    </q-card>
  </q-expansion-item>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useSettingsStore } from '../stores/settings';
import {
  isWasmSupported,
  getWasmState,
  getWasmError,
  preloadWasm
} from '../pixel/wasmApi';

const settingsStore = useSettingsStore();

// 状态
const isSupported = ref(false);
const wasmState = ref<'unloaded' | 'loading' | 'loaded' | 'error'>('unloaded');
const wasmError = ref<Error | null>(null);

// 初始化 - 自动尝试加载 WASM
onMounted(async () => {
  console.log('[WasmSettings] Component mounted');
  isSupported.value = isWasmSupported();
  console.log('[WasmSettings] WASM supported:', isSupported.value);
  updateState();

  // 如果支持 WASM 且已启用，自动尝试加载
  if (isSupported.value && settingsStore.wasmEnabled) {
    console.log('[WasmSettings] Auto-loading WASM...');
    try {
      await preloadWasm();
      console.log('[WasmSettings] WASM auto-load completed');
    } catch (err) {
      console.warn('[WasmSettings] WASM auto-load failed, will use JS fallback:', err);
      // 加载失败，禁用 WASM 并使用 JS
      settingsStore.wasmEnabled = false;
    }
    updateState();
  }
});

// 更新状态（只在状态变化时打印日志）
function updateState() {
  const newState = getWasmState();
  const newError = getWasmError();

  if (newState !== wasmState.value || newError !== wasmError.value) {
    wasmState.value = newState;
    wasmError.value = newError;
    console.log('[WasmSettings] State update:', { state: wasmState.value, error: wasmError.value });
  }
}

async function onPreloadWasm() {
  console.log('[WasmSettings] Preload button clicked');
  try {
    await preloadWasm();
    console.log('[WasmSettings] Preload completed');
  } catch (err) {
    console.error('[WasmSettings] Preload failed:', err);
    // 加载失败，禁用 WASM
    settingsStore.wasmEnabled = false;
  }
  updateState();
}
</script>
