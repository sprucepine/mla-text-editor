<template>
  <div class="block-editor-container">
    <editor-content :editor="editor" />
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, watch } from 'vue'
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import type { ContentBlock } from '@/types/types'

const props = defineProps<{
  modelValue: ContentBlock
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: ContentBlock): void
}>()

const editor = useEditor({
  content: {
    type: 'doc',
    content: props.modelValue.content
  },
  extensions: [StarterKit],
  onUpdate: ({ editor: currentEditor }) => {
    const json = currentEditor.getJSON()
    emit('update:modelValue', {
      ...props.modelValue,
      text: currentEditor.getText(),
      content: json.content || []
    })
  },
})

watch(
  () => props.modelValue.content,
  (newContent) => {
    if (!editor.value) return
    const currentContent = editor.value.getJSON().content || []
    if (JSON.stringify(currentContent) !== JSON.stringify(newContent)) {
      editor.value.commands.setContent({
        type: 'doc',
        content: newContent
      })
    }
  },
  { deep: true }
)

onBeforeUnmount(() => {
  editor.value?.destroy()
})
</script>

<style scoped>
.block-editor-container {
  width: 100%;
  border: 1px solid rgba(148, 163, 184, 0.45);
  border-radius: 1rem;
  background: #ffffff;
  box-shadow: 0 1px 2px rgba(15, 23, 42, 0.04);
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
  overflow: hidden;
}

.block-editor-container:focus-within {
  border-color: rgba(59, 130, 246, 0.55);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.12);
}
:deep(.tiptap) {
  min-height: 100px;
  border: none;
  padding: 0.9rem 1rem;
  background-color: transparent;
}
:deep(.tiptap:focus) {
  outline: none;
}
:deep(.citation-pill) {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  background-color: #e2e8f0;
  color: #0f172a;
  padding: 0.15rem 0.5rem;
  border-radius: 9999px;
  font-weight: 600;
  cursor: pointer;
}
</style>
