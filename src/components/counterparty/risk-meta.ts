import {
  TrendingDown,
  Scale,
  FileX,
  ShieldAlert,
  Ban,
  AlertTriangle,
  UsersRound,
  LayoutGrid,
  type LucideIcon,
} from "@/shared/ui";
import type { RiskType } from "@/domain/counterparty";

export type RiskMetaItem = {
  icon: LucideIcon;
  short: string;
  label: string;
  iconColor: string;
  activeBg: string;
  activeText: string;
  activeBorder: string;
  idleIconColor: string;
};

export const riskMeta: Record<RiskType, RiskMetaItem> = {
  "Ухудшилось финансовое состояние": {
    icon: TrendingDown,
    short: "Ухудшилось фин. состояние",
    label: "Ухудшилось фин. состояние",
    iconColor: "text-rose-600",
    activeBg: "bg-rose-50",
    activeText: "text-rose-900",
    activeBorder: "border-rose-300",
    idleIconColor: "text-rose-500/70",
  },
  "Банкротство / ликвидация": {
    icon: Scale,
    short: "Банкротство / ликвидация",
    label: "Банкротство / ликвидация",
    iconColor: "text-rose-700",
    activeBg: "bg-rose-50",
    activeText: "text-rose-900",
    activeBorder: "border-rose-300",
    idleIconColor: "text-rose-600/70",
  },
  "Неисполнение контракта группы": {
    icon: FileX,
    short: "Неисполнение контракта",
    label: "Неисполнение контракта группы",
    iconColor: "text-amber-700",
    activeBg: "bg-amber-50",
    activeText: "text-amber-900",
    activeBorder: "border-amber-300",
    idleIconColor: "text-amber-600/70",
  },
  "Уголовное дело": {
    icon: ShieldAlert,
    short: "Уголовное дело",
    label: "Уголовное дело",
    iconColor: "text-red-700",
    activeBg: "bg-red-50",
    activeText: "text-red-900",
    activeBorder: "border-red-300",
    idleIconColor: "text-red-600/70",
  },
  "Ограничения деятельности": {
    icon: Ban,
    short: "Ограничения",
    label: "Ограничения деятельности",
    iconColor: "text-slate-700",
    activeBg: "bg-slate-100",
    activeText: "text-slate-900",
    activeBorder: "border-slate-400",
    idleIconColor: "text-slate-500",
  },
  "Административные нарушения": {
    icon: AlertTriangle,
    short: "Адм. нарушения",
    label: "Адм. нарушения",
    iconColor: "text-orange-700",
    activeBg: "bg-orange-50",
    activeText: "text-orange-900",
    activeBorder: "border-orange-300",
    idleIconColor: "text-orange-600/70",
  },
};

export const groupOverdueChip = {
  icon: UsersRound,
  label: "Просрочена задолженность в группе",
  short: "Группа",
  iconColor: "text-amber-700",
  activeBg: "bg-amber-50",
  activeText: "text-amber-900",
  activeBorder: "border-amber-300",
  idleIconColor: "text-amber-600/70",
};

export const allChipMeta = {
  icon: LayoutGrid,
  label: "Все признаки",
  short: "Все",
  iconColor: "text-slate-700",
  activeBg: "bg-slate-100",
  activeText: "text-slate-900",
  activeBorder: "border-slate-400",
  idleIconColor: "text-slate-500",
};

export const riskOrder: RiskType[] = [
  "Ухудшилось финансовое состояние",
  "Банкротство / ликвидация",
  "Неисполнение контракта группы",
  "Уголовное дело",
  "Ограничения деятельности",
  "Административные нарушения",
];
