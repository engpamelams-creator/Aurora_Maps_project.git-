import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

import viteCompression from 'vite-plugin-compression';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    viteCompression({ algorithm: 'brotliCompress' }), // SRE: Brotli for max compression
    viteCompression({ algorithm: 'gzip' }) // SRE: Gzip fallback
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    host: true,
    port: 5173,
    watch: {
      usePolling: true,
    },
  },
})
