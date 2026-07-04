<script setup lang="ts">
import Sidebar from "@/components/Sidebar.vue"
import { useDocumentStore } from "@/stores/documentStore";
import { onMounted } from 'vue'; // Added onMounted
import Card from "@/components/Card.vue";

const documentStore = useDocumentStore();

// On load, make sure there is an active document to type into
onMounted(() => {
  if (!documentStore.activeDocumentId || !documentStore.activeDocument) {
    documentStore.addContentBlock();
  }
});
</script>

<template>
    <div class="drawer lg:drawer-open drawer-end flex-1 min-h-0 overflow-hidden">
        <input id="my-sidebar" type="checkbox" class="drawer-toggle" />

        <div class="drawer-content flex min-h-0 flex-col bg-base-200">
            <main class="flex-1 overflow-y-auto p-6">
                <section class="mx-auto flex w-full max-w-4xl flex-col gap-6">
                    <div>
                        <h1 class="text-3xl font-semibold tracking-tight">Start writing</h1>
                    </div>
                    
                    <Card v-if="documentStore.activeDocument" title="Heading Information">
                        <p class="pb-4">The heading in MLA format is displayed on the first page of your paper.</p>   
                        
                        <input v-model="documentStore.activeDocument.title" type="text" placeholder="Document Title" class="input input-bordered w-full mb-2" />
                        <input v-model="documentStore.activeDocument.name" type="text" placeholder="Your Name" class="input input-bordered w-full mb-2" />
                        <input v-model="documentStore.activeDocument.professor" type="text" placeholder="Professor's Name" class="input input-bordered w-full mb-2" />
                        <input v-model="documentStore.activeDocument.course" type="text" placeholder="Course Name" class="input input-bordered w-full mb-2" />
                        <input v-model="documentStore.activeDocument.dueDate" type="date" placeholder="Due Date" class="input input-bordered w-full mb-2" />
                    </Card>
                    <template v-if="documentStore.activeDocument">
                        <Card v-for="(block, index) in documentStore.activeDocument.content" :key="index" :title="'Paragraph'" :icon="'boxicons:paragraph'">
                            <textarea v-model="block.text" class="textarea textarea-bordered w-full" placeholder="  Type your content here..."></textarea>
                        </Card>
                    </template>
                    
                </section>
            </main>
        </div>

        <Sidebar />
    </div>
</template>