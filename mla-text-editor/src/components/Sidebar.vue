
<script setup lang="ts">
const blocks = [
  { name: 'Paragraph Block', icon: '🧱' },
  { name: 'Image Block', icon: '🧱' },
  { name: 'Heading Block', icon: '🧱' },
  { name: 'Table Block', icon: '🧱' },
  { name: 'Code Block', icon: '🧱' },
]
</script>

<template>
  <div class="drawer-side h-full z-10">
    <label for="my-sidebar" aria-label="close sidebar" class="drawer-overlay"></label>

    <aside class="flex h-full w-80 flex-col border-l border-base-300 bg-base-100 text-base-content">
      <div class="border-b border-base-300 p-4">
        <h2 class="text-lg font-semibold text-primary">Add Blocks</h2>
      </div>

      <ul class="menu flex-1 gap-1 overflow-y-auto p-4">
        <li v-for="block in blocks" :key="block.name">
          <a class="rounded-xl">
            {{ block.icon }} {{ block.name }}
          </a>
        </li>
      </ul>
    </aside>
  </div>
</template>
