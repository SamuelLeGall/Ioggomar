import { rmSync } from "fs";
import path from "path";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import electron, { onstart } from "vite-plugin-electron";
import pkg from "./package.json";
import eslintPlugin from "vite-plugin-eslint";

rmSync("dist", { recursive: true, force: true }); // v14.14.0

// https://vitejs.dev/config/
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
      "@models": path.resolve(__dirname, "./src/server/models"),
      "@router": path.resolve(__dirname, "./src/router"),
      "@stores": path.resolve(__dirname, "./src/server/database"),
      "@styles": path.resolve(__dirname, "./src/styles"),
      "@utils": path.resolve(__dirname, "./src/utils"),
    },
  },
  plugins: [
    eslintPlugin(),
    vue(),
    electron({
      main: {
        entry: "electron/main/index.ts",
        vite: {
          build: {
            // For Debug
            sourcemap: true,
            outDir: "dist/electron/main",
          },
          // Will start Electron via VSCode Debug
          plugins: [process.env.VSCODE_DEBUG ? onstart() : null],
        },
      },
      preload: {
        input: {
          // You can configure multiple preload here
          index: path.join(__dirname, "electron/preload/index.ts"),
        },
        vite: {
          build: {
            // For Debug
            sourcemap: "inline",
            outDir: "dist/electron/preload",
          },
        },
      },
    }),
  ],
  server: process.env.VSCODE_DEBUG
    ? {
        host: pkg.debug.env.VITE_DEV_SERVER_HOSTNAME,
        port: pkg.debug.env.VITE_DEV_SERVER_PORT,
      }
    : undefined,
});
