<script setup lang="ts">
import versionData from '../../package.json';

</script>
<template>
  <footer class="w-full border-t border-base-300 bg-base-100 px-6 py-4 text-xs text-muted-foreground transition-colors">
    <div class="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 sm:flex-row">

      <div class="flex items-center gap-2">
        <span class="font-medium text-foreground">MLA Text Editor</span>
        <span>•</span>
        <span class="rounded-full bg-base-200 px-2 py-0.5 text-[10px] font-mono font-medium tracking-wide">
          {{ versionData.version }}
        </span>
      </div>
      <span class="text-xs">MLA Text Editor is currently in active development. Make sure to back up your work regularly.</span>
      <nav class="flex items-center gap-4 sm:gap-6">
        <a
          href="https://github.com/sprucepine/mla-text-editor"
          target="_blank"
          rel="noopener noreferrer"
          class="flex items-center gap-1.5 hover:text-foreground transition-colors focus:outline-none focus:underline"
        >
          <iconify-icon icon="mdi-github" class="text-base" />
          <span>GitHub</span>
          <iconify-icon icon="mdi-open-in-new" class="text-base text-xs" />
        </a>

        <a
          href="https://github.com/sprucepine/mla-text-editor/issues"
          target="_blank"
          rel="noopener noreferrer"
          class="flex items-center gap-1.5 hover:text-foreground transition-colors focus:outline-none focus:underline"
        >
          <iconify-icon icon="mdi-bug-outline" class="text-base" />
          <span>Report Bugs</span>
          <iconify-icon icon="mdi-open-in-new" class="text-base text-xs" />
        </a>

        <a
          href="https://github.com/sprucepine/mla-text-editor/blob/c630880a07f6eebbfdc6b7e746d6c00a110d69bc/THIRD_PARTY_LICENSES.md"
          target="_blank"
          rel="noopener noreferrer"
          class="flex items-center gap-1.5 hover:text-foreground transition-colors focus:outline-none focus:underline"
        >
          <iconify-icon icon="mdi-license" class="text-base" />
          <span>Licenses</span>
          <iconify-icon icon="mdi-open-in-new" class="text-base text-xs" />
        </a>
      </nav>

    </div>
  </footer>
</template>
