import { useState } from "react";
import { ChevronDown, MessageSquare } from "@/shared/ui";
import { cn } from "@/lib/utils";
import { InModalDrawer } from "./InModalDrawer";
import { NormAssistantIcon } from "./NormAssistantIcon";
import {
  type AssessmentGroup,
  type AssessmentCriterion,
  type CriterionStatus,
  groupCounts,
  statusFromPassed,
  criterionStatusMeta,
} from "@/lib/assessment-data";
import { assessmentCountMeta, type AssessmentCountKind } from "./assessment-count-meta";

export type GroupComment = {
  text: string;
  author: string;
  createdAt: string;
};

export function AssessmentGroupDrawer({
  group,
  open,
  onOpenChange,
  comment,
}: {
  group: AssessmentGroup | null;
  open: boolean;
  onOpenChange: (o: boolean) => void;
  comment?: GroupComment;
}) {
  const [activeFilter, setActiveFilter] = useState<AssessmentCountKind | null>(null);
  if (!group) return null;
  const counts = groupCounts(group);

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
        {comment && <GroupCommentBlock comment={comment} />}
        <div className="space-y-3">
          {filteredCriteria.map((c) => (
            <CriterionCard key={`${c.number}-${activeFilter ?? "all"}`} c={c} />
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

function GroupCommentBlock({ comment }: { comment: GroupComment }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="mb-4 rounded-2xl border border-slate-200 bg-white">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center gap-3 px-4 py-3 text-left"
      >
        <MessageSquare className="h-4 w-4 shrink-0 text-primary" />
        <span className="flex-1 text-sm font-medium text-slate-900">Замечание к группе</span>
        <ChevronDown
          className={cn("h-4 w-4 shrink-0 text-muted-foreground transition", open && "rotate-180")}
        />
      </button>
      {open && (
        <div className="border-t border-slate-100 px-4 py-3">
          <div className="text-xs text-muted-foreground">
            {comment.author} · {comment.createdAt}
          </div>
          <div className="mt-2 whitespace-pre-wrap text-sm text-slate-900">{comment.text}</div>
        </div>
      )}
    </div>
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
  const isActiveRisk = kind === "risk" && value > 0;

  const activeStyle = isActiveRisk
    ? "ring-1 ring-rose-200 bg-rose-50/40 border-rose-200"
    : "ring-1 ring-slate-200 bg-slate-100/60 border-slate-300";

  const iconBg = isActiveRisk ? "bg-rose-50" : "bg-slate-100";
  const iconColor = isActiveRisk ? "text-rose-500" : "text-slate-400";
  const numColor = isActiveRisk ? "text-rose-700" : "text-slate-900";
  const labelColor = isActive
    ? isActiveRisk
      ? "text-slate-700"
      : "text-slate-600"
    : "text-slate-500";

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
        <div className={`flex h-8 w-8 items-center justify-center rounded-full ${iconBg}`}>
          <Ico className={`h-4 w-4 ${iconColor}`} />
        </div>
        <div
          className={`text-2xl font-semibold leading-none ${isActive ? numColor : "text-slate-900"}`}
        >
          {value}
        </div>
      </div>
      <div className={`mt-3 text-xs leading-snug ${labelColor}`}>{m.label}</div>
    </button>
  );
}

function CriterionCard({ c }: { c: AssessmentCriterion }) {
  const status: CriterionStatus = statusFromPassed(c.passed);
  const m = criterionStatusMeta[status];
  const showReason = c.passed === false;
  const reason = showReason ? (c.reason ?? "") : "";
  const isLong = reason.length > 100;
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3.5 transition-colors hover:border-slate-300">
      <span
        className={`inline-flex h-5 items-center whitespace-nowrap rounded-full px-2 text-[11px] font-semibold ${m.chip}`}
      >
        {m.label}
      </span>
      <div className="mt-1.5 text-sm font-medium leading-snug text-slate-900">{c.title}</div>
      {showReason && reason && (
        <>
          <div
            className={`mt-2 text-xs leading-relaxed text-slate-500 ${
              isLong && !expanded ? "truncate" : ""
            }`}
          >
            {reason}
          </div>
          {isLong && (
            <button
              type="button"
              onClick={() => setExpanded((v) => !v)}
              className="mt-1.5 text-xs font-medium text-slate-600 hover:text-slate-900"
            >
              {expanded ? "Свернуть" : "Раскрыть"}
            </button>
          )}
        </>
      )}
    </div>
  );
}
