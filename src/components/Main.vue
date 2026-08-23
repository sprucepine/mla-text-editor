<script setup lang="ts">
import { useDocumentStore } from "@/stores/documentStore";
import { onMounted } from 'vue';
import Card from "@/components/Card.vue";
import BlockEditor from "@/components/BlockEditor.vue"; // Imported your separate editor
import Footer from "@/components/Footer.vue"; // Import Footer component

const documentStore = useDocumentStore();

// On load, make sure there is an active document to type into
onMounted(() => {
    if (!documentStore.activeDocumentId || !documentStore.activeDocument) {
        documentStore.createNewDocument();
    }

    if (documentStore.activeDocument && documentStore.activeDocument.content.length === 0) {
        documentStore.addContentBlock();
  }
});
</script>

<template>
      <main class="flex-1">
        <section class="">
          <section class="mx-auto flex w-full max-w-4xl flex-col gap-6">
              <div>
                <h1 class="text-3xl font-semibold tracking-tight">
                  {{ documentStore.activeDocument?.fileTitle || "Untitled Document" }}
                </h1>
              </div>
              <template v-if="documentStore.activeDocument">
                  <Card v-if="documentStore.activeDocument" title="Header Information">
                      <p class="pb-4">The header in MLA format is displayed at the top right of your paper. It should include your last name and an auto-generated page number.</p>
                      <label class="floating-label">
                          <span class="label-text">Header Name</span>
                          <input v-model="documentStore.activeDocument.headerName" type="text" placeholder="Header Name" class="input input-bordered w-full mb-4" />
                      </label>
                  </Card>

                  <Card v-if="documentStore.activeDocument" title="Heading Information">
                      <p class="pb-4">The heading in MLA format is displayed on the first page of your paper.</p>
                        <label class="floating-label">
                          <span class="label-text">Document Title</span>
                          <input v-model="documentStore.activeDocument.title" type="text" placeholder="Document Title" class="input input-bordered w-full mb-4" />
                      </label>
                        <label class="floating-label">
                          <span class="label-text">Your Name</span>
                          <input v-model="documentStore.activeDocument.name" type="text" placeholder="Your Name" class="input input-bordered w-full mb-4" />
                      </label>
                      <label class="floating-label">
                          <span class="label-text">Professor's Name</span>
                          <input v-model="documentStore.activeDocument.professor" type="text" placeholder="Professor's Name" class="input input-bordered w-full mb-4" />
                      </label>
                      <label class="floating-label">
                          <span class="label-text">Course Name</span>
                          <input v-model="documentStore.activeDocument.course" type="text" placeholder="Course Name" class="input input-bordered w-full mb-4" />
                      </label>
                      <label class="floating-label">
                          <span class="label-text">Due Date</span>
                          <input v-model="documentStore.activeDocument.dueDate" type="date" placeholder="Due Date" class="input input-bordered w-full mb-4" />
                      </label>
                  </Card>

                  <Card v-for="(block, index) in documentStore.activeDocument.content" :key="index" :title="'Paragraph'" :icon="'boxicons:paragraph'">

                      <BlockEditor v-model="documentStore.activeDocument.content[index]!" />

                      <button class="btn btn-sm btn-ghost mt-2" @click="documentStore.deleteContentBlock(index)" title="Delete Paragraph"><iconify-icon icon="mdi-delete" /></button>
                      <button v-if="index > 0" class="btn btn-sm btn-ghost mt-2 ml-2" @click="documentStore.moveContentBlock(index, index - 1)" title="Move Up"><iconify-icon icon="mdi-arrow-up" /></button>
                      <button v-if="index < documentStore.activeDocument.content.length - 1" class="btn btn-sm btn-ghost mt-2 ml-2" @click="documentStore.moveContentBlock(index, index + 1)" title="Move Down"><iconify-icon icon="mdi-arrow-down" /></button>
                  </Card>
              </template>
            </section>
          </section>
        <Footer />
      </main>
</template>
