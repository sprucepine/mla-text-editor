
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

const tabs = [
  { name: 'Blocks', label: 'Blocks', icon: 'mdi-cube-outline', slot: 'blocks' },
  { name: 'Citations', label: 'Citations', icon: 'mdi-format-quote-open', slot: 'citations' },
];

const blocks = [
  { name: 'Paragraph Block', badge: '', icon: 'boxicons:paragraph', description: 'A block for writing paragraphs of text.' },
  // { name: 'Image Block', badge: '', icon: 'boxicons:image', description: 'A block for inserting images.' },
  // { name: 'Heading Block', badge: '', icon: 'codex:h1', description: 'A block for creating headings.' },
  // { name: 'Table Block', badge: '', icon: 'boxicons:table', description: 'A block for creating tables.' },
  // { name: 'Code Block', badge: '', icon: 'boxicons:code', description: 'A block for writing code.' },
]

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

</script>

<template>
  <UTabs :items="tabs" class="w-full">
    <template #blocks>
      <div class="border-b border-default p-4">
        <h2 class="text-lg font-semibold text-highlighted">Blocks</h2>
      </div>
      <ul class="flex w-full flex-col gap-1">
        <li v-for="block in blocks" :key="block.name" class="w-full">
          <button class="block w-full rounded-md p-2 text-left hover:bg-elevated" @click="handleBlockClick(block.name)" style="cursor: pointer">
            <UPageCard :title="block.name" :badge="block.badge" :icon="block.icon">
              <p class="text-sm text-muted">{{ block.description }}</p>
            </UPageCard>
          </button>
        </li>
      </ul>
      </template>
      <template #citations>
      <div class="border-b border-default p-4">
        <h2 class="text-lg font-semibold text-highlighted">Citations</h2>
      </div>
  <GenerateInlineCitation
    :project-label="currentProjectLabel"
    @close="closeInlineCitationModal"
    @generate="handleGenerateCitation"
  />
  </template>
  </UTabs>
</template>
