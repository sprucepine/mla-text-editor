import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import './main.css'
import router from './router'
import 'iconify-icon'
import { useDocumentStore } from './stores/documentStore.ts'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

const documentStore = useDocumentStore(pinia)
await documentStore.hydrateStore() // Ensure the store is hydrated before mounting the app

app.mount('#app')
