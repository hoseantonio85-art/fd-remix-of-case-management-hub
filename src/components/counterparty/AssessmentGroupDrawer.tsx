import { useState } from "react";
import { InModalDrawer } from "./InModalDrawer";
import {
  type AssessmentGroup,
  type AssessmentCriterion,
  type CriterionStatus,
  groupCounts,
  statusFromPassed,
  criterionStatusMeta,
} from "@/lib/assessment-data";
import { assessmentCountMeta, type AssessmentCountKind } from "./assessment-count-meta";

export function AssessmentGroupDrawer({
  group,
  open,
  onOpenChange,
}: {
  group: AssessmentGroup | null;
  open: boolean;
  onOpenChange: (o: boolean) => void;
}) {
  if (!group) return null;
  const counts = groupCounts(group);
  const [activeFilter, setActiveFilter] = useState<AssessmentCountKind | null>(null);

  const toggleFilter = (kind: AssessmentCountKind) => {
    setActiveFilter((prev) => (prev === kind ? null : kind));
  };

  const sortedCriteria = [...group.criteria].sort(sortByPriority);
  const filteredCriteria = activeFilter
    ? sortedCriteria.filter((c) => statusFromPassed(c.passed) === activeFilter)
    : sortedCriteria;

  return (
    <InModalDrawer open={open} onOpenChange={onOpenChange}>
      {/* Header */}
      <div className="shrink-0 px-6 pt-6 pb-4">
        <div className="text-[11px] font-medium uppercase tracking-wide text-slate-500">
          Группа оценки
        </div>
        <h3 className="mt-1 pr-10 text-lg font-semibold leading-snug text-slate-900">
          {group.title}
        </h3>
        <div className="mt-1.5 text-xs leading-relaxed text-slate-500">
          {group.criteria.length} {pluralCriteria(group.criteria.length)}
        </div>

        {/* Summary filters */}
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <SummaryStat
            kind="risk"
            value={counts.risk}
            isActive={activeFilter === "risk"}
            onClick={() => toggleFilter("risk")}
          />
          <SummaryStat
            kind="clear"
            value={counts.clear}
            isActive={activeFilter === "clear"}
            onClick={() => toggleFilter("clear")}
          />
          <SummaryStat
            kind="no_data"
            value={counts.no_data}
            isActive={activeFilter === "no_data"}
            onClick={() => toggleFilter("no_data")}
          />
        </div>

        {/* Active filter indicator */}
        {activeFilter && (
          <div className="mt-3 flex items-center justify-between">
            <span className="text-xs text-slate-500">
              Показаны: {assessmentCountMeta[activeFilter].label.toLowerCase()}
            </span>
            <button
              onClick={() => setActiveFilter(null)}
              className="text-xs font-medium text-slate-600 hover:text-slate-900"
            >
              Сбросить
            </button>
          </div>
        )}
      </div>

      {/* Body — flat list of criteria, no category sections */}
      <div className="px-6 pb-6">
        <div className="space-y-2.5">
          {filteredCriteria.map((c) => (
            <CriterionCard key={c.number} c={c} />
          ))}
          {filteredCriteria.length === 0 && (
            <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/50 p-6 text-center">
              <p className="text-sm text-slate-500">
                В этой группе нет критериев с таким статусом.
              </p>
            </div>
          )}
        </div>
      </div>
    </InModalDrawer>
  );
}

function sortByPriority(a: AssessmentCriterion, b: AssessmentCriterion): number {
  const order = (p: boolean | null) => (p === false ? 0 : p === null ? 1 : 2);
  return order(a.passed) - order(b.passed);
}

function pluralCriteria(n: number) {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return "критерий";
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return "критерия";
  return "критериев";
}

const activeCardStyles: Record<AssessmentCountKind, string> = {
  risk: "ring-1 ring-rose-200 bg-rose-50/40 border-rose-200",
  clear: "ring-1 ring-emerald-200 bg-emerald-50/40 border-emerald-200",
  no_data: "ring-1 ring-slate-200 bg-slate-50/40 border-slate-300",
};

function SummaryStat({
  kind,
  value,
  isActive,
  onClick,
}: {
  kind: AssessmentCountKind;
  value: number;
  isActive: boolean;
  onClick: () => void;
}) {
  const m = assessmentCountMeta[kind];
  const Ico = m.icon;
  const activeStyle = activeCardStyles[kind];
  return (
    <button
      onClick={onClick}
      className={`flex min-h-[92px] w-full flex-col justify-between rounded-2xl border p-4 text-left transition-colors ${
        isActive
          ? activeStyle
          : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/30"
      }`}
    >
      <div className="flex items-center justify-between">
        <div className={`flex h-8 w-8 items-center justify-center rounded-full ${m.bg}`}>
          <Ico className={`h-4 w-4 ${m.icon_color}`} />
        </div>
        <div className={`text-2xl font-semibold leading-none ${isActive ? m.num : "text-slate-900"}`}>
          {value}
        </div>
      </div>
      <div className={`mt-3 text-xs leading-snug ${isActive ? "text-slate-700" : "text-slate-500"}`}>
        {m.label}
      </div>
    </button>
  );
}

function CriterionCard({ c }: { c: AssessmentCriterion }) {
  const status: CriterionStatus = statusFromPassed(c.passed);
  const m = criterionStatusMeta[status];
  return (
    <div className="rounded-xl border border-slate-200 bg-white px-3 py-2.5">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <span
            className={`inline-flex h-5 items-center whitespace-nowrap rounded-full px-2 text-[11px] font-semibold ${m.chip}`}
          >
            {m.label}
          </span>
          <div className="mt-1 text-sm font-medium leading-snug text-slate-900">
            {c.title}
          </div>
        </div>
        <div className="max-w-[42%] shrink-0 self-center text-xs leading-snug text-slate-500">
          {c.reason}
        </div>
      </div>
    </div>
  );
}
