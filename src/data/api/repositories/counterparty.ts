import type { CollectionSubStep, Contract, Counterparty, RiskSignal } from "@/domain/counterparty";
import type { CounterpartyRepository, RiskDecisionFlowInput } from "@/data/repositories/types";
import type { HttpClient } from "../client/http";
import { endpoints, isTbdEndpoint } from "../config/endpoints";
import type { CounterpartyDto, RiskDecisionFlowRequestDto } from "../dto/counterparty";
import {
  fromContract,
  fromRisk,
  fromStep,
  fromCounterparty,
  toCounterparty,
} from "../mappers/counterparty";
import { createDataError, normalizeUnknownError } from "@/data/errors";

// Любой TBD endpoint => нормализованная ошибка. UI получит существующее
// error/retry-состояние, белого экрана не будет.
const ensureEndpoint = (e: string): string => {
  if (isTbdEndpoint(e)) {
    throw createDataError("API_NOT_CONFIGURED", {
      message: "Endpoint не согласован с backend (см. API_CONTRACT.md).",
    });
  }
  return e;
};

export function createApiCounterpartyRepository(http: HttpClient): CounterpartyRepository {
  const run = async <T>(fn: () => Promise<T>): Promise<T> => {
    try {
      return await fn();
    } catch (e) {
      throw normalizeUnknownError(e);
    }
  };

  return {
    async list(): Promise<Counterparty[]> {
      return run(async () => {
        const path = ensureEndpoint(endpoints.counterparties.list);
        const data = await http.request<CounterpartyDto[]>({ method: "GET", path });
        return (data ?? []).map(toCounterparty);
      });
    },
    async byInn(inn: string): Promise<Counterparty | null> {
      return run(async () => {
        const path = ensureEndpoint(endpoints.counterparties.byInn(inn));
        const data = await http.request<CounterpartyDto | null>({ method: "GET", path });
        return data ? toCounterparty(data) : null;
      });
    },
    async add(cp: Counterparty): Promise<void> {
      return run(async () => {
        const path = ensureEndpoint(endpoints.counterparties.add);
        await http.request<void>({ method: "POST", path, body: fromCounterparty(cp) });
      });
    },
    async updateStatus(inn, status) {
      return run(async () => {
        const path = ensureEndpoint(endpoints.counterparties.updateStatus(inn));
        await http.request<void>({ method: "PATCH", path, body: { status } });
      });
    },
    async saveRiskDecision(inn: string, risk: RiskSignal): Promise<void> {
      return run(async () => {
        // Предполагаем, что backend выставит endpoint, но для атомарности
        // используется saveRiskDecisionFlow. Этот метод оставлен для совместимости.
        const path = ensureEndpoint(endpoints.counterparties.riskDecisionFlow(inn));
        const body: RiskDecisionFlowRequestDto = {
          risk: fromRisk(risk),
          changedCollectionSteps: [],
        };
        await http.request<void>({ method: "POST", path, body });
      });
    },
    async addOrUpdateContract(inn: string, contract: Contract): Promise<void> {
      return run(async () => {
        const path = ensureEndpoint(endpoints.counterparties.addOrUpdateContract(inn));
        await http.request<void>({ method: "PUT", path, body: fromContract(contract) });
      });
    },
    async updateCollectionStep(inn: string, step: CollectionSubStep): Promise<void> {
      return run(async () => {
        const path = ensureEndpoint(endpoints.counterparties.updateCollectionStep(inn));
        await http.request<void>({ method: "PUT", path, body: fromStep(step) });
      });
    },
    async saveRiskDecisionFlow(input: RiskDecisionFlowInput): Promise<void> {
      return run(async () => {
        const path = ensureEndpoint(
          endpoints.counterparties.riskDecisionFlow(input.counterpartyId),
        );
        const body: RiskDecisionFlowRequestDto = {
          risk: fromRisk(input.risk),
          changedCollectionSteps: input.changedCollectionSteps.map(fromStep),
        };
        await http.request<void>({ method: "POST", path, body });
      });
    },
  };
}
