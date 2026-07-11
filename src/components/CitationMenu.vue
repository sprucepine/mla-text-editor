<template>
  <div class="citation-menu">
    <div class="citation-menu__header">
      <div class="citation-menu__title">MLA Citation</div>
      <div class="citation-menu__subtitle">Fill this in after inserting the citation pill.</div>
    </div>

    <label class="citation-menu__field">
      <span>Author</span>
      <input class="input input-bordered input-sm w-full" type="text" placeholder="Last, First" />
    </label>

    <label class="citation-menu__field">
      <span>Title</span>
      <input class="input input-bordered input-sm w-full" type="text" placeholder="Source title" />
    </label>

    <div class="citation-menu__grid">
      <label class="citation-menu__field">
        <span>Year</span>
        <input class="input input-bordered input-sm w-full" type="text" placeholder="2026" />
      </label>

      <label class="citation-menu__field">
        <span>Page</span>
        <input class="input input-bordered input-sm w-full" type="text" placeholder="12" />
      </label>
    </div>

    <div class="citation-menu__actions">
      <button class="btn btn-sm btn-primary">Insert</button>
      <button class="btn btn-sm btn-ghost">Cancel</button>
    </div>
  </div>
</template>

<script setup lang="ts">
defineExpose({})
</script>

<style scoped>
.citation-menu {
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
  min-width: 280px;
  padding: 0.9rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.875rem;
  background: #ffffff;
  box-shadow: 0 20px 45px -18px rgba(15, 23, 42, 0.28);
}

.citation-menu__header {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.citation-menu__title {
  font-size: 0.95rem;
  font-weight: 700;
  color: #0f172a;
}

.citation-menu__subtitle {
  font-size: 0.78rem;
  color: #64748b;
}

.citation-menu__field {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  font-size: 0.8rem;
  color: #334155;
}

.citation-menu__grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.75rem;
}

.citation-menu__actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
}
</style>