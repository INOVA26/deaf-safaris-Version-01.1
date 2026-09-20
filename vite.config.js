import { defineConfig } from 'vite';

export default defineConfig(({ command }) => ({
  base: './',
  publicDir: command === 'serve' ? 'public' : false,
  server: {
    proxy: {
      '/api': 'http://127.0.0.1:8787',
    },
  },
}));
