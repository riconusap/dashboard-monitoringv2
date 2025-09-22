import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

// Determine base URL for GitHub Pages
const getBaseUrl = () => {
  // For GitHub Pages deployment
  if (process.env.NODE_ENV === 'production') {
    return '/dashboard-monitoringv2/';
  }
  // For local development
  return '/';
};

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      "vue-i18n": "vue-i18n/dist/vue-i18n.cjs.js",
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  base: getBaseUrl(),
  build: {
    chunkSizeWarningLimit: 3000,
  },
});
