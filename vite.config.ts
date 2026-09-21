import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath } from 'node:url'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      // fileURLToPath(new URL(...)) works on every Node that can run Vite.
      // `import.meta.dirname` needs Node >= 20.11 and is undefined on older
      // runtimes, which makes path.resolve() throw while the config loads —
      // the build then dies before it starts on a stale CI image.
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
