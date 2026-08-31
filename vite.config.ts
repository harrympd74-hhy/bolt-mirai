import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';
import { enterDevPlugin, enterProdPlugin } from 'vite-plugin-enter-dev';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [...enterProdPlugin(), ...enterDevPlugin(), react()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
