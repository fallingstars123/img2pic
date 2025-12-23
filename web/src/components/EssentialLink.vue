<template>
  <q-item clickable tag="a" target="_blank" :href="link">
    <q-item-section v-if="icon" avatar>
      <q-icon :name="icon" />
    </q-item-section>

    <q-item-section>
      <q-item-label class="nav-title">{{ title }}</q-item-label>
      <q-item-label caption class="nav-caption">{{ caption }}</q-item-label>
    </q-item-section>
  </q-item>
</template>

<script setup lang="ts">
export interface EssentialLinkProps {
  title: string;
  caption?: string;
  link?: string;
  icon?: string;
}

withDefaults(defineProps<EssentialLinkProps>(), {
  caption: '',
  link: '#',
  icon: '',
});
</script>

<style scoped>
/* EssentialLink 深色模式适配 */
.nav-title {
  color: var(--text-primary);
}

.nav-caption {
  color: var(--text-secondary);
}

:deep(.q-icon) {
  color: var(--text-primary);
}

/* 深色模式 */
.body--dark .nav-title {
  color: var(--text-primary) !important;
}

.body--dark .nav-caption {
  color: var(--text-secondary) !important;
  opacity: 0.8;
}

.body--dark :deep(.q-icon) {
  color: var(--text-primary);
}
</style>
