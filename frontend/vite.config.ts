import path from "path";
import react from "@vitejs/plugin-react";
import checker from "vite-plugin-checker";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react(), checker({ typescript: true })],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
