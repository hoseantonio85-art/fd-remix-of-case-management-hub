import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsconfigPaths from "vite-tsconfig-paths";
import path from "node:path";

// https://vitejs.dev/config/
export default defineConfig({
  base: "/fd-remix-of-case-management-hub/",
  plugins: [react(), tailwindcss(), tsconfigPaths()],
  resolve: {
    alias: {
      // Гарантируем единый runtime React / react-dom (защита от двойного React,
      // т.к. @sber-orm/ui-kit имеет react в peerDependencies)
      react: path.resolve(__dirname, "node_modules/react"),
      "react-dom/server": path.resolve(__dirname, "node_modules/react-dom/server.browser.js"),
      "react-dom": path.resolve(__dirname, "node_modules/react-dom"),
    },
    dedupe: ["react", "react-dom"],
  },
  server: {
    host: "::",
    port: 8080,
  },
});
