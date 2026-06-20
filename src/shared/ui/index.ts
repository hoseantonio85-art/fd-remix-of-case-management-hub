/**
 * Единственный публичный barrel UI-слоя для продуктового кода.
 *
 * - Базовые формы/контролы (Button, Input, Checkbox, ...) — ре-экспорт shadcn,
 *   обёрнут в `./legacy/shadcn`. Сохраняем текущий UX на первой итерации.
 * - Композитные (Dialog/Sheet/Select/Tabs/...) — там же, до отдельной итерации
 *   по их замене на kit.
 * - Loader / Icon / Text / Title / Chips и enum'ы — приходят из kit через
 *   `./adapters/kit`.
 * - Иконки lucide — централизованы в `./legacy/icons` и реэкспортированы здесь
 *   как именованные. Прямые импорты `lucide-react` в продукте запрещены ESLint.
 */
export * from "./legacy/shadcn";
export * from "./adapters/kit";
export * from "./legacy/icons";
