<template>
  <section class="w-full rounded-2xl border border-base-300 bg-base-100 p-6 shadow-sm">
    <header class="mb-4 flex items-center justify-between gap-4">
      <div class="flex items-center gap-2">
        <iconify-icon v-if="icon" :icon="icon" class="text-xl" />
        <h2 class="text-lg font-semibold text-base-content">{{ title }}</h2>
      </div>
      <span v-if="badge" class="badge badge-outline shrink-0">{{ badge }}</span>
    </header>

    <div class="prose max-w-none">
      <slot />
    </div>
  </section>
</template>

<script setup lang="ts">

defineProps({
  icon: {
    type: String,
    required: false
  },
  title: {
    type: String,
    required: true
  },
  badge: {
    type: String,
    required: false
  }
});
</script>