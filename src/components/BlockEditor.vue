<template>
  <div class="block-editor-container">
    <editor-content :editor="editor" />
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, watch } from 'vue'
import { useEditor, EditorContent, VueRenderer } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Mention from '@tiptap/extension-mention'
import type { SuggestionProps } from '@tiptap/suggestion'
import tippy from 'tippy.js'
import type { Instance } from 'tippy.js'
import type { ContentBlock } from '@/types/types'
import MenuList from './MenuList.vue'
import CitationMenu from './CitationMenu.vue'

// Contract for what MenuList exposes via defineExpose
interface MenuListInstance {
  onKeyDown: (props: { event: KeyboardEvent }) => boolean
}

// Menu item structure matching MenuList
interface MenuItem {
  label: string;
  id: string;
}

const props = defineProps<{
  modelValue: ContentBlock
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: ContentBlock): void
}>()

let citationComponent: (VueRenderer & { ref: unknown }) | null = null
let citationPopup: Instance | null = null

function destroyCitationMenu() {
  citationPopup?.destroy()
  citationPopup = null
  citationComponent?.destroy()
  citationComponent = null
}

function openCitationMenuAtElement(anchor: Element) {
  destroyCitationMenu()

  const currentEditor = editor.value
  if (!currentEditor) return

  citationComponent = new VueRenderer(CitationMenu, {
    editor: currentEditor,
  }) as VueRenderer & { ref: unknown }

  const menuElement = citationComponent.element
  if (!menuElement) return

  citationPopup = tippy(anchor, {
    content: menuElement,
    appendTo: () => document.body,
    showOnCreate: true,
    interactive: true,
    trigger: 'manual',
    placement: 'bottom-start',
    theme: 'citation-menu',
    zIndex: 9999,
    hideOnClick: true,
  })
}

function openCitationMenuFromSelection() {
  const currentEditor = editor.value
  if (!currentEditor) return

  const { $from } = currentEditor.state.selection
  const node = $from.nodeBefore
  if (!node) return

  const nodePos = $from.pos - node.nodeSize
  const dom = currentEditor.view.nodeDOM(nodePos)
  if (dom instanceof Element) {
    openCitationMenuAtElement(dom)
  }
}

const editor = useEditor({
  content: {
    type: 'doc',
    content: props.modelValue.content
  },
  extensions: [
    StarterKit,
    Mention.configure({
      HTMLAttributes: {
        class: 'citation-pill',
      },
      // Configure the suggestion behavior
      suggestion: {
        char: '/',
        items: ({ query }: { query: string }): MenuItem[] => {
          return [
            { label: 'Inline Citation', id: 'citation' }
          ].filter(item => item.label.toLowerCase().startsWith(query.toLowerCase()))
        },
        render: () => {
          let component: (VueRenderer & { ref: MenuListInstance | null }) | null = null
          let popup: Instance | null = null

          return {
            onStart: (suggestionProps: SuggestionProps<MenuItem>) => {
              component = new VueRenderer(MenuList, {
                props: {
                  ...suggestionProps,
                  onCommand: () => {
                    requestAnimationFrame(() => openCitationMenuFromSelection())
                  },
                },
                editor: suggestionProps.editor,
              }) as VueRenderer & { ref: MenuListInstance | null }

              const clientRect = suggestionProps.clientRect
              const element = component.element
              const bodyElement = document.body

              if (!element || !bodyElement) return

              const referenceClientRect = () => clientRect?.() ?? new DOMRect(0, 0, 0, 0)

              popup = tippy(bodyElement, {
                getReferenceClientRect: referenceClientRect,
                appendTo: () => bodyElement,
                content: element,
                showOnCreate: true,
                interactive: true,
                trigger: 'manual',
                placement: 'bottom-start',
                theme: 'slash-menu',
                zIndex: 9999,
              })
            },
            onUpdate(suggestionProps: SuggestionProps<MenuItem>) {
              component?.updateProps({
                ...suggestionProps,
                onCommand: () => {
                  requestAnimationFrame(() => openCitationMenuFromSelection())
                },
              })

              const clientRect = suggestionProps.clientRect
              popup?.setProps({
                getReferenceClientRect: () => clientRect?.() ?? new DOMRect(0, 0, 0, 0),
              })
            },
            onKeyDown(suggestionProps: { event: KeyboardEvent }) {
              if (suggestionProps.event.key === 'Escape') {
                popup?.hide()
                return true
              }
              return component?.ref?.onKeyDown(suggestionProps) ?? false
            },
            onExit() {
              popup?.destroy()
              component?.destroy()
            },
          }
        },
      },
    }),
  ],
  editorProps: {
    handleClick: (_view, _pos, event) => {
      const target = event.target as Element | null
      const pill = target?.closest?.('.citation-pill')

      if (pill instanceof Element) {
        openCitationMenuAtElement(pill)
        return true
      }

      return false
    },
  },
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

:global(.tippy-box[data-theme~='slash-menu']) {
  background: transparent;
  box-shadow: none;
}

:global(.tippy-box[data-theme~='slash-menu'] > .tippy-content) {
  padding: 0;
}

:global(.tippy-box[data-theme~='citation-menu']) {
  background: transparent;
  box-shadow: none;
}

:global(.tippy-box[data-theme~='citation-menu'] > .tippy-content) {
  padding: 0;
}
</style>
