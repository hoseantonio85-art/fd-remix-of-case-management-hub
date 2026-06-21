// UI-presentation для оценки контрагента.
import type { CriterionStatus } from "@/domain/assessment";
import type { StatusTone } from "@/shared/ui";

export const criterionStatusMeta: Record<CriterionStatus, { label: string; tone: StatusTone }> = {
  risk: { label: "Выявлен риск", tone: "danger" },
  clear: { label: "Нарушений нет", tone: "success" },
  no_data: { label: "Нет данных", tone: "neutral" },
};

export const assessmentChangeToneStyles: Record<
  "rose" | "amber" | "slate" | "emerald",
  { dot: string; border: string; iconBg: string; iconText: string; chip: string }
> = {
  rose: {
    dot: "bg-rose-500",
    border: "border-l-rose-400",
    iconBg: "bg-rose-50",
    iconText: "text-rose-600",
    chip: "bg-rose-50 text-rose-700",
  },
  amber: {
    dot: "bg-amber-500",
    border: "border-l-amber-400",
    iconBg: "bg-amber-50",
    iconText: "text-amber-700",
    chip: "bg-amber-50 text-amber-800",
  },
  slate: {
    dot: "bg-slate-400",
    border: "border-l-slate-300",
    iconBg: "bg-slate-100",
    iconText: "text-slate-700",
    chip: "bg-slate-100 text-slate-700",
  },
  emerald: {
    dot: "bg-emerald-500",
    border: "border-l-emerald-400",
    iconBg: "bg-emerald-50",
    iconText: "text-emerald-700",
    chip: "bg-emerald-50 text-emerald-700",
  },
};
