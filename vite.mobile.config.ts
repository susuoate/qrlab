import tailwindcss from '@tailwindcss/postcss';
import react from '@vitejs/plugin-react';
import { resolve } from 'node:path';
import { defineConfig } from 'vite';

export default defineConfig({
  root: resolve(__dirname, 'mobile'),
  publicDir: resolve(__dirname, 'public'),
  base: './',
  css: { postcss: { plugins: [tailwindcss()] } },
  plugins: [react()],
  build: {
    outDir: resolve(__dirname, 'mobile-dist'),
    emptyOutDir: true,
  },
});
