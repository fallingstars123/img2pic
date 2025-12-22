<template>
  <div>
    <!-- PWA Install Prompt -->
    <q-dialog v-model="showInstallPrompt" persistent>
      <q-card style="min-width: 350px">
        <q-card-section class="row items-center">
          <q-avatar
            icon="apps"
            color="primary"
            text-color="white"
            size="lg"
          />
          <div class="q-ml-md">
            <div class="text-h6">安装 img2pic 应用</div>
            <div class="text-body2 text-grey-7">
              将 img2pic 安装到您的设备，随时随地使用像素画转换功能！
            </div>
          </div>
        </q-card-section>

        <q-card-section class="text-body2">
          <ul class="q-pl-md">
            <li>离线使用，无需网络连接</li>
            <li>全屏体验，更专注的工作环境</li>
            <li>启动更快，即开即用</li>
            <li>获得所有最新功能更新</li>
          </ul>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn
            flat
            label="以后再说"
            color="grey"
            @click="dismissInstallPrompt"
            v-close-popup
          />
          <q-btn
            flat
            label="安装应用"
            color="primary"
            @click="installPWA"
            v-close-popup
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Update Available Dialog -->
    <q-dialog v-model="showUpdateDialog" persistent>
      <q-card style="min-width: 350px">
        <q-card-section class="row items-center">
          <q-avatar
            icon="system_update"
            color="positive"
            text-color="white"
            size="lg"
          />
          <div class="q-ml-md">
            <div class="text-h6">新版本可用</div>
            <div class="text-body2 text-grey-7">
              img2pic 有新版本更新，包含改进和新功能！
            </div>
          </div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn
            flat
            label="稍后更新"
            color="grey"
            @click="dismissUpdate"
            v-close-popup
          />
          <q-btn
            flat
            label="立即更新"
            color="primary"
            @click="applyUpdate"
            v-close-popup
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Offline Notification -->
    <q-banner
      v-if="isOffline"
      class="bg-warning text-white"
      dense
    >
      <template v-slot:avatar>
        <q-icon name="wifi_off" />
      </template>
      <div class="text-body2">
        离线模式：正在使用缓存版本运行，部分功能可能受限
      </div>
    </q-banner>
  </div>
</template>

<script>
import { defineComponent, ref, onMounted, onUnmounted } from 'vue';
import { useQuasar } from 'quasar';

export default defineComponent({
  name: 'PWAInstaller',

  setup() {
    const $q = useQuasar();

    // Refs
    const showInstallPrompt = ref(false);
    const showUpdateDialog = ref(false);
    const isOffline = ref(false);
    const deferredPrompt = ref(null);
    const swRegistration = ref(null);

    // Check if app is already installed
    const isInstalled = () => {
      return window.matchMedia('(display-mode: standalone)').matches ||
             window.navigator.standalone === true;
    };

    // Show install prompt
    const showInstallPromptDialog = (prompt) => {
      if (!isInstalled() && !localStorage.getItem('pwa-install-dismissed')) {
        deferredPrompt.value = prompt;
        showInstallPrompt.value = true;
      }
    };

    // Dismiss install prompt
    const dismissInstallPrompt = () => {
      localStorage.setItem('pwa-install-dismissed', 'true');
      deferredPrompt.value = null;
    };

    // Install PWA
    const installPWA = async () => {
      if (!deferredPrompt.value) return;

      try {
        const result = await deferredPrompt.value.prompt();

        if (result.outcome === 'accepted') {
          $q.notify({
            type: 'positive',
            message: '应用安装成功！',
            icon: 'check_circle',
            position: 'top'
          });
        }

        deferredPrompt.value = null;
      } catch (error) {
        console.error('PWA installation failed:', error);
        $q.notify({
          type: 'negative',
          message: '应用安装失败，请重试',
          icon: 'error',
          position: 'top'
        });
      }
    };

    // Show update dialog
    const showUpdateAvailableDialog = (registration) => {
      swRegistration.value = registration;
      showUpdateDialog.value = true;
    };

    // Dismiss update
    const dismissUpdate = () => {
      // Will update on next page load
      swRegistration.value = null;
    };

    // Apply update
    const applyUpdate = () => {
      if (swRegistration.value && swRegistration.value.waiting) {
        swRegistration.value.waiting.postMessage({ type: 'SKIP_WAITING' });
        window.location.reload();
      }
    };

    // Check online/offline status
    const updateOnlineStatus = () => {
      isOffline.value = !navigator.onLine;

      if (isOffline.value) {
        $q.notify({
          type: 'warning',
          message: '应用已切换到离线模式',
          icon: 'wifi_off',
          position: 'bottom',
          timeout: 3000
        });
      } else {
        $q.notify({
          type: 'positive',
          message: '网络连接已恢复',
          icon: 'wifi',
          position: 'bottom',
          timeout: 2000
        });
      }
    };

    onMounted(() => {
      // Check initial online status
      isOffline.value = !navigator.onLine;

      // Listen for online/offline events
      window.addEventListener('online', updateOnlineStatus);
      window.addEventListener('offline', updateOnlineStatus);

      // Listen for PWA install prompt
      window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        showInstallPromptDialog(e);
      });

      // Listen for app installed event
      window.addEventListener('appinstalled', () => {
        $q.notify({
          type: 'positive',
          message: 'img2pic 已成功安装到您的设备！',
          icon: 'celebration',
          position: 'top',
          timeout: 4000
        });
        showInstallPrompt.value = false;
        deferredPrompt.value = null;
      });

      // Listen for service worker updates
      window.addEventListener('sw-update-available', (e) => {
        showUpdateAvailableDialog(e.detail);
      });
    });

    onUnmounted(() => {
      window.removeEventListener('online', updateOnlineStatus);
      window.removeEventListener('offline', updateOnlineStatus);
    });

    return {
      showInstallPrompt,
      showUpdateDialog,
      isOffline,
      dismissInstallPrompt,
      installPWA,
      dismissUpdate,
      applyUpdate
    };
  }
});
</script>

<style scoped>
.q-banner {
  margin-bottom: 8px;
}
</style>