import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  base: "/14m/",
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 1300,
    outDir: "docs",
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
