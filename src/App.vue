<script setup lang="ts">
  import Navbar from '@/components/Navbar.vue'
  import Main from '@/components/Main.vue'
</script>

<template>
  <div class="flex h-screen flex-col bg-base-200 text-base-content">
    <Navbar />
    <Main />
    
  </div>
</template>

  <!-- <main class="flex min-h-screen items-center justify-center p-6">
    <section class="card w-full max-w-lg border border-base-300 bg-base-100 shadow-xl">
      <div class="card-body gap-4 text-center">
        <h1 class="text-3xl font-semibold tracking-tight">MLA Text Editor</h1>
        <p class="text-base-content/70">
          Tailwind v4 and daisyUI are now wired into the Vite build.
        </p>

        <div class="join mx-auto">
          <button class="btn btn-sm join-item btn-active">Draft</button>
          <button class="btn btn-sm join-item">Outline</button>
          <button class="btn btn-sm join-item">Citations</button>
        </div>

        <textarea
          class="textarea textarea-bordered min-h-48 w-full bg-base-200 font-mono text-sm"
          placeholder="Start typing here..."
        ></textarea>

        <div class="flex items-center justify-between gap-3">
          <div class="badge badge-outline">Ready</div>
          <button class="btn btn-primary">Export</button>
        </div>
      </div>
    </section>
  </main> -->

<style scoped></style>
