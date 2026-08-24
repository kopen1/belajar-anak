import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';

const nm = fileURLToPath(new URL('./node_modules', import.meta.url));

export default defineConfig({
  plugins: [react()],
  resolve: {
    dedupe: ['react', 'react-dom'],
    alias: [
      { find: /^(react|react-dom)(?=$|\/)/, replacement: `${nm}/$1` },
    ],
  },
  server: { port: 5173, watch: { usePolling: true, interval: 300 } },
  build: { outDir: 'dist', sourcemap: false },
});
