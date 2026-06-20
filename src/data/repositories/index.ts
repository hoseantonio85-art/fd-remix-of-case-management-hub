// Единственная точка выбора реализации репозиториев.
import { mockCounterpartyRepository } from "./mock/counterparty";
import { mockAssessmentRepository } from "./mock/assessment";
import { mockCheckRepository } from "./mock/check";

export const counterpartyRepository = mockCounterpartyRepository;
export const assessmentRepository = mockAssessmentRepository;
export const checkRepository = mockCheckRepository;

export type {
  CounterpartyRepository,
  AssessmentRepository,
  CheckRepository,
  CheckRecordDto,
  CheckType,
} from "./types";
