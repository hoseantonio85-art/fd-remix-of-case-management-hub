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

## Итерация 2.3 — финальные критичные исправления

### Что исправлено

1. **Risk → связанные изменения этапа.** В `CounterpartyModal.handleSave`
   при confirm/dismiss, который сдвигает текущий этап, теперь действительно
   персистируются изменённые `CollectionSubStep` через
   `persistCollectionStep`. Введён хелпер `shiftCurrentStep(delta)`,
   возвращающий список изменённых шагов; результат отправляется в repo
   с обработкой ошибки (toast.error, без повторного rollback —
   локальный state остаётся согласованным с попыткой пользователя).
2. **Contract stage — compute → persist → setContracts.**
   `advanceContractStage`, `addOverdue` и `onUpdateContract` теперь
   вычисляют новый `Contract` снаружи setState-апдейтера,
   синхронно обновляют state и drawer, затем вызывают `persistContract`
   с rollback’ом локального state при ошибке. Дублирующая логика
   в `ContractDrawer onAdvanceStage` использует единый `stageOrder`.
3. **AddContractDrawer.** `toast.success` теперь показывается только
   после успешного `persistContract`; при ошибке — rollback + toast.error.
4. **Assessment retry без пустого ИНН.** Для проверок (`AssessmentModal`
   в Index) `onRetry` использует `assessment.inn ?? check.inn`; если
   ИНН недоступен — `toast.error("Не указан ИНН для повторной оценки")`,
   запрос не отправляется.
5. **Checks flow.** `useChecks.run/remove` теперь пробрасывают ошибки
   вызывающему коду (`throw e` после `setError`). В Index `runCheck`/
   `removeCheck` тоже пробрасывают. Сообщение «Результат проверки удалён»
   показывается только после успешного `removeCheck`. Неиспользуемый
   `void retryChecks` удалён.
6. **`addCounterparty` / `updateStatus`.** `handleStatusChange` и
   manual-flow `handleManualFlowCpOpenChange` больше не показывают
   success-toast до завершения repository-операции — оптимистично
   обновляют UI, await’ят repo, откатывают state и показывают error
   при сбое. Аналогично для check/complex `onAddToList`.

### Проверки

| Команда / сценарий | Результат |
| --- | --- |
| `bun run build` | ✓ 4.58s, 580 kB JS / 294 kB CSS |
| `bun run lint` | 0 errors, 14 warnings (pre-existing) |
| Risk confirm/dismiss со сдвигом этапа | persist всех изменённых шагов |
| Contract advance / overdue / update | compute → setState → persist с откатом |
| Add contract | toast только после persist |
| Assessment retry с пустым ИНН | блокируется toast’ом, запрос не уходит |
| Run/remove check | ошибки доходят до вызывающего кода, success post-await |
| Status change / addCounterparty | success-toast только после repo |

### Остаточный долг

- Для batched-операций (несколько шагов / отката статуса) rollback
  делается покомпонентно из snapshot; конкурентные мутации одного
  контрагента всё ещё не сериализуются — добавится вместе с HTTP-слоем.
- `useAssessment` пока не сохраняет последний использованный ИНН,
  поэтому retry в check-флоу опирается на `check.inn`; при переходе
  на HTTP-репозиторий разумно передавать context внутрь хука.
- Глобальный mutation-layer (toast/progress политика, in-flight reg)
  всё ещё откладывается до подключения backend.

## Итерация 2.4 — консистентность UI ↔ repository (20.06.2026)

### Что исправлено

1. **Risk + связанные этапы — одна UI-операция.**
   `CounterpartyModal.handleSave` теперь персистирует риск и изменённые
   `CollectionSubStep` одним `Promise.all([persistRisk, ...persistCollectionStep])`.
   `toast.success("Решение по риску сохранено")` показывается только
   когда успешны ВСЕ вызовы. При ошибке откатываются и `risks`, и `steps`
   (snapshot `prevSteps` берётся до `shiftCurrentStep`). Два разных
   toast’а на одну операцию больше не появляются.
2. **Contract stage rollback включает drawer.** В `advanceContractStage`
   теперь обновляется и откатывается одновременно `contracts` и
   `contractDrawer` — раньше при ошибке UI оставлял drawer на новом этапе,
   а список возвращался на старый. Дублирующая логика обновления drawer
   в `onAdvanceStage` callback’е удалена.
3. **`useCounterparties.add/updateStatus` — rollback внутри hook.**
   - `updateStatus` запоминает текущий `status` контрагента в `setData`
     functional updater, выполняет repo-вызов и при ошибке возвращает
     состояние. Локальные `active`/`manualFlowTarget` в `Index`
     откатываются как раньше.
   - `add` оптимистично добавляет контрагента, в случае ошибки удаляет
     его из списка и восстанавливает прежний `LoadStatus`
     (важно для `empty → success → empty`).
4. **`useAssessment` очищает старый результат.** На каждом `run()`
   `assessment` сбрасывается в `null` до запроса; ошибка тоже обнуляет
   результат. Повторный сбой больше не оставляет старую оценку
   как «актуальную»; UI показывает loading/error поверх пустого state.
5. **Checks — один способ показа ошибки.**
   - Удалён `useEffect`, который дублировал toast по `checksError`.
   - `runCheck` в Index больше не пробрасывает ошибку (вызывается через
     `void` из `RunCheckDialog`); один `toast.error` показывается
     внутри catch. `removeCheck` сохранил `throw`, т.к. вызывается
     с `.catch(()=>{})` и rethrow безопасен.
   - Unhandled promise rejection в `void runCheck(...)` устранён.

### Проверки

| Команда / сценарий | Результат |
| --- | --- |
| `bun run build` | ✓ 4.16s, 580.40 kB JS / 293.98 kB CSS |
| `bun run lint` | 0 errors, 14 warnings (pre-existing) |
| Risk save (mock OK) | один success toast после persist всех записей |
| Risk save (имитация ошибки persist) | rollback и risks, и steps; один error toast |
| Contract advance (ошибка repo) | rollback contracts + contractDrawer одновременно |
| `updateStatus` (ошибка repo) | data в hook возвращается к прежнему статусу |
| `add` (ошибка repo) | контрагент исчезает из списка, status восстановлен |
| Assessment retry → ошибка | старая `assessment` очищена, виден error block |
| `runCheck` (ошибка repo) | один toast, нет unhandled rejection |

### Остаточный долг

- `useAssessment.run` каждый раз дёргает repository заново; кэш
  результатов и in-flight dedup — задача HTTP-слоя.
- `useCounterparties.add` не откатывается частично, если параллельно
  пришёл рефетч из repo с тем же `inn`; конкурентные мутации
  будут сериализоваться вместе с HTTP-репозиторием.
- Для прочих мутаций (notification copy, animations) toast/rollback
  политика всё ещё дублируется покомпонентно — общий `useMutation`
  откладывается до интеграции с backend.

---

## Iteration 3 — backend readiness and handoff

Дата: 21.06.2026. UX, маршруты, тексты и `shared/ui` не изменялись.

### Repository source switching

- Добавлен `src/data/config.ts` — единственная точка чтения
  `VITE_DATA_SOURCE` и `VITE_API_BASE_URL`.
- Единая точка выбора реализации — `src/data/repositories/index.ts`:
  `dataConfig.source === "api" ? createApiRepositories(...) : createMockRepositories()`.
- Создан `.env.example`. По умолчанию — `mock`.
- Mock-фабрика: `src/data/repositories/mock/index.ts`.
- API-фабрика: `src/data/api/index.ts`.
- UI и hooks `VITE_DATA_SOURCE` не читают (проверено grep).

### API layer

- `src/data/api/client/http.ts` — минимальный fetch-клиент: baseUrl, JSON,
  query, methods, AbortController + timeout, обработка пустого ответа,
  нормализация ошибок, точка расширения `getAuthHeaders` (TBD-авторизация).
  Axios не добавлен.
- `src/data/api/config/endpoints.ts` — реестр endpoints; все значения помечены
  `TBD`. Любой вызов с TBD-endpoint бросает `API_NOT_CONFIGURED` — UI рисует
  существующее error/retry-состояние, без белого экрана.
- API-реализации repository-интерфейсов: `src/data/api/repositories/{counterparty,assessment,check}.ts`.
- `CheckRepository.subscribe` в API сейчас noop (см. API_CONTRACT.md §11 —
  транспорт обновлений выбирает backend).

### DTO and mappers

- DTO: `src/data/api/dto/{counterparty,assessment,check}.ts`.
- Mappers DTO ↔ domain: `src/data/api/mappers/*`.
- UI и hooks DTO не импортируют (проверено grep
  `rg "@/data/api/dto" src/components src/hooks src/pages`).

### Error normalization

- `src/data/errors.ts` — `DataError` с кодами `NETWORK_ERROR`, `TIMEOUT`,
  `UNAUTHORIZED`, `FORBIDDEN`, `NOT_FOUND`, `VALIDATION_ERROR`, `CONFLICT`,
  `SERVER_ERROR`, `API_NOT_CONFIGURED`, `UNKNOWN` и флагом `retryable`.
- `fromHttpStatus`, `normalizeUnknownError` — единые точки нормализации.
- Существующие UI loading/error/retry-состояния работают без знания о HTTP.

### Atomic operations

- В `CounterpartyRepository` добавлен метод
  `saveRiskDecisionFlow({ counterpartyId, risk, changedCollectionSteps })`.
- `CounterpartyModal.handleSave` теперь делает **один** repository-вызов
  вместо `Promise.all([persistRisk, ...persistCollectionStep])`. Поведение
  UI (success/rollback toast, локальный rollback risks + steps) сохранено.
- Mock-реализация: один патч стора (риск + изменённые этапы).
- API-реализация: один POST на `riskDecisionFlow(:inn)` — endpoint TBD,
  транзакционность требуется от backend (API_CONTRACT.md §5).

### API contracts requiring backend confirmation

Создан `API_CONTRACT.md`. Зафиксированы все используемые операции
(list/byInn/add/updateStatus/saveRiskDecisionFlow/addOrUpdateContract/
updateCollectionStep/assessments.build/checks.list/run/remove), HTTP method
(где очевидно), endpoint = TBD, входные/выходные DTO, ожидаемые ошибки,
требуется ли атомарность, открытые вопросы (авторизация, формат ошибок,
пагинация, аплоад файлов проверок, транспорт обновлений проверок).

### Handoff documentation

Создан `HANDOFF.md` с разделами: запуск, env, переключение mock/API,
архитектура данных, путеводитель по domain/repo/mock/api/dto, основные
сценарии, что нужно от backend, атомарные операции, статус UI-kit и
legacy, известный технический долг, чек-лист перед началом разработки.

### Verification

| Команда / сценарий | Результат |
| --- | --- |
| `bun install` | OK |
| `bun run build` | ✓ 4.41s, 580.96 kB JS / 293.98 kB CSS |
| `bun run lint` | 0 errors, 14 warnings (pre-existing) |
| Mock-режим (по умолчанию) | список, поиск, фильтры, карточка, проверки, оценка, риск-flow, advance/rollback этапа, договоры, error/retry — работают как раньше |
| API-режим без `VITE_API_BASE_URL` | приложение запускается, белого экрана нет, error/retry-состояние с нормализованным сообщением `API_NOT_CONFIGURED` |
| `grep` UI на запрещённые импорты | UI не импортирует `@/data/mock/**`, `@/data/api/dto/**`, `VITE_DATA_SOURCE` |

### Remaining debt

- Endpoints в `src/data/api/config/endpoints.ts` — TBD до согласования с backend.
- `CheckRepository.subscribe` в API — noop; транспорт (polling/SSE/WS) TBD.
- Загрузка файлов проверок — не реализована (передаются только имена).
- `getAuthHeaders` в HTTP-клиенте — точка расширения, без реализации.
- ESLint-правило, запрещающее импорт `@/data/api/dto/**` и `@/data/mock/**`
  из `src/components/**` и `src/hooks/**`, не добавлено — контролируется ревью.
- React/Vite alias-workaround для kit остаётся (см. итерация 1).
- Tailwind v4 + SCSS kit — нет единого источника токенов.

## Итерация 3.1 — checks flow API-ready

- `useChecks` теперь **всегда** выполняет первичную загрузку через
  `checkRepository.list()` при монтировании. `subscribe()` подключается
  дополнительно — только для live-обновлений (running → done, изменения
  от других клиентов) и не блокирует базовый сценарий, если транспорт noop.
- После `run()` UI добавляет/обновляет возвращённый `CheckRecordDto` в
  локальном state с дедупликацией по `id`. После `remove()` запись удаляется
  локально. Оба пути работают без live-транспорта.
- Перед `list/run/remove` хук очищает предыдущую ошибку. `retry()` повторяет
  `list()` и сбрасывает error.
- `ChecksDrawer` принимает `loading`, `error`, `onRetry` и показывает
  компактный блок «Не удалось загрузить проверки … Повторить» внутри
  существующего шапочного блока — без нового большого UI-компонента.
- `Index.tsx` пробрасывает `checksLoading/checksError/retryChecks` в
  `ChecksDrawer`; `void checksError` больше нет.
- API-реализация `createApiCheckRepository.subscribe` оставлена noop как
  явная точка расширения (polling/SSE/WS) — list/run/remove работают и
  без live-транспорта (см. API_CONTRACT.md §11).
- Проверено: mock-режим — список, запуск, удаление, переход running→done,
  фильтры, error/retry; API-режим без `VITE_API_BASE_URL` — ChecksDrawer
  показывает нормализованную ошибку `API_NOT_CONFIGURED` и кнопку
  «Повторить». `bun run build` и `bun run lint` — без ошибок.

## Iteration 4 — visual migration to corporate UI kit

### Components migrated to kit

Базовые controls теперь рендерятся через `@sber-orm/ui-kit` в
`src/shared/ui/adapters/kit.tsx`:

- `Button` → `KitButton`
- `Input` → `KitInput`
- `Textarea` → `KitTextarea`
- `Checkbox` → `KitCheckbox`
- `Switch` → `KitSwitch`
- `Badge` → `KitBadge`
- `Chips` → `KitChips` (новое — для семантических тегов)
- `Loader` → `KitLoader`
- `Text` / `Title` / `Icon` — уже были на kit (адаптер сохранён)

Эти имена удалены из `src/shared/ui/legacy/shadcn.ts`; продуктовый код
импортирует их по-прежнему из `@/shared/ui` и получает kit-реализацию.

### Variant and size mappings

Button (shadcn API → kit `variant`):

```
default     → primary
outline     → secondary
secondary   → tertiary
ghost       → ghost
destructive → danger
link        → ghost + link={true}
```

Button (shadcn `size` → kit `size`):

```
sm      → S
default → M
lg      → L
icon    → M + iconOnly
```

Badge (shadcn API → kit `variant`):

```
default     → blue
secondary   → gray
destructive → red
outline     → outlined
```

Семантические токены для chips/badges (`semanticBadgeVariant`):

```
success → green
warning → yellow
danger  → red
info    → blue
neutral → gray
```

### Product call sites updated

Call sites не менялись (по требованию — UX и текст не трогать). Все
существующие импорты `from "@/shared/ui"` автоматически получили
kit-реализацию. Сигнатуры адаптированы внутри адаптера:

- `Input`/`Textarea`: shadcn `onChange(event)` оставлен — kit `onChange(value, event)`
  пробрасывает `event` обратно;
- `Checkbox`/`Switch`: shadcn `onCheckedChange(checked)` оставлен — внутри
  адаптер слушает kit `onChange(event)` и извлекает `event.target.checked`.

### Selects migrated

Не мигрированы в этой итерации. Продуктовые Select используются в
`ContractDrawer.tsx` (две точки — `newOverdueStage`, `editOvStage`) как
композиция Radix `Select / SelectTrigger / SelectContent / SelectItem`.
Перевод на kit Select требует переписывания на `options[]`-API и `value`/
`onChange`-сигнатуру — сделано отдельной итерацией, чтобы не ломать поведение
выбора этапа в открытом drawer. Пока остаются в legacy.

### Semantic chips and badges

Добавлен экспорт `Chips` (kit) и таблица `semanticBadgeVariant` для
централизованного маппинга `success | warning | danger | info | neutral` →
kit-палитра. Точечная замена существующих «самопальных» цветных pill-блоков
(статусные плашки в карточке контрагента, kindBadge в RiskDrawer и т.д.) —
не выполнялась, чтобы не менять визуальные акценты сценариев; запланирована
как отдельная UX-итерация дизайнерами.

### Components remaining in legacy

В `src/shared/ui/legacy/shadcn.ts` остались:

- `Dialog`, `DialogContent`, `DialogHeader`, `DialogTitle`, `DialogDescription`,
  `DialogFooter`, `DialogTrigger`, `DialogPrimitive` —
  использование: `CounterpartyModal.tsx`, `AssessmentModal.tsx`,
  `ComplexAssessmentModal.tsx`, `ContractAssessmentModal.tsx`,
  `PendingAssessmentModal.tsx`, `RunCheckDialog.tsx`,
  `InModalDrawer.tsx`, `AddContractDrawer.tsx`, и др.
  Несовместимость: kit `Modal` имеет другую композицию (`ModalHeader/Body/Footer`),
  fullscreen-поведение и backdrop. Переход требует переноса крупных модалок
  и потенциального изменения композиции — нарушает требование «не менять
  размеры и общую композицию крупных модальных окон».
- `Sheet`, `SheetContent`, `SheetHeader`, `SheetTitle`, `SheetDescription`,
  `SheetFooter`, `SheetTrigger` — использование: `ChecksDrawer`,
  `RiskDrawer`, `ContractDrawer`, `DebtProcessDrawer`,
  `AssessmentHistoryDrawer`, `RegistrationInfoDrawer`,
  `DrpaDataUpdateDrawer`, `ProcessFilterDrawer`, `CheckProcessDrawer`.
  Несовместимость: kit нет Sheet-компонента, используется Radix Sheet.
- `Tabs`, `TabsList`, `TabsTrigger`, `TabsContent` — использование:
  `CounterpartyModal.tsx`, `AssessmentModal.tsx`. В kit нет прямого аналога.
- `Select`, `SelectTrigger`, `SelectContent`, `SelectItem`, `SelectGroup`,
  `SelectLabel`, `SelectSeparator`, `SelectValue` — использование:
  `ContractDrawer.tsx`. Несовместимость: kit Select работает через
  `options`/`value`/`onChange`, нет Trigger/Content/Item-композиции.
- `Tooltip`, `TooltipContent`, `TooltipProvider`, `TooltipTrigger` —
  использование: `AssessmentModal.tsx` (с `asChild`). Несовместимость:
  kit Tooltip не поддерживает `asChild`-композицию Radix.
- `Label` — использование: `RunCheckDialog.tsx`, `AddContractDrawer.tsx`,
  `DrpaDataUpdateDrawer.tsx`. В kit лейблы встроены в Input/Textarea/etc.;
  отдельный самостоятельный `<Label>` отсутствует. Что нужно для замены:
  перевести оставшиеся «голые» Label на kit Input.label, либо ввести
  собственный мини-компонент.
- `Separator` — использование: `RiskDrawer.tsx`, `CheckProcessDrawer.tsx`.
  В kit прямого аналога нет.
- `Skeleton` — использование: общий shadcn-компонент. В kit есть Shimmer,
  но API и визуал отличаются; миграция отдельной итерацией.
- `Toaster` (sonner) — использование: `App.tsx`. В kit есть `Notification`/
  `notification`, но API отличается; не мигрировано.

Кроме того, `Button` с `asChild` (единичный случай: `AssessmentModal.tsx`
строка 474, `TooltipTrigger asChild`) обрабатывается внутри адаптера через
`React.cloneElement` — fallback на нативный child, kit-визуал кнопки в этой
точке не применяется.

### Visual verification

Через Playwright проверены:

- главный экран — список контрагентов отрисовывается; CTA «Запустить проверку»,
  «Поиск», вкладки «Все признаки / Банкротство / Неисполнение / Негативные
  факторы» используют kit-кнопки (закругление, шрифт, цвет — корпоративные);
- статусные плашки контрагентов («Просрочено», «Риск дефолта», «Нет риска»,
  «Статус изменён») продолжают использовать продуктовые pill-компоненты;
- console: чистый, рантайм-ошибок нет;
- `useAssessment` не падает с «Should have a queue» после рестарта dev-сервера
  (ошибка была от устаревшего HMR-кеша на удалённый `kit.ts`; перезапуск
  решил проблему).

Крупные модалки и drawer не сломаны — остались на shadcn-композиции и
визуально не изменились (по требованию).

### Build and lint

- `bun run build` — успешно (6.80s, без ошибок).
- `bunx tsc --noEmit` — 0 ошибок.
- `bun run lint` — 0 errors, ~17 warnings (все pre-existing
  `react-refresh/only-export-components` в shadcn-примитивах и одна новая
  такая же в `adapters/kit.tsx` из-за смешанного экспорта типов/констант
  с компонентами — допустимо).
