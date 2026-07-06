<script setup lang="ts">
defineProps({
  text: {
    type: String,
    required: true
  },
  icon: {
    type: String,
    default: ''
  }
})
</script>

<template>
  <span class="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs text-base-content">
    <iconify-icon v-if="icon" :icon="icon" class="text-sm" />
    <span>{{ text }}</span>
  </span>
</template>
