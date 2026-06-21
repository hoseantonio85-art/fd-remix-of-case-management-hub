import type {
  CollectionSubStep,
  Contract,
  Counterparty,
  OverdueRecord,
  ProcessStage,
  RiskPriority,
  RiskSignal,
  RiskStatus,
  RiskType,
} from "@/domain/counterparty";
import type {
  CollectionSubStepDto,
  ContractDto,
  CounterpartyDto,
  OverdueRecordDto,
  RiskSignalDto,
} from "../dto/counterparty";

// DTO → domain. Сейчас структуры совпадают; mapper изолирует место,
// где появятся расхождения после согласования backend-контракта.

const toOverdue = (r: OverdueRecordDto): OverdueRecord => ({ ...r });

const toContract = (c: ContractDto): Contract => ({
  ...c,
  overdueHistory: (c.overdueHistory ?? []).map(toOverdue),
});

const toRisk = (r: RiskSignalDto): RiskSignal => ({
  ...r,
  type: r.type as RiskType,
  status: r.status as RiskStatus,
  priority: r.priority as RiskPriority,
});

const toStep = (s: CollectionSubStepDto): CollectionSubStep => ({
  ...s,
  status: s.status as CollectionSubStep["status"],
});

export function toCounterparty(d: CounterpartyDto): Counterparty {
  return {
    id: d.id,
    name: d.name,
    inn: d.inn,
    tag: d.tag,
    status: d.status as Counterparty["status"],
    totalDebt: d.totalDebt,
    overdueDebt: d.overdueDebt,
    overdueAmountNum: d.overdueAmountNum,
    lastUpdate: d.lastUpdate,
    contracts: (d.contracts ?? []).map(toContract),
    risks: (d.risks ?? []).map(toRisk),
    collection: (d.collection ?? []).map(toStep),
    processStage: d.processStage as ProcessStage,
  };
}

// domain → DTO (для отправки на сервер).
export const fromContract = (c: Contract): ContractDto => ({ ...c });
export const fromRisk = (r: RiskSignal): RiskSignalDto => ({ ...r });
export const fromStep = (s: CollectionSubStep): CollectionSubStepDto => ({ ...s });
export const fromCounterparty = (c: Counterparty): CounterpartyDto => ({
  ...c,
  contracts: c.contracts.map(fromContract),
  risks: c.risks.map(fromRisk),
  collection: c.collection.map(fromStep),
});
