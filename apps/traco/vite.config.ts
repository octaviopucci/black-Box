import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  base: process.env.VITE_BASE || '/',
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: process.env.VITE_OUT_DIR || 'dist',
    emptyOutDir: true,
    sourcemap: false,
  },
  preview: {
    host: true,
    allowedHosts: true,
  },
  server: {
    host: true,
    allowedHosts: true,
    proxy: {
      '/api/traco': {
        target: process.env.VITE_TRACO_API_PROXY || 'https://blckbox.vercel.app',
        changeOrigin: true,
        secure: true,
      },
    },
  },
})
