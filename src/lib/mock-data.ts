// DEPRECATED shim: оставлен на короткое время для совместимости.
// Используйте `@/domain/counterparty` (типы, бизнес-хелперы) и
// `@/data/mock/counterparties` (mock-датасет) либо hooks (`useCounterparties`).
export type {
  RiskStatus,
  RiskPriority,
  MeasureDef,
  RiskSignal,
  OverdueRecord,
  Contract,
  CollectionSubStep,
  ProcessStage,
  Counterparty,
  RiskType,
} from "@/domain/counterparty";
export { measuresByRisk } from "@/domain/counterparty";
export { counterpartiesMock as counterparties, todayLabel } from "@/data/mock/counterparties";
