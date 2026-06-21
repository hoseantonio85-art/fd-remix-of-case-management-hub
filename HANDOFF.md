# Frontend handoff

Документ для frontend- и backend-разработчиков, принимающих проект после
миграционных итераций.

## Как запустить проект

```bash
bun install
bun run dev      # http://localhost:8080
bun run build
bun run lint
```

Требуется Bun (см. `bunfig.toml`). `@sber-orm/ui-kit` подключён как локальный
tarball из `vendor/tarballs/` — приватный registry не нужен.

## Environment variables

См. `.env.example`. Скопируйте в `.env.local` и заполните.

| Переменная | Значения | Назначение |
| --- | --- | --- |
| `VITE_DATA_SOURCE` | `mock` (по умолчанию) / `api` | Источник данных |
| `VITE_API_BASE_URL` | URL backend | Обязателен при `api`; пустое — UI покажет нормализованную ошибку |
| `VITE_API_TIMEOUT_MS` | число | Таймаут HTTP-запросов (по умолчанию 15000) |
| `VITE_MOCK_LATENCY_MS` | число | Задержка mock-операций |
| `VITE_MOCK_CHECK_DURATION_MS` | число | Длительность `running → done` для mock-проверок |

## Как переключить mock/API

Только через `VITE_DATA_SOURCE`. Выбор реализации происходит **в единой точке** —
`src/data/repositories/index.ts`:

```ts
const repositories =
  dataConfig.source === "api" ? createApiRepositories(dataConfig) : createMockRepositories();
```

UI-компоненты и hooks **не должны** читать `VITE_DATA_SOURCE`. Замена mock → API
не требует изменений в `src/components`, `src/pages`, `src/hooks`.

## Архитектура данных

```
src/
  domain/                 ← чистые типы и бизнес-хелперы (UI и hooks импортируют отсюда)
  hooks/                  ← состояние и оркестрация (используют repositories)
  data/
    config.ts             ← чтение env, выбор источника
    errors.ts             ← DataError, нормализация
    repositories/
      index.ts            ← единая точка выбора mock/api
      types.ts            ← интерфейсы репозиториев (контракты)
      mock/               ← in-memory реализация
    mock/                 ← фикстуры
    api/
      client/http.ts      ← минимальный fetch-клиент
      config/endpoints.ts ← реестр endpoints (TBD пока не согласованы)
      dto/                ← backend DTO (отделены от domain)
      mappers/            ← DTO ↔ domain
      repositories/       ← API-реализации repository contracts
      index.ts            ← createApiRepositories(config)
```

## Где находятся domain models

`src/domain/counterparty.ts`, `src/domain/assessment.ts`.

## Где находятся repository contracts

`src/data/repositories/types.ts`.

## Где находятся mock implementations

`src/data/repositories/mock/{counterparty,assessment,check}.ts` +
`src/data/repositories/mock/index.ts` (`createMockRepositories`).

## Где находятся API implementations

`src/data/api/repositories/{counterparty,assessment,check}.ts` +
`src/data/api/index.ts` (`createApiRepositories`).

## Где находятся DTO и mappers

`src/data/api/dto/*` и `src/data/api/mappers/*`.

**UI и hooks не должны импортировать DTO.** ESLint-правило для запрета этого
ещё не добавлено (см. «Известный технический долг»).

## Основные пользовательские сценарии

- список и поиск контрагентов (`Index.tsx` + `useCounterparties`);
- карточка контрагента (`CounterpartyModal` + `useCounterpartyCard`);
- запуск/удаление проверки (`useChecks` + `CheckRepository`);
- запуск оценки (`AssessmentModal` + `useAssessment`);
- решение по риску + связанные этапы взыскания — **атомарной операцией**
  `saveRiskDecisionFlow`;
- сохранение и продвижение договора (`ContractDrawer`, `AddContractDrawer`);
- продвижение/откат этапа взыскания (`DebtStepper`, `DebtProcessDrawer`).

## Что требуется от backend

Полный список с TBD-полями — в `API_CONTRACT.md`. Кратко:

- согласовать endpoint и схемы DTO для всех операций;
- выбрать транспорт обновления статуса проверок (polling / SSE / WS / ручной refetch);
- спроектировать загрузку файлов проверок;
- спроектировать **транзакционный endpoint** для `saveRiskDecisionFlow`;
- определить схему авторизации (точка расширения — `getAuthHeaders` в HTTP-клиенте);
- определить формат тела ошибок (HTTP status уже нормализуется).

## Атомарные операции

- `CounterpartyRepository.saveRiskDecisionFlow({ counterpartyId, risk, changedCollectionSteps })` —
  решение по риску **и** связанные сдвиги этапов одним вызовом. UI ожидает один
  success/error.

  В mock-режиме поведение сохранено (один обновляющий патч стора). В API-режиме
  это **обязан быть транзакционный endpoint** на стороне backend (см. API_CONTRACT.md §5).

Остальные мутации UI выполняет независимыми вызовами с локальным rollback при ошибке.

## UI-kit и legacy-компоненты

- Корпоративный `@sber-orm/ui-kit` подключён через локальный patched tarball
  (`vendor/tarballs/ui-kit-0.283.0.tgz`). Внешний приватный registry **не нужен**.
- Часть базовых primitives (`Button`, `Input`, `Textarea`, `Checkbox`, `Switch`,
  `Badge`, `Tooltip`) и композитные компоненты (`Dialog`, `Sheet`, `Drawer`,
  `Select`, `Tabs`, `Sonner`) **оставлены в legacy** (`src/components/ui/*`).
  Причины зафиксированы в `MIGRATION_REPORT.md §3-4`.
- Публичная точка UI: `@/shared/ui`. Компоненты и страницы импортируют отсюда.
  Импорт `lucide-react` и `@radix-ui/*` напрямую запрещён ESLint-правилом.

## Известный технический долг

1. **React/Vite workaround**: `vite.config.ts` содержит alias на
   `react`/`react-dom` и `dedupe`, потому что kit имеет react в peerDependencies.
   Workaround остаётся до миграции kit на ESM-only сборку.
2. Часть primitives осталась shadcn — миграция blокирована несовместимостью API
   (см. MIGRATION_REPORT.md).
3. Tailwind v4 + SCSS kit сосуществуют — единого source-of-truth для токенов нет.
4. Endpoint в `src/data/api/config/endpoints.ts` — **TBD**. До заполнения
   API-режим возвращает `API_NOT_CONFIGURED` для каждой операции.
5. Транспорт обновлений `CheckRepository.subscribe` в API — TBD (noop).
6. Загрузка файлов проверок не реализована, передаются только имена.
7. Авторизация в HTTP-клиенте — точка расширения (`getAuthHeaders`), но не заполнена.
8. ESLint-правило, запрещающее импорт `@/data/mock/**` и `@/data/api/dto/**` из
   `src/components/**` и `src/hooks/**`, ещё не добавлено (контролируется ревью).
9. `Index.tsx` остаётся крупным — дальнейший рефакторинг вне scope, см.
   MIGRATION_REPORT.md.

## Проверка перед началом разработки

```bash
bun install
cp .env.example .env.local        # mock по умолчанию
bun run build
bun run lint
bun run dev
```

Дополнительно проверьте API-режим:

```bash
VITE_DATA_SOURCE=api bun run dev  # без VITE_API_BASE_URL — должна показаться нормализованная ошибка, без белого экрана
```

UI **не должен** импортировать:

- ничего из `@/data/mock/**`;
- ничего из `@/data/api/dto/**`;
- ничего из `@/data/api/client/**`;
- `import.meta.env.VITE_DATA_SOURCE` напрямую.

Если такие импорты появились — их выносят в `repositories` или `hooks`.
