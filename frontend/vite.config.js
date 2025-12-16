import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    esbuildOptions: {
      loader: {
        '.js': 'jsx',
      },
    },
  },
  server: {
    // proxy API requests to backend to preserve CRA `proxy` behavior
    proxy: {
      '/api': 'http://localhost:5000',
    },
  },
})
