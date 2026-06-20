// Доменные типы контрагента. Чистые типы и константы без I/O.
// UI и hooks должны импортировать типы только отсюда, не из data-слоя.

export type RiskStatus = "pending" | "confirmed" | "dismissed" | "verification";
export type RiskPriority = "high" | "medium" | "low";
export type ProcessStage = "monitoring" | "risk_confirmation" | "settlement" | "writeoff";

export type RiskType =
  | "Ухудшилось финансовое состояние"
  | "Уголовное дело"
  | "Административные нарушения"
  | "Неисполнение контракта группы"
  | "Ограничения деятельности"
  | "Банкротство / ликвидация";

export interface MeasureDef {
  name: string;
  hint: string;
  kind: "required" | "recommended" | "situational";
}

export interface RiskSignal {
  id: string;
  type: RiskType;
  source: string;
  detectedAt: string;
  description: string;
  status: RiskStatus;
  priority: RiskPriority;
  recommendedAction: string;
  decision?: {
    date: string;
    measures: string[];
    comment: string;
    responsible?: string;
  };
  dismissal?: {
    date: string;
    comment: string;
    responsible?: string;
  };
  verification?: {
    date: string;
    plannedDate: string;
    comment: string;
    responsible: string;
  };
}

export interface OverdueRecord {
  date: string;
  amount: number;
  days: number;
  comment?: string;
}

export interface Contract {
  id: string;
  number: string;
  date: string;
  amount: number;
  debt: number;
  overdue: number;
  overdueDays: number;
  measures: string;
  collectionStage?: string;
  overdueHistory: OverdueRecord[];
}

export interface CollectionSubStep {
  id: string;
  title: string;
  stage: string;
  status: "done" | "current" | "upcoming";
  startDate?: string;
  sla?: string;
  plannedDate?: string;
  overdue?: boolean;
  nextAction?: string;
}

export interface Counterparty {
  id: string;
  name: string;
  inn: string;
  tag: string;
  status: "risk" | "overdue_risk" | "overdue" | "no_risk";
  totalDebt: string;
  overdueDebt: string;
  overdueAmountNum: number;
  lastUpdate: string;
  contracts: Contract[];
  risks: RiskSignal[];
  collection: CollectionSubStep[];
  processStage: ProcessStage;
}

export type CategoryKey = Counterparty["status"];

// Чистый бизнес-хелпер: рекомендуемые меры по типу риска.
// Не зависит от UI и data-слоя.
export const measuresByRisk: Record<RiskType, MeasureDef[]> = {
  "Ухудшилось финансовое состояние": [
    { name: "Блокировка поставок", hint: "Приостановить отгрузку до погашения", kind: "required" },
    {
      name: "Реструктуризация долга",
      hint: "Согласовать новый график платежей",
      kind: "recommended",
    },
    {
      name: "Запрос обеспечения",
      hint: "Залог, поручительство, банковская гарантия",
      kind: "recommended",
    },
    { name: "Уступка прав требования", hint: "Передать долг третьему лицу", kind: "situational" },
    { name: "Ускоренное взыскание", hint: "Сократить досудебные сроки", kind: "situational" },
    {
      name: "Контроль движения средств",
      hint: "Мониторинг операций по счетам",
      kind: "recommended",
    },
  ],
  "Уголовное дело": [
    {
      name: "Подача заявления в правоохранительные органы",
      hint: "Зафиксировать ущерб",
      kind: "required",
    },
    { name: "Арест имущества", hint: "Через обеспечительные меры суда", kind: "recommended" },
    { name: "Оспаривание сделок", hint: "Проверить подозрительные операции", kind: "recommended" },
    { name: "Гражданский иск", hint: "Заявить в рамках уголовного дела", kind: "situational" },
    { name: "Приостановка отгрузок", hint: "До прояснения ситуации", kind: "required" },
  ],
  "Банкротство / ликвидация": [
    { name: "Подать иск о признании банкротом", hint: "Если есть основания", kind: "situational" },
    {
      name: "Включиться в реестр требований кредиторов",
      hint: "В установленный срок",
      kind: "required",
    },
    {
      name: "Оспорить сделки должника",
      hint: "Сделки за период подозрительности",
      kind: "recommended",
    },
  ],
  "Административные нарушения": [
    { name: "Приостановка отгрузок", hint: "До устранения нарушений", kind: "recommended" },
    { name: "Запрос обеспечения", hint: "Залог или поручительство", kind: "situational" },
    { name: "Ускоренное взыскание", hint: "Сокращение сроков претензионки", kind: "situational" },
  ],
  "Неисполнение контракта группы": [
    { name: "Блокировка поставок", hint: "По всем компаниям группы", kind: "required" },
    { name: "Реструктуризация долга", hint: "По группе компаний", kind: "recommended" },
    { name: "Запрос обеспечения", hint: "От головной компании группы", kind: "recommended" },
    { name: "Ускоренное взыскание", hint: "По всем договорам группы", kind: "situational" },
  ],
  "Ограничения деятельности": [
    {
      name: "Проверка полномочий подписанта",
      hint: "Актуальность доверенностей",
      kind: "required",
    },
    { name: "Оспаривание договора", hint: "Если заключен с нарушением", kind: "situational" },
    {
      name: "Запрос подтверждения факта запрета",
      hint: "Официальный запрос в орган",
      kind: "recommended",
    },
    {
      name: "Подача заявления о принудительной ликвидации",
      hint: "При систематических нарушениях",
      kind: "situational",
    },
  ],
};

// Чистые бизнес-хелперы поиска / индикаторов

const NEGATIVE_RISK_TYPES: RiskType[] = [
  "Ухудшилось финансовое состояние",
  "Уголовное дело",
  "Ограничения деятельности",
  "Административные нарушения",
];

export type ProblemIndicatorKey =
  | "bankruptcy_liquidation"
  | "group_contract_nonperformance"
  | "negative_factors";

export function getCounterpartyProblemIndicators(
  c?: Counterparty | null,
): ProblemIndicatorKey[] {
  if (!c || !Array.isArray(c.risks)) return [];
  if (c.status === "no_risk") return [];
  const result: ProblemIndicatorKey[] = [];
  if (c.risks.some((r) => r?.type === "Банкротство / ликвидация"))
    result.push("bankruptcy_liquidation");
  if (c.risks.some((r) => r?.type === "Неисполнение контракта группы"))
    result.push("group_contract_nonperformance");
  if (c.risks.some((r) => r?.type && NEGATIVE_RISK_TYPES.includes(r.type)))
    result.push("negative_factors");
  return result;
}

export function searchCounterparties(list: Counterparty[], query: string): Counterparty[] {
  const q = query.trim().toLowerCase();
  if (!q) return list;
  return list.filter(
    (c) => c.name.toLowerCase().includes(q) || c.inn.toLowerCase().includes(q),
  );
}
