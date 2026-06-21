# API_CONTRACT.md

Документ перечисляет операции, которые **уже используются** интерфейсом, и фиксирует
открытые вопросы к backend-команде. Это **не спецификация согласованного API** —
endpoint, схемы DTO и транспорт обновлений ещё не подтверждены.

Источник правды:

- repository-интерфейсы: `src/data/repositories/types.ts`;
- API-реализации с TBD-точками: `src/data/api/repositories/*`, `src/data/api/config/endpoints.ts`;
- DTO: `src/data/api/dto/*`;
- mappers DTO ↔ domain: `src/data/api/mappers/*`.

Все ошибки нормализованы в `DataError` (`src/data/errors.ts`). Backend должен возвращать
осмысленный HTTP status — конкретный JSON-формат ошибок согласовывается.

Обозначения:

- **TBD** — поле/решение, требующее подтверждения от backend.
- **Атомарность** — операция должна выполняться одной транзакцией на backend.

---

## 1. Список контрагентов

| | |
| --- | --- |
| Repository | `CounterpartyRepository.list()` |
| Сценарий | Главный экран `/`, поиск и фильтры (фильтрация — на клиенте) |
| HTTP | `GET` |
| Endpoint | TBD |
| Input | — |
| Output | `CounterpartyDto[]` (см. `src/data/api/dto/counterparty.ts`) |
| Ошибки | `NETWORK_ERROR`, `TIMEOUT`, `SERVER_ERROR` |
| Атомарность | нет |
| Вопросы | Пагинация / серверный поиск? Сейчас UI ждёт полный список. Если объём большой — нужен серверный поиск + пагинация. |

## 2. Карточка контрагента

| | |
| --- | --- |
| Repository | `CounterpartyRepository.byInn(inn)` |
| Сценарий | Открытие модалки контрагента (опционально — сейчас используется кэш из list) |
| HTTP | `GET` |
| Endpoint | TBD `/counterparties/:inn` |
| Output | `CounterpartyDto \| null` |
| Ошибки | `NOT_FOUND`, `NETWORK_ERROR`, `SERVER_ERROR` |
| Вопросы | Нужен ли отдельный endpoint, или достаточно ответа из списка? |

## 3. Добавление контрагента

| | |
| --- | --- |
| Repository | `CounterpartyRepository.add(cp)` |
| Сценарий | Добавление контрагента после завершённой проверки |
| HTTP | `POST` |
| Endpoint | TBD `/counterparties` |
| Input | `CounterpartyDto` (целиком, как создаёт UI; см. `buildNewCounterparty` в `Index.tsx`) |
| Output | 200/204; идеально — созданный `CounterpartyDto` |
| Ошибки | `CONFLICT` (уже существует по ИНН), `VALIDATION_ERROR` |
| Вопросы | Поля `id`, `lastUpdate`, `tag` — UI или backend генерирует? |

## 4. Изменение статуса контрагента

| | |
| --- | --- |
| Repository | `CounterpartyRepository.updateStatus(inn, status)` |
| Сценарий | Чип статуса в карточке/списке |
| HTTP | `PATCH` |
| Endpoint | TBD `/counterparties/:inn/status` |
| Input | `{ status: "risk" \| "overdue_risk" \| "overdue" \| "no_risk" }` |
| Output | 204 |
| Ошибки | `CONFLICT`, `VALIDATION_ERROR` |

## 5. Решение по риску + связанные этапы (атомарная операция)

| | |
| --- | --- |
| Repository | `CounterpartyRepository.saveRiskDecisionFlow(input)` |
| Сценарий | RiskDrawer → confirm / dismiss / verify; при confirm/dismiss дополнительно сдвигается текущий этап взыскания |
| HTTP | `POST` |
| Endpoint | TBD `/counterparties/:inn/risk-decisions` |
| Input | `RiskDecisionFlowRequestDto = { risk: RiskSignalDto; changedCollectionSteps: CollectionSubStepDto[] }` |
| Output | 204 (или обновлённый `CounterpartyDto`) |
| Ошибки | `CONFLICT`, `VALIDATION_ERROR` |
| **Атомарность** | **Да.** Решение по риску и сдвиг этапа должны сохраняться одной транзакцией. UI ожидает один success/error для этой пары. |
| Вопросы | Согласовать имена полей `decision` / `dismissal` / `verification` и enum-значения статусов. |

> Метод `saveRiskDecision(inn, risk)` оставлен в интерфейсе для совместимости с
> отдельными сценариями (если появятся), но в текущем UI используется только
> `saveRiskDecisionFlow`.

## 6. Сохранение договора

| | |
| --- | --- |
| Repository | `CounterpartyRepository.addOrUpdateContract(inn, contract)` |
| Сценарий | AddContractDrawer (создание), ContractDrawer (редактирование) |
| HTTP | `PUT` (upsert) |
| Endpoint | TBD `/counterparties/:inn/contracts` |
| Input | `ContractDto` |
| Ошибки | `VALIDATION_ERROR`, `CONFLICT` |
| Вопросы | Разделить на `POST` (создание) и `PATCH/PUT` (обновление)? |

## 7. Изменение этапа договора

| | |
| --- | --- |
| Repository | `CounterpartyRepository.addOrUpdateContract(inn, contract)` (через тот же endpoint) |
| Сценарий | Стадия `collectionStage` в карточке договора |
| Атомарность | нет (изменение одного договора) |

## 8. Добавление просроченной задолженности

| | |
| --- | --- |
| Repository | `CounterpartyRepository.addOrUpdateContract(inn, contract)` |
| Сценарий | UI вычисляет новые `overdue`, `overdueDays`, `overdueHistory` и отправляет договор целиком |
| Вопросы | Если backend хранит историю отдельно — потребуется отдельный endpoint и метод в repository. |

## 9. Изменение этапа взыскания

| | |
| --- | --- |
| Repository | `CounterpartyRepository.updateCollectionStep(inn, step)` |
| Сценарий | DebtStepper / DebtProcessDrawer advance / rollback (вне риск-flow) |
| HTTP | `PUT` |
| Endpoint | TBD `/counterparties/:inn/collection-steps` |
| Input | `CollectionSubStepDto` |
| Ошибки | `VALIDATION_ERROR`, `CONFLICT` |
| Атомарность | Когда меняются 2 этапа подряд (current → done + next → current), UI делает 2 вызова. Если нужна транзакционность — backend предлагает batch endpoint. |

## 10. Оценка контрагента

| | |
| --- | --- |
| Repository | `AssessmentRepository.buildFor(name, inn, source, variant)` |
| Сценарий | AssessmentModal (открытие оценки, retry) |
| HTTP | `POST` |
| Endpoint | TBD `/assessments` |
| Input | `{ inn, counterpartyName, source: "auto"\|"manual", variant?: "negative"\|"positive" }` |
| Output | `AssessmentDto` |
| Ошибки | `NOT_FOUND` (нет данных), `SERVER_ERROR`, `TIMEOUT` |
| Атомарность | нет |
| Вопросы | Параметр `variant` сейчас демо-флаг — оставить или убрать в реальном API? Кэш / срок жизни оценки на backend? |

## 11. Проверки: list / run / remove / обновление статуса

| | |
| --- | --- |
| Repository | `CheckRepository.list()`, `.run({inn?, fileNames, type})`, `.remove(id)`, `.subscribe(listener)` |
| Сценарий | ChecksWidget / ChecksDrawer / RunCheckDialog |
| HTTP | `GET /checks`, `POST /checks`, `DELETE /checks/:id` |
| Endpoints | TBD |
| Input run | `{ inn?, fileNames: string[], type: "counterparty"\|"contract"\|"complex" }`; реальный аплоад файлов **не реализован**, передаются только имена |
| Output run | `CheckRecordApiDto` с `status: "running"` |
| Ошибки | `VALIDATION_ERROR`, `SERVER_ERROR` |

### TBD: транспорт обновлений статуса проверки

Сейчас mock использует `subscribe(listener)` и сам переводит проверку
`running → done` через `setTimeout`. UI зависит **только** от наличия точки
подписки, не от конкретного транспорта.

Backend-команде нужно выбрать один из вариантов:

- **polling** — UI периодически опрашивает `GET /checks`;
- **SSE** — `GET /checks/stream`;
- **WebSocket** — общий канал `/ws`;
- **ручной refetch** — обновление по действию пользователя.

После согласования: реализовать выбранный транспорт в
`createApiCheckRepository.subscribe` (`src/data/api/repositories/check.ts`).
Адаптация изолирована — UI и `useChecks` менять не нужно.

### TBD: загрузка файлов проверки

Текущий API передаёт только `fileNames: string[]`. Реальная загрузка файлов
(multipart, presigned URL, отдельный upload endpoint) **не реализована** и
требует отдельного контракта.

---

## Общие открытые вопросы к backend

1. Авторизация: схема (Bearer JWT / SSO / cookies). Точка расширения — `getAuthHeaders` в `HttpClient` (`src/data/api/client/http.ts`).
2. Формат ошибок: код, message, поля. Сейчас normalizer (`fromHttpStatus`) использует только HTTP status.
3. Идентификаторы: ИНН как `:inn` в пути или числовой `id`? UI оперирует ИНН.
4. Часовые пояса и формат дат в DTO.
5. Версионирование API (`/v1/...`)?
