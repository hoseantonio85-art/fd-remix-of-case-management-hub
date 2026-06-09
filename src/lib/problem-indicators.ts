import { AlertTriangle, Scale, FileX, TrendingDown, type LucideIcon } from "lucide-react";
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

const FALLBACK_META: RiskMetaItem = {
  icon: AlertTriangle,
  short: "Признак",
  label: "Признак",
  iconColor: "text-slate-700",
  activeBg: "bg-slate-100",
  activeText: "text-slate-900",
  activeBorder: "border-slate-300",
  idleIconColor: "text-slate-500",
};

function safeMeta(key: RiskType, fallbackIcon: LucideIcon): RiskMetaItem {
  const m = riskMeta[key];
  if (m) return m;
  return { ...FALLBACK_META, icon: fallbackIcon };
}

export const problemIndicatorMeta: Record<
  ProblemIndicatorKey,
  RiskMetaItem & { label: string }
> = {
  bankruptcy_liquidation: {
    ...safeMeta("Банкротство / ликвидация", Scale),
    label: "Банкротство / ликвидация",
    short: "Банкротство / ликвидация",
  },
  group_contract_nonperformance: {
    ...safeMeta("Неисполнение контракта группы", FileX),
    label: "Неисполнение контракта группы",
    short: "Неисполнение контракта группы",
  },
  negative_factors: {
    ...safeMeta("Ухудшилось финансовое состояние", TrendingDown),
    label: "Наличие негативных факторов",
    short: "Наличие негативных факторов",
  },
};

export function getCounterpartyProblemIndicators(
  c?: Counterparty | null,
): ProblemIndicatorKey[] {
  if (!c || !Array.isArray(c.risks)) return [];
  const result: ProblemIndicatorKey[] = [];
  if (c.risks.some((r) => r?.type === "Банкротство / ликвидация")) {
    result.push("bankruptcy_liquidation");
  }
  if (c.risks.some((r) => r?.type === "Неисполнение контракта группы")) {
    result.push("group_contract_nonperformance");
  }
  if (c.risks.some((r) => r?.type && NEGATIVE_RISK_TYPES.includes(r.type))) {
    result.push("negative_factors");
  }
  return result;
}
