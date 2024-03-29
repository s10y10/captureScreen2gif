import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';
import { defineConfig } from 'vite';
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js';

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    reportCompressedSize: false,
    lib: {
      entry: resolve(__dirname, 'src/main.js'),
      name: 'screen2gif',
    },
  },
  plugins: [vue(), cssInjectedByJsPlugin()],
  resolve: {
    alias: {
      '@': resolve('./src'),
    },
  },
});
