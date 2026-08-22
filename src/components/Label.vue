<script setup lang="ts">
defineOptions({ name: 'StatusLabel' })

const props = withDefaults(
  defineProps<{
    text: string
    icon?: string
    tone?: 'success' | 'error' | 'info'
  }>(),
  {
    icon: '',
    tone: 'info'
  }
)

const toneClasses: Record<string, string> = {
  success: 'border-emerald-500/25 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300',
  error: 'border-red-500/25 bg-red-500/10 text-red-700 dark:text-red-300',
  info: 'border-sky-500/25 bg-sky-500/10 text-sky-700 dark:text-sky-300'
}
</script>

<template>
  <span
    :class="[
      'inline-flex w-fit items-center gap-1.5 rounded-full border px-2 py-1 text-[11px] font-medium leading-none tracking-wide',
      toneClasses[props.tone]
    ]"
  >
    <iconify-icon v-if="icon" :icon="icon" class="text-sm" />
    <span>{{ text }}</span>
  </span>
</template>
