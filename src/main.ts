import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

import App from './App.vue'
import './main.css'
import router from './router'
import 'iconify-icon'
import ui from '@nuxt/ui/vue-plugin'

const app = createApp(App)
const pinia = createPinia()

app.use(ui)
app.use(pinia)
app.use(router)

pinia.use(piniaPluginPersistedstate)

app.mount('#app')
