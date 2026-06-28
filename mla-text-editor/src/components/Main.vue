<script setup lang="ts">
import Sidebar from "@/components/Sidebar.vue"
import { useDocumentStore } from "@/stores/documentStore";
import { storeToRefs } from 'pinia';
import { ref } from 'vue';
import Card from "@/components/Card.vue";

const documentStore = useDocumentStore();

const title = ref('');
const name = ref('');
const professor = ref('');
const course = ref('');
const dueDate = ref('');
</script>

<template>
    <div class="drawer lg:drawer-open drawer-end flex-1 min-h-0 overflow-hidden">
        <input id="my-sidebar" type="checkbox" class="drawer-toggle" />

        <div class="drawer-content flex min-h-0 flex-col bg-base-200">
            <div class="navbar border-b border-base-300 bg-base-100 px-4 lg:hidden">
                <div class="flex-none">
                    <label for="my-sidebar" class="btn btn-square btn-ghost drawer-button">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="inline-block h-5 w-5 stroke-current"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
                    </label>
                </div>
                <div class="px-2 text-sm font-semibold">Workspace</div>
            </div>

            <main class="flex-1 overflow-y-auto p-6">
                <section class="mx-auto flex w-full max-w-4xl flex-col gap-6">
                    <div>
                        <h1 class="text-3xl font-semibold tracking-tight">Start writing</h1>
                        <p class="mt-2 text-base-content/70">
                            Use the sidebar to add blocks and keep the main editor in one scroll area.
                        </p>
                    </div>
                        <Card title="Heading Information">
                            <p class="pb-4">The heading in MLA format is displayed on the first page of your paper. It includes your name, your professor's name, the course name, and the date. Please fill in the information below to generate the heading. </p>   
                            <input v-model="title" type="text" placeholder="Document Title" class="input input-bordered w-full mb-2" />
                            <input v-model="name" type="text" placeholder="Your Name" class="input input-bordered w-full mb-2" />
                            <input v-model="professor" type="text" placeholder="Professor's Name" class="input input-bordered w-full mb-2" />
                            <input v-model="course" type="text" placeholder="Course Name" class="input input-bordered w-full mb-2" />
                            <input v-model="dueDate" type="date" placeholder="Due Date" class="input input-bordered w-full mb-2" />
                           
                        </Card>
                    
                </section>
            </main>
        </div>

        <Sidebar />
    </div>
</template>