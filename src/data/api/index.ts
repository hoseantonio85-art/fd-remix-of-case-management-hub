// Сборка API-репозиториев. Вызывается из единой точки selection (data/repositories/index.ts).
import { dataConfig, type DataSourceConfig } from "@/data/config";
import { createHttpClient } from "./client/http";
import { createApiCounterpartyRepository } from "./repositories/counterparty";
import { createApiAssessmentRepository } from "./repositories/assessment";
import { createApiCheckRepository } from "./repositories/check";
import type {
  AssessmentRepository,
  CheckRepository,
  CounterpartyRepository,
} from "@/data/repositories/types";

export interface ApiRepositoriesBundle {
  counterpartyRepository: CounterpartyRepository;
  assessmentRepository: AssessmentRepository;
  checkRepository: CheckRepository;
}

export function createApiRepositories(cfg: DataSourceConfig = dataConfig): ApiRepositoriesBundle {
  const http = createHttpClient({
    baseUrl: cfg.apiBaseUrl,
    defaultTimeoutMs: cfg.requestTimeoutMs,
    // TBD: подключение auth-заголовков backend-командой.
    // getAuthHeaders: async () => ({ Authorization: `Bearer ${await getToken()}` }),
  });

  return {
    counterpartyRepository: createApiCounterpartyRepository(http),
    assessmentRepository: createApiAssessmentRepository(http),
    checkRepository: createApiCheckRepository(http),
  };
}
