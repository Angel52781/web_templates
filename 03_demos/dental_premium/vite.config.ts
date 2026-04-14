import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    // Ensures Three/R3F are prebundled up-front to avoid transient aborted requests during dev reloads.
    include: ['three', '@react-three/fiber', '@react-three/drei'],
  },
  build: {
    chunkSizeWarningLimit: 1200,
  },
})
