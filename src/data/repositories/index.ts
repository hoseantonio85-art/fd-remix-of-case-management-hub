// Единственная точка выбора реализации репозиториев.
// UI и hooks не должны читать VITE_DATA_SOURCE — только импортировать
// counterpartyRepository / assessmentRepository / checkRepository отсюда.
import { dataConfig } from "@/data/config";
import { createMockRepositories } from "./mock";
import { createApiRepositories } from "@/data/api";

const repositories =
  dataConfig.source === "api" ? createApiRepositories(dataConfig) : createMockRepositories();

export const counterpartyRepository = repositories.counterpartyRepository;
export const assessmentRepository = repositories.assessmentRepository;
export const checkRepository = repositories.checkRepository;

export type {
  CounterpartyRepository,
  AssessmentRepository,
  CheckRepository,
  CheckRecordDto,
  CheckType,
  RiskDecisionFlowInput,
} from "./types";
