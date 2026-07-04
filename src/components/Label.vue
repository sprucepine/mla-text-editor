<script setup>
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
  <span class="inline-flex items-center gap-1.5 rounded-md bg-base-200 px-2 py-1 text-xs font-medium text-base-content ring-1 ring-inset ring-base-300">
    <iconify-icon v-if="icon" :icon="icon" class="text-sm" />
    <span>{{ text }}</span>
  </span>
</template>