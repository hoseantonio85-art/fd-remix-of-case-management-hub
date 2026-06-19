import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsconfigPaths from "vite-tsconfig-paths";
import path from "node:path";

// https://vitejs.dev/config/
export default defineConfig({
  // base используется как basename для BrowserRouter в src/App.tsx — для GitHub Pages
  base: "/case-management-hub-v3/",
  plugins: [react(), tailwindcss(), tsconfigPaths()],
  resolve: {
    alias: {
      // Корпоративный UI-kit, vendor-копия. dist уже собран — используем его.
      "@sber-orm/ui-kit/index.css": path.resolve(
        __dirname,
        "vendor/sber-orm-ui-kit/dist/index.css",
      ),
      "@sber-orm/ui-kit": path.resolve(
        __dirname,
        "vendor/sber-orm-ui-kit/dist/index.js",
      ),
      // Гарантируем единый runtime React / react-dom (защита от двойного React)
      react: path.resolve(__dirname, "node_modules/react"),
      "react-dom": path.resolve(__dirname, "node_modules/react-dom"),
    },
    dedupe: ["react", "react-dom"],
  },
  server: {
    host: "::",
    port: 8080,
    fs: {
      // Разрешаем читать файлы из vendor/ за пределами src/
      allow: [path.resolve(__dirname)],
    },
  },
  optimizeDeps: {
    exclude: ["@sber-orm/ui-kit"],
  },
});
