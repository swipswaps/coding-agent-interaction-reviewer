import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
// [2] https://vite.dev/guide/static-deploy
const BASE = '/coding-agent-interaction-reviewer/'
export default defineConfig({
  base: BASE,
  plugins: [react()],
  build: { outDir: 'dist', sourcemap: false, assetsDir: 'assets' },
})
