import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), vueDevTools()],
  // esbuild: {
  //   supported: {
  //     'top-level-await': true,
  //   },
  // },
  css: {
    preprocessorOptions: {
      scss: {
        // Con esta opción, solo se ocultarán las advertencias de archivos
        // dentro de node_modules (como Bootstrap).
        quietDeps: true,
      },
    },
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
