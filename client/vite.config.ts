import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000', // Адрес вашего бэкенда
        changeOrigin: true,
      },
    },
  },
});