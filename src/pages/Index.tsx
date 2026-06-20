import { useEffect, useMemo, useState } from "react";
import {
  Search,
  ChevronDown,
  Sparkles,
  UserCog,
  Home,
  CalendarClock,
  Flame,
  Shield,
  BarChart3,
  Users,
  Bot,
  Gauge,
  GraduationCap,
  Headphones,
  Loader2,
  SlidersHorizontal,
  X,
  ShieldCheck,
  AlertTriangle,
} from "@/shared/ui";
import type { Counterparty, RiskType, ProcessStage } from "@/domain/counterparty";
import {
  getCounterpartyProblemIndicators,
  type ProblemIndicatorKey,
} from "@/domain/counterparty";
import { buildAssessment, type Assessment } from "@/domain/assessment";
import { useCounterparties } from "@/hooks/useCounterparties";
import { CounterpartyModal } from "@/components/counterparty/CounterpartyModal";
import { CounterpartyStatusBadge } from "@/components/counterparty/CounterpartyStatusBadge";
import { riskMeta, allChipMeta } from "@/components/counterparty/risk-meta";
import { problemIndicatorMeta } from "@/lib/problem-indicators";
import {
  AssessmentModal,
  type AssessmentStatus,
  type Disagreement,
} from "@/components/counterparty/AssessmentModal";
import { Button } from "@/shared/ui";
import { ProcessFilterDrawer } from "@/components/counterparty/ProcessFilterDrawer";
import { processMeta, processOrder } from "@/lib/process-meta";
import { toast } from "sonner";
import {
  DrpaDataUpdateDrawer,
  type DrpaCardData,
} from "@/components/counterparty/DrpaDataUpdateDrawer";
import { RunCheckDialog } from "@/components/counterparty/RunCheckDialog";
import { PendingAssessmentModal } from "@/components/counterparty/PendingAssessmentModal";
import { ChecksWidget } from "@/components/counterparty/CheckProcessPill";
import { ChecksDrawer, type CheckRecord } from "@/components/counterparty/CheckProcessDrawer";
import { ContractAssessmentModal } from "@/components/counterparty/ContractAssessmentModal";
import { ComplexAssessmentModal } from "@/components/counterparty/ComplexAssessmentModal";

function buildNewCounterparty(inn: string, today: string): Counterparty {
  return {
    id: `manual-${inn}-${Date.now()}`,
    name: "ООО «Новый контрагент»",
    inn,
    tag: "На оценке",
    status: "no_risk",
    totalDebt: "0,0 млн. ₽",
    overdueDebt: "0,0 млн. ₽",
    overdueAmountNum: 0,
    lastUpdate: today,
    contracts: [],
    risks: [],
    collection: [],
    processStage: "monitoring",
  };
}

function getContractWord(count: number): string {
  const lastTwo = count % 100;
  const lastOne = count % 10;
  if (lastTwo >= 11 && lastTwo <= 14) return "договоров";
  if (lastOne === 1) return "договор";
  if (lastOne >= 2 && lastOne <= 4) return "договора";
  return "договоров";
}

type CategoryKey = "risk" | "overdue_risk" | "no_risk" | "overdue";

const tiles: {
  key: CategoryKey;
  title: string;
  pct: string;
  amount: string;
  count: string;
  bg: string;
  activeBg: string;
  pctBg: string;
  ring: string;
  dot: string;
}[] = [
  {
    key: "risk",
    title: "Риск дефолта",
    pct: "9.5 %",
    amount: "1,3 млн. ₽",
    count: "5 деб.",
    bg: "bg-[#FBF1D6]/60",
    activeBg: "bg-amber-100",
    pctBg: "bg-[#F4E1A1]/70 text-[#8B6B14]",
    ring: "ring-amber-300",
    dot: "#E9C657",
  },
  {
    key: "overdue_risk",
    title: "Просрочено с риском дефолта",
    pct: "10 %",
    amount: "1,4 млн. ₽",
    count: "5 деб.",
    bg: "bg-rose-50",
    activeBg: "bg-rose-100",
    pctBg: "bg-rose-200/70 text-rose-900",
    ring: "ring-rose-300",
    dot: "#E11D48",
  },
  {
    key: "no_risk",
    title: "Нет риска",
    pct: "74.5 %",
    amount: "1,2 млн. ₽",
    count: "5 деб.",
    bg: "bg-[#D6F0E2]/60",
    activeBg: "bg-emerald-100",
    pctBg: "bg-[#A6E0BE]/70 text-[#1E6B43]",
    ring: "ring-emerald-300",
    dot: "#5BC48C",
  },
  {
    key: "overdue",
    title: "Просрочено",
    pct: "9.5 %",
    amount: "1,2 млн. ₽",
    count: "5 деб.",
    bg: "bg-[#FBE9D6]/60",
    activeBg: "bg-orange-100",
    pctBg: "bg-[#F6D2A2]/70 text-[#8B5A14]",
    ring: "ring-orange-300",
    dot: "#EDB05A",
  },
];

type Segment = { key: string; value: number; color: string; label: string };

const defaultSegments: Segment[] = [
  { key: "no_risk", value: 74.5, color: "#5BC48C", label: "Без просрочки" },
  { key: "risk", value: 9.5, color: "#E9C657", label: "Просроч. на 0-30 д" },
  { key: "overdue", value: 9.5, color: "#EDB05A", label: "Просроч. на 30-60 д" },
  { key: "overdue_risk", value: 6.5, color: "#E26B3A", label: "Просроч. на 60+ д" },
];

const categoryPalette: Record<CategoryKey, { amount: string; segments: Segment[] }> = {
  risk: {
    amount: "1,3",
    segments: [
      { key: "a", label: "Без просрочки", value: 45, color: "#FBE9A8" },
      { key: "b", label: "Просроч. на 0-30 д", value: 25, color: "#F4D470" },
      { key: "c", label: "Просроч. на 30-60 д", value: 18, color: "#E9C657" },
      { key: "d", label: "Просроч. на 60+ д", value: 12, color: "#B5912F" },
    ],
  },
  overdue_risk: {
    amount: "1,4",
    segments: [
      { key: "a", label: "Без просрочки", value: 40, color: "#F8D2BE" },
      { key: "b", label: "Просроч. на 0-30 д", value: 25, color: "#F0A788" },
      { key: "c", label: "Просроч. на 30-60 д", value: 20, color: "#E26B3A" },
      { key: "d", label: "Просроч. на 60+ д", value: 15, color: "#9A3A18" },
    ],
  },
  no_risk: {
    amount: "1,2",
    segments: [
      { key: "a", label: "Без просрочки", value: 50, color: "#C5ECD4" },
      { key: "b", label: "Просроч. на 0-30 д", value: 22, color: "#8FD8AE" },
      { key: "c", label: "Просроч. на 30-60 д", value: 18, color: "#5BC48C" },
      { key: "d", label: "Просроч. на 60+ д", value: 10, color: "#1E6B43" },
    ],
  },
  overdue: {
    amount: "1,2",
    segments: [
      { key: "a", label: "Без просрочки", value: 38, color: "#FBE0BC" },
      { key: "b", label: "Просроч. на 0-30 д", value: 27, color: "#F4C384" },
      { key: "c", label: "Просроч. на 30-60 д", value: 20, color: "#EDB05A" },
      { key: "d", label: "Просроч. на 60+ д", value: 15, color: "#8B5A14" },
    ],
  },
};

function Donut({ amount, segments }: { amount: string; segments: Segment[] }) {
  const size = 170;
  const stroke = 28;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const total = segments.reduce((s, x) => s + x.value, 0);
  const gap = 1.5;
  let acc = 0;
  const innerR = r - stroke / 2;
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        {segments.map((s) => {
          const len = Math.max((s.value / total) * c - gap, 0);
          const dash = `${len} ${c - len}`;
          const offset = -acc;
          acc += len + gap;
          return (
            <circle
              key={s.key}
              cx={size / 2}
              cy={size / 2}
              r={r}
              stroke={s.color}
              strokeWidth={stroke}
              fill="none"
              strokeDasharray={dash}
              strokeDashoffset={offset}
              strokeLinecap="butt"
              opacity={0.55}
              className="transition-all duration-300"
            />
          );
        })}
        {/* Inner soft contour ring */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={innerR + 1.5}
          stroke="rgba(255,255,255,0.9)"
          strokeWidth={2}
          fill="none"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="text-lg font-semibold tracking-tight">
          {amount} <span className="text-xs font-normal text-muted-foreground">млн. ₽</span>
        </div>
      </div>
    </div>
  );
}

function SidebarItem({
  icon: Icon,
  label,
  active,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  active?: boolean;
}) {
  return (
    <button
      className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition ${
        active ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground hover:bg-muted"
      }`}
    >
      <Icon className="h-4 w-4" />
      {label}
    </button>
  );
}

type RiskChipKey = "all" | "bankruptcy" | "group" | "negative";

const NEGATIVE_RISK_TYPES: RiskType[] = [
  "Ухудшилось финансовое состояние",
  "Уголовное дело",
  "Ограничения деятельности",
  "Административные нарушения",
];

const problemChips: {
  key: Exclude<RiskChipKey, "all">;
  meta: (typeof riskMeta)[RiskType];
  matches: (c: Counterparty) => boolean;
}[] = [
  {
    key: "bankruptcy",
    meta: {
      ...riskMeta["Банкротство / ликвидация"],
      label: "Банкротство / ликвидация",
      short: "Банкротство / ликвидация",
    },
    matches: (c) =>
      c.status !== "no_risk" && c.risks.some((r) => r.type === "Банкротство / ликвидация"),
  },
  {
    key: "group",
    meta: {
      ...riskMeta["Неисполнение контракта группы"],
      label: "Неисполнение контракта группы",
      short: "Неисполнение контракта группы",
    },
    matches: (c) =>
      c.status !== "no_risk" && c.risks.some((r) => r.type === "Неисполнение контракта группы"),
  },
  {
    key: "negative",
    meta: {
      ...riskMeta["Ухудшилось финансовое состояние"],
      label: "Наличие негативных факторов",
      short: "Наличие негативных факторов",
    },
    matches: (c) =>
      c.status !== "no_risk" && c.risks.some((r) => NEGATIVE_RISK_TYPES.includes(r.type)),
  },
];

export default function Index() {
  // Источник истины по контрагентам — через repository / hook.
  // Loading / error / empty состояния можно открыть в preview через ?state=loading|error|empty.
  const {
    data: counterpartiesData,
    status: dataStatus,
    error: dataError,
    refetch,
  } = useCounterparties();

  const [active, setActive] = useState<Counterparty | null>(null);
  const [selectedTiles, setSelectedTiles] = useState<Set<CategoryKey>>(new Set());
  const [riskFilter, setRiskFilter] = useState<RiskChipKey>("all");
  const [processStage, setProcessStage] = useState<ProcessStage | null>(null);
  const [processDrawerOpen, setProcessDrawerOpen] = useState(false);
  const [runDialogOpen, setRunDialogOpen] = useState(false);
  const [pendingCp, setPendingCp] = useState<Counterparty | null>(null);
  const [pendingCpOpen, setPendingCpOpen] = useState(false);
  const [checks, setChecks] = useState<CheckRecord[]>([]);
  const [checkDrawerOpen, setCheckDrawerOpen] = useState(false);
  const [activeCheckId, setActiveCheckId] = useState<string | null>(null);
  const [checkAssessment, setCheckAssessment] = useState<Assessment | null>(null);
  const [checkAssessmentOpen, setCheckAssessmentOpen] = useState(false);
  const [contractModalOpen, setContractModalOpen] = useState(false);
  const [activeContractCheckId, setActiveContractCheckId] = useState<string | null>(null);
  const [complexModalOpen, setComplexModalOpen] = useState(false);
  const [activeComplexCheckId, setActiveComplexCheckId] = useState<string | null>(null);
  const [complexAssessment, setComplexAssessment] = useState<Assessment | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  // Legacy manual assessment flow (kept for AssessmentModal scenarios from existing cards)
  const [manualAssessment, setManualAssessment] = useState<Assessment | null>(null);
  const [manualAssessmentOpen, setManualAssessmentOpen] = useState(false);
  const [manualStatus, setManualStatus] = useState<AssessmentStatus>("updated");
  const [manualDisagreement, setManualDisagreement] = useState<Disagreement | null>(null);
  const [addedCounterparties, setAddedCounterparties] = useState<Counterparty[]>([]);
  const [manualFlowTarget, setManualFlowTarget] = useState<Counterparty | null>(null);
  const [manualFlowIsNew, setManualFlowIsNew] = useState(false);
  const [manualFlowCpOpen, setManualFlowCpOpen] = useState(false);

  const [statusOverrides, setStatusOverrides] = useState<Record<string, Counterparty["status"]>>(
    {},
  );
  const [statusChanges, setStatusChanges] = useState<
    Record<string, { from: Counterparty["status"]; to: Counterparty["status"] }>
  >({
    // Дефолтное состояние после ежедневного автообновления:
    // ООО «Сигма-Логистик» перешёл из «Риск дефолта» в «Нет риска».
    "7702345678": { from: "risk", to: "no_risk" },
  });

  // DRPA update flow
  const [drpaOpen, setDrpaOpen] = useState(false);
  const [drpaConfirmed, setDrpaConfirmed] = useState(false);
  const [drpaCards, setDrpaCards] = useState<DrpaCardData[]>([]);
  // Подтягиваем DRPA-карточки из загруженных контрагентов после первой загрузки.
  useEffect(() => {
    if (counterpartiesData.length === 0) return;
    setDrpaCards((prev) =>
      prev.length > 0
        ? prev
        : counterpartiesData
            .filter(
              (c) =>
                c.status === "overdue" ||
                c.status === "overdue_risk" ||
                (c.overdueAmountNum ?? 0) > 0,
            )
            .map((c) => ({
              counterparty: c,
              contracts: c.contracts.map((k) => ({
                ...k,
                overdueHistory: [...k.overdueHistory],
              })),
              updated: false,
            })),
    );
  }, [counterpartiesData]);
  const drpaTotal = drpaCards.length;
  const drpaUpdated = drpaCards.filter((c) => c.updated).length;
  const drpaInProgress = drpaUpdated > 0 && !drpaConfirmed;


  const applyOverride = (c: Counterparty): Counterparty => {
    const override = statusOverrides[c.inn];
    return override && override !== c.status ? { ...c, status: override } : c;
  };

  const allCounterparties = useMemo(
    () => [...addedCounterparties, ...counterparties].map(applyOverride),
    [addedCounterparties, statusOverrides],
  );

  const handleStatusChange = (inn: string, status: Counterparty["status"]) => {
    const base = [...addedCounterparties, ...counterparties].find((c) => c.inn === inn);
    const current = statusOverrides[inn] ?? base?.status;
    if (current && current !== status) {
      setStatusChanges((prev) => ({ ...prev, [inn]: { from: current, to: status } }));
    }
    setStatusOverrides((prev) => ({ ...prev, [inn]: status }));
    setActive((prev) => (prev && prev.inn === inn ? { ...prev, status } : prev));
    setManualFlowTarget((prev) => (prev && prev.inn === inn ? { ...prev, status } : prev));
  };

  const categoryLabel: Record<CategoryKey, string> = {
    risk: "Риск дефолта",
    overdue_risk: "Просрочено с риском дефолта",
    no_risk: "Нет риска",
    overdue: "Просрочено",
  };

  const statusChangePlusByCategory = useMemo(() => {
    const map: Record<CategoryKey, number> = { risk: 0, overdue_risk: 0, no_risk: 0, overdue: 0 };
    for (const ch of Object.values(statusChanges)) {
      if (ch.from !== ch.to) map[ch.to as CategoryKey]++;
    }
    return map;
  }, [statusChanges]);

  // ESC/overlay close on AssessmentModal in manual flow → behave like Back:
  // close assessment, open CounterpartyModal of the just-evaluated counterparty.
  // No snackbar at this point — snackbar fires only when the whole flow closes.
  const handleManualAssessmentOpenChange = (o: boolean) => {
    setManualAssessmentOpen(o);
    if (!o) {
      setManualDisagreement(null);
      if (manualFlowTarget) {
        setManualFlowCpOpen(true);
      }
    }
  };

  // Back arrow: assessment → counterparty modal.
  const handleManualAssessmentBack = () => {
    setManualAssessmentOpen(false);
    setManualDisagreement(null);
    if (manualFlowTarget) {
      setManualFlowCpOpen(true);
    }
  };

  // Closing CounterpartyModal after manual assessment flow → finalize:
  // add to list (if new), show snackbar, clear state.
  const handleManualFlowCpOpenChange = (o: boolean) => {
    setManualFlowCpOpen(o);
    if (!o) {
      if (manualFlowTarget) {
        const inn = manualFlowTarget.inn;
        if (manualFlowIsNew) {
          setAddedCounterparties((prev) =>
            prev.some((c) => c.inn === inn) ? prev : [manualFlowTarget, ...prev],
          );
          toast.success("Контрагент добавлен в список", {
            description: `Оценка сохранена по ИНН ${inn}`,
          });
        } else {
          toast("Контрагент уже есть в списке", {
            description: `ИНН ${inn} найден в рабочем списке`,
          });
        }
      }
      setManualFlowTarget(null);
      setManualFlowIsNew(false);
      setManualAssessment(null);
    }
  };

  // X in AssessmentModal: full close, no snackbar, no list add.
  const handleManualFlowCloseAll = () => {
    setManualAssessmentOpen(false);
    setManualFlowCpOpen(false);
    setManualDisagreement(null);
    setManualFlowTarget(null);
    setManualFlowIsNew(false);
    setManualAssessment(null);
  };

  const processCounts = useMemo(() => {
    const map = { monitoring: 0, risk_confirmation: 0, settlement: 0, writeoff: 0 } as Record<
      ProcessStage,
      number
    >;
    for (const c of allCounterparties) map[c.processStage]++;
    return map;
  }, [allCounterparties]);

  const byProcess = useMemo(() => {
    if (!processStage) return allCounterparties;
    return allCounterparties.filter((c) => c.processStage === processStage);
  }, [processStage, allCounterparties]);

  const allowedCategories = useMemo(() => {
    if (!processStage) return null;
    return new Set(processMeta[processStage].allowedCategories);
  }, [processStage]);

  const byCategory = useMemo(() => {
    if (selectedTiles.size === 0) return byProcess;
    // Pending («На оценке») cards should not be included into any risk/status category.
    return byProcess.filter((c) => c.tag !== "На оценке" && selectedTiles.has(c.status));
  }, [byProcess, selectedTiles]);

  const riskCounts = useMemo(() => {
    const map: Record<string, number> = { all: byCategory.length };
    for (const chip of problemChips) {
      map[chip.key] = byCategory.filter(chip.matches).length;
    }
    return map;
  }, [byCategory]);

  // Auto-clear the active problem filter if it becomes unavailable
  // after a debt-category selection change.
  useEffect(() => {
    if (riskFilter !== "all" && (riskCounts[riskFilter] ?? 0) === 0) {
      setRiskFilter("all");
    }
  }, [riskCounts, riskFilter]);

  const filtered = useMemo(() => {
    if (riskFilter === "all") return byCategory;
    const chip = problemChips.find((c) => c.key === riskFilter);
    if (!chip) return byCategory;
    return byCategory.filter(chip.matches);
  }, [byCategory, riskFilter]);

  // Donut data:
  //  - 0 selected   → overview (top categories)
  //  - 1 selected   → drilldown by overdue buckets within that category
  //  - 2+ selected  → process_categories: one segment per selected tile (top-category colors/labels)
  const donutData = useMemo(() => {
    if (selectedTiles.size === 0) {
      return { amount: "4,7", segments: defaultSegments };
    }
    if (selectedTiles.size === 1) {
      const key = Array.from(selectedTiles)[0] as CategoryKey;
      const cat = categoryPalette[key];
      // Single no-overdue mode: «Нет риска» and «Риск дефолта» → one solid segment
      if (key === "no_risk" || key === "risk") {
        const tile = tiles.find((t) => t.key === key)!;
        const val = parseFloat(cat.amount.replace(",", "."));
        return {
          amount: cat.amount,
          segments: [{ key: "no_overdue", label: "Без просрочки", value: val, color: tile.dot }],
        };
      }
      return { amount: cat.amount, segments: cat.segments };
    }
    // process_categories
    const segs: Segment[] = [];
    let total = 0;
    for (const t of tiles) {
      if (!selectedTiles.has(t.key)) continue;
      const val = parseFloat(categoryPalette[t.key].amount.replace(",", "."));
      total += val;
      segs.push({ key: t.key, label: t.title, value: val, color: t.dot });
    }
    return { amount: total.toFixed(1).replace(".", ","), segments: segs };
  }, [selectedTiles]);

  const toggleTile = (key: CategoryKey) => {
    if (allowedCategories && !allowedCategories.has(key)) return;
    // Manual click on an allowed tile while a process is active → drop process context
    // but preserve the resulting manual selection.
    if (processStage) {
      const next = new Set(selectedTiles);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      setProcessStage(null);
      setSelectedTiles(next);
      setRiskFilter("all");
      return;
    }
    setSelectedTiles((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.clear();
        next.add(key);
      }
      return next;
    });
    setRiskFilter("all");
  };

  const applyProcessStage = (stage: ProcessStage | null) => {
    setProcessStage(stage);
    if (stage) {
      setSelectedTiles(new Set(processMeta[stage].allowedCategories));
    } else {
      setSelectedTiles(new Set());
    }
    setRiskFilter("all");
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="flex">
        {/* Sidebar */}
        <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-border bg-white px-4 py-5 lg:flex">
          <div className="mb-5 flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/15 text-primary">
              <Shield className="h-5 w-5" />
            </div>
            <div className="text-lg font-semibold tracking-tight">НОРМ</div>
          </div>

          <div className="mb-5 flex items-center justify-between rounded-xl bg-muted/60 px-3 py-2.5">
            <div>
              <div className="text-[10px] uppercase text-muted-foreground">Организация</div>
              <div className="text-sm font-medium">Не выбрана</div>
            </div>
            <button className="text-muted-foreground hover:text-foreground">
              <ChevronDown className="h-4 w-4" />
            </button>
          </div>

          <nav className="space-y-1">
            <SidebarItem icon={UserCog} label="Администратор" />
            <SidebarItem icon={Home} label="Главная" />
            <SidebarItem icon={CalendarClock} label="События" />
            <SidebarItem icon={Flame} label="Риски" />
            <SidebarItem icon={Shield} label="Меры" />
            <SidebarItem icon={BarChart3} label="Аналитика" />
            <SidebarItem icon={Users} label="Контрагенты" active />
            <SidebarItem icon={Bot} label="AI мониторинг" />
            <SidebarItem icon={Gauge} label="Лимитная кампания" />
            <SidebarItem icon={GraduationCap} label="База знаний" />
          </nav>

          <div className="mt-auto space-y-3">
            <div className="flex items-center gap-3 rounded-xl border border-border bg-card px-3 py-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted text-xs font-semibold">
                МЕ
              </div>
              <div className="min-w-0">
                <div className="truncate text-sm font-medium">Михайлова Екатерина</div>
                <div className="truncate text-[11px] text-muted-foreground">Риск-менеджер (ЦА)</div>
              </div>
            </div>
            <SidebarItem icon={Headphones} label="Служба поддержки" />
          </div>
        </aside>

        {/* Main */}
        <main className="flex-1 px-4 py-6 sm:px-8 sm:py-8">
          <div className="mx-auto max-w-6xl">
            {/* Header */}
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-baseline gap-3">
                <h1 className="text-3xl font-semibold tracking-tight">Контрагенты</h1>
                <span className="text-sm text-muted-foreground">1002</span>
              </div>
              <div className="flex min-h-[40px] items-center">
                <ChecksWidget
                  runningCount={checks.filter((c) => c.status === "running").length}
                  doneCount={checks.filter((c) => c.status === "done").length}
                  onClick={() => setCheckDrawerOpen(true)}
                />
              </div>
            </div>

            {/* AI banner — DRPA data update */}
            <div className="mb-8 rounded-2xl border border-primary/30 bg-gradient-to-r from-primary/5 to-transparent p-4">
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary">
                  <Sparkles className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1 text-sm">
                  <div className="font-medium">
                    Я проанализировал дебиторскую задолженность: в зоне внимания 5 дебиторов и 3,9
                    млн рублей
                  </div>
                  <div className="mt-0.5 text-muted-foreground">
                    Оценивается задолженность ЮЛ и ИП, зарегистрированных на территории РФ, с
                    задолженностью свыше 10 млн
                  </div>
                </div>
              </div>
            </div>

            {/* Дебиторская задолженность */}
            <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-baseline gap-2">
                <h2 className="text-xl font-semibold">Дебиторская задолженность</h2>
                <span className="text-xs text-muted-foreground">на 30.09.2025</span>
              </div>
              <button
                onClick={() => setProcessDrawerOpen(true)}
                className={`inline-flex h-9 items-center gap-2 rounded-full border px-3.5 text-sm font-medium transition ${
                  processStage
                    ? "border-primary/40 bg-primary/5 text-primary"
                    : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                }`}
              >
                <SlidersHorizontal className="h-4 w-4" />
                Фильтр по процессу
                {processStage && (
                  <span className="ml-0.5 rounded-full bg-primary/15 px-1.5 py-px text-[10px] font-semibold">
                    1
                  </span>
                )}
              </button>
            </div>
            <div className="mb-8 rounded-2xl border border-border bg-white p-5">
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_auto]">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {tiles.map((t) => {
                    const isActive = selectedTiles.has(t.key);
                    const disabled = !!allowedCategories && !allowedCategories.has(t.key);
                    const dimmed = selectedTiles.size > 0 && !isActive && !disabled;
                    return (
                      <button
                        key={t.key}
                        disabled={disabled}
                        onClick={() => toggleTile(t.key)}
                        className={`rounded-2xl px-4 py-4 text-left transition ${
                          isActive
                            ? `${t.activeBg} ring-1 ring-inset ${t.ring} shadow-sm`
                            : `${t.bg} ring-1 ring-inset ring-transparent hover:ring-2 ${dimmed ? "opacity-60" : ""}`
                        } ${disabled ? "!opacity-40 !cursor-not-allowed hover:ring-0" : ""}`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="text-sm text-foreground/80">{t.title}</div>
                          <span
                            className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${t.pctBg}`}
                          >
                            {t.pct}
                          </span>
                        </div>
                        <div className="mt-3 flex items-end justify-between">
                          <div className="text-xl font-medium tracking-tight">{t.amount}</div>
                          <div className="flex items-center gap-1.5">
                            {statusChangePlusByCategory[t.key] > 0 && (
                              <span className="inline-flex h-5 items-center rounded-full bg-emerald-100 px-1.5 text-[11px] font-medium text-emerald-700">
                                +{statusChangePlusByCategory[t.key]}
                              </span>
                            )}
                            <div className="text-xs text-muted-foreground">{t.count}</div>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>

                <div className="flex items-center gap-6">
                  <ul className="space-y-2 text-sm">
                    {donutData.segments.map((s) => (
                      <li key={s.key} className="flex items-center gap-2">
                        <span
                          className="inline-block h-2 w-2 rounded-full"
                          style={{ background: s.color }}
                        />
                        <span>{s.label}</span>
                      </li>
                    ))}
                  </ul>
                  <Donut amount={donutData.amount} segments={donutData.segments} />
                </div>
              </div>
            </div>

            {/* Список дебиторов */}
            <h2 className="mb-3 text-xl font-semibold">Список дебиторов</h2>

            {processStage && (
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/5 px-3 py-1 text-xs font-medium text-primary">
                  Процесс: {processMeta[processStage].label}
                  <button
                    onClick={() => applyProcessStage(null)}
                    className="ml-0.5 rounded-full p-0.5 hover:bg-primary/10"
                    aria-label="Снять процесс"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
                <span className="text-[11px] text-muted-foreground">
                  Проблемы показаны в рамках выбранного процесса
                </span>
              </div>
            )}

            <div className="mb-5 flex flex-wrap items-center gap-2">
              {(["all", ...problemChips.map((c) => c.key)] as RiskChipKey[]).map((key) => {
                const meta =
                  key === "all" ? allChipMeta : problemChips.find((c) => c.key === key)!.meta;
                const Icon = meta.icon;
                const count = riskCounts[key] ?? 0;
                const isActive = riskFilter === key;
                const disabled = key !== "all" && count === 0;
                return (
                  <button
                    key={key}
                    disabled={disabled}
                    onClick={() => setRiskFilter(isActive && key !== "all" ? "all" : key)}
                    className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                      isActive
                        ? `${meta.activeBg} ${meta.activeBorder} ${meta.activeText} shadow-sm`
                        : `bg-white border-slate-200 text-slate-600 hover:bg-slate-50`
                    } ${disabled ? "opacity-40 cursor-not-allowed" : ""}`}
                  >
                    <Icon
                      className={`h-3.5 w-3.5 ${isActive ? meta.iconColor : meta.idleIconColor}`}
                    />
                    {meta.label}
                    <span
                      className={`rounded-full px-1.5 py-px text-[10px] ${
                        isActive ? "bg-white/70" : "bg-slate-100 text-muted-foreground"
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
              <div className="ml-auto">
                {searchOpen ? (
                  <div className="relative w-56 animate-in fade-in slide-in-from-right-2 duration-200">
                    <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                    <input
                      autoFocus
                      value={searchValue}
                      onChange={(e) => setSearchValue(e.target.value)}
                      placeholder="Поиск…"
                      className="h-8 w-full rounded-full border border-slate-200 bg-white pl-8 pr-8 text-xs outline-none focus:border-primary"
                    />
                    <button
                      onClick={() => {
                        setSearchOpen(false);
                        setSearchValue("");
                      }}
                      className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-full p-0.5 text-muted-foreground hover:bg-muted"
                      aria-label="Закрыть поиск"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setSearchOpen(true)}
                    className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:bg-slate-50"
                  >
                    <Search className="h-3.5 w-3.5" />
                    Поиск
                  </button>
                )}
              </div>
            </div>

            <div className="space-y-2.5">
              {filtered.length === 0 && (
                <div className="rounded-2xl border border-border bg-white p-8 text-center text-sm text-muted-foreground">
                  Нет дебиторов в этой категории
                </div>
              )}
              {filtered.map((c) => {
                const isPending = c.tag === "На оценке";
                const indicators = isPending ? [] : getCounterpartyProblemIndicators(c);
                const handleClick = () => {
                  if (isPending) {
                    setPendingCp(c);
                    setPendingCpOpen(true);
                  } else {
                    setActive(c);
                  }
                };
                return (
                  <button
                    key={c.id}
                    onClick={handleClick}
                    className="flex w-full items-center gap-4 rounded-2xl border border-[#E5E7EB] bg-white px-5 py-4 text-left transition hover:border-slate-300 hover:shadow-sm"
                  >
                    <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                      <div className="flex flex-wrap items-center gap-1.5">
                        {isPending ? (
                          <span className="inline-flex w-fit items-center rounded-full bg-violet-100/80 px-2.5 py-1 text-[11px] font-medium text-violet-800">
                            На оценке
                          </span>
                        ) : (
                          <CounterpartyStatusBadge tag={categoryLabel[c.status]} />
                        )}
                        {!isPending &&
                          statusChanges[c.inn] &&
                          statusChanges[c.inn].from !== statusChanges[c.inn].to && (
                            <span
                              title={`${categoryLabel[statusChanges[c.inn].from as CategoryKey]} → ${categoryLabel[statusChanges[c.inn].to as CategoryKey]}`}
                              className="inline-flex items-center rounded-full border border-violet-100 bg-violet-50 px-2 py-0.5 text-[11px] font-medium text-violet-700"
                            >
                              Статус изменён
                            </span>
                          )}
                        {indicators
                          .map((k) => ({ k, m: problemIndicatorMeta[k] }))
                          .filter((x) => Boolean(x.m))
                          .map(({ k, m }) => {
                            const Icon = m.icon;
                            return (
                              <span
                                key={k}
                                title={m.label}
                                className={`inline-flex h-6 w-6 items-center justify-center rounded-full border ${m.activeBorder} ${m.activeBg}`}
                              >
                                <Icon className={`h-3.5 w-3.5 ${m.iconColor}`} />
                              </span>
                            );
                          })}
                      </div>

                      <div className="truncate text-sm font-semibold text-foreground">{c.name}</div>
                      <div className="text-[12px] text-muted-foreground">
                        {c.inn} · {c.contracts.length} {getContractWord(c.contracts.length)}
                      </div>
                    </div>
                    {!isPending && (
                      <div className="hidden shrink-0 grid-cols-2 gap-3 sm:grid sm:w-[280px]">
                        <div className="min-w-0 rounded-lg bg-slate-50/70 px-3 py-2.5">
                          <div className="truncate text-sm font-medium text-foreground">
                            {c.totalDebt}
                          </div>
                          <div className="mt-1 text-[11px] text-muted-foreground">
                            Задолженность
                          </div>
                        </div>
                        <div className="min-w-0 rounded-lg bg-slate-50/70 px-3 py-2.5">
                          <div
                            className={`truncate text-sm font-medium ${
                              c.overdueAmountNum > 0 ? "text-rose-600" : "text-muted-foreground"
                            }`}
                          >
                            {c.overdueAmountNum > 0 ? c.overdueDebt : "—"}
                          </div>
                          <div className="mt-1 text-[11px] text-muted-foreground">Просроченная</div>
                        </div>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Bottom padding so last card is not hidden under fixed CTA */}
            <div className="pb-28" />
          </div>
        </main>
      </div>

      {/* Floating CTA — pinned to bottom of main work area, independent of list height */}
      <div className="pointer-events-none fixed inset-x-0 bottom-6 z-30 flex justify-center lg:left-64">
        <Button
          onClick={() => setRunDialogOpen(true)}
          className="pointer-events-auto h-12 gap-2 rounded-full px-6 text-sm font-semibold shadow-lg shadow-primary/25"
        >
          <Sparkles className="h-4 w-4" />
          Запустить проверку
        </Button>
      </div>

      <CounterpartyModal
        counterparty={active}
        open={!!active}
        onOpenChange={(o) => !o && setActive(null)}
        onStatusChange={handleStatusChange}
      />

      <RunCheckDialog
        open={runDialogOpen}
        onOpenChange={setRunDialogOpen}
        onSubmit={(inn, files) => {
          setRunDialogOpen(false);
          const hasInn = !!inn;
          const hasFiles = files.length > 0;
          const recordType: "counterparty" | "contract" | "complex" =
            hasInn && hasFiles ? "complex" : hasInn ? "counterparty" : "contract";
          const id = `check-${inn || "contract"}-${Date.now()}`;
          const rec: CheckRecord = {
            id,
            inn: inn || undefined,
            fileNames: files.map((f) => f.name),
            status: "running",
            createdAt: Date.now(),
            type: recordType,
          };
          setChecks((prev) => [rec, ...prev]);
          window.setTimeout(() => {
            setChecks((prev) => prev.map((c) => (c.id === id ? { ...c, status: "done" } : c)));
          }, 5000);
        }}
      />

      <PendingAssessmentModal
        counterparty={pendingCp}
        open={pendingCpOpen}
        onOpenChange={(o) => {
          setPendingCpOpen(o);
          if (!o) setPendingCp(null);
        }}
      />

      <ChecksDrawer
        open={checkDrawerOpen}
        onOpenChange={setCheckDrawerOpen}
        checks={checks}
        onOpenCheck={(c) => {
          const hasInn = !!c.inn;
          const hasFiles = c.fileNames.length > 0;
          const recordType =
            c.type ?? (hasInn && hasFiles ? "complex" : hasInn ? "counterparty" : "contract");
          if (recordType === "complex") {
            const a = buildAssessment(`ООО „Альтаир Логистик“`, c.inn ?? "", "auto");
            setActiveComplexCheckId(c.id);
            setComplexAssessment(a);
            setCheckDrawerOpen(false);
            setComplexModalOpen(true);
            return;
          }
          if (recordType === "contract") {
            setActiveContractCheckId(c.id);
            setCheckDrawerOpen(false);
            setContractModalOpen(true);
            return;
          }
          const a = buildAssessment(`ООО „Альтаир Логистик“`, c.inn ?? "", "auto");
          setActiveCheckId(c.id);
          setCheckAssessment(a);
          setCheckDrawerOpen(false);
          setCheckAssessmentOpen(true);
        }}
      />

      <ContractAssessmentModal
        open={contractModalOpen}
        onOpenChange={(o) => {
          setContractModalOpen(o);
          if (!o) setActiveContractCheckId(null);
        }}
        onDelete={() => {
          if (activeContractCheckId) {
            setChecks((prev) => prev.filter((c) => c.id !== activeContractCheckId));
          }
          setContractModalOpen(false);
          setActiveContractCheckId(null);
          toast("Результат проверки удалён");
        }}
      />

      <ComplexAssessmentModal
        assessment={complexAssessment}
        open={complexModalOpen}
        onOpenChange={(o) => {
          setComplexModalOpen(o);
          if (!o) {
            setActiveComplexCheckId(null);
            setComplexAssessment(null);
          }
        }}
        positive
        onDelete={() => {
          if (activeComplexCheckId) {
            setChecks((prev) => prev.filter((c) => c.id !== activeComplexCheckId));
          }
          setComplexModalOpen(false);
          setActiveComplexCheckId(null);
          setComplexAssessment(null);
          toast("Результат проверки удалён");
        }}
        onAddToList={() => {
          const check = checks.find((c) => c.id === activeComplexCheckId);
          if (!check) {
            setComplexModalOpen(false);
            return;
          }
          const today = new Date().toLocaleDateString("ru-RU");
          const cp: Counterparty = {
            ...buildNewCounterparty(check.inn ?? "", today),
            name: `ООО „Альтаир Логистик“`,
            tag: "Нет риска",
            status: "no_risk",
          };
          setAddedCounterparties((prev) =>
            prev.some((c) => c.inn === cp.inn) ? prev : [cp, ...prev],
          );
          setChecks((prev) => prev.filter((c) => c.id !== check.id));
          setComplexModalOpen(false);
          setActiveComplexCheckId(null);
          setComplexAssessment(null);
          toast.success("Контрагент добавлен в список дебиторов");
        }}
      />

      <AssessmentModal
        assessment={checkAssessment}
        open={checkAssessmentOpen}
        onOpenChange={(o) => {
          setCheckAssessmentOpen(o);
          if (!o) {
            setCheckAssessment(null);
            setActiveCheckId(null);
          }
        }}
        status="updated"
        disagreement={null}
        defaultInn={checkAssessment?.inn}
        onConfirm={() => {}}
        onDisagree={() => {}}
        completionMode
        positive
        onDeleteResult={() => {
          if (activeCheckId) {
            setChecks((prev) => prev.filter((c) => c.id !== activeCheckId));
          }
          setCheckAssessmentOpen(false);
          setCheckAssessment(null);
          setActiveCheckId(null);
          toast("Результат проверки удалён");
        }}
        onAddToList={() => {
          const check = checks.find((c) => c.id === activeCheckId);
          if (!check) return;
          const today = new Date().toLocaleDateString("ru-RU");
          const cp: Counterparty = {
            ...buildNewCounterparty(check.inn ?? "", today),
            name: `ООО „Альтаир Логистик“`,
            tag: "Нет риска",
            status: "no_risk",
          };
          setAddedCounterparties((prev) =>
            prev.some((c) => c.inn === cp.inn) ? prev : [cp, ...prev],
          );
          setChecks((prev) => prev.filter((c) => c.id !== check.id));
          setCheckAssessmentOpen(false);
          setCheckAssessment(null);
          setActiveCheckId(null);
          toast.success("Контрагент добавлен в список дебиторов");
        }}
      />

      <AssessmentModal
        assessment={manualAssessment}
        open={manualAssessmentOpen}
        onOpenChange={handleManualAssessmentOpenChange}
        onBack={handleManualAssessmentBack}
        onCloseFlow={handleManualFlowCloseAll}
        status={manualStatus}
        disagreement={manualDisagreement}
        defaultInn={manualAssessment?.inn}
        positive={manualFlowTarget?.status === "no_risk"}
        onConfirm={() => setManualStatus("confirmed")}
        onDisagree={(d) => {
          setManualDisagreement(d);
          setManualStatus("disagreed");
        }}
        onStatusChange={(s) => manualFlowTarget && handleStatusChange(manualFlowTarget.inn, s)}
      />

      <CounterpartyModal
        counterparty={manualFlowTarget}
        open={manualFlowCpOpen}
        onOpenChange={handleManualFlowCpOpenChange}
        onStatusChange={handleStatusChange}
      />

      <ProcessFilterDrawer
        open={processDrawerOpen}
        onOpenChange={setProcessDrawerOpen}
        value={processStage}
        onApply={applyProcessStage}
        counts={processCounts}
      />

      <DrpaDataUpdateDrawer
        open={drpaOpen}
        onOpenChange={setDrpaOpen}
        cards={drpaCards}
        setCards={setDrpaCards}
        confirmed={drpaConfirmed}
        onConfirm={() => {
          setDrpaConfirmed(true);
          setDrpaOpen(false);
          toast.success("Данные обновлены и подтверждены");
        }}
      />
    </div>
  );
}
