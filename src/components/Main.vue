<script setup lang="ts">
import { useDocumentStore } from '@/stores/documentStore'
import { onMounted } from 'vue'
import type { DropdownMenuItem } from '@nuxt/ui'
import BlockEditor from '@/components/BlockEditor.vue' // Imported your separate editor
import Footer from '@/components/Footer.vue' // Import Footer component

const documentStore = useDocumentStore()

function getContentBlockMenuItems(index: number): DropdownMenuItem[][] {
  const items: DropdownMenuItem[] = [
    {
      label: 'Delete Paragraph',
      icon: 'mdi-delete',
      onSelect: () => documentStore.deleteContentBlock(index),
    },
  ]

  if (index > 0) {
    items.push({
      label: 'Move Up',
      icon: 'mdi-arrow-up',
      onSelect: () => documentStore.moveContentBlock(index, index - 1),
    })
  }

  if (documentStore.activeDocument && index < documentStore.activeDocument.content.length - 1) {
    items.push({
      label: 'Move Down',
      icon: 'mdi-arrow-down',
      onSelect: () => documentStore.moveContentBlock(index, index + 1),
    })
  }

  return [items]
}

// On load, make sure there is an active document to type into
onMounted(() => {
  if (!documentStore.activeDocumentId || !documentStore.activeDocument) {
    documentStore.createNewDocument()
  }

  if (documentStore.activeDocument && documentStore.activeDocument.content.length === 0) {
    documentStore.addContentBlock()
  }
})
</script>

<template>
  <main class="flex-1">
    <section class="w-full px-4 sm:px-6">
      <section class="mx-auto flex w-full max-w-5xl flex-col gap-6">
        <div>
          <h1 class="text-3xl font-semibold tracking-tight">
            {{ documentStore.activeDocument?.fileTitle || 'Untitled Document' }}
          </h1>
        </div>
        <template v-if="documentStore.activeDocument">
          <UCard v-if="documentStore.activeDocument" title="Header Information">
            <div class="flex flex-col gap-6 md:flex-row md:items-start">
              <div class="min-w-0 flex-1">
                <p class="pb-4">
                  The header in MLA format is displayed at the top right of your paper. It should
                  include your last name and an auto-generated page number.
                </p>
                <label class="floating-label md:pt-1">
                  <span class="label-text">Header Name</span>
                  <UInput
                    v-model="documentStore.activeDocument.headerName"
                    type="text"
                    placeholder="Header Name"
                    class="w-full"
                  />
                </label>
              </div>
              <figure class="flex shrink-0 flex-col items-center gap-2 md:items-end">
                <div class="overflow-hidden rounded-md border border-default bg-muted shadow-sm">
                  <img
                    src="@/assets/header_preview.png"
                    alt="Example of an MLA page header"
                    class="block h-auto w-48 max-w-full"
                  />
                </div>
                <figcaption class="text-xs text-muted">Header preview</figcaption>
              </figure>
            </div>
          </UCard>

          <UCard v-if="documentStore.activeDocument" title="Heading Information">
            <p class="pb-4">
              The heading in MLA format is displayed on the first page of your paper.
            </p>
            <div class="flex flex-col gap-6 md:flex-row md:items-start">
              <div class="min-w-0 flex-1">
                <label class="floating-label">
                  <span class="label-text">Document Title</span>
                  <UInput
                    v-model="documentStore.activeDocument.title"
                    type="text"
                    placeholder="Document Title"
                    class="mb-4 w-full"
                  />
                </label>
                <label class="floating-label">
                  <span class="label-text">Your Name</span>
                  <UInput
                    v-model="documentStore.activeDocument.name"
                    type="text"
                    placeholder="Your Name"
                    class="mb-4 w-full"
                  />
                </label>
                <label class="floating-label">
                  <span class="label-text">Professor's Name</span>
                  <UInput
                    v-model="documentStore.activeDocument.professor"
                    type="text"
                    placeholder="Professor's Name"
                    class="mb-4 w-full"
                  />
                </label>
                <label class="floating-label">
                  <span class="label-text">Course Name</span>
                  <UInput
                    v-model="documentStore.activeDocument.course"
                    type="text"
                    placeholder="Course Name"
                    class="mb-4 w-full"
                  />
                </label>
                <label class="floating-label">
                  <span class="label-text">Due Date</span>
                  <UInput
                    v-model="documentStore.activeDocument.dueDate"
                    type="date"
                    placeholder="Due Date"
                    class="mb-4 w-full"
                  />
                </label>
              </div>
              <figure class="flex shrink-0 flex-col items-center gap-2 md:items-end">
                <div class="overflow-hidden rounded-md border border-default bg-muted shadow-sm">
                  <img
                    src="@/assets/heading_preview.png"
                    alt="Example of an MLA heading"
                    class="block h-auto w-48 max-w-full"
                  />
                </div>
                <figcaption class="text-xs text-muted">Heading preview</figcaption>
              </figure>
            </div>
          </UCard>
          <UCard
            v-for="(block, index) in documentStore.activeDocument.content"
            :key="index"
            :title="'Paragraph'"
            :icon="'boxicons:paragraph'"
          >
            <template #header>
              <div class="flex items-center gap-2">
                <iconify-icon icon="boxicons:paragraph" class="text-xl" />
                <h6 class="text-lg font-semibold text-base-content">Paragraph {{ index + 1 }}</h6>
                <UDropdownMenu :items="getContentBlockMenuItems(index)">
                  <UButton variant="ghost" color="neutral" class="ml-auto" aria-label="Paragraph actions">
                    <iconify-icon icon="mdi:dots-vertical" class="text-lg" />
                  </UButton>
                </UDropdownMenu>
              </div>
            </template>
            <template #default>
              <BlockEditor v-model="documentStore.activeDocument.content[index]!" />
            </template>
            <template #footer>
              <UButton
                class="btn btn-sm btn-ghost mt-2"
                @click="documentStore.deleteContentBlock(index)"
                title="Delete Paragraph"
                variant="ghost"
              >
                <iconify-icon icon="mdi-delete" />
                Delete
              </UButton>
              <UButton
                v-if="index > 0"
                class="btn btn-sm btn-ghost mt-2 ml-2"
                @click="documentStore.moveContentBlock(index, index - 1)"
                title="Move Up"
                variant="ghost"
              >
                <iconify-icon icon="mdi-arrow-up" />
                Move Up
              </UButton>
              <UButton
                v-if="index < documentStore.activeDocument.content.length - 1"
                class="btn btn-sm btn-ghost mt-2 ml-2"
                @click="documentStore.moveContentBlock(index, index + 1)"
                title="Move Down"
                variant="ghost"
              >
                <iconify-icon icon="mdi-arrow-down" />
                Move Down
              </UButton>
            </template>
          </UCard>
        </template>
      </section>
    </section>
  </main>
  <Footer />
</template>
