import js from "@eslint/js";
import eslintPluginPrettier from "eslint-plugin-prettier/recommended";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";

const restrictedImports = {
  paths: [
    {
      name: "server-only",
      message:
        "TanStack Start does not use the Next.js `server-only` package. Rename the module to `*.server.ts` or mark it with `@tanstack/react-start/server-only`.",
    },
    {
      name: "lucide-react",
      message:
        "Импортируйте иконки только через `@/shared/ui` (или `@/shared/ui/legacy/icons`). Прямые импорты `lucide-react` в продуктовом коде запрещены.",
    },
  ],
  patterns: [
    {
      group: ["@/components/ui/*"],
      message:
        "Импортируйте shadcn-примитивы только через `@/shared/ui`. Прямые импорты `@/components/ui/*` в продуктовом коде запрещены.",
    },
    {
      group: ["@radix-ui/*"],
      message:
        "Импортируйте Radix только через `@/shared/ui` (или legacy-обёртки в `src/components/ui/*`). Прямые импорты `@radix-ui/*` в продуктовом коде запрещены.",
    },
  ],
};

export default tseslint.config(
  { ignores: ["dist", ".output", ".vinxi", "vendor", "node_modules"] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      "no-restricted-imports": ["error", restrictedImports],
      "react-refresh/only-export-components": ["warn", { allowConstantExport: true }],
      "@typescript-eslint/no-unused-vars": "off",
    },
  },
  {
    // Внутри shared-слоя и legacy shadcn-примитивов разрешены прямые импорты
    // shadcn/radix/lucide — это и есть единственный допустимый их источник.
    files: ["src/shared/ui/**/*.{ts,tsx}", "src/components/ui/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": "off",
    },
  },
  eslintPluginPrettier,
);
