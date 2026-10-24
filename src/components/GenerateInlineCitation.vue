<script setup lang="ts">
import { computed, ref } from 'vue';
import { useDocumentStore } from '@/stores/documentStore';
import { buildMlaCitation, buildMlaInlineCitation, getRequiredMlaFields } from '@/utils/mlaCitationGenerator';
import { CitationType } from '@/types/types';
import type { Citation } from '@/types/types';

const props = defineProps<{
  projectLabel: string;
}>();


const showingCitationDetails = ref(false);
const selectedCitation = ref<Citation | null>(null);
const copiedRegular = ref(false);
const copiedInline = ref(false);

const toast = useToast();

const documentStore = useDocumentStore();
const currentCitationsCount = computed(() => documentStore.citations.length);

function deleteCitation(citationId: string) {
  documentStore.deleteCitation(citationId);
  if (selectedCitation.value && selectedCitation.value.id === citationId) {
    selectedCitation.value = null;
    showingCitationDetails.value = false;
  }
  toast.add({
    title: 'Citation deleted',
    icon: 'mdi-check-circle',
    duration: 1500,
    progress: false,
  });
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
    toast.add({
      title: 'Copied to clipboard',
      icon: 'mdi-check-circle',
      duration: 1500,
      progress: false,
    });
  } catch {
    copiedRegular.value = false;
    toast.add({
      title: 'Copy failed',
      icon: 'mdi-alert-circle',
      description: 'Failed to copy the citation to clipboard. Please try again.',
      duration: 1500,
      progress: false,
    });
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
    toast.add({
      title: 'Copy failed',
      icon: 'mdi-alert-circle',
      duration: 1500,
      progress: false,
    });
  }
}
</script>

<template>
    <!-- Add new citation -->
      <div v-if="showingCitationDetails">
        <UButton @click="showingCitationDetails = false" icon="mdi-arrow-left" variant="ghost" title="Back to Citations Homepage">Citations Homepage</UButton>
        <p class="py-2 text-sm text-base-content/70">
          Only the fields required for the selected citation type are shown below.
        </p>
        <div v-if="selectedCitation" class="space-y-3">
          <label class="form-control w-full">
            <span class="label-text">Citation type</span>
            <USelect v-model="selectedCitation.type" :items="Object.values(CitationType)" class="w-full"/>
          </label>

          <div v-for="field in citationFields" :key="field.key" class="form-control w-full">
            <label class="label px-0 py-1">
              <span class="label-text">{{ field.label }}</span>
            </label>
            <UInput
              :value="selectedCitation[field.key] ?? ''"
              :placeholder="field.placeholder"
              class="w-full"
              @input="updateCitationField(field.key, ($event.target as HTMLInputElement).value)"
            />
          </div>

          <UCard class="w-full h-full bg-base-100">

            <p class="text-sm font-semibold">Regular citation (Works Cited)</p>
            <p class="mt-2 text-sm text-base-content/70">{{ generatedCitationText || 'Fill in the required fields to generate a copy-ready MLA citation.' }}</p>
            <UButton :disabled="!generatedCitationText" :icon="copiedRegular ? 'mdi-check' : 'mdi-content-copy'" variant="outline" @click="copyGeneratedCitation">
              {{ copiedRegular ? 'Copied!' : 'Copy regular citation' }}
            </UButton>

            <p class="mt-4 text-sm font-semibold">Inline citation (in-text)</p>
            <p class="mt-2 text-sm text-base-content/70">{{ generatedInlineCitationText || 'Add author/title and optional page number to generate an inline citation.' }}</p>
            <UButton  :disabled="!generatedInlineCitationText" :icon="copiedInline ? 'mdi-check' : 'mdi-content-copy'" variant="outline" @click="copyGeneratedInlineCitation">
              {{ copiedInline ? 'Copied!' : 'Copy inline citation' }}
            </UButton>
          </UCard>
        </div>

      </div>
      <!-- Show list of citations -->
      <div v-else-if="documentStore.citations.length === 0">
        <UButton @click="() => openCitationDetails()" icon="mdi-plus" variant="outline" class="btn-sm">Add New Citation</UButton>
        <p class="py-2 text-sm text-base-content/70">
          No citations have been added yet. Click the button below to add a new citation for the currently selected text in the editor.
        </p>
      </div>
      <!-- Show list of citations -->
      <div v-else>
        <UButton @click="() => openCitationDetails()" icon="mdi-plus" variant="outline" class="btn-sm">Add New Citation</UButton>
        <p class="py-2 text-sm text-base-content/70">
          Total citations: <span class="font-semibold">{{ currentCitationsCount }}</span>
        </p>
        <UPageCard
          v-for="block in documentStore.citations"
          :key="block.id"
          :title="block.title || block.author || block.name || 'Draft citation'"
          icon="mdi:book-open-page-variant"
          class="mt-4"
        >
          <p class="py-2 text-sm text-base-content/70">
            {{ buildMlaCitation(block) || 'No MLA citation generated yet.' }}
          </p>
          <p class="pb-2 text-sm text-base-content/70">
            Inline: {{ buildMlaInlineCitation(block) || 'No inline citation generated yet.' }}
          </p>
          <UFieldGroup class="mt-2">
              <UButton @click="() => openCitationDetails(block)"  variant="outline" icon="mdi-pencil" title="Edit Citation">Edit</UButton>
              <UButton @click="() => deleteCitation(block.id)" variant="outline" icon="mdi-delete" title="Delete Citation">Delete</UButton>
          </UFieldGroup>
        </UPageCard>
      </div>
</template>
