import { useEffect, useMemo, useRef, useState } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X, Sparkles, CheckCircle2, Download, ChevronRight, Info, RefreshCw, Loader2, Flame, Zap, Send } from "lucide-react";
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

export type AssessmentStatus = "pending" | "confirmed" | "disagreed" | "updated" | "review";

const statusMeta: Record<
  AssessmentStatus,
  { label: string; chip: string; headerBg: string }
> = {
  pending: {
    label: "Требует подтверждения",
    chip: "bg-amber-100 text-amber-900",
    headerBg: "bg-gradient-to-b from-amber-50 via-amber-50/40 to-transparent",
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
    chip: "bg-violet-100 text-violet-900",
    headerBg: "bg-gradient-to-b from-violet-50 via-violet-50/40 to-transparent",
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
}) {
  const [notice, setNotice] = useState<{ tone: "success" | "info"; text: string } | null>(null);
  const [groupDrawer, setGroupDrawer] = useState<AssessmentGroup | null>(null);
  const [registrationOpen, setRegistrationOpen] = useState(false);

  // Disagreement (review) inline flow
  const [disagreeOpen, setDisagreeOpen] = useState(false);
  const [disagreeGroupIds, setDisagreeGroupIds] = useState<string[]>([]);
  const [disagreeComment, setDisagreeComment] = useState("");
  const [disagreeSubmitted, setDisagreeSubmitted] = useState(false);
  const [disagreeEditMode, setDisagreeEditMode] = useState(false);
  const disagreeRef = useRef<HTMLDivElement>(null);

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
      setDisagreeOpen(false);
      setDisagreeGroupIds([]);
      setDisagreeComment("");
      setDisagreeSubmitted(false);
      setDisagreeEditMode(false);
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
      }, 1800),
      window.setTimeout(() => setHighlightedChanges(false), 5400),
    ];
  };

  const scrollToDisagree = () => {
    window.requestAnimationFrame(() => {
      disagreeRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  };

  const handleDisagreeClick = () => {
    if (disagreeSubmitted) {
      setDisagreeEditMode(true);
      scrollToDisagree();
      return;
    }
    setDisagreeOpen(true);
    scrollToDisagree();
  };

  const toggleDisagreeGroup = (id: string) => {
    setDisagreeGroupIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const handleSubmitDisagree = () => {
    if (disagreeGroupIds.length === 0) return;
    onDisagree({
      text: disagreeComment.trim(),
      groups: disagreeGroupIds,
    });
    setDisagreeSubmitted(true);
    setDisagreeEditMode(false);
    setDisagreeOpen(true);
    setNotice({ tone: "info", text: "Замечания отправлены на пересмотр" });
  };

  const showDisagreeForm =
    (disagreeOpen && !disagreeSubmitted) || (disagreeSubmitted && disagreeEditMode);
  const showDisagreeSummary = disagreeSubmitted && !disagreeEditMode;

  const disagreeGroupTitles = useMemo(
    () =>
      (assessment?.groups ?? [])
        .filter((g) => disagreeGroupIds.includes(g.id))
        .map((g) => g.title),
    [assessment?.groups, disagreeGroupIds],
  );

  if (!assessment) return null;

  const effectiveStatus: AssessmentStatus = disagreeSubmitted
    ? "review"
    : reassessmentCompleted
      ? "updated"
      : status;
  const meta = statusMeta[effectiveStatus];
  const baseSourceLabel =
    assessment.source === "auto" ? "Автоматический мониторинг" : "Запущено пользователем";
  const sourceLabel = reassessmentCompleted ? "Запущено пользователем · только что" : baseSourceLabel;


  const handleDownload = () => {
    setNotice({ tone: "info", text: "Отчёт по оценке скачан" });
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
              <button
                onClick={() => onOpenChange(false)}
                className="rounded-full bg-white p-1.5 text-muted-foreground hover:bg-muted"
                aria-label="Закрыть"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-medium ${meta.chip}`}>
                {reassessmentCompleted ? "Обновлена, требует подтверждения" : meta.label}
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
            <div className="mt-5 rounded-3xl bg-gradient-to-r from-blue-100 via-violet-100 to-emerald-100 p-[1.5px]">
              <div className="flex items-start gap-4 rounded-[22px] bg-white px-6 py-5">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-indigo-100 bg-indigo-50 text-indigo-600">
                  <Sparkles className="h-6 w-6" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                    Вывод NORM AI
                  </div>
                  <div className="mt-1 text-lg font-semibold text-slate-900">
                    Не заключать сделки
                  </div>
                  {reassessmentCompleted && (
                    <div className="mt-0.5 text-[11px] text-muted-foreground">
                      Пересчитано по текущим данным · только что
                    </div>
                  )}
                  <p className="mt-2 text-sm leading-snug text-muted-foreground">
                    Проверка по 43 критериям выявила несколько маркеров, которые блокируют безопасное согласование сделки: ограничения ФНС по счетам, налоговая задолженность и повышенная доля вычитаемого НДС. Дополнительно есть судебные и репутационные факторы, поэтому сначала стоит разобрать группы «Юридический статус», «Финансы и налоги» и «Судебная нагрузка».
                  </p>
                </div>
              </div>
            </div>
          </div>


          {/* Body */}
          <div className="min-h-0 flex-1 space-y-5 overflow-y-auto bg-white px-5 py-6 lg:px-10">
            {notice && (
              <div
                className={`flex items-start gap-2.5 rounded-xl border px-3.5 py-3 text-sm ${
                  notice.tone === "success"
                    ? "border-emerald-200 bg-emerald-50/70 text-emerald-900"
                    : "border-border bg-slate-50 text-foreground"
                }`}
                role="status"
              >
                {notice.tone === "success" ? (
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                ) : (
                  <Info className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                )}
                <div className="flex-1 leading-snug">{notice.text}</div>
                <button
                  onClick={() => setNotice(null)}
                  className="shrink-0 rounded p-0.5 text-muted-foreground transition hover:bg-black/5"
                  aria-label="Закрыть"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            )}

            <div className="grid gap-y-5 gap-x-5 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-x-12">
              {/* What changed — right column */}
              <aside className="order-2 lg:col-start-2 lg:row-start-1">

                <div className="space-y-3 lg:sticky lg:top-0">
                  <div
                    className={cn(
                      "rounded-2xl border p-4 transition-colors duration-500",
                      highlightedChanges
                        ? "border-emerald-300 bg-emerald-50/40"
                        : "border-border bg-white",
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm font-semibold text-foreground">Что изменилось</div>
                        <div className="text-[11px] text-muted-foreground">
                          {reassessmentCompleted
                            ? "Появились новые изменения по 3 критериям"
                            : "За последний период"}
                        </div>
                      </div>
                      <span className="inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-muted px-1.5 text-[11px] font-medium text-muted-foreground">
                        {assessment.changes.length + extraChanges.length}
                      </span>
                    </div>
                    <div className="mt-3">
                      {assessment.changes.length + extraChanges.length === 0 ? (
                        <div className="rounded-lg border border-dashed border-border px-3 py-4 text-center text-xs text-muted-foreground">
                          За последний период новых факторов не обнаружено
                        </div>
                      ) : (
                        <ul className="divide-y divide-border">
                          {[
                            ...extraChanges.map((c) => ({ ...c, fresh: true })),
                            ...assessment.changes.map((c) => ({ ...c, fresh: false })),
                          ].map((c, i) => {
                            const Ico = changeIcon[c.tone];
                            const cls = changeIconClass[c.tone];
                            return (
                              <li key={i} className="flex items-start gap-2.5 py-2.5 first:pt-0 last:pb-0">
                                <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${cls.bg}`}>
                                  <Ico className={`h-3.5 w-3.5 ${cls.text}`} />
                                </span>
                                <div className="min-w-0 flex-1">
                                  <div className="text-xs leading-snug text-foreground">{c.text}</div>
                                  <div className="mt-0.5 text-[10px] text-muted-foreground">
                                    {toneLabel[c.tone]}
                                    {c.fresh && " · только что"}
                                  </div>
                                </div>
                              </li>
                            );
                          })}
                        </ul>
                      )}
                    </div>
                  </div>

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
                          : "Появились новые изменения по 3 критериям. Проверьте блок «Что изменилось»."}
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
                    const isUnderReview =
                      disagreeSubmitted && disagreeGroupIds.includes(g.id);
                    return (
                      <button
                        key={g.id}
                        onClick={() => setGroupDrawer(g)}
                        className="group flex items-center gap-3 rounded-lg border border-border bg-white px-3 py-3 text-left transition hover:bg-muted/30"
                      >
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
                            <CountPill
                              kind="attention"
                              count={counts.attention}
                            />
                            {counts.info > 0 && (
                              <CountPill kind="info" count={counts.info} />
                            )}
                            <CountPill kind="clear" count={counts.clear} />
                          </div>
                        </div>
                        <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground transition group-hover:text-foreground" />
                      </button>
                    );
                  })}
                </div>
                </div>
              </section>
            </div>


            {/* Disagreement inline block */}
            {(disagreeOpen || disagreeSubmitted) && (
              <section
                ref={disagreeRef}
                className="rounded-2xl border border-border bg-white p-5"
              >
                {showDisagreeForm && (
                  <>
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h4 className="text-sm font-semibold text-foreground">
                          Несогласие с результатами оценки
                        </h4>
                        <p className="mt-1 text-[12px] text-muted-foreground">
                          Выберите группы оценки, с выводами по которым вы не согласны.
                        </p>
                      </div>
                      {!disagreeSubmitted && (
                        <button
                          onClick={() => setDisagreeOpen(false)}
                          className="rounded p-1 text-muted-foreground hover:bg-muted"
                          aria-label="Закрыть"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      )}
                    </div>

                    <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
                      {assessment.groups.map((g) => {
                        const checked = disagreeGroupIds.includes(g.id);
                        return (
                          <label
                            key={g.id}
                            className={cn(
                              "flex cursor-pointer items-start gap-2.5 rounded-xl border px-3 py-2.5 text-sm transition",
                              checked
                                ? "border-primary/40 bg-primary/5"
                                : "border-border bg-white hover:bg-muted/30",
                            )}
                          >
                            <Checkbox
                              checked={checked}
                              onCheckedChange={() => toggleDisagreeGroup(g.id)}
                              className="mt-0.5"
                            />
                            <span className="leading-snug text-foreground">{g.title}</span>
                          </label>
                        );
                      })}
                    </div>

                    {disagreeGroupIds.length > 0 && (
                      <div className="mt-4 space-y-2">
                        <label className="text-xs font-medium text-foreground">Комментарий</label>
                        <Textarea
                          value={disagreeComment}
                          onChange={(e) => setDisagreeComment(e.target.value)}
                          placeholder="Опишите причину несогласия или укажите дополнительные сведения."
                          className="min-h-[112px] resize-y"
                          rows={4}
                        />
                        <div className="flex justify-end">
                          <Button
                            onClick={handleSubmitDisagree}
                            className="h-10 rounded-full px-5 text-sm font-medium"
                          >
                            <Send className="h-4 w-4" /> Отправить на пересмотр
                          </Button>
                        </div>
                      </div>
                    )}
                  </>
                )}

                {showDisagreeSummary && (
                  <div className="space-y-3">
                    <div className="flex items-start gap-2.5">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-violet-50 text-violet-600">
                        <CheckCircle2 className="h-4 w-4" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="text-sm font-semibold text-foreground">
                          Замечания отправлены
                        </div>
                        <p className="mt-1 text-[12px] text-muted-foreground">
                          Вы оспорили результаты оценки по выбранным группам. Комментарий передан на повторную проверку.
                        </p>
                      </div>
                    </div>
                    <div className="rounded-xl border border-border bg-slate-50/60 p-3.5 text-sm">
                      <div className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                        Выбрано групп: {disagreeGroupIds.length}
                      </div>
                      <div className="mt-1.5 flex flex-wrap gap-1.5">
                        {disagreeGroupTitles.map((t) => (
                          <span
                            key={t}
                            className="inline-flex items-center rounded-full border border-violet-200 bg-violet-50 px-2 py-0.5 text-[11px] font-medium text-violet-700"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                      {disagreeComment.trim() && (
                        <>
                          <div className="mt-3 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                            Комментарий
                          </div>
                          <div className="mt-1 text-sm text-foreground">«{disagreeComment.trim()}»</div>
                        </>
                      )}
                    </div>
                    <div className="flex justify-end">
                      <Button
                        variant="outline"
                        onClick={() => {
                          setDisagreeEditMode(true);
                          scrollToDisagree();
                        }}
                        className="h-10 rounded-full px-5 text-sm font-medium"
                      >
                        Изменить замечания
                      </Button>
                    </div>
                  </div>
                )}
              </section>
            )}
          </div>

          {/* Footer actions */}
          <div className="shrink-0 border-t border-border bg-white px-5 py-4 lg:px-10">
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button
                variant="outline"
                onClick={handleDisagreeClick}
                className="h-12 flex-1 rounded-full text-sm font-medium"
              >
                Не согласен
              </Button>
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
  return (
    <span className={`inline-flex h-6 items-center gap-1 rounded-full px-2.5 text-xs font-semibold ${m.bg}`}>
      <Ico className={`h-3.5 w-3.5 ${m.icon_color}`} />
      <span className={`leading-none ${m.num}`}>{count}</span>
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

