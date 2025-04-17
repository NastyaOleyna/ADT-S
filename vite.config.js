import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import fs from 'fs';
import path from 'path';
import basicSsl from '@vitejs/plugin-basic-ssl';


// https://vitejs.dev/config/
export default defineConfig({
  base: '/ADT-S/', 
  plugins: [vue(),
    basicSsl(),
  ],
  server: {
    port: 3000,
    https: false,
    host: true,
    watch: {
      usePolling: true,
    },
    hmr: {
      overlay: true,
    },
  },
  build: {
    outDir: './dist',
    emptyOutDir: true,
  },
  assetsInclude: ['**/*.woff', '**/*.woff2', '**/*.ttf', '**/*.eot'],
  resolve: {
    alias: {
      '@': '/src',
    },
  },
});
