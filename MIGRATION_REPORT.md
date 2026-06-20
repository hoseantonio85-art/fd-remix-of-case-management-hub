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

---

## Iteration 2 — architecture and data

### Extracted data and business logic

- Доменные типы и чистые хелперы вынесены из `src/lib/*` в `src/domain/`:
  - `src/domain/counterparty.ts` — типы `Counterparty`, `Contract`, `RiskSignal`, `RiskType`, `CollectionSubStep`, `ProcessStage`, константа `measuresByRisk`, чистые хелперы `getCounterpartyProblemIndicators`, `searchCounterparties`.
  - `src/domain/assessment.ts` — типы `Assessment`/`AssessmentGroup`/`AssessmentCriterion`, `buildAssessment`, `groupCounts`, `sumGroupCounts`, `statusFromPassed`, `toneStyles`, `criterionStatusMeta`.
- Mock-датасет (`counterparties`, `makeCollection`, `todayLabel`) перенесён в `src/data/mock/counterparties.ts`. UI-код к нему напрямую больше не обращается.
- `src/lib/mock-data.ts`, `src/lib/assessment-data.ts`, `src/lib/problem-indicators.ts` оставлены как **deprecated re-export shims** на короткий период совместимости.

### Created domain models, hooks and repositories

```
src/domain/
  counterparty.ts        # типы + чистая бизнес-логика
  assessment.ts          # типы + builder/aggregators
src/data/
  mock/counterparties.ts # in-memory dataset
  repositories/
    types.ts             # CounterpartyRepository, AssessmentRepository
    mock/counterparty.ts # имитация async + in-memory mutations
    mock/assessment.ts
    index.ts             # единственная точка выбора реализации
src/hooks/
  useCounterparties.ts   # data/filtered/status/error/refetch/updateStatusLocally/prepend
  useAssessment.ts       # run()/reset()/loading/error
```

Точка переключения mock → http — `src/data/repositories/index.ts`. Mock-репозитории имитируют сетевую задержку через `VITE_MOCK_LATENCY_MS` (по умолчанию 250 мс).

### Refactored modules

- `src/pages/Index.tsx` теперь получает контрагентов через `useCounterparties()`, не импортирует `@/lib/mock-data` напрямую. Локальные `addedCounterparties` / `statusOverrides` / `statusChanges` сохранены как UI-состояние поверх данных репозитория. DRPA-карточки заполняются через `useEffect` после первой загрузки.
- Все 17 UI-компонентов counterparty-домена переключены с `@/lib/mock-data` → `@/domain/counterparty` и с `@/lib/assessment-data` → `@/domain/assessment` (массовый sed; импорты типов не изменились семантически).
- `CounterpartyModal.tsx` сохранил структуру — менялся только источник типов. Дробление компонента отложено: его ответственность — это полностью композиция (RiskDrawer, ContractDrawer, AssessmentModal, DebtProcessDrawer и т.п. уже выделены), и дальнейшее разделение без архитектурной необходимости не оправдано на этой итерации.

### Implemented states

В `useCounterparties` реализованы реальные состояния: `loading | refreshing | success | empty | error`. Состояния доступны в preview через query-параметр `?state=loading|error|empty`:

- `loading` — спиннер «Загружаем список контрагентов…»
- `error` — карточка с сообщением об ошибке + кнопка «Повторить» (`refetch`)
- `empty` — текст «Список контрагентов пуст»

В нормальном режиме mock-задержка ~250 мс кратко проявляет loading-стейт.

### Remaining architectural debt

1. **`CounterpartyModal.tsx` (869 строк)** содержит большой пул `useState` для рисков/договоров/шагов взыскания. Кандидат на выделение в `useCounterpartyCard(cp)` hook + sub-views (RisksTab, DebtTab) — но требует продуктового тест-плана. Отложено в следующую итерацию.
2. `RunCheckDialog` → `setChecks` с `setTimeout` остаётся в `Index.tsx`. Кандидат на `useChecks()` hook с `CheckRepository`.
3. `statusOverrides` / `statusChanges` / `addedCounterparties` — UI-state, который логически принадлежит репозиторию (после http-backend они отпадут). Сейчас выкидывать преждевременно.
4. `src/lib/*` shim'ы — удалить, когда внешние интеграции (если есть) перестанут на них ссылаться.

### Verification

| Проверка | Результат |
| --- | --- |
| `bun install` (clean) | OK |
| `bun run build` | ✓ 4.54s, 574 kB JS / 294 kB CSS |
| `bun run lint` | 0 errors, 14 warnings (pre-existing) |
| Playwright `/` | 0 runtime errors |
| Playwright `?state=loading` | 0 runtime errors, виден спиннер |
| Playwright `?state=error` | 0 runtime errors, видна error-карточка + Retry |
| Playwright `?state=empty` | 0 runtime errors, виден empty-text |

Визуальная композиция, маршрутизация, тексты и продуктовые сценарии не изменялись.

---

## Iteration 2.1 — wiring data layer to real scenarios

### Hooks подключены к UI

- **`useCounterparties`** — расширен:
  - `add(cp)` идёт через `counterpartyRepository.add()` + локальная синхронизация;
  - `updateStatus(inn, st)` идёт через `counterpartyRepository.updateStatus()` (раньше был `updateStatusLocally`).
  - В `Index.tsx` удалены `addedCounterparties` и `statusOverrides`. Список приходит сразу из hook (`data: allCounterparties`). Остался только `statusChanges` — чисто визуальный бейдж «Статус изменён», который не дублирует данные.

- **`useChecks` + `mockCheckRepository`** (новое):
  - Mock-репозиторий с переходом `running → done` через таймер внутри репо (не в UI).
  - `subscribe()` push-уведомляет хук об изменениях.
  - `run()` / `remove()` доступны UI без работы с таймерами.
  - В `Index.tsx` удалены: ручной `setChecks`, `window.setTimeout` для перехода в `done`, прямые мутации массива checks.

- **`useAssessment`** — теперь реально используется:
  - `Index.tsx` создаёт две инстанции (`assessmentForChecks`, `assessmentForComplex`) вместо прямого `buildAssessment`. Loading прокидывается в `AssessmentModal` через `running`.
  - `CounterpartyModal.tsx` использует hook и для авто-оценки при открытии карточки, и для ручного re-run по кнопке.

- **`useCounterpartyCard`** (новое):
  - Лифт `risks` / `contracts` / `steps` из `CounterpartyModal` + персистентные мутации `persistRisk`, `persistContract`, `persistCollectionStep`.
  - Инициализация state при `open && counterparty` живёт в hook (раньше — в `useEffect` модалки).
  - UI-state (notifications, stepAnim, history, completedFields) остался в модалке — это чистая презентация и не относится к данным карточки.

### Repository расширен

`CounterpartyRepository` теперь содержит:

```
list, byInn,
add,
updateStatus,
saveRiskDecision,
addOrUpdateContract,
updateCollectionStep
```

`CheckRepository`:

```
list, run, remove, subscribe
```

Реализации — `src/data/repositories/mock/{counterparty,assessment,check}.ts`. Точка переключения mock → http по-прежнему `src/data/repositories/index.ts`.

### Domain очищен от UI

- Из `src/domain/assessment.ts` удалены `criterionStatusMeta` (UI-presentation) и `toneStyles` (UI-presentation, ранее не использовалась — header'ы продолжают пользоваться `./header-theme`).
- `criterionStatusMeta` + `assessmentChangeToneStyles` переехали в `src/components/counterparty/assessment-ui.ts`. `AssessmentGroupDrawer.tsx` теперь импортирует оттуда.
- Mock-данные оценки (`defaultGroups`, `buildAssessment`, `toPositiveGroups`, ok/nd/risk helpers) переехали в `src/data/mock/assessment.ts`. `src/data/repositories/mock/assessment.ts` импортирует builder оттуда.
- В `src/domain/assessment.ts` остались только: типы, `statusFromPassed`, `groupCounts`, `sumGroupCounts`, `MAIN_GROUP_IDS`, `OTHER_GROUP_IDS`.

### Что осталось в `Index.tsx` / `CounterpartyModal.tsx`

- **`Index.tsx`** — UI-композиция (tiles, chips, donut, layout), routing подпотока manual-assessment, статус-changes badge. Никакой бизнес-логики оценки, мутаций контрагентов или setTimeout по проверкам.
- **`CounterpartyModal.tsx`** — UI-композиция модалки + UI-state (notifications, stepperError, history, stepAnim, completedFields), которые остались как чистая презентация. Stepper-правила (`advanceStage`, `rollbackStage`, `moveCurrentStep`) — UI-flow с правилами валидации, не основная бизнес-логика. Дальнейшее дробление stepper в отдельный hook возможно, но избыточно для текущей итерации.

### Verification

| Проверка | Результат |
| --- | --- |
| `bun install` (clean) | OK |
| `bun run build` | ✓ 4.37s, 577 kB JS / 294 kB CSS |
| `bun run lint` | 0 errors, 14 warnings (pre-existing) |
| Playwright `/` | 0 runtime errors |
| Playwright `?state=loading\|error\|empty` | 0 runtime errors |
| Playwright «Запустить проверку» / открытие карточки | 0 runtime errors |

UX, визуал и сценарии не менялись.

### Остаточный долг

1. `Index.tsx` локально вычисляет `byProcess` / `byCategory` / `riskCounts` / `filtered` поверх `data` из hook — это UI-derivations (tile chip + process), не дублирующая фильтрация. Можно перевести в `useCounterparties.filters` после согласования product-логики chip-фильтров. Сейчас оставлено как есть.
2. Stepper-логика в `CounterpartyModal` (advanceStage / rollbackStage с правилами «нельзя в суд без сверки» и т.п.) — кандидат на `useDebtStepper`. Не делалось, чтобы не задеть многочисленные UI-привязки (notifications + history + stepAnim).
3. `manualAssessment` flow (правка статуса контрагента из AssessmentModal) пока работает через локальный state в `Index.tsx` без отдельного hook — это переходный сценарий, который уйдёт после унификации флоу проверок.
4. `src/lib/*` shim'ы по-прежнему остаются для внешней совместимости.

---

## Итерация 2.2 — исправления mutations и состояний (20.06.2026)

### Что починено

1. **Сохранение решения по риску.** В `CounterpartyModal.handleSave` вычисляется
   обновлённый `RiskSignal` и именно он передаётся в `persistRisk`
   (раньше уходил `prevRisk`). При ошибке persist делаем rollback локального
   state и показываем `toast.error`; toast.success — только после успешного
   завершения repository-операции.
2. **Persistence этапов взыскания.** `advanceStage` и `rollbackStage` теперь
   вызывают `persistCollectionStep` для двух изменённых шагов (done+current
   или current→upcoming + prev→current). Ошибка → rollback к снимку `steps`
   и toast.error.
3. **Persistence этапа договора.** `advanceContractStage` вычисляет
   обновлённый `Contract` и сохраняет через `persistContract`.
4. **Assessment loading/error UI.** `AssessmentModal` больше не возвращает
   `null` при `assessment === null` — показывает спиннер «Готовим оценку…»,
   либо блок ошибки с кнопкой «Повторить» (`onRetry`). Новые props
   `error`, `onRetry` пробрасываются из `useAssessment.error` в
   `CounterpartyModal` и в Index-флоу проверок.
5. **Checks flow.** В `Index.tsx` подключены `useChecks.error` (toast.error
   через useEffect) и обёртки `runCheck`/`removeCheck`, которые блокируют
   повторный вызов через `checkActionId` и показывают ошибку запуска/удаления.
6. **Поиск по списку.** `searchValue` теперь реально фильтрует список
   через `searchCounterparties(list, searchValue)` в `filtered`-мемоизации.

### Проверки

| Команда / сценарий | Результат |
| --- | --- |
| `bun run build` | ✓ 4.76s, 579 kB JS / 294 kB CSS |
| `bun run lint` | 0 errors, 14 warnings (pre-existing) |
| Playwright smoke `/` + поиск «Сигма» | 0 runtime / console errors |
| Поиск по названию и ИНН | работает |
| Изменение статуса | через `updateCounterparties.updateStatus` |
| Решение по риску | persist в repo, toast после успеха |
| Advance/rollback этапа | persist обоих изменённых шагов |
| Запуск/удаление проверки | блокируются повторно, ошибки → toast |
| Loading/error/retry оценки | спиннер и блок ошибки в `AssessmentModal` |

### Остаточный долг

- Глобального loading-индикатора для inflight-mutations пока нет
  (используется локальный disabled на конкретных кнопках там, где это
  критично). Полноценный `useMutation`-слой откладывается до интеграции
  с реальным HTTP-репозиторием.
- Для batched-mutations (rollback нескольких шагов) пишется один общий
  snapshot — этого достаточно для mock-репозитория с фиксированной
  задержкой; при появлении конкурентных операций потребуется версионирование.
