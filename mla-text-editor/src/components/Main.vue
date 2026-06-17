<script setup lang="ts">
import Sidebar from "@/components/Sidebar.vue"
</script>

<template>
    <div class="drawer lg:drawer-open drawer-end h-screen overflow-hidden">
        <input id="my-sidebar" type="checkbox" class="drawer-toggle" />
        
        <div class="drawer-content flex flex-col items-center p-6 bg-base-200 h-full overflow-y-auto">
            
            <div class="w-full navbar bg-base-100 lg:hidden shadow rounded-xl mb-4">
                <div class="flex-none">
                <label for="my-sidebar" class="btn btn-square btn-ghost drawer-button">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="inline-block w-5 h-5 stroke-current"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
                </label>
                </div>
                <div class="flex-1 px-2 mx-2 font-bold">My App</div>
            </div>

            <div class="text-center py-20">
                <h1 class="text-3xl font-bold">Main Content Area</h1>
                <p class="py-6 text-gray-500">Responsive sidebar stays open on large screens and collapses into a hamburger menu on mobile.</p>
                <div class="h-[120vh] bg-base-300 rounded-xl p-4 mt-4">Main content scrolling test wrapper</div>
            </div>
        </div> 
        <Sidebar />
    </div>
</template>