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
                        <Card title="Draft" badge="Ready">
                            Your writing area can go here.
                        </Card>
                    


                    <div class="rounded-2xl border border-base-300 bg-base-100 p-6 shadow-sm">
                        <div class="mb-4 flex items-center justify-between">
                            <h2 class="text-lg font-semibold">Draft</h2>
                            <span class="badge badge-outline">Ready</span>
                        </div>
                        <div class="min-h-80 rounded-xl border border-base-300 bg-base-200 p-4 text-base-content/50">
                            Your writing area can go here.
                        </div>
                    </div>
                </section>
            </main>
        </div>

        <Sidebar />
    </div>
</template>