// Централизованный реестр endpoints. Backend-команда заполняет TBD-значения
// после согласования контрактов (см. API_CONTRACT.md).
//
// ВАЖНО: не размещайте URL прямо в repository-файлах. Любой новый endpoint
// добавляется здесь.

export const TBD = "__TBD__" as const;
export type Endpoint = string;

export const endpoints = {
  counterparties: {
    list: TBD as Endpoint, // GET /counterparties
    byInn: (inn: string) => `${TBD}/${encodeURIComponent(inn)}`, // GET /counterparties/:inn
    add: TBD as Endpoint, // POST /counterparties
    updateStatus: (inn: string) => `${TBD}/${encodeURIComponent(inn)}/status`, // PATCH
    addOrUpdateContract: (inn: string) => `${TBD}/${encodeURIComponent(inn)}/contracts`, // PUT
    updateCollectionStep: (inn: string) => `${TBD}/${encodeURIComponent(inn)}/collection-steps`, // PUT
    // Атомарная операция: решение по риску + связанные этапы.
    riskDecisionFlow: (inn: string) => `${TBD}/${encodeURIComponent(inn)}/risk-decisions`, // POST (транзакционно)
  },
  assessments: {
    build: TBD as Endpoint, // POST /assessments
  },
  checks: {
    list: TBD as Endpoint, // GET /checks
    run: TBD as Endpoint, // POST /checks
    remove: (id: string) => `${TBD}/${encodeURIComponent(id)}`, // DELETE
    // TBD: transport для обновления статусов running → done
    // (polling / SSE / WebSocket — выбирает backend, см. API_CONTRACT.md).
    stream: TBD as Endpoint,
  },
} as const;

export function isTbdEndpoint(value: string): boolean {
  return value.includes(TBD);
}
