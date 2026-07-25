<script setup lang="ts">
import { ref } from 'vue'
import { useDocumentStore } from '@/stores/documentStore'
import RenameDocumentModal from '@/components/RenameDocumentModal.vue'
import Label from './Label.vue'
import { downloadMlaDocumentExport, exportMlaDocumentAsPdf } from '@/utils/exportMlaDocument'

defineOptions({ name: 'AppNavbar' })

const documentStore = useDocumentStore()

// Rename Modal state

const isRenameModalOpen = ref(false)

function openRenameModal() {
  if (!documentStore.activeDocument) return

  isRenameModalOpen.value = true
}

function saveTitle(title: string, icon: string) {
  if (!documentStore.activeDocument) return

  documentStore.activeDocument.fileTitle = title
  documentStore.activeDocument.fileIcon = icon || 'mdi-file-document-outline' // Default icon if not set
  isRenameModalOpen.value = false
}

function closeRenameModal() {
  isRenameModalOpen.value = false
}

function exportDocument() {
  if (!documentStore.activeDocument) return

  downloadMlaDocumentExport(documentStore.activeDocument)
}

function exportDocumentAsPdf() {
  if (!documentStore.activeDocument) return

  exportMlaDocumentAsPdf(documentStore.activeDocument)
}
</script>

<template>
  <header class="navbar w-full border-b border-base-300 bg-base-100 px-4 shadow-sm">
    <div class="navbar-start">
        <div class="text-lg font-semibold pr-4">MLA Text Editor</div>
        <button v-if="documentStore.activeDocument" class="btn btn-sm btn-ghost" :disabled="!documentStore.activeDocument" @click="openRenameModal" title="Rename Document">
          <Label :text="documentStore.activeDocument.fileTitle || 'Untitled Document'" :icon="documentStore.activeDocument.fileIcon || 'mdi-file-document-outline'" />
          <iconify-icon icon="mdi-pencil" />
        </button>
        <!-- Document Saving Information-->
        <div v-if="documentStore.activeDocument" class="text-sm text-muted-foreground">
          <div v-if="documentStore.saveState === 'saved'">
            <Label :text="'Saved'" :icon="'mdi-check-circle-outline'" />
          </div>
          <div v-else-if="documentStore.saveState === 'error'">
            <Label :text="'Error saving changes'" :icon="'mdi-alert-circle-outline'" />
          </div>
          <div v-else>
            <Label :text="'Saving...'" :icon="'mdi-progress-clock'" />
          </div>

        </div>
    </div>

    <div v-if="documentStore.activeDocument" class="navbar-end gap-2">
      <button class="btn btn-sm btn-outline btn-primary" @click="exportDocument" title="Export MLA as HTML">
        <iconify-icon icon="mdi-download" />
        HTML
      </button>
      <button class="btn btn-sm btn-primary" @click="exportDocumentAsPdf" title="Export MLA as PDF">
        <iconify-icon icon="mdi-file-pdf-box" />
        PDF
      </button>
    </div>
  </header>

  <RenameDocumentModal
    v-if="isRenameModalOpen"
    :initial-title="documentStore.activeDocument?.fileTitle || ''"
    :initial-icon="documentStore.activeDocument?.fileIcon || 'mdi-file-document-outline'"
    @save="saveTitle"
    @close="closeRenameModal"
  />
</template>

<style scoped>
</style>
