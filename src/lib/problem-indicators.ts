// DEPRECATED shim. Используйте `@/domain/counterparty` (getCounterpartyProblemIndicators)
// и `@/components/counterparty/problem-indicator-meta` для UI-меты.
import { AlertTriangle, Scale, FileX, TrendingDown, type LucideIcon } from "@/shared/ui";
import { riskMeta, type RiskMetaItem } from "@/components/counterparty/risk-meta";
import type { RiskType } from "@/domain/counterparty";

export { getCounterpartyProblemIndicators } from "@/domain/counterparty";
export type { ProblemIndicatorKey } from "@/domain/counterparty";

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

export const problemIndicatorMeta = {
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
} as const;
