import { ref, computed, watch } from 'vue'
import { defineStore } from 'pinia'
import { DocumentType, SaveState } from '@/types/types'
import type { DocumentItem, ContentBlock } from '@/types/types'

export const useDocumentStore = defineStore('document', () => {
  const documents = ref<Record<string, DocumentItem>>({})
  const activeDocumentId = ref<string | null>(null)
  const saveState = ref<SaveState>(SaveState.Idle)

  const activeDocument = computed(() => {
    if (!activeDocumentId.value) return null
    return documents.value[activeDocumentId.value]
  })

  function createNewDocument() {
    const id = crypto.randomUUID()
    documents.value[id] = {
      id,
      fileTitle: "",
      fileIcon: "",
      headerName: "",
      title: "",
      name: "",
      professor: "",
      course: "",
      dueDate: "",
      content: [] // Empty array matching your ContentBlock[] type
    }
    activeDocumentId.value = id
  }

  function moveContentBlock(fromIndex: number, toIndex: number) {
    if (!activeDocument.value) return

    const content = activeDocument.value.content
    if (fromIndex < 0 || fromIndex >= content.length || toIndex < 0 || toIndex >= content.length) {
      console.error("Invalid indices for moving content block.")
      return
    }

    const [movedBlock] = content.splice(fromIndex, 1)
    if (!movedBlock) return
    content.splice(toIndex, 0, movedBlock)
  }

  function deleteContentBlock(index: number) {
    if (!activeDocument.value) return

    const content = activeDocument.value.content
    if (index < 0 || index >= content.length) {
      console.error("Invalid index for deleting content block.")
      return
    }

    content.splice(index, 1)
  }

  function addContentBlock(type: DocumentType = DocumentType.body) {
    if (!activeDocument.value) return
    activeDocument.value.content.push({
      type,
      text: ""
    })
  }

  // Watch for changes to the active document to update visual save states
  watch(
    () => activeDocument.value,
    (newDoc) => {
      if (!newDoc) return

      saveState.value = SaveState.Saving

      // Fake a slight delay so the user actually sees a "Saving..." feedback cycle
      setTimeout(() => {
        saveState.value = SaveState.Saved
      }, 400)
    },
    { deep: true }
  )

  return {
    documents,
    activeDocumentId,
    activeDocument,
    saveState,
    createNewDocument,
    addContentBlock
  }
},
{
  persist: true // pinia-plugin-persistedstate auto-saves everything safely
})
