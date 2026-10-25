<template>
  <UPageCard class="w-full h-full bg-base-100">
    <div class="flex items-center gap-2">
      <iconify-icon v-if="icon" :icon="icon" class="text-xl" />
      <h2 class="text-lg font-semibold text-base-content">{{ title }}</h2>
      <span v-if="badge" class="badge badge-outline shrink-0">{{ badge }}</span>
    </div>
    <div>
      <slot />
    </div>
  </UPageCard>
</template>

<script setup lang="ts">
defineProps({
  title: {
    type: String,
    required: true,
  },
  icon: {
    type: String,
    required: false,
  },
  badge: {
    type: String,
    required: false,
  },
})
</script>
