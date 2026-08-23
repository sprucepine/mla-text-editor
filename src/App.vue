<script setup lang="ts">
  import Navbar from '@/components/Navbar.vue'
  import Main from '@/components/Main.vue'
  import 'tippy.js/dist/tippy.css'
</script>

<template>
  <UApp :tooltip="{ delayDuration: 0 }">
    <UDashboardGroup>
        <UDashboardPanel :ui="{ body: 'p-0' }">
          <template #header>
            <Navbar />
          </template>
          <template #body>
            <Main />
          </template>
        </UDashboardPanel>
        <UDashboardSidebar variant="floating" side="right" :toggle="false" resizable :min-size="20" :max-size="50" :default-size="25" >
          <Sidebar />
        </UDashboardSidebar>
      </UDashboardGroup>

    </UApp>
</template>

<style scoped></style>
