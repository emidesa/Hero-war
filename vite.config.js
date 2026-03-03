import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    proxy: {
      '/superhero-api': {
        target: 'https://www.superheroapi.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/superhero-api/, '/api.php'),
      },
    },
  },
})