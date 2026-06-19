# MIGRATION_REPORT

Дата: 19.06.2026
Итерация: подключение корпоративного `@sber-orm/ui-kit` к существующему Lovable-прототипу.

## Что сделано

### 1. Починили локальную установку, build и preview

- React был на 19.2 — не совместим с `@sber-orm/ui-kit@0.283.0` (kit заявлен на React 18.3.1
  и в собственных `dependencies`, не `peerDependencies`). Это гарантировало бы установку
  второго runtime React.
- Зафиксировали версии через `overrides` и `resolutions` в `package.json`:
  - `react@18.3.1`, `react-dom@18.3.1`
  - `@types/react@18.3.12`, `@types/react-dom@18.3.1`
- Полная переустановка зависимостей (`rm -rf node_modules bun.lock && bun install`).
- Проверено: в `node_modules/@types` теперь ровно одна копия `react` (18.3.12),
  вложенной копии `react@19` внутри `@types/react-dom` больше нет.

### 2. Подключили UI-kit как внешний пакет `@sber-orm/ui-kit`

- Архив `ui-kit-0.283.0.tgz` распакован в `vendor/sber-orm-ui-kit/`. `dist/` уже собран,
  поэтому используем его как рабочий entry point — `dist/index.js` и `dist/index.css`.
- `vite.config.ts`:
  - alias `@sber-orm/ui-kit` → `vendor/sber-orm-ui-kit/dist/index.js`
  - alias `@sber-orm/ui-kit/index.css` → соответствующий css
  - принудительный `dedupe: ["react", "react-dom"]` и alias на `node_modules/react(-dom)`
  - `optimizeDeps.exclude: ["@sber-orm/ui-kit"]` чтобы Vite не пытался pre-bundle vendor
  - `server.fs.allow` расширен на корень репозитория для чтения `vendor/`
- `tsconfig.json`: добавлен path `@sber-orm/ui-kit` → `vendor/sber-orm-ui-kit/dist/index.d.ts`,
  что даёт типы и автокомплит без публикации пакета.
- `src/main.tsx`: `import "@sber-orm/ui-kit/index.css"` подключён ДО `./styles.css`,
  чтобы Tailwind/проектные стили могли точечно переопределять.

### 3. Проверка одного runtime React

- `find node_modules/@types -type d -name react` возвращает только одну запись.
- `find node_modules -type d -name react` возвращает только корневую копию.
- Vite alias дополнительно фиксирует единственный путь резолва.

### 4. Внешний контракт продуктового кода

- Создан barrel `src/shared/ui/index.ts`, который ре-экспортирует именно те имена,
  которые перечислены в задаче: `Button, Input, Text, Title, Icon, Checkbox, Switch,
  Textarea, Badge, Loader, Tooltip, Chips` плюс типы. Это единственный рекомендованный
  путь импорта для нового кода:

  ```ts
  import { Button, Icon, Text } from "@/shared/ui";
  ```

  При переходе на NPM-публикацию kit достаточно изменить один файл.

### 5. Лёгкие фиксы кода ради зелёного lint

- `ComplexAssessmentModal.tsx`, `AssessmentGroupDrawer.tsx`: `useState` вызывался
  после `if (!x) return null` — нарушение rules-of-hooks. Перенесено наверх.
- `.prettierignore` и `eslint.config.js` расширены секцией `vendor`, чтобы vendor-код
  kit не ломал lint/format проекта.

## Что НЕ сделано (осознанно)

| Пункт задания | Статус | Почему |
| --- | --- | --- |
| Массовая замена `@/components/ui/{button,input,checkbox,switch,textarea,badge,tooltip}` на kit | НЕ начато | API kit (`variant: primary/secondary/tertiary/ghost/...`, `size: XXS..XL`) не совпадает 1-в-1 с shadcn (`variant: default/destructive/outline/...`, `size: default/sm/lg/icon`, плюс `asChild`). Простая подмена «в лоб» поломает десятки call-site и `cva`-варианты. Нужен отдельный sweep с маппингом per-component и регрессом по экранам. Инфраструктура готова — продуктовые компоненты теперь могут импортировать `@/shared/ui` точечно. |
| Замена `Select`, `Modal`, `Drawer`, `Sheet`, `Accordion` | НЕ начато | В kit есть `Modal`, `Select`, `Accordion`, но нет прямого `Drawer`/`Sheet`. Текущие модалки/draweры (`InModalDrawer`, кастомные complex-модалки) сильно завязаны на собственную композицию (sticky header, footer, in-modal drawer слайд). Замена требует переработки композиции и отдельной задачи дизайна. |
| Удаление прямых импортов `lucide-react` и `@/components/ui/*` из продуктового кода | НЕ начато | Используется в ~50+ файлах. Будет сделано вместе с миграцией компонентов выше, чтобы избежать двойной правки. |
| Изоляция legacy в одном месте | Частично | shadcn-примитивы остаются в `src/components/ui/*`, lucide-иконки — прямо в файлах. Цель «один legacy-слой» достигается переездом на `@/shared/ui` (см. след. шаги). |

## Результаты проверок (фактически выполнены)

| Команда | Результат |
| --- | --- |
| `bun install` | OK, 334 пакета, единый React 18.3.1 |
| `bun run build` | ✓ built in 3.63s, 571 kB JS / 294 kB CSS (kit CSS подключён) |
| `bun run lint` | 0 errors, 14 warnings (все warnings — pre-existing, не связаны с миграцией) |
| `vite dev` (preview) | поднимается auto-restart после `bun install`, доступен на `localhost:8080` |

## Известные ограничения / блокеры для следующей итерации

1. **API mismatch kit ↔ shadcn.** Прежде чем массово менять `Button`/`Input`, нужно
   зафиксировать таблицу маппинга вариантов и размеров. Без неё пострадает UX.
2. **`asChild` / `Slot`.** shadcn-компоненты в проекте местами используют `asChild`
   (composition pattern Radix). У kit-компонентов аналога нет — потребуются ручные
   обёртки в `src/shared/ui` для соответствующих кейсов.
3. **Иконки.** Сейчас везде `lucide-react`. У kit свой набор `EIconName` через `<Icon />`.
   Нужно либо сделать словарь `lucide → EIconName`, либо оставить `lucide-react` как
   единственный «iconography legacy» и пометить это в архитектурном решении.
4. **Drawer/Sheet.** В kit нет drop-in замены. Решение по архитектуре drawers нужно
   обсудить с дизайном (адаптер на основе `Modal` kit vs сохранение текущей реализации).
5. **CSS-конфликт.** Tailwind v4 и SCSS-токены kit живут параллельно. Пока работает,
   но в будущем стоит вынести kit-токены в общий source-of-truth.
6. **`bun-types` отсутствуют** — TS ошибок нет благодаря `skipLibCheck`, но при включении
   строгого режима всплывут.

## Следующие безопасные шаги (рекомендация)

1. Согласовать таблицу маппинга вариантов `Button`/`Input`/`Checkbox` shadcn → kit.
2. Поштучно (по экранам) переключать импорты на `@/shared/ui`, удаляя shadcn-файлы
   после полной отвязки.
3. Параллельно ввести eslint-правило `no-restricted-imports` на `@/components/ui/*`
   и `lucide-react`, чтобы новый код шёл только через `@/shared/ui`.
4. Принять решение по `Drawer`/`Sheet` и `Select` (kit vs кастом) до их миграции.
