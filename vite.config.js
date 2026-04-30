import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  server: {
    port: 5173,
    proxy: {
      // Proxy ke Express server kamu yang sudah ada (port 3000)
      '/arcgis-proxy': 'http://localhost:3000',
      '/portal-intercept': 'http://localhost:3000',
    },
  },
})
