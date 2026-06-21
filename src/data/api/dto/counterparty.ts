// DTO контрагента. Объявлены отдельно от domain-моделей, чтобы изменение
// backend-контракта не ломало UI. Сейчас структура совпадает с domain —
// при первом реальном backend-контракте будет уточнена.
//
// UI и hooks не должны импортировать DTO.

export interface OverdueRecordDto {
  date: string;
  amount: number;
  days: number;
  comment?: string;
}

export interface ContractDto {
  id: string;
  number: string;
  date: string;
  amount: number;
  debt: number;
  overdue: number;
  overdueDays: number;
  measures: string;
  collectionStage?: string;
  overdueHistory: OverdueRecordDto[];
}

export interface RiskDecisionDto {
  date: string;
  measures: string[];
  comment: string;
  responsible?: string;
}

export interface RiskDismissalDto {
  date: string;
  comment: string;
  responsible?: string;
}

export interface RiskVerificationDto {
  date: string;
  plannedDate: string;
  comment: string;
  responsible: string;
}

export interface RiskSignalDto {
  id: string;
  type: string;
  source: string;
  detectedAt: string;
  description: string;
  status: string;
  priority: string;
  recommendedAction: string;
  decision?: RiskDecisionDto;
  dismissal?: RiskDismissalDto;
  verification?: RiskVerificationDto;
}

export interface CollectionSubStepDto {
  id: string;
  title: string;
  stage: string;
  status: string;
  startDate?: string;
  sla?: string;
  plannedDate?: string;
  overdue?: boolean;
  nextAction?: string;
}

export interface CounterpartyDto {
  id: string;
  name: string;
  inn: string;
  tag: string;
  status: string;
  totalDebt: string;
  overdueDebt: string;
  overdueAmountNum: number;
  lastUpdate: string;
  contracts: ContractDto[];
  risks: RiskSignalDto[];
  collection: CollectionSubStepDto[];
  processStage: string;
}

export interface RiskDecisionFlowRequestDto {
  risk: RiskSignalDto;
  changedCollectionSteps: CollectionSubStepDto[];
}
