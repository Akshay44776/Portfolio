import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 8080,
    host: true
  },
  preview: {
    port: 8080,
    host: true
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("three") || id.includes("@react-three") || id.includes("postprocessing") || id.includes("maath")) {
            return "three-bundle";
          }
        }
      }
    }
  }
});
