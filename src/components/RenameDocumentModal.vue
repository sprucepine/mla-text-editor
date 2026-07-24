<script setup lang="ts">
import { ref } from 'vue'
import ModalView from '@/components/ModalView.vue'

// Make sure to import your Icon component if not globally registered
// import { Icon } from '@iconify/vue'

defineOptions({ name: 'RenameDocumentModal' })

const props = defineProps<{
  initialTitle: string
  initialIcon: string
}>()

const emit = defineEmits<{
  save: [title: string, icon: string]
  close: []
}>()

const draftTitle = ref(props.initialTitle || 'Untitled Document')
const draftIcon = ref(props.initialIcon || 'lucide:file-text')

// School-focused Iconify identifiers (using Lucide/Mdi sets for consistency)
const schoolIcons = [
  'lucide:file-text',
  'lucide:book-open',
  'lucide:graduation-cap',
  'lucide:calculator',
  'lucide:pencil',
  'lucide:compass',
  'lucide:flask-conical',
  'lucide:globe',
  'lucide:music',
  'lucide:clapperboard',
  'lucide:brain',
  'lucide:calendar'
]

function selectIcon(iconName: string) {
  draftIcon.value = iconName
}

function closeDialog() {
  emit('close')
}

function saveDialog() {
  emit('save', draftTitle.value.trim() || 'Untitled Document', draftIcon.value)
  emit('close')
}
</script>

<template>
  <ModalView :title="props.initialTitle" :description="props.initialIcon" @close="closeDialog">
    <h3 class="text-lg font-semibold">Change file title</h3>
    <p class="mt-2 text-sm text-base-content/70">This title appears in the document header and app shell.</p>

    <label class="floating-label mt-4">
      <span class="label-text">File title</span>
      <input
        v-model="draftTitle"
        type="text"
        placeholder="Untitled Document"
        class="input input-bordered w-full"
        @keydown.enter.prevent="saveDialog"
      />
    </label>

    <label class="floating-label mt-4">
      <span class="label-text">File icon identifier</span>
      <input
        v-model="draftIcon"
        type="text"
        placeholder="lucide:file-text"
        class="input input-bordered w-full"
        @keydown.enter.prevent="saveDialog"
      />
    </label>

    <div class="mt-4">
      <span class="text-xs font-medium text-base-content/60 block mb-2">Quick Select School Icon:</span>
      <div class="grid grid-cols-6 gap-2 p-2 bg-base-200 rounded-lg">
        <button
          v-for="icon in schoolIcons"
          :key="icon"
          type="button"
          class="btn btn-square btn-sm btn-ghost flex items-center justify-center transition-all"
          :class="{ 'btn-active btn-primary text-primary-content': draftIcon === icon }"
          @click="selectIcon(icon)"
        >
          <iconify-icon :icon="icon" class="w-5 h-5 flex items-center justify-center" />
        </button>
      </div>
      <p class="text-xs text-base-content/60 mt-2">
        Looking for more icons? You can visit <a href="https://icon-sets.iconify.design/" target="_blank" class="link link-primary">Iconify</a> to find more icons.
      </p>
    </div>

    <div class="modal-action">
      <button class="btn btn-ghost" type="button" @click="closeDialog">Cancel</button>
      <button class="btn btn-primary" type="button" @click="saveDialog">Save</button>
    </div>
  </ModalView>
</template>

<style scoped>
</style>
