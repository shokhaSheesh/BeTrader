import { fileURLToPath, URL } from 'node:url'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  server: { port: 3000 },
  build: {
    // Main chunk is ~505 kB (~155 kB gzipped): React, router, query, Radix. Pages are already lazy chunks.
    // Revisit (split vendors) if it passes this limit.
    chunkSizeWarningLimit: 600,
  },
})
