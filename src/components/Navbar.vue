<script setup lang="ts">
import { ref } from 'vue'
import { useDocumentStore } from '@/stores/documentStore'
import RenameDocumentModal from '@/components/RenameDocumentModal.vue'
import StatusLabel from '@/components/Label.vue'
import type { DropdownMenuItem } from '@nuxt/ui'
import { exportMlaDocumentAsPdf } from '@/utils/exportMlaDocument'

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

const documentNameOptions = ref<DropdownMenuItem[][]>([
  [
    {
      label: 'Rename Document',
      icon: 'mdi-pencil',
      onSelect: openRenameModal
    },
    {
      label: 'Delete Document',
      icon: 'mdi-delete',
      onSelect: () => {
        if (documentStore.activeDocument) {
          documentStore.deleteDocument(documentStore.activeDocument.id)
        }
      }
    }
  ]
])

function exportDocumentAsPdf() {
  if (!documentStore.activeDocument) return

  exportMlaDocumentAsPdf(documentStore.activeDocument)
}

</script>

<template>
  <UHeader title="MLA Text Editor" toggle-side="right">
    <template #toggle>
      <UDashboardSidebarToggle
        class="lg:hidden"
        side="right"
        aria-label="Open sidebar"
        title="Open sidebar"
        icon="lucide:panel-right-open"
      />
    </template>
    <template #title>
      <span>MLA Text Editor</span>
      <UTooltip text="Edit Document Details" :content="{ side: 'bottom' }" arrow>
        <span class="ml-4 inline-flex">
          <UDropdownMenu :items="documentNameOptions">
          <UButton variant="ghost" size="sm" color="neutral">
            <iconify-icon :icon="documentStore.activeDocument?.fileIcon || 'mdi-file-document-outline'" />
            <span class="ml-2">{{ documentStore.activeDocument?.fileTitle || 'Untitled Document' }}</span>
            <iconify-icon icon="mdi-chevron-down" class="ml-1" />
          </UButton>
          </UDropdownMenu>
        </span>
      </UTooltip>
      <div v-if="documentStore.activeDocument" class="flex items-center">
         <div v-if="documentStore.saveState === 'saved'">
          <UTooltip :text="'All changes saved'" :content="{ side: 'bottom' }" arrow>
            <StatusLabel :text="'Saved'" :icon="'mdi-check-circle-outline'" />
          </UTooltip>
          </div>
          <div v-else-if="documentStore.saveState === 'error'">
            <UTooltip :text="'Error saving changes'" :content="{ side: 'bottom' }" arrow>
              <StatusLabel :text="'Error saving changes'" :icon="'mdi-alert-circle-outline'" tone="error" />
            </UTooltip>
          </div>
          <div v-else>
            <UTooltip :text="'Saving changes...'" :content="{ side: 'bottom' }" arrow>
              <StatusLabel :text="'Saving...'" :icon="'mdi-progress-clock'" tone="info" />
            </UTooltip>
          </div>
      </div>

    </template>
    <template #right>
      <!-- <button class="btn btn-sm btn-outline btn-primary" @click="exportDocument" title="Export MLA as HTML">
        <iconify-icon icon="mdi-download" />
        HTML
      </button> -->
      <UButton icon="mdi-file-pdf-box" label="Export to PDF" @click="exportDocumentAsPdf" title="Export MLA as PDF" />
    </template>
  </UHeader>
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
