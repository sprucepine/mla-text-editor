<template>
  <div class="modal modal-open" @click="handleBackdropClick">
    <div class="modal-box" @click.stop>
      <h3 class="font-bold text-lg">{{ props.title }}</h3>
      <button class="btn btn-lg btn-circle btn-ghost absolute right-2 top-2" type="button" @click="handleClose">✕</button>
      <p class="py-2 text-sm text-base-content/70">
        {{ props.description }}
      </p>
      <div class="mt-4">
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount } from 'vue'

const props = defineProps<{
  title: string;
  description: string;
}>();

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
