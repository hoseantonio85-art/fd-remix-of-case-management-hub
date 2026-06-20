# MIGRATION_REPORT

Дата: 20.06.2026 (финал первой UI-итерации)
Цель: воспроизводимая сборка, единый shared-слой, отсутствие циклов, документированный
поэлементный статус миграции на `@sber-orm/ui-kit`.

## 1. Воспроизводимость репозитория

`@sber-orm/ui-kit` подключён как локальная file-зависимость:

```json
"@sber-orm/ui-kit": "file:vendor/tarballs/ui-kit-0.283.0.tgz"
```

- Тарбол лежит в `vendor/tarballs/ui-kit-0.283.0.tgz`, ставится без приватного registry.
- В `package.json` тарбола `dependencies` обнулены (внутренние `@v-uik/*` уже забандлены в `dist/`).
- Vite alias `react-dom/server → react-dom/server.browser.js` нужен kit'у (SSR-ветка темы).
- `dedupe: ["react","react-dom"]` + alias на каноничные пути защищают от двойного React.

Проверка чистого клона (`rm -rf node_modules bun.lock && bun install`):

| Команда | Результат |
| --- | --- |
| `bun install` | OK, 335 пакетов |
| `bun run build` | ✓ 4.7s, 571 kB JS / 294 kB CSS |
| `bun run lint` | 0 errors, 14 warnings (pre-existing) |
| Playwright smoke (`/`) | 0 runtime errors, главный экран рендерится |

## 2. Shared-слой и отсутствие циклов

```
src/shared/ui/
├── index.ts              # единственный публичный barrel
├── adapters/kit.ts       # обёртки над @sber-orm/ui-kit (Loader, Text, Title, Chips, Icon)
└── legacy/
    ├── shadcn.ts         # ре-экспорт shadcn-примитивов
    └── icons.ts          # ре-экспорт lucide-react
```

**Цикл устранён.** Раньше `src/components/ui/*` импортировали иконки из `@/shared/ui`,
что давало `shared/ui → components/ui → shared/ui`. Заменено на прямой `lucide-react`
во всех 18 файлах `src/components/ui/*`. Проверка:

```
$ rg "from \"@/shared" src/components/ui/
(пусто)
```

ESLint `no-restricted-imports` запрещает в продуктовом коде:
- `lucide-react`, `@radix-ui/*`, `@/components/ui/*`.
Разрешения только в `src/shared/ui/**` и `src/components/ui/**`.

## 3. Поэлементный статус базовых компонентов

| Компонент | Статус | Причина |
| --- | --- | --- |
| `Loader` | ✅ **kit** (`adapters/kit.ts`) | Аналога в shadcn не было; props `ILoaderProps` (color/size/classes/absolute) совместимы; визуальной регрессии нет. |
| `Button` | ⛔ legacy (shadcn) | Несовместимые props: `variant` (`default|destructive|outline|secondary|ghost|link` vs kit `primary|secondary|tertiary|warning|danger|ghost|ellipse|function|ai`), `size` (`default|sm|lg|icon` vs kit `XXS..XL`), **`asChild` (Radix Slot)** — используется в продукте (`AssessmentModal.tsx`), в kit отсутствует. Свитч ломает визуал и `asChild`-композицию. |
| `Input` | ⛔ legacy (shadcn) | Kit `IInputProperties` навязывает label/helperText/canClear и фирменное оформление (border-radius/высота/префиксы). Продукт использует Input как голый Tailwind-инпут (`<Input className="...">` в фильтрах, поиске, drawer'ах). Свитч изменит визуал и сломает кастомные className. |
| `Textarea` | ⛔ legacy (shadcn) | Kit `ITextareaProperties` опускает `size`/`resize` и добавляет `labelInside`, `maxLength`, счётчик. Продукт использует как голую textarea в `AssessmentCommentDrawer`, `AssessmentCorrectionDrawer`. Визуальный сдвиг. |
| `Checkbox` | ⛔ legacy (shadcn/Radix) | Продукт использует Radix-API: `checked` + `onCheckedChange`. Kit `Checkbox` принимает MUI-стиль `onChange(event, checked)`. Не drop-in. Call-sites: `ProcessFilterDrawer`, `DrpaDataUpdateDrawer`. |
| `Switch` | ⛔ legacy (shadcn/Radix) | То же: `onCheckedChange` vs `onChange`. Call-site: `Index.tsx` (переключатель режима). |
| `Badge` | ⛔ legacy (shadcn) | Kit `IBadgeProps` основан на `EBadgeSize`+цветовых токенах и точечном использовании (нотификации, маркеры). В проекте `Badge` — текстовый чип с `variant=outline|secondary|destructive` и произвольным `className`. Близкий kit-эквивалент — `Chips` (другой компонент, уже доступен через adapters под именем `Chips`). |
| `Tooltip` | ⛔ legacy (shadcn/Radix) | Kit `Tooltip` — единый компонент с props `content`/`children`. Продукт использует композитный API `Provider/Root/Trigger/Content` с `sideOffset`, кастомными классами и порталом. Свитч требует переписывания всех call-site. |

Все «kit-эквиваленты» доступны параллельно: `Text`, `Title`, `Chips`, `Icon`, `Loader`
уже экспортируются из `@/shared/ui` и могут использоваться в новых компонентах без
правок call-site.

## 4. Композитные компоненты (вне scope этой итерации)

`Dialog`, `Sheet`, `Drawer`, `Select`, `Tabs`, `Sonner` оставлены legacy. Причины
зафиксированы выше + специфические композиции (sticky header/footer, in-modal drawer,
кастомный `DialogPrimitive`). Миграция — отдельная итерация.

## 5. Lucide иконки

Централизованы в `src/shared/ui/legacy/icons.ts`. Прямой импорт `lucide-react` в
продуктовом коде запрещён. Маппинг lucide → kit `EIconName` не сделан (требует
явного словаря; визуального профита без полной замены `<Icon>` нет).

## 6. Smoke-проверки (Playwright, headless)

- `/` — главный экран рендерится, **0 runtime errors / 0 console errors**.
- Карточка контрагента, основная модалка оценки, RiskDrawer, AddContractDrawer,
  поиск, фильтры, ввод в Input/Textarea, Checkbox/Switch, закрытие overlay,
  уведомления — открываются в текущем preview без визуальных регрессий
  (handled через сохранение shadcn-реализации для этих примитивов).

## 7. Что осталось блокером

1. Согласовать таблицу маппинга вариантов **shadcn → kit** для Button/Input/Badge.
2. Решение по composite (`Dialog`/`Sheet`/`Tabs`/`Select`) с учётом kit `Modal` API.
3. Маппинг lucide → `EIconName`.
4. Единый source-of-truth для дизайн-токенов (Tailwind v4 + SCSS kit пока сосуществуют).
