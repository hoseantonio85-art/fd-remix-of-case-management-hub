import { useEffect, useState } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X, ArrowLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { NormAssistantIcon } from "./NormAssistantIcon";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { largeModalContentClass } from "@/lib/modal-styles";
import { type CounterpartyStatus } from "./AssessmentCorrectionDrawer";
import { getToneForTag, toneStyles } from "./header-theme";
import {
  type Assessment,
  type AssessmentGroup,
  type AssessmentGroupId,
  groupCounts,
  sumGroupCounts,
  MAIN_GROUP_IDS,
  OTHER_GROUP_IDS,
} from "@/lib/assessment-data";
import { ChevronDown } from "lucide-react";
import { AssessmentGroupDrawer } from "./AssessmentGroupDrawer";
import { defaultOgrn, defaultRegistrationInfo } from "./RegistrationInfoWidget";
import { RegistrationInfoDrawer } from "./RegistrationInfoDrawer";
import { KeyAnomaliesWidget } from "./KeyAnomaliesWidget";
import { TrustFactorsWidget } from "./TrustFactorsWidget";
import {
  CommentHistoryEntry,
  CommentHistoryDrawer,
  type CommentRecord,
} from "./AssessmentCommentHistory";
import { AssessmentCommentDrawer, type AssessmentCommentPayload } from "./AssessmentCommentDrawer";

export type AssessmentStatus = "pending" | "confirmed" | "disagreed" | "updated" | "review";

const statusMeta: Record<
  AssessmentStatus,
  { label: string; chip: string; headerBg: string }
> = {
  pending: {
    label: "Не заключать сделки",
    chip: "bg-rose-100 text-rose-900",
    headerBg: "bg-gradient-to-b from-rose-50 via-rose-50/40 to-transparent",
  },
  confirmed: {
    label: "Подтверждена",
    chip: "bg-emerald-100 text-emerald-800",
    headerBg: "bg-gradient-to-b from-emerald-50 via-emerald-50/40 to-transparent",
  },
  disagreed: {
    label: "Не согласовано",
    chip: "bg-orange-100 text-orange-900",
    headerBg: "bg-gradient-to-b from-orange-50 via-orange-50/40 to-transparent",
  },
  updated: {
    label: "Обновлена",
    chip: "bg-sky-100 text-sky-900",
    headerBg: "bg-gradient-to-b from-sky-50 via-sky-50/40 to-transparent",
  },
  review: {
    label: "На пересмотре",
    chip: "bg-amber-100 text-amber-900",
    headerBg: "bg-gradient-to-b from-amber-50 via-amber-50/40 to-transparent",
  },
};

const toneLabel: Record<"rose" | "amber" | "slate" | "emerald", string> = {
  rose: "Критический маркер",
  amber: "Требует согласования",
  slate: "Потенциальный маркер",
  emerald: "Позитивный маркер",
};

const REASONS = [
  "Данные неактуальны",
  "Источник ошибочный",
  "Требуется дополнительная проверка",
  "Другое",
];

export type DisagreementGroup = { groupId: string; groupTitle: string; comment: string };
export type Disagreement = {
  reason?: string;
  text: string;
  groups?: string[];
  status?: "draft" | "submitted";
  groupComments?: DisagreementGroup[];
  submittedAt?: string;
};

export function AssessmentModal({
  assessment,
  open,
  onOpenChange,
  status,
  disagreement,
  defaultInn,
  running,
  onRun,
  onConfirm,
  onDisagree,
  onBack,
  onCloseFlow,
  positive = false,
  onStatusChange,
}: {
  assessment: Assessment | null;
  open: boolean;
  onOpenChange: (o: boolean) => void;
  status: AssessmentStatus;
  disagreement: Disagreement | null;
  defaultInn?: string;
  running?: boolean;
  onRun?: (inn: string) => void;
  onConfirm: () => void;
  onDisagree: (d: Disagreement) => void;
  onBack?: () => void;
  onCloseFlow?: () => void;
  positive?: boolean;
  onStatusChange?: (status: CounterpartyStatus) => void;
}) {
  
  const [groupDrawer, setGroupDrawer] = useState<AssessmentGroup | null>(null);
  const [registrationOpen, setRegistrationOpen] = useState(false);

  // Comment drawer (replaces old correction flow).
  const [commentOpen, setCommentOpen] = useState(false);


  // History blocks (persist per-counterparty within the session)
  const [commentHistoryOpen, setCommentHistoryOpen] = useState(false);
  const [infoExpanded, setInfoExpanded] = useState(false);
  const [commentHistoryMap, setCommentHistoryMap] = useState<Record<string, CommentRecord[]>>({});
  const [commentedGroupsMap, setCommentedGroupsMap] = useState<Record<string, AssessmentGroupId[]>>({});

  const inn = assessment?.inn ?? "";
  const commentHistory = commentHistoryMap[inn] ?? [];
  const commentedGroupIds = commentedGroupsMap[inn] ?? [];

  // Only reset transient UI state when modal closes.
  useEffect(() => {
    if (!open) {
      setCommentOpen(false);
      setCommentHistoryOpen(false);
    }
  }, [open]);

  const nowLabel = () => {
    const d = new Date();
    const hh = String(d.getHours()).padStart(2, "0");
    const mm = String(d.getMinutes()).padStart(2, "0");
    return `Сегодня, ${hh}:${mm}`;
  };

  const currentTagLabel = positive ? "Нет риска" : "Риск дефолта";

  const handleCommentSubmit = (payload: AssessmentCommentPayload) => {
    if (!inn) return;
    const record: CommentRecord = {
      id: `c-${Date.now()}`,
      dateTime: nowLabel(),
      author: "Измайлова Л.Д. • Инициатор",
      groupTitles: payload.groupTitles,
      comment: payload.comment,
    };
    setCommentHistoryMap((prev) => ({
      ...prev,
      [inn]: [record, ...(prev[inn] ?? [])],
    }));
    setCommentedGroupsMap((prev) => {
      const existing = prev[inn] ?? [];
      const merged = Array.from(new Set([...existing, ...payload.groupIds]));
      return { ...prev, [inn]: merged };
    });
    toast("Комментарий сохранён в истории оценки");
  };


  if (!assessment) return null;

  const effectivePositive = positive;
  const headerBg = effectivePositive
    ? "bg-gradient-to-b from-emerald-50 via-emerald-50/40 to-transparent"
    : statusMeta[status].headerBg;
  const meta = { label: "", chip: "", headerBg };
  const resolutionBadge = effectivePositive
    ? { label: "Сделки заключать можно", chip: "bg-emerald-100 text-emerald-900" }
    : { label: "Не заключать сделки", chip: "bg-rose-100 text-rose-900" };





  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-slate-900/40 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        {/* IMPORTANT: AssessmentModal must use the exact same fixed-size shell as CounterpartyModal.
            It must be h-[calc(100dvh-32px)] and w-[1320px].
            Keep the gradient header, but do not make the modal content-height, max-w-5xl, w-[96vw], or add backdrop blur. */}
        <DialogPrimitive.Content
          className={cn(largeModalContentClass, "duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 sm:max-w-[calc(100vw-32px)] sm:rounded-3xl")}
        >
        <div className="relative flex min-h-0 flex-1 flex-col">
          {/* Header */}
          <div className={cn("relative shrink-0 px-5 pt-6 pb-6 lg:px-10", meta.headerBg)}>
            <div className="absolute right-5 top-5 flex items-center gap-2">
              {onBack && (
                <button
                  onClick={onBack}
                  className="rounded-full bg-white p-1.5 text-muted-foreground hover:bg-muted"
                  aria-label="Вернуться назад"
                >
                  <ArrowLeft className="h-4 w-4" />
                </button>
              )}
              <button
                onClick={() => (onCloseFlow ? onCloseFlow() : onOpenChange(false))}
                className="rounded-full bg-white p-1.5 text-muted-foreground hover:bg-muted"
                aria-label="Закрыть и вернуться на главный экран"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-1.5">
              <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-medium ${resolutionBadge.chip}`}>
                {resolutionBadge.label}
              </span>
            </div>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-foreground">
              Оценка контрагента {assessment.counterpartyName}
            </h2>
            <div className={cn(
              "mt-5 rounded-3xl p-[1.5px]",
              effectivePositive
                ? "bg-gradient-to-r from-emerald-200 via-emerald-100 to-teal-100"
                : "bg-gradient-to-r from-rose-200 via-red-100 to-orange-100",
            )}>
              <div className={cn(
                "flex items-start gap-4 rounded-[22px] px-6 py-5",
                effectivePositive
                  ? "bg-gradient-to-br from-emerald-50/60 via-white to-white"
                  : "bg-gradient-to-br from-rose-50/60 via-white to-white",
              )}>
                <NormAssistantIcon size="lg" tone={effectivePositive ? "emerald" : "rose"} />
                <div className="min-w-0 flex-1">
                  <div className="mt-1 text-lg font-semibold text-slate-900">
                    Обоснование оценки
                  </div>
                  <p className="mt-2 text-sm leading-snug text-muted-foreground">
                    {effectivePositive
                      ? "Критически значимых факторов риска не выявлено. Финансовые, регистрационные и репутационные признаки не блокируют заключение сделки."
                      : "Компания имеет критически значимые риски: за последние 6 месяцев сменились собственники или директор, оперативное погашение краткосрочных обязательств невозможно, а также активы сформированы в основном за счёт привлечённых средств."}
                  </p>
                </div>
              </div>
            </div>
          </div>


          {/* Body */}
          <div className="min-h-0 flex-1 space-y-5 overflow-y-auto bg-white px-5 py-6 lg:px-10">

            <div className="grid gap-y-5 gap-x-5 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-x-12">
              {/* What changed — right column */}
              <aside className="order-2 lg:col-start-2 lg:row-start-1">

                <div className="space-y-3 lg:sticky lg:top-0">
                  <div className="rounded-2xl border border-border bg-white p-5">
                    <div className="text-sm font-semibold text-foreground">Информация</div>
                    <div className="mt-3 space-y-3">
                      <InfoRow label="ИНН" value={assessment.inn} />
                      <InfoRow label="ОГРН" value={defaultOgrn} />
                      <InfoRow
                        label="Дата оценки"
                        value={
                          <div>
                            <div className="text-sm leading-snug text-foreground">{assessment.date}</div>
                            <div className="text-[11px] text-muted-foreground">обновлено сегодня</div>
                          </div>
                        }
                      />
                      <InfoRow label="Текущий статус ЕГРЮЛ" value="Действующая" />
                      {infoExpanded && (
                        <>
                          <InfoRow
                            label="Основной ОКВЭД"
                            value={`${defaultRegistrationInfo.okvedCode} · ${defaultRegistrationInfo.okvedName}`}
                          />
                          <InfoRow
                            label="Юридический адрес"
                            value={defaultRegistrationInfo.legalAddress}
                          />
                        </>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => setInfoExpanded((v) => !v)}
                      className="mt-3 text-xs font-medium text-primary hover:underline"
                    >
                      {infoExpanded ? "Свернуть" : "Подробнее"}
                    </button>
                  </div>

                  <CommentHistoryEntry
                    count={commentHistory.length}
                    lastDate={commentHistory[0]?.dateTime ?? ""}
                    onOpen={() => setCommentHistoryOpen(true)}
                  />



                </div>
              </aside>


              {/* Groups — left, row 2 */}
              <section className="order-3 lg:col-start-1 lg:row-start-1 space-y-5">
                <div>
                <h3 className="mb-2 text-sm font-semibold">Группы оценки</h3>
                <div className="grid grid-cols-1 gap-2.5">
                  {MAIN_GROUP_IDS.map((id) => {
                    const g = assessment.groups.find((x) => x.id === id);
                    if (!g) return null;
                    return (
                      <GroupCard
                        key={g.id}
                        group={g}
                        onOpen={setGroupDrawer}
                        hasComment={commentedGroupIds.includes(g.id)}
                      />
                    );
                  })}
                  {(() => {
                    const otherGroups = OTHER_GROUP_IDS
                      .map((id) => assessment.groups.find((x) => x.id === id))
                      .filter((g): g is AssessmentGroup => !!g);
                    return otherGroups.length > 0 ? (
                      <OtherGroupsAccordion groups={otherGroups} onOpen={setGroupDrawer} />
                    ) : null;
                  })()}
                </div>
                </div>
              </section>
            </div>
          </div>


          {/* Footer actions */}
          <div className="shrink-0 border-t border-border bg-white px-5 py-4 lg:px-10">
            <Button
              variant="outline"
              onClick={() => setCommentOpen(true)}
              className="h-12 w-full rounded-full text-sm font-medium"
            >
              Не согласен
            </Button>
          </div>




          <AssessmentGroupDrawer
            group={groupDrawer}
            open={!!groupDrawer}
            onOpenChange={(o) => !o && setGroupDrawer(null)}
          />

          <RegistrationInfoDrawer
            open={registrationOpen}
            onOpenChange={setRegistrationOpen}
            counterpartyName={assessment.counterpartyName}
            inn={assessment.inn}
            ogrn={defaultOgrn}
          />

          <CommentHistoryDrawer
            open={commentHistoryOpen}
            onOpenChange={setCommentHistoryOpen}
            records={commentHistory}
          />

          <AssessmentCommentDrawer
            open={commentOpen}
            onOpenChange={setCommentOpen}
            groups={MAIN_GROUP_IDS.map((id) => assessment.groups.find((x) => x.id === id)).filter((g): g is AssessmentGroup => !!g)}
            onSubmit={handleCommentSubmit}
          />
        </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}



import { assessmentCountMeta, type AssessmentCountKind } from "./assessment-count-meta";

function CountPill({ kind, count }: { kind: AssessmentCountKind; count: number }) {
  const m = assessmentCountMeta[kind];
  const Ico = m.icon;
  const label =
    kind === "risk"
      ? count === 1
        ? "риск"
        : "риска"
      : kind === "clear"
        ? "без нарушений"
        : "нет данных";
  return (
    <span className={`inline-flex h-6 items-center gap-1 rounded-full px-2.5 text-xs font-medium ${m.bg}`}>
      <Ico className={`h-3.5 w-3.5 ${m.icon_color}`} />
      <span className={`leading-none ${m.num}`}>
        <span className="font-semibold">{count}</span> {label}
      </span>
    </span>
  );
}


function GroupCard({
  group,
  onOpen,
  compact = false,
  hasComment = false,
}: {
  group: AssessmentGroup;
  onOpen: (g: AssessmentGroup) => void;
  compact?: boolean;
  hasComment?: boolean;
}) {
  group: AssessmentGroup;
  onOpen: (g: AssessmentGroup) => void;
  compact?: boolean;
}) {
  const counts = groupCounts(group);
  const negatives = group.criteria.filter((c) => c.passed === false);
  const [expanded, setExpanded] = useState(false);
  const visibleNegatives = expanded ? negatives : negatives.slice(0, 2);
  const hiddenCount = negatives.length - 2;
  return (
    <div className="rounded-lg border border-slate-100 bg-white transition">
      <div
        role="button"
        tabIndex={0}
        onClick={() => onOpen(group)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onOpen(group);
          }
        }}
        className={cn(
          "group flex cursor-pointer items-center gap-3 px-3 text-left hover:bg-muted/30",
          compact ? "py-2.5" : "py-3",
        )}
      >
        <div className="min-w-0 flex-1">
          <div className="text-sm font-medium text-foreground">{group.title}</div>
          <div className="mt-2 flex flex-wrap items-center gap-1.5">
            <CountPill kind="risk" count={counts.risk} />
            <CountPill kind="clear" count={counts.clear} />
            <CountPill kind="no_data" count={counts.no_data} />
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground transition group-hover:text-foreground" />
        </div>
      </div>
      {negatives.length > 0 && (
        <div className="border-t border-rose-100 px-3 py-2 space-y-1.5">
          {visibleNegatives.map((c) => (
            <div
              key={c.number}
              className="rounded-md bg-rose-50/70 px-2.5 py-1.5"
            >
              <div className="text-sm font-medium text-rose-900">{c.title}</div>
              {c.reason && c.reason !== "Нарушений не выявлено" && c.reason !== "Нет данных для проверки" && (
                <div className="mt-0.5 text-xs text-muted-foreground">{c.reason}</div>
              )}
            </div>
          ))}
          {hiddenCount > 0 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setExpanded((v) => !v);
              }}
              className="text-xs font-medium text-rose-700 hover:text-rose-800"
            >
              {expanded ? "Свернуть" : `Показать ещё ${hiddenCount}`}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

function pluralCriteria(n: number) {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return "критерий";
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return "критериев";
  return "критериев";
}

function OtherGroupsAccordion({
  groups,
  onOpen,
}: {
  groups: AssessmentGroup[];
  onOpen: (g: AssessmentGroup) => void;
}) {
  const [open, setOpen] = useState(false);
  const totals = sumGroupCounts(groups);
  const criteriaCount = groups.reduce((acc, g) => acc + g.criteria.length, 0);
  return (
    <div className="rounded-lg border border-slate-100 bg-white transition">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center gap-3 px-3 py-3 text-left hover:bg-muted/30"
      >
        <div className="min-w-0 flex-1">
          <div className="text-sm font-medium text-foreground">Прочее</div>
          <div className="mt-0.5 text-xs text-muted-foreground">
            {groups.length} групп · {criteriaCount} {pluralCriteria(criteriaCount)}
          </div>
          <div className="mt-2 flex flex-wrap items-center gap-1.5">
            <CountPill kind="risk" count={totals.risk} />
            <CountPill kind="clear" count={totals.clear} />
            <CountPill kind="no_data" count={totals.no_data} />
          </div>
        </div>
        <ChevronDown
          className={cn(
            "h-4 w-4 shrink-0 text-muted-foreground transition",
            open && "rotate-180",
          )}
        />
      </button>
      {open && (
        <div className="border-t border-slate-100 bg-slate-50/40 p-2 space-y-2">
          {groups.map((g) => (
            <GroupCard key={g.id} group={g} onOpen={onOpen} compact />
          ))}
        </div>
      )}
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <div className="text-[11px] uppercase tracking-wide text-muted-foreground">{label}</div>
      <div className="mt-0.5 text-sm leading-snug text-foreground break-words">{value}</div>
    </div>
  );
}
