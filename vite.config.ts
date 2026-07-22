import { fileURLToPath } from "node:url";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  root: "frontend",
  plugins: [react()],
  define: {
    "process.env.NODE_ENV": JSON.stringify("production"),
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./frontend/src", import.meta.url)),
    },
  },
  build: {
    minify: "esbuild",
    outDir: "dist",
    emptyOutDir: true,
    cssCodeSplit: false,
  },
});
