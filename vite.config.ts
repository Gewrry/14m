import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

const repositoryName = process.env.GITHUB_REPOSITORY?.split("/")[1];
const isUserOrOrgPage = repositoryName?.endsWith(".github.io");
const base = repositoryName && !isUserOrOrgPage ? `/${repositoryName}/` : "/";

export default defineConfig({
  base,
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 1300,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
