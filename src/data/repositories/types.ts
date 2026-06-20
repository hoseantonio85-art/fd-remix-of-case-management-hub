// Контракты репозиториев. Используются hooks; реализации (mock или http) подменяются
// в `@/data/repositories` без правок UI.
import type { Counterparty, RiskSignal } from "@/domain/counterparty";
import type { Assessment, AssessmentSource } from "@/domain/assessment";

export type AsyncResult<T> = Promise<T>;

export interface CounterpartyRepository {
  list(): AsyncResult<Counterparty[]>;
  byInn(inn: string): AsyncResult<Counterparty | null>;
  updateStatus(inn: string, status: Counterparty["status"]): AsyncResult<void>;
  addRisk(inn: string, risk: RiskSignal): AsyncResult<void>;
}

export type CheckType = "counterparty" | "contract" | "complex";

export interface CheckResultMeta {
  type: CheckType;
  inn?: string;
  fileNames: string[];
}

export interface AssessmentRepository {
  buildFor(
    counterpartyName: string,
    inn: string,
    source?: AssessmentSource,
    variant?: "negative" | "positive",
  ): AsyncResult<Assessment>;
}
