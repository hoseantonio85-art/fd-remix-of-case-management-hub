// Контракты репозиториев. Реализации (mock или http) подменяются в `@/data/repositories`.
import type {
  Counterparty,
  RiskSignal,
  Contract,
  CollectionSubStep,
} from "@/domain/counterparty";
import type { Assessment, AssessmentSource } from "@/domain/assessment";

export type AsyncResult<T> = Promise<T>;

export interface CounterpartyRepository {
  list(): AsyncResult<Counterparty[]>;
  byInn(inn: string): AsyncResult<Counterparty | null>;
  add(cp: Counterparty): AsyncResult<void>;
  updateStatus(inn: string, status: Counterparty["status"]): AsyncResult<void>;
  saveRiskDecision(inn: string, risk: RiskSignal): AsyncResult<void>;
  addOrUpdateContract(inn: string, contract: Contract): AsyncResult<void>;
  updateCollectionStep(inn: string, step: CollectionSubStep): AsyncResult<void>;
}

export interface AssessmentRepository {
  buildFor(
    counterpartyName: string,
    inn: string,
    source?: AssessmentSource,
    variant?: "negative" | "positive",
  ): AsyncResult<Assessment>;
}

export type CheckType = "counterparty" | "contract" | "complex";

export interface CheckRecordDto {
  id: string;
  inn?: string;
  fileNames: string[];
  status: "running" | "done";
  createdAt: number;
  type: CheckType;
}

export interface CheckRepository {
  list(): AsyncResult<CheckRecordDto[]>;
  run(input: { inn?: string; fileNames: string[]; type: CheckType }): AsyncResult<CheckRecordDto>;
  remove(id: string): AsyncResult<void>;
  subscribe(listener: (records: CheckRecordDto[]) => void): () => void;
}
