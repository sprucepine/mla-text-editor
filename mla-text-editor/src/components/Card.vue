<template>
    <div class="rounded-2xl border border-base-300 bg-base-100 p-6 shadow-sm">
        <div class="mb-4 flex items-center justify-between">
            <h2 class="text-lg font-semibold">{{ title }}</h2>
            <span class="badge badge-outline">{{ badge }}</span>
        </div>
        <div class="min-h-80 p-4">
            <slot />
        </div>
    </div>
</template>

<script setup lang="ts">
defineProps({
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