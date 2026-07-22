<script setup lang="ts">
import { computed } from 'vue';
import { useDocumentStore } from '@/stores/documentStore';
import Card from '@/components/Card.vue';

const props = defineProps<{
  projectLabel: string;
}>();

const emit = defineEmits<{
  (event: 'close'): void
  (event: 'generate'): void
  (event: 'add-citation'): void
}>();

const documentStore = useDocumentStore();
const currentCitationsCount = computed(() => documentStore.citations.length);

function handleClose() {
  emit('close');
}

function handleGenerate() {
  emit('generate');
}

function addCitation() {
  documentStore.addCitation(props.projectLabel);
}
</script>

<template>
  <div class="modal modal-open">
    <div class="modal-box">
      <h3 class="font-bold text-lg">Generate Inline Citation</h3>
      <button class="btn btn-lg btn-circle btn-ghost absolute right-2 top-2" @click="handleClose">✕</button>
      <p class="py-2 text-sm text-base-content/70">
      <button class="btn btn-sm btn-outline btn-primary" @click="addCitation">Add Citation</button> an inline citation for the currently selected text in the editor.
        Current project: <span class="font-semibold">{{ props.projectLabel }}</span>
      </p>
      <p class="py-2 text-sm text-base-content/70">
        Exposed citations: <span class="font-semibold">{{ currentCitationsCount }}</span>
      </p>
      <p class="py-4">This citation will be attached to the currently active project.</p>
      <p class="py-2 text-sm text-base-content/70">
        Sample citations:
      </p>
      <Card
        v-for="block in documentStore.citations"
        :key="block.id"
        :title="block.name"
        icon="mdi:book-open-page-variant"
        badge="MLA"
      >
        <p class="py-2 text-sm text-base-content/70">
          This is a sample card.
        </p>
      </Card>
      <div class="modal-action">
        <button class="btn btn-ghost" @click="handleClose">Cancel</button>
        <button class="btn btn-primary" @click="handleGenerate">Generate</button>
      </div>
    </div>
  </div>
</template>
