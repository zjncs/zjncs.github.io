import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    host: '0.0.0.0',
    port: 4000
  },
  build: {
    outDir: '_site'
  }
})