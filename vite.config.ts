import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  base: '/mla-text-editor/', // This fixes the blank page on GitHub Pages!
  plugins: [
    tailwindcss(),

    vue({
      template: {
        compilerOptions: {
          // This tells Vue to treat <iconify-icon> as a native web component
          // instead of looking for a registered Vue component.
          isCustomElement: (tag) => tag === 'iconify-icon'
        }
      }
    }),
    vueDevTools(),
  ],
  server: {
    host: '0.0.0.0', // Exposes the server to the Codespaces proxy
    port: 5173
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
})
