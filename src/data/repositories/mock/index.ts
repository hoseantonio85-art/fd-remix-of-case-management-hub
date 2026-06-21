// Фабрика mock-репозиториев. Используется единой точкой выбора источника данных.
import { mockCounterpartyRepository } from "./counterparty";
import { mockAssessmentRepository } from "./assessment";
import { mockCheckRepository } from "./check";
import type { AssessmentRepository, CheckRepository, CounterpartyRepository } from "../types";

export interface MockRepositoriesBundle {
  counterpartyRepository: CounterpartyRepository;
  assessmentRepository: AssessmentRepository;
  checkRepository: CheckRepository;
}

export function createMockRepositories(): MockRepositoriesBundle {
  return {
    counterpartyRepository: mockCounterpartyRepository,
    assessmentRepository: mockAssessmentRepository,
    checkRepository: mockCheckRepository,
  };
}
