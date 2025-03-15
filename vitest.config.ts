/// <reference types="vitest" />

import path from "path";

import { defineConfig } from "vite";
import Vue from "@vitejs/plugin-vue";

export default defineConfig({
  resolve: {
    alias: {
      "@src": path.resolve(__dirname, "./src"),
      "@assets": path.resolve(__dirname, "./src/assets"),
      "@composables": path.resolve(__dirname, "./src/composables"),
      "@components": path.resolve(__dirname, "./src/components"),
      "@config": path.resolve(__dirname, "./src/config"),
      "@directives": path.resolve(__dirname, "./src/directives"),
      "@localizations": path.resolve(__dirname, "./src/localizations"),
      "@models": path.resolve(__dirname, "./src/domain/models"),
      "@router": path.resolve(__dirname, "./src/router"),
      "@stores": path.resolve(__dirname, "./src/domain/database-stores"),
      "@styles": path.resolve(__dirname, "./src/styles"),
      "@utils": path.resolve(__dirname, "./src/utils"),
    },
  },
  plugins: [Vue()],
  test: {
    globals: true,
    environment: "jsdom",
  },
});
