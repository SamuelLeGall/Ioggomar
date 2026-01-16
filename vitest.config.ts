/// <reference types="vitest" />

import path from "path";

import { defineConfig } from "vite";
import Vue from "@vitejs/plugin-vue";

export default defineConfig({
  resolve: {
    alias: {
      "@src": path.resolve(__dirname, "./src"),
    },
  },
  plugins: [Vue()],
  test: {
    globals: true,
    environment: "jsdom",
  },
});
