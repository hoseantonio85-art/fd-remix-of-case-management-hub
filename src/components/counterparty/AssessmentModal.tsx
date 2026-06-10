import { useEffect, useRef, useState } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X, ArrowLeft, CheckCircle2, Download, ChevronRight, Info, RefreshCw, Loader2, Flame, Zap, Send } from "lucide-react";
import { toast } from "sonner";
import { NormAssistantIcon } from "./NormAssistantIcon";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { largeModalContentClass } from "@/lib/modal-styles";
import {
  type Assessment,
  type AssessmentGroup,
  groupCounts,
} from "@/lib/assessment-data";
import { AssessmentGroupDrawer } from "./AssessmentGroupDrawer";
import { defaultOgrn } from "./RegistrationInfoWidget";
import { RegistrationInfoDrawer } from "./RegistrationInfoDrawer";
import { KeyAnomaliesWidget } from "./KeyAnomaliesWidget";
import { TrustFactorsWidget } from "./TrustFactorsWidget";
import { AssessmentHistoryEntry, AssessmentHistoryDrawer } from "./AssessmentHistoryDrawer";

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
}) {
  
  const [groupDrawer, setGroupDrawer] = useState<AssessmentGroup | null>(null);
  const [registrationOpen, setRegistrationOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);

  // Disagreement (review) inline flow — checkboxes appear directly on group cards.
  const [disagreeMode, setDisagreeMode] = useState(false);
  const [disagreeGroupIds, setDisagreeGroupIds] = useState<string[]>([]);
  const [disagreeComments, setDisagreeComments] = useState<Record<string, string>>({});
  const [disagreeErrors, setDisagreeErrors] = useState<Record<string, boolean>>({});
  const [disagreeSubmitted, setDisagreeSubmitted] = useState(false);

  // In-modal reassessment (separate from main-screen flow that asks INN).
  const [isReassessmentRunning, setIsReassessmentRunning] = useState(false);
  const [reassessmentCompleted, setReassessmentCompleted] = useState(false);
  const [highlightedChanges, setHighlightedChanges] = useState(false);
  const [extraChanges, setExtraChanges] = useState<{ text: string; tone: "rose" | "amber" | "slate" | "emerald" }[]>([]);
  const [progressStep, setProgressStep] = useState(0);
  const reassessTimers = useRef<number[]>([]);

  useEffect(() => {
    return () => {
      reassessTimers.current.forEach((t) => window.clearTimeout(t));
    };
  }, []);

  // Reset local rerun state when switching counterparty or closing.
  useEffect(() => {
    if (!open) {
      setIsReassessmentRunning(false);
      setReassessmentCompleted(false);
      setHighlightedChanges(false);
      setExtraChanges([]);
      setProgressStep(0);
      setDisagreeMode(false);
      setDisagreeGroupIds([]);
      setDisagreeComments({});
      setDisagreeErrors({});
      setDisagreeSubmitted(false);
    }
  }, [open, assessment?.inn]);

  const handleRerunAssessment = () => {
    if (isReassessmentRunning) return;
    setIsReassessmentRunning(true);
    setReassessmentCompleted(false);
    setProgressStep(0);
    reassessTimers.current.forEach((t) => window.clearTimeout(t));
    reassessTimers.current = [
      window.setTimeout(() => setProgressStep(1), 500),
      window.setTimeout(() => setProgressStep(2), 1100),
      window.setTimeout(() => {
        setIsReassessmentRunning(false);
        setReassessmentCompleted(true);
        setHighlightedChanges(true);
        setExtraChanges([
          { text: "Обновлены ограничения ФНС по счетам", tone: "rose" },
          { text: "Изменилась налоговая задолженность", tone: "amber" },
          { text: "Добавлен новый судебный фактор", tone: "slate" },
        ]);
        toast.success("Оценка обновлена");
      }, 1800),
      window.setTimeout(() => setHighlightedChanges(false), 5400),
    ];
  };

  const handleDisagreeClick = () => {
    setDisagreeMode(true);
  };

  const toggleDisagreeGroup = (id: string) => {
    setDisagreeGroupIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
    setDisagreeErrors((prev) => {
      if (!prev[id]) return prev;
      const next = { ...prev };
      delete next[id];
      return next;
    });
  };

  const setGroupComment = (id: string, value: string) => {
    setDisagreeComments((prev) => ({ ...prev, [id]: value }));
    if (value.trim()) {
      setDisagreeErrors((prev) => {
        if (!prev[id]) return prev;
        const next = { ...prev };
        delete next[id];
        return next;
      });
    }
  };

  const handleSubmitDisagree = () => {
    if (disagreeGroupIds.length === 0) return;
    const errors: Record<string, boolean> = {};
    for (const id of disagreeGroupIds) {
      if (!(disagreeComments[id] ?? "").trim()) errors[id] = true;
    }
    if (Object.keys(errors).length > 0) {
      setDisagreeErrors(errors);
      return;
    }
    const groupTitleById = new Map<string, string>((assessment?.groups ?? []).map((g) => [g.id as string, g.title]));
    const groupComments: DisagreementGroup[] = disagreeGroupIds.map((id) => ({
      groupId: id,
      groupTitle: groupTitleById.get(id) ?? id,
      comment: (disagreeComments[id] ?? "").trim(),
    }));
    onDisagree({
      text: groupComments.map((g) => `${g.groupTitle}: ${g.comment}`).join("\n"),
      groups: disagreeGroupIds,
      status: "submitted",
      groupComments,
      submittedAt: new Date().toISOString(),
    });
    setDisagreeSubmitted(true);
    setDisagreeMode(false);
    toast("Замечания отправлены на пересмотр");
  };


  if (!assessment) return null;

  const effectiveStatus: AssessmentStatus = disagreeSubmitted
    ? "review"
    : reassessmentCompleted
      ? "updated"
      : status;
  const meta = positive
    ? {
        label: "Сделки заключать можно",
        chip: "bg-emerald-100 text-emerald-900",
        headerBg: "bg-gradient-to-b from-emerald-50 via-emerald-50/40 to-transparent",
      }
    : statusMeta[effectiveStatus];
  const resolutionBadge = positive
    ? { label: "Сделки заключать можно", chip: "bg-emerald-100 text-emerald-900" }
    : { label: "Не заключать сделки", chip: "bg-rose-100 text-rose-900" };
  const statusBadge: { label: string; chip: string } | null = isReassessmentRunning
    ? { label: "Обновляется", chip: "bg-slate-100 text-slate-700" }
    : disagreeSubmitted
      ? { label: "На пересмотре", chip: "bg-amber-100 text-amber-900" }
      : reassessmentCompleted || effectiveStatus === "updated"
        ? { label: "Обновлена", chip: "bg-sky-100 text-sky-900" }
        : effectiveStatus === "review"
          ? { label: "На пересмотре", chip: "bg-amber-100 text-amber-900" }
          : effectiveStatus === "confirmed"
            ? { label: "Подтверждена", chip: "bg-emerald-100 text-emerald-800" }
            : effectiveStatus === "disagreed"
              ? { label: "Не согласовано", chip: "bg-orange-100 text-orange-900" }
              : null;
  const baseSourceLabel =
    assessment.source === "auto" ? "Автоматический мониторинг" : "Запущено пользователем";
  const sourceLabel = reassessmentCompleted ? "Запущено пользователем · только что" : baseSourceLabel;


  const handleDownload = () => {
    toast.success("Отчёт скачан");
  };


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
              Оценка контрагента
            </h2>
            <div className="mt-1 text-sm text-muted-foreground">
              {assessment.counterpartyName} · ИНН {assessment.inn} · ОГРН {defaultOgrn} · Оценка: {assessment.date} · {sourceLabel}
              {assessment.nextCheck && <> · Следующая проверка: {assessment.nextCheck}</>}
              {" · "}
              <button
                type="button"
                onClick={() => setRegistrationOpen(true)}
                className="cursor-pointer text-primary transition hover:underline"
              >
                Подробнее
              </button>
            </div>
            <div className={cn(
              "mt-5 rounded-3xl p-[1.5px]",
              positive
                ? "bg-gradient-to-r from-emerald-200 via-emerald-100 to-teal-100"
                : "bg-gradient-to-r from-rose-200 via-red-100 to-orange-100",
            )}>
              <div className={cn(
                "flex items-start gap-4 rounded-[22px] px-6 py-5",
                positive
                  ? "bg-gradient-to-br from-emerald-50/60 via-white to-white"
                  : "bg-gradient-to-br from-rose-50/60 via-white to-white",
              )}>
                <NormAssistantIcon size="lg" tone={positive ? "emerald" : "rose"} />
                <div className="min-w-0 flex-1">
                  <div className="mt-1 text-lg font-semibold text-slate-900">
                    Обоснование оценки
                  </div>
                  {reassessmentCompleted && (
                    <div className="mt-0.5 text-[11px] text-muted-foreground">
                      Пересчитано по текущим данным · только что
                    </div>
                  )}
                  <p className="mt-2 text-sm leading-snug text-muted-foreground">
                    {positive
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
                  {positive ? <TrustFactorsWidget /> : <KeyAnomaliesWidget />}

                  <AssessmentHistoryEntry positive={positive} onOpen={() => setHistoryOpen(true)} />

                  {(isReassessmentRunning || reassessmentCompleted) && (
                    <div className="rounded-2xl border border-border bg-white p-4">
                      <div className="flex items-center gap-2">
                        {isReassessmentRunning ? (
                          <Loader2 className="h-4 w-4 animate-spin text-primary" />
                        ) : (
                          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                        )}
                        <div className="text-sm font-semibold text-foreground">
                          {isReassessmentRunning ? "Оценка запущена" : "Оценка обновлена"}
                        </div>
                      </div>
                      <p className="mt-1.5 text-[11px] leading-snug text-muted-foreground">
                        {isReassessmentRunning
                          ? `Проверяю данные по ИНН ${assessment.inn}: регистрационные сведения, налоговые маркеры и судебную нагрузку.`
                          : "Появились новые изменения по 3 критериям. Проверьте ключевые аномалии."}
                      </p>
                      {isReassessmentRunning && (
                        <ul className="mt-3 space-y-1.5">
                          {[
                            "Регистрационные данные",
                            "Финансы и налоги",
                            "Судебная нагрузка",
                          ].map((label, idx) => {
                            const done = progressStep > idx;
                            const active = progressStep === idx;
                            return (
                              <li key={label} className="flex items-center gap-2 text-[11px]">
                                {done ? (
                                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                                ) : active ? (
                                  <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />
                                ) : (
                                  <span className="h-3.5 w-3.5 rounded-full border border-border" />
                                )}
                                <span className={cn(done ? "text-foreground" : "text-muted-foreground")}>
                                  {label}
                                </span>
                              </li>
                            );
                          })}
                        </ul>
                      )}
                    </div>
                  )}

                  <Button
                    variant="outline"
                    onClick={handleRerunAssessment}
                    disabled={isReassessmentRunning}
                    className="h-11 w-full rounded-full border bg-white text-sm font-medium"
                  >
                    {isReassessmentRunning ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" /> Обновляю оценку
                      </>
                    ) : (
                      <>
                        <RefreshCw className="h-4 w-4" />
                        {reassessmentCompleted ? "Запустить повторно" : "Запустить новую оценку"}
                      </>
                    )}
                  </Button>
                </div>
              </aside>


              {/* Groups — left, row 2 */}
              <section className="order-3 lg:col-start-1 lg:row-start-1 space-y-5">
                <div className="grid grid-cols-2 gap-3">
                  <LimitCard label="Расходные сделки" sublabel="Лимит аванса" value="2,5 млн ₽" />
                  <LimitCard label="Доходные сделки" sublabel="Лимит дебиторской задолженности" value="4,8 млн ₽" />
                </div>
                <div>
                <h3 className="mb-2 text-sm font-semibold">Группы оценки</h3>
                <div className="grid grid-cols-1 gap-2.5">
                  {assessment.groups.map((g) => {
                    const counts = groupCounts(g);
                    const checked = disagreeGroupIds.includes(g.id);
                    const isUnderReview =
                      disagreeSubmitted && !disagreeMode && disagreeGroupIds.includes(g.id);
                    const submittedComment = disagreeComments[g.id]?.trim();
                    const hasError = disagreeErrors[g.id];
                    return (
                      <div
                        key={g.id}
                        className={cn(
                          "rounded-lg border bg-white transition",
                          disagreeMode && checked
                            ? "border-primary/30 bg-primary/5"
                            : "border-slate-100",
                        )}

                      >
                        <div
                          role="button"
                          tabIndex={0}
                          onClick={() => setGroupDrawer(g)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              e.preventDefault();
                              setGroupDrawer(g);
                            }
                          }}
                          className="group flex cursor-pointer items-center gap-3 px-3 py-3 text-left hover:bg-muted/30"
                        >
                          {disagreeMode && (
                            <div
                              onClick={(e) => e.stopPropagation()}
                              className="flex shrink-0 items-center"
                            >
                              <Checkbox
                                checked={checked}
                                onCheckedChange={() => toggleDisagreeGroup(g.id)}
                                aria-label={`Выбрать группу ${g.title}`}
                              />
                            </div>
                          )}
                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <div className="text-sm font-medium text-foreground">{g.title}</div>
                              {isUnderReview && (
                                <span className="inline-flex items-center rounded-full border border-violet-200 bg-violet-50 px-2 py-0.5 text-[10px] font-medium text-violet-700">
                                  На пересмотре
                                </span>
                              )}
                            </div>
                            <div className="mt-2 flex flex-wrap items-center gap-1.5">
                              <CountPill kind="risk" count={counts.risk} />
                              <CountPill kind="clear" count={counts.clear} />
                              <CountPill kind="no_data" count={counts.no_data} />
                            </div>
                          </div>
                          <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground transition group-hover:text-foreground" />
                        </div>

                        {disagreeMode && checked && (
                          <div
                            className="border-t border-primary/20 px-3 py-3"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <label className="text-[11px] font-medium text-foreground">
                              Комментарий к группе
                            </label>
                            <Textarea
                              value={disagreeComments[g.id] ?? ""}
                              onChange={(e) => setGroupComment(g.id, e.target.value)}
                              onClick={(e) => e.stopPropagation()}
                              onFocus={(e) => e.stopPropagation()}
                              placeholder="Опишите, с чем именно вы не согласны по этой группе."
                              className={cn(
                                "mt-1.5 min-h-[88px] resize-y",
                                hasError && "border-rose-400 focus-visible:ring-rose-300",
                              )}
                              rows={3}
                            />
                            {hasError && (
                              <div className="mt-1 text-[11px] text-rose-600">
                                Добавьте комментарий по выбранной группе.
                              </div>
                            )}
                          </div>
                        )}

                        {!disagreeMode && isUnderReview && submittedComment && (
                          <div className="border-t border-border px-3 py-2.5 text-[12px] text-muted-foreground">
                            <span className="font-medium text-foreground">Комментарий:</span>{" "}
                            {submittedComment}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
                </div>
              </section>
            </div>
          </div>

          {/* Footer actions */}
          <div className="shrink-0 border-t border-border bg-white px-5 py-4 lg:px-10">
            <div className="flex flex-col gap-3 sm:flex-row">
              {disagreeMode ? (
                <Button
                  onClick={handleSubmitDisagree}
                  disabled={disagreeGroupIds.length === 0}
                  className="h-12 flex-1 rounded-full text-sm font-medium"
                >
                  <Send className="h-4 w-4" /> Отправить на пересмотр
                </Button>
              ) : (
                <Button
                  variant="outline"
                  onClick={handleDisagreeClick}
                  className="h-12 flex-1 rounded-full text-sm font-medium"
                >
                  Не согласен
                </Button>
              )}
              <Button
                variant="outline"
                onClick={handleDownload}
                className="h-12 flex-1 rounded-full text-sm font-medium"
              >
                <Download className="h-4 w-4" /> Скачать
              </Button>
            </div>
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

          <AssessmentHistoryDrawer
            open={historyOpen}
            onOpenChange={setHistoryOpen}
            positive={positive}
          />
        </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}

function LimitCard({ label, sublabel, value }: { label: string; sublabel: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-white px-4 py-3">
      <div className="text-xs font-medium text-muted-foreground">{label}</div>
      <div className="mt-0.5 text-[11px] text-muted-foreground/70">{sublabel}</div>
      <div className="mt-1.5 text-lg font-semibold text-foreground">{value}</div>
    </div>
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


const changeIcon: Record<"rose" | "amber" | "slate" | "emerald", typeof Flame> = {
  rose: Flame,
  amber: Zap,
  slate: RefreshCw,
  emerald: CheckCircle2,
};

const changeIconClass: Record<
  "rose" | "amber" | "slate" | "emerald",
  { bg: string; text: string }
> = {
  rose: { bg: "bg-rose-50", text: "text-rose-600" },
  amber: { bg: "bg-amber-50", text: "text-amber-600" },
  slate: { bg: "bg-slate-100", text: "text-slate-600" },
  emerald: { bg: "bg-emerald-50", text: "text-emerald-600" },
};

