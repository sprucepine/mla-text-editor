<script setup lang="ts">
import { computed, ref } from 'vue';
import { useDocumentStore } from '@/stores/documentStore';
import Card from '@/components/Card.vue';
import { buildMlaCitation, buildMlaInlineCitation, getRequiredMlaFields } from '@/utils/mlaCitationGenerator';
import { CitationType } from '@/types/types';
import type { Citation } from '@/types/types';

const props = defineProps<{
  projectLabel: string;
}>();

const emit = defineEmits<{
  (event: 'close'): void
  (event: 'generate'): void
}>();

const showingCitationDetails = ref(false);
const selectedCitation = ref<Citation | null>(null);
const copiedRegular = ref(false);
const copiedInline = ref(false);

const documentStore = useDocumentStore();
const currentCitationsCount = computed(() => documentStore.citations.length);

function deleteCitation(citationId: string) {
  documentStore.deleteCitation(citationId);
  if (selectedCitation.value && selectedCitation.value.id === citationId) {
    selectedCitation.value = null;
    showingCitationDetails.value = false;
  }
}

const citationFields = computed(() => {
  if (!selectedCitation.value) {
    return [];
  }

  return getRequiredMlaFields(selectedCitation.value.type);
});

const generatedCitationText = computed(() => {
  if (!selectedCitation.value) {
    return '';
  }

  return buildMlaCitation(selectedCitation.value);
});

const generatedInlineCitationText = computed(() => {
  if (!selectedCitation.value) {
    return '';
  }

  return buildMlaInlineCitation(selectedCitation.value);
});

function handleClose() {
  emit('close');
}

function handleGenerate() {
  emit('generate');
}

function openCitationDetails(citation: Citation | null = null) {
  selectedCitation.value = citation ?? documentStore.addCitation(props.projectLabel, CitationType.Book);

  if (selectedCitation.value && !selectedCitation.value.type) {
    selectedCitation.value.type = CitationType.Book;
  }

  showingCitationDetails.value = true;
}

function updateCitationField(key: 'author' | 'title' | 'year' | 'publisher' | 'containerTitle' | 'url' | 'pageNumber', value: string) {
  if (!selectedCitation.value) {
    return;
  }

  selectedCitation.value[key] = value;
}

async function copyGeneratedCitation() {
  if (!selectedCitation.value) {
    return;
  }

  const citationText = generatedCitationText.value;
  if (!citationText) {
    return;
  }

  try {
    await navigator.clipboard.writeText(citationText);
    copiedRegular.value = true;
    window.setTimeout(() => {
      copiedRegular.value = false;
    }, 1500);
  } catch {
    copiedRegular.value = false;
  }
}

async function copyGeneratedInlineCitation() {
  if (!selectedCitation.value) {
    return;
  }

  const inlineCitationText = generatedInlineCitationText.value;
  if (!inlineCitationText) {
    return;
  }

  try {
    await navigator.clipboard.writeText(inlineCitationText);
    copiedInline.value = true;
    window.setTimeout(() => {
      copiedInline.value = false;
    }, 1500);
  } catch {
    copiedInline.value = false;
  }
}
</script>

<template>
  <div class="modal modal-open">
    <div class="modal-box">
      <div v-if="showingCitationDetails">
        <h3 class="font-bold text-lg">MLA Citation Details</h3>
        <p class="py-2 text-sm text-base-content/70">
          Only the fields required for the selected citation type are shown below.
        </p>
        <div v-if="selectedCitation" class="space-y-3">
          <label class="form-control w-full">
            <span class="label-text">Citation type</span>
            <select v-model="selectedCitation.type" class="select select-bordered w-full">

              <option :value="CitationType.Book">Book</option>
              <option :value="CitationType.Article">Article</option>
              <option :value="CitationType.Website">Website</option>
              <option :value="CitationType.Video">Video</option>
              <option :value="CitationType.Other">Other</option>
            </select>
          </label>

          <div v-for="field in citationFields" :key="field.key" class="form-control w-full">
            <label class="label px-0 py-1">
              <span class="label-text">{{ field.label }}</span>
            </label>
            <input
              :value="selectedCitation[field.key] ?? ''"
              :placeholder="field.placeholder"
              class="input input-bordered w-full"
              @input="updateCitationField(field.key, ($event.target as HTMLInputElement).value)"
            />
          </div>

          <div class="rounded-box border border-base-300 bg-base-100 p-3">
            <p class="text-sm font-semibold">Regular citation (Works Cited)</p>
            <p class="mt-2 text-sm text-base-content/70">{{ generatedCitationText || 'Fill in the required fields to generate a copy-ready MLA citation.' }}</p>
            <button class="btn btn-sm btn-outline btn-primary mt-3" :disabled="!generatedCitationText" @click="copyGeneratedCitation">
              {{ copiedRegular ? 'Copied!' : 'Copy regular citation' }}
            </button>

            <p class="mt-4 text-sm font-semibold">Inline citation (in-text)</p>
            <p class="mt-2 text-sm text-base-content/70">{{ generatedInlineCitationText || 'Add author/title and optional page number to generate an inline citation.' }}</p>
            <button class="btn btn-sm btn-outline btn-primary mt-3" :disabled="!generatedInlineCitationText" @click="copyGeneratedInlineCitation">
              {{ copiedInline ? 'Copied!' : 'Copy inline citation' }}
            </button>
          </div>
        </div>

        <button class="btn btn-sm btn-outline btn-primary mt-4" @click="showingCitationDetails = false">Back</button>
      </div>
      <div v-else>
        <h3 class="font-bold text-lg">Citation Maker</h3>
        <button class="btn btn-lg btn-circle btn-ghost absolute right-2 top-2" @click="handleClose">✕</button>
        <button class="btn btn-sm btn-outline btn-primary absolute right-12 top-2" @click="() => openCitationDetails()">Add New Citation</button>
        <p class="py-2 text-sm text-base-content/70">
          <button class="btn btn-sm btn-outline btn-primary" @click="() => openCitationDetails()">Open Citation Details</button> regular and inline citations for the currently selected text in the editor.
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
          :title="block.title || block.author || block.name || 'Draft citation'"
          icon="mdi:book-open-page-variant"
          badge="MLA"
        >
          <p class="py-2 text-sm text-base-content/70">
            {{ buildMlaCitation(block) || 'No MLA citation generated yet.' }}
          </p>
          <p class="pb-2 text-sm text-base-content/70">
            Inline: {{ buildMlaInlineCitation(block) || 'No inline citation generated yet.' }}
          </p>
          <button class="btn btn-sm btn-outline btn-primary" @click="openCitationDetails(block)">View Details</button>
          <button class="btn btn-sm btn-outline btn-error ml-2" @click="deleteCitation(block.id)">Delete</button>
        </Card>
        <div class="modal-action">
          <button class="btn btn-ghost" @click="handleClose">Cancel</button>
          <button class="btn btn-primary" @click="handleGenerate">Generate</button>
        </div>
      </div>
    </div>
  </div>
</template>
