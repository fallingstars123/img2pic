import { defineStore } from 'pinia';
import { ref, watch } from 'vue';
import { setWasmEnabled } from '../pixel/wasmApi';

const STORAGE_KEY_WASM_ENABLED = 'img2pic_wasm_enabled';

// 从 localStorage 加载 WASM 设置
function loadWasmSetting(): boolean {
  try {
    const value = localStorage.getItem(STORAGE_KEY_WASM_ENABLED);
    if (value !== null) {
      return value === 'true';
    }
    // 默认启用 WASM（每个上下文会独立加载自己的 WASM 实例）
    return true;
  } catch {
    return true; // 默认启用 WASM
  }
}

// 保存 WASM 设置到 localStorage
function saveWasmSetting(value: boolean) {
  try {
    localStorage.setItem(STORAGE_KEY_WASM_ENABLED, String(value));
  } catch (e) {
    console.warn('Failed to save WASM setting:', e);
  }
}

export const useSettingsStore = defineStore('settings', () => {
  const shouldShowPinchCenter = ref(false);

  // WASM 加速设置
  const wasmEnabled = ref(loadWasmSetting());

  // 监听变化，同步到 localStorage 和 wasmApi
  watch(wasmEnabled, (newValue, oldValue) => {
    saveWasmSetting(newValue);
    setWasmEnabled(newValue);
    if (newValue !== oldValue) {
      console.log(`[Settings] WASM engine ${newValue ? 'enabled' : 'disabled'}, will use ${newValue ? 'WASM' : 'JS'} for rendering`);
    }
  }, { immediate: true });

  // 初始化时设置 WASM 状态
  console.log(`[Settings] Initial WASM state: ${wasmEnabled.value ? 'enabled' : 'disabled'}, will use ${wasmEnabled.value ? 'WASM' : 'JS'} for rendering`);
  setWasmEnabled(wasmEnabled.value);

  return {
    shouldShowPinchCenter,
    wasmEnabled,
  };
});
