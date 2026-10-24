<template>
      <h3 class="font-bold text-lg">{{ props.title }}</h3>
      <p v-if="props.description" class="py-2 text-sm text-base-content/70">
        {{ props.description }}
      </p>
      <div :class="props.description ? 'mt-4' : ''">
        <slot />
      </div>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount } from 'vue'

const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: false,
  },
})

const emits = defineEmits<{
  (event: 'close'): void
}>();

function handleClose() {
  emits('close');
}

function handleKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') {
    handleClose();
  }
}

function handleBackdropClick(event: MouseEvent) {
  if ((event.target as HTMLElement).classList.contains('modal')) {
    handleClose();
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeydown)
})
</script>
