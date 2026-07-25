
<script setup lang="ts">
import GenerateInlineCitation from "@/components/GenerateInlineCitation.vue";
import { useDocumentStore } from "@/stores/documentStore";
import { DocumentType } from "@/types/types";
import { computed, ref } from 'vue';

const useDocumentStoreInstance = useDocumentStore();
const inlineCitationModal = ref(false);
const currentProjectLabel = computed(() => useDocumentStoreInstance.currentProjectLabel);

function openInlineCitationModal() {
  inlineCitationModal.value = true;
}

function closeInlineCitationModal() {
  inlineCitationModal.value = false;
}

function handleGenerateCitation() {
  closeInlineCitationModal();
}

const blocks = [
  { name: 'Paragraph Block', badge: '', icon: 'boxicons:paragraph', description: 'A block for writing paragraphs of text.' },
  // { name: 'Image Block', badge: '', icon: 'boxicons:image', description: 'A block for inserting images.' },
  // { name: 'Heading Block', badge: '', icon: 'codex:h1', description: 'A block for creating headings.' },
  // { name: 'Table Block', badge: '', icon: 'boxicons:table', description: 'A block for creating tables.' },
  // { name: 'Code Block', badge: '', icon: 'boxicons:code', description: 'A block for writing code.' },
]

const tools = [
  { name: 'Generate Inline Citation', badge: '', icon: 'f7:quote-bubble', description: 'Generate citations for your content.' },

]

import BlockTemplate from "@/components/BlockTemplate.vue";

const handleBlockClick = (blockName: string) => {
  if (!useDocumentStoreInstance.activeDocument) {
    useDocumentStoreInstance.createNewDocument();
  }

  switch (blockName) {
    case 'Paragraph Block':
      useDocumentStoreInstance.addContentBlock(DocumentType.body);
      break;
    // case 'Image Block':
    //   useDocumentStoreInstance.addImageBlock();
    //   break;
    // case 'Heading Block':
    //   useDocumentStoreInstance.addHeadingBlock();
    //   break;
    // case 'Table Block':
    //   useDocumentStoreInstance.addTableBlock();
    //   break;
    // case 'Code Block':
    //   useDocumentStoreInstance.addCodeBlock();
    //   break;
  }
};
const handleToolClick = (toolName: string) => {
  switch (toolName) {
    case 'Generate Inline Citation':
      openInlineCitationModal();
      break;
  }
};

</script>

<template>
  <div class="drawer-side h-full min-h-0 z-10 overflow-hidden">
    <label for="my-sidebar" aria-label="close sidebar" class="drawer-overlay"></label>

    <aside class="flex h-full min-h-0 w-80 flex-col overflow-y-auto overflow-x-hidden border-l border-base-300 bg-base-100 text-base-content">
      <div class="border-b border-base-300 p-4">
        <h2 class="text-lg font-semibold">Blocks</h2>
      </div>
      <ul class="menu w-full gap-1 p-4">
        <li v-for="block in blocks" :key="block.name" class="w-full">
          <a class="block w-full rounded-xl" @click="handleBlockClick(block.name)">
            <BlockTemplate :title="block.name" :badge="block.badge" :icon="block.icon">
              <p class="text-sm text-base-content/70">{{ block.description }}</p>
            </BlockTemplate>
          </a>
        </li>
      </ul>
      <div class="border-b border-base-300 p-4">
        <h2 class="text-lg font-semibold">Tools</h2>
      </div>
      <ul class="menu w-full gap-1 p-4">
        <li v-for="tool in tools" :key="tool.name" class="w-full">
          <a class="block w-full rounded-xl" @click="handleToolClick(tool.name)">
            <BlockTemplate :title="tool.name" :badge="tool.badge" :icon="tool.icon">
              <p class="text-sm text-base-content/70">{{ tool.description }}</p>
            </BlockTemplate>
          </a>
        </li>
      </ul>
    </aside>
  </div>
  <GenerateInlineCitation
    v-if="inlineCitationModal"
    :project-label="currentProjectLabel"
    @close="closeInlineCitationModal"
    @generate="handleGenerateCitation"
  />
</template>
