<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn flat dense round icon="menu" aria-label="Menu" @click="toggleLeftDrawer" />

        <q-toolbar-title> Img2Pic - {{ t('app.title') }} </q-toolbar-title>

        <q-select
          v-model="locale"
          :options="languageOptions"
          option-value="value"
          option-label="label"
          emit-value
          map-options
          dense
          outlined
          style="min-width: 140px; margin-right: 16px"
          class="language-select"
        >
          <template v-slot:prepend>
            <q-icon name="translate" size="sm" />
          </template>
          <template v-slot:option="scope">
            <q-item v-bind="scope.itemProps">
              <q-item-section>
                <q-item-label class="dropdown-option-text">{{ scope.opt.label }}</q-item-label>
              </q-item-section>
            </q-item>
          </template>
          <template v-slot:selected-item="scope">
            <span class="selected-text">{{ scope.opt.label }}</span>
          </template>
        </q-select>

        <q-select
          v-model="theme"
          :options="themeOptions"
          option-value="value"
          option-label="label"
          emit-value
          map-options
          dense
          outlined
          style="min-width: 140px; margin-right: 16px"
          class="theme-select"
        >
          <template v-slot:prepend>
            <q-icon :name="themeIcon" size="sm" />
          </template>
          <template v-slot:option="scope">
            <q-item v-bind="scope.itemProps">
              <q-item-section>
                <q-item-label class="dropdown-option-text">{{ scope.opt.label }}</q-item-label>
              </q-item-section>
            </q-item>
          </template>
          <template v-slot:selected-item="scope">
            <span class="selected-text">{{ scope.opt.label }}</span>
          </template>
        </q-select>

        <div>Quasar v{{ $q.version }}</div>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
      <q-list>
        <q-item-label header> {{ t('nav.menu') }} </q-item-label>

        <EssentialLink v-for="link in linksList" :key="link.title" v-bind="link" />
      </q-list>
    </q-drawer>

    <q-page-container>
      <PWAInstaller />
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue';
import { useI18n } from 'vue-i18n';
import EssentialLink, { type EssentialLinkProps } from 'components/EssentialLink.vue';
import PWAInstaller from 'components/PWAInstaller.vue';
import { storageService } from 'src/utils/storage';

const { locale, t } = useI18n();

// Load saved language on component mount
const savedLanguage = storageService.loadLanguage();
if (savedLanguage) {
  locale.value = savedLanguage;
}

// Watch for language changes and save to localStorage
watch(locale, (newLocale) => {
  storageService.saveLanguage(newLocale);
});

// 语言选项
const languageOptions = [
  { value: 'zh-CN', label: '简体中文' },
  { value: 'zh-TW', label: '繁體中文' },
  { value: 'zh-classical', label: '文言文' },
  { value: 'ja', label: '日本語' },
  { value: 'ja-h', label: '日本語漢字' },
  { value: 'en', label: 'English' },
  { value: 'es', label: 'Español' },
  { value: 'de', label: 'Deutsch' },
  { value: 'it', label: 'Italiano' },
  { value: 'pt', label: 'Português' },
  { value: 'fr', label: 'Français' },
  { value: 'ru', label: 'Русский' },
  { value: 'ko', label: '한국어' },
  { value: 'ar', label: 'العربية' },
  { value: 'hi', label: 'हिन्दी' },
];

// Theme management
type ThemeMode = 'light' | 'dark' | 'auto';

const theme = ref<ThemeMode>('auto');

// Load saved theme on component mount
const savedTheme = storageService.loadTheme();
if (savedTheme) {
  theme.value = savedTheme;
}

// Theme options
const themeOptions = computed(() => [
  { value: 'light', label: t('theme.light') },
  { value: 'dark', label: t('theme.dark') },
  { value: 'auto', label: t('theme.auto') },
]);

// Theme icon based on current theme
const themeIcon = computed(() => {
  const isDark = theme.value === 'dark' || (theme.value === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches);
  return isDark ? 'dark_mode' : 'light_mode';
});

// Apply theme to body
const applyTheme = () => {
  const body = document.body;
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  if (theme.value === 'dark' || (theme.value === 'auto' && prefersDark)) {
    body.classList.add('body--dark');
  } else {
    body.classList.remove('body--dark');
  }
};

// Watch for theme changes and save to localStorage
watch(theme, (newTheme) => {
  storageService.saveTheme(newTheme);
  applyTheme();
});

// Handle system theme change
const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
const handleSystemThemeChange = () => {
  if (theme.value === 'auto') {
    applyTheme();
  }
};

onMounted(() => {
  applyTheme();
  mediaQuery.addEventListener('change', handleSystemThemeChange);
});

onUnmounted(() => {
  mediaQuery.removeEventListener('change', handleSystemThemeChange);
});

const linksList = computed<EssentialLinkProps[]>(() => [
  {
    title: t('nav.home'),
    caption: t('nav.homeCaption'),
    icon: 'home',
    link: '/',
  },
  {
    title: t('nav.pixelArt'),
    caption: t('nav.pixelArtCaption'),
    icon: 'brush',
    link: '/pixel-art',
  },
  {
    title: t('nav.toolbox'),
    caption: t('nav.toolboxCaption'),
    icon: 'build',
    link: 'https://tools.sirrus.cc',
  },
  {
    title: t('nav.novelAssistant'),
    caption: t('nav.novelAssistantCaption'),
    icon: 'auto_stories',
    link: 'https://anh.sirrus.cc',
  },
  {
    title: t('nav.checklist'),
    caption: t('nav.checklistCaption'),
    icon: 'checklist',
    link: 'https://guides.sirrus.cc',
  },
  {
    title: t('nav.blog'),
    caption: t('nav.blogCaption'),
    icon: 'article',
    link: 'https://blog.sirrus.cc',
  },
  {
    title: t('nav.github'),
    caption: 'github.com/AndreaFrederica',
    icon: 'code',
    link: 'https://github.com/AndreaFrederica/img2pic',
  },
]);

const leftDrawerOpen = ref(false);

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}
</script>

<style scoped>
.language-select :deep(.q-field__control),
.language-select :deep(.q-field__control:before) {
  border-color: rgba(255, 255, 255, 0.3);
  color: white;
}

.language-select :deep(.q-field__native) {
  color: white;
}

.language-select :deep(.q-field__append),
.language-select :deep(.q-field__prepend) {
  color: white;
}

.language-select :deep(.q-field__focusable) {
  color: white;
}

/* 下拉菜单样式 */
.language-select :deep(.q-menu .q-item) {
  color: var(--text-primary);
}

.language-select :deep(.q-menu .q-item:hover) {
  background-color: rgba(0, 0, 0, 0.05);
}

.body--dark .language-select :deep(.q-menu .q-item:hover) {
  background-color: rgba(255, 255, 255, 0.1);
}

.language-select :deep(.q-menu) {
  background-color: var(--card-bg);
}

.theme-select :deep(.q-field__control),
.theme-select :deep(.q-field__control:before) {
  border-color: rgba(255, 255, 255, 0.3);
  color: white;
}

.theme-select :deep(.q-field__native) {
  color: white;
}

.theme-select :deep(.q-field__append),
.theme-select :deep(.q-field__prepend) {
  color: white;
}

.theme-select :deep(.q-field__focusable) {
  color: white;
}

/* 下拉菜单样式 */
.theme-select :deep(.q-menu .q-item) {
  color: var(--text-primary);
}

.theme-select :deep(.q-menu .q-item:hover) {
  background-color: rgba(0, 0, 0, 0.05);
}

.body--dark .theme-select :deep(.q-menu .q-item:hover) {
  background-color: rgba(255, 255, 255, 0.1);
}

.theme-select :deep(.q-menu) {
  background-color: var(--card-bg);
}

/* 下拉选项文字颜色 */
.dropdown-option-text {
  color: var(--text-primary);
}

/* 选中项文字颜色 - 在header中始终为白色 */
.selected-text {
  color: white;
}

/* 导航菜单深色模式适配 */
.body--dark .q-drawer {
  background: var(--bg-secondary);
}

.body--dark .q-item {
  color: var(--text-primary);
}

.body--dark .q-item:hover {
  background: var(--bg-tertiary);
}

.body--dark .q-item-label {
  color: var(--text-secondary);
}

/* q-select 下拉菜单在深色模式下的适配 */
.body--dark :deep(.q-menu) {
  background: var(--card-bg);
  border: 1px solid var(--border-color);
}

.body--dark :deep(.q-menu .q-item) {
  color: var(--text-primary);
}

.body--dark :deep(.q-menu .q-item:hover) {
  background: var(--bg-tertiary);
}

/* q-select 选项在深色模式下的适配 */
.body--dark :deep(.q-select__dropdown-option) {
  color: var(--text-primary);
}

/* 顶栏深色模式适配 */
.body--dark .q-header {
  background: var(--toolbar-bg);
  border-bottom: 1px solid var(--border-color);
  box-shadow: none !important;
}

.body--dark .q-header.q-header--elevated {
  box-shadow: none !important;
}

.body--dark .q-toolbar {
  background: transparent;
}

.body--dark .q-toolbar-title {
  color: var(--text-primary);
}

/* 顶栏右侧版本信息颜色 */
.body--dark .q-toolbar > div:last-child {
  color: var(--text-secondary);
}
</style>
