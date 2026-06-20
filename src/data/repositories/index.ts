// Единственная точка выбора реализации репозиториев.
// Сейчас всегда mock. В будущей итерации сюда добавится http-реализация и
// switch по `import.meta.env.VITE_DATA_SOURCE`.
import { mockCounterpartyRepository } from "./mock/counterparty";
import { mockAssessmentRepository } from "./mock/assessment";

export const counterpartyRepository = mockCounterpartyRepository;
export const assessmentRepository = mockAssessmentRepository;

export type { CounterpartyRepository, AssessmentRepository } from "./types";
