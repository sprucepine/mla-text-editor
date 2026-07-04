<template>
    <div class="rounded-2xl border border-base-300 bg-base-100 p-6 shadow-sm">
        <div class="flex items-center gap-2">
          <iconify-icon v-if="icon" :icon="icon" class="text-xl" />
          <h2 class="text-lg font-semibold text-base-content">{{ title }}</h2>
        </div>
        <div>
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
  icon: {
    type: String,
    required: false
  }
});
</script>