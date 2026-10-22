import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: '/',
  server: {
    // Port baru yang sengaja berbeda dari project lama (5173/5180).
    port: 5199,
    strictPort: true,
    host: '127.0.0.1',
  },
})
