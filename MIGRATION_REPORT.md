# MIGRATION_REPORT

Дата: 20.06.2026 (вторая часть первой итерации)
Цель: воспроизводимая сборка после чистого клонирования + перевод продуктового кода на единый shared-слой.

## 1. Воспроизводимость репозитория

**Проблема предыдущего шага.** Alias `@sber-orm/ui-kit` → `vendor/sber-orm-ui-kit/dist/...`,
но папка `dist` отсутствовала в GitHub (исключена `.gitignore`). После клонирования
сборка падала: `Cannot find module '@sber-orm/ui-kit'`.

**Решение.** Kit подключён как локальная file-зависимость:

```json
"@sber-orm/ui-kit": "file:vendor/tarballs/ui-kit-0.283.0.tgz"
```

- Тарбол `vendor/tarballs/ui-kit-0.283.0.tgz` хранится в репозитории и не зависит
  от временного окружения Lovable.
- В `package.json` тарбола обнулены `dependencies` (внутренние `@v-uik/*` пакеты не
  публикуются в npm и уже забандлены в `dist/`). Пакет ставится без внешних
  обращений и без приватного registry.
- Vite/TS alias на `vendor/sber-orm-ui-kit/dist` удалён — продукт импортирует
  `@sber-orm/ui-kit` напрямую из `node_modules`.
- Вспомогательная папка `vendor/sber-orm-ui-kit/` удалена.

**Vite корректировки**, нужные для kit:

- alias `react-dom/server` → `react-dom/server.browser.js`. Kit транзитивно
  использует `react-dom/server` (через `react-jss`/SSR-ветку темы), node-вариант
  ломается в браузере ошибкой `Cannot read properties of undefined (reading 'prototype')`.
- `dedupe: ["react", "react-dom"]` и явный alias на каноничные пути react —
  защита от двойного runtime (kit имеет `react` в `dependencies`, перенесён в
  `peerDependencies` при репаке).

**Проверка чистого клона.** Выполнено `rm -rf node_modules bun.lock && bun install`:

| Команда | Результат |
| --- | --- |
| `bun install` (с нуля) | OK, 335 пакетов, kit подтягивается из vendored tgz |
| `bun run build` | ✓ built in ~5s, 571 kB JS / 294 kB CSS |
| `bun run lint` | 0 errors, 14 warnings (все warnings — pre-existing, не связаны с миграцией) |
| `vite dev` preview | поднимается, runtime-ошибок нет, главный экран рендерится |

## 2. Перевод продуктового кода на `@/shared/ui`

### Структура shared-слоя

```
src/shared/ui/
├── index.ts                # единственный публичный barrel
├── adapters/
│   └── kit.ts              # обёртки над @sber-orm/ui-kit: Text/Title/Chips/Loader/Icon
└── legacy/
    ├── shadcn.ts           # ре-экспорт всех используемых shadcn-примитивов
    └── icons.ts            # ре-экспорт используемых lucide-иконок
```

Продуктовый код импортирует ВСЁ только из `@/shared/ui`. Внутри barrel сам
решает, что отдать из kit, а что временно — из shadcn/lucide.

### Что мигрировано (импорты)

Bulk-replace по `src/` (без `src/shared/**` и `src/components/ui/**`):

- `lucide-react` → `@/shared/ui` (48 файлов)
- `@/components/ui/{button,input,checkbox,switch,textarea,badge,tooltip,skeleton,label,separator,dialog,sheet,select,tabs,sonner}` → `@/shared/ui` (~27 файлов)
- `@radix-ui/react-dialog` (использовался для кастомных модалок) → `@/shared/ui` (`DialogPrimitive`)

После миграции:

```
$ rg "from \"@/components/ui/" src/ --glob '!src/components/ui/**' --glob '!src/shared/**'
(пусто)

$ rg "from \"lucide-react\"" src/ --glob '!src/shared/**'
(пусто)

$ rg "from \"@radix-ui/" src/ --glob '!src/components/ui/**' --glob '!src/shared/**'
(пусто)
```

### Что выставляет `@/shared/ui` сейчас

| Имя | Источник | Комментарий |
| --- | --- | --- |
| `Button`, `Input`, `Checkbox`, `Switch`, `Textarea`, `Badge`, `Tooltip*`, `Label`, `Separator`, `Skeleton` | shadcn (через legacy) | Кодовая миграция выполнена; визуальный свитч на kit отложен до согласования таблицы вариантов (kit: `primary/secondary/tertiary/ghost`, `XXS..XL` vs shadcn: `default/destructive/outline`, `sm/lg/icon`). До тех пор `Skeleton` фактически играет роль `Loader` для shadcn-кейсов. |
| `Dialog*`, `Sheet*`, `Select*`, `Tabs*`, `Toaster`, `DialogPrimitive` | shadcn / radix (через legacy) | Композитные компоненты, kit-замена идёт отдельной итерацией (см. п. ниже). |
| `Text`, `Title`, `Chips`, `Loader`, `Icon`, `EIconName`, `ETitleSize`, `ETextSize` | `@sber-orm/ui-kit` (через adapters) | Базовые «новые» имена для продуктового кода. Можно использовать в новых компонентах без правок call-site в будущем. |
| Все используемые `lucide`-иконки (`X`, `ChevronDown`, `Trash2`, ...) | `lucide-react` (через legacy/icons) | Маппинг lucide → `EIconName` kit'а не закрыт 1-в-1; до согласованной таблицы — единая точка lucide-иконок. |

### ESLint enforcement

`eslint.config.js` теперь содержит `no-restricted-imports`:

- Запрещены `lucide-react`, `@/components/ui/*`, `@radix-ui/*` во всём проекте.
- Разрешены только внутри `src/shared/ui/**` и `src/components/ui/**` (legacy-слои).
- Сообщения на русском поясняют, куда переезжать.

`bun run lint` → 0 errors. Любая попытка импортировать `lucide-react`/shadcn-примитив
напрямую теперь падает с понятным сообщением.

### Лёгкие фиксы в коде

- `ComplexAssessmentModal.tsx`, `AssessmentGroupDrawer.tsx`: `useState` вызывался
  после раннего `return null` — нарушение rules-of-hooks. Перенесено наверх (сделано
  в предыдущем шаге).
- Прежние правки React 19 → 18.3.1, `overrides`/`resolutions` — без изменений.

## 3. Что НЕ сделано (осознанно)

| Пункт | Статус | Почему |
| --- | --- | --- |
| Замена shadcn-импл. `Button/Input/...` на kit с сохранением API через adapters | НЕ начато | Требует согласованной таблицы маппинга вариантов и регресса экранов; на этой итерации кодовая миграция важнее визуальной. Adapters-точка готова (`src/shared/ui/adapters/kit.ts`). |
| Замена `Select` / `Modal` / `Drawer` / `Sheet` / `Tabs` на kit | НЕ начато | API расходится сильнее всего, требует переработки композиции (sticky header/footer, in-modal drawer, кастомные `DialogPrimitive`-обёртки). Изолированы в `legacy/shadcn.ts`. |
| Полный переход lucide → kit `<Icon>` | НЕ начато | Нужен явный словарь lucide → `EIconName`. Сейчас всё централизовано в `legacy/icons.ts`; визуально и по API ничего не меняется. |

## 4. Smoke-проверки (фактически выполнены через Playwright)

- Главный экран `/index` рендерится без runtime-ошибок (после фикса `react-dom/server` alias).
- Сайдбар, header, виджет «Я проанализировал ...», карточки портфеля, список дебиторов, фильтры по признакам, поиск, кнопка «Запустить проверку» — на месте, верстка не сломана.

## 5. Что осталось блокером для следующих итераций

1. Таблица маппинга вариантов **shadcn → kit** для `Button/Input/Checkbox/...`.
   Без неё нельзя переключить реализацию под `@/shared/ui` без UX-регресса.
2. Решение по `Drawer/Sheet` (в kit нет drop-in аналога) и по `DialogPrimitive`-кейсам.
3. Маппинг **lucide → `EIconName`** или явное архитектурное решение оставить
   `lucide-react` как «iconography legacy».
4. CSS-конфликт: Tailwind v4 и SCSS-токены kit живут параллельно. Работает, но
   долгосрочно — единый source-of-truth для дизайн-токенов.

## Файлы изменены

- `package.json` — `@sber-orm/ui-kit` как `file:` зависимость
- `vendor/tarballs/ui-kit-0.283.0.tgz` — добавлен в репозиторий
- `vendor/sber-orm-ui-kit/` — удалён
- `vite.config.ts` — alias на vendor убраны, добавлен `react-dom/server` → browser
- `tsconfig.json` — path на vendor убран
- `eslint.config.js` — `no-restricted-imports` для lucide / radix / shadcn
- `src/shared/ui/{index,adapters/kit,legacy/shadcn,legacy/icons}.ts` — единый shared-слой
- ~50 файлов в `src/components/counterparty/`, `src/pages/`, `src/lib/` — переключение импортов
