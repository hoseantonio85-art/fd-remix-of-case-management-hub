import type { Counterparty, RiskType } from "@/lib/mock-data";
import { riskMeta, type RiskMetaItem } from "@/components/counterparty/risk-meta";

export type ProblemIndicatorKey =
  | "bankruptcy_liquidation"
  | "group_contract_nonperformance"
  | "negative_factors";

const NEGATIVE_RISK_TYPES: RiskType[] = [
  "Ухудшилось финансовое состояние",
  "Уголовное дело",
  "Ограничения деятельности",
  "Административные нарушения",
];

export const problemIndicatorMeta: Record<
  ProblemIndicatorKey,
  RiskMetaItem & { label: string }
> = {
  bankruptcy_liquidation: {
    ...riskMeta["Банкротство / ликвидация"],
    label: "Банкротство / ликвидация",
    short: "Банкротство / ликвидация",
  },
  group_contract_nonperformance: {
    ...riskMeta["Неисполнение контракта группы"],
    label: "Неисполнение контракта группы",
    short: "Неисполнение контракта группы",
  },
  negative_factors: {
    ...riskMeta["Ухудшилось финансовое состояние"],
    label: "Наличие негативных факторов",
    short: "Наличие негативных факторов",
  },
};

export function getCounterpartyProblemIndicators(
  c: Counterparty,
): ProblemIndicatorKey[] {
  const result: ProblemIndicatorKey[] = [];
  if (c.risks.some((r) => r.type === "Банкротство / ликвидация")) {
    result.push("bankruptcy_liquidation");
  }
  if (c.risks.some((r) => r.type === "Неисполнение контракта группы")) {
    result.push("group_contract_nonperformance");
  }
  if (c.risks.some((r) => NEGATIVE_RISK_TYPES.includes(r.type))) {
    result.push("negative_factors");
  }
  return result;
}
