import { useEffect, useRef, useState } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X, ArrowLeft, CheckCircle2, ChevronRight, Info, RefreshCw, Loader2, Flame, Zap } from "lucide-react";
import { toast } from "sonner";
import { NormAssistantIcon } from "./NormAssistantIcon";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { largeModalContentClass } from "@/lib/modal-styles";
import { AssessmentCorrectionDrawer, type CorrectionPayload, type CorrectionTag, type CounterpartyStatus, correctionTagToStatus } from "./AssessmentCorrectionDrawer";
import { getToneForTag, toneStyles } from "./header-theme";
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
  const [historyOpen, setHistoryOpen] = useState(false);

  // Correction drawer (replaces old inline disagreement flow).
  const [correctionOpen, setCorrectionOpen] = useState(false);
  const [correctedTag, setCorrectedTag] = useState<CorrectionTag | null>(null);

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
      setCorrectionOpen(false);
      setCorrectedTag(null);
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

  const handleCorrectionSubmit = (payload: CorrectionPayload) => {
    setCorrectedTag(payload.tag);
    onDisagree({
      text: payload.comment,
      status: "submitted",
      submittedAt: new Date().toISOString(),
    });
    toast("Корректировка оценки отправлена");
  };

  if (!assessment) return null;

  const effectivePositive = correctedTag ? correctedTag === "Нет риска" : positive;
  const headerTone = correctedTag ? getToneForTag(correctedTag) : null;
  const headerBg = headerTone
    ? toneStyles[headerTone].gradient
    : effectivePositive
      ? "bg-gradient-to-b from-emerald-50 via-emerald-50/40 to-transparent"
      : statusMeta[status].headerBg;
  const meta = { label: "", chip: "", headerBg };
  const resolutionBadge = correctedTag
    ? { label: correctedTag, chip: toneStyles[getToneForTag(correctedTag)].badge }
    : effectivePositive
      ? { label: "Сделки заключать можно", chip: "bg-emerald-100 text-emerald-900" }
      : { label: "Не заключать сделки", chip: "bg-rose-100 text-rose-900" };

  const baseSourceLabel =
    assessment.source === "auto" ? "Автоматический мониторинг" : "Запущено пользователем";
  const sourceLabel = reassessmentCompleted ? "Запущено пользователем · только что" : baseSourceLabel;




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
                  {reassessmentCompleted && (
                    <div className="mt-0.5 text-[11px] text-muted-foreground">
                      Пересчитано по текущим данным · только что
                    </div>
                  )}
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
                  {effectivePositive ? <TrustFactorsWidget /> : <KeyAnomaliesWidget />}

                  <AssessmentHistoryEntry positive={effectivePositive} onOpen={() => setHistoryOpen(true)} />

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

                </div>
              </aside>


              {/* Groups — left, row 2 */}
              <section className="order-3 lg:col-start-1 lg:row-start-1 space-y-5">
                <div className="grid grid-cols-2 gap-3">
                  <LimitCard label="Расходные сделки" sublabel="Лимит аванса" value="12,4 млн ₽" />
                  <LimitCard label="Доходные сделки" sublabel="Лимит дебиторской задолженности" value="18,7 млн ₽" />
                </div>
                <div>
                <h3 className="mb-2 text-sm font-semibold">Группы оценки</h3>
                <div className="grid grid-cols-1 gap-2.5">
                  {assessment.groups.map((g) => {
                    const counts = groupCounts(g);
                    return (
                      <div
                        key={g.id}
                        className="rounded-lg border border-slate-100 bg-white transition"
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
                          <div className="min-w-0 flex-1">
                            <div className="text-sm font-medium text-foreground">{g.title}</div>
                            <div className="mt-2 flex flex-wrap items-center gap-1.5">
                              <CountPill kind="risk" count={counts.risk} />
                              <CountPill kind="clear" count={counts.clear} />
                              <CountPill kind="no_data" count={counts.no_data} />
                            </div>
                          </div>
                          <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground transition group-hover:text-foreground" />
                        </div>
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
              <Button
                variant="outline"
                onClick={() => setCorrectionOpen(true)}
                className="h-12 flex-1 rounded-full text-sm font-medium"
              >
                Не согласен
              </Button>
              <Button
                variant="outline"
                onClick={handleRerunAssessment}
                disabled={isReassessmentRunning}
                className="h-12 flex-1 rounded-full text-sm font-medium"
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
            positive={effectivePositive}
          />

          <AssessmentCorrectionDrawer
            open={correctionOpen}
            onOpenChange={setCorrectionOpen}
            onSubmit={handleCorrectionSubmit}
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
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="mt-1 flex items-baseline gap-2">
        <span className="text-lg font-semibold text-foreground">{value}</span>
        <span className="text-xs text-muted-foreground leading-tight">{sublabel}</span>
      </div>
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

