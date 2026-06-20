import { useMemo, useState } from "react";
import {
  ArrowRight,
  ArrowLeft,
  AlertTriangle,
  Check,
  Paperclip,
  FileText,
  Clock,
  History as HistoryIcon,
} from "@/shared/ui";
import type { CollectionSubStep } from "@/lib/mock-data";
import { InModalDrawer } from "./InModalDrawer";
import type { StepAnim } from "./DebtSummaryCard";
import {
  stageOrder,
  stepMetaByTitle,
  computeDue,
  formatDDMMYYYY,
  diffDays,
  TODAY,
  type RequiredField,
} from "@/lib/debt-process";

export interface DebtHistoryEntry {
  date: string;
  action: string;
  step: string;
  user: string;
  comment?: string;
}

export interface DebtSummary {
  overdueAmount: string;
  overdueStartDate: string;
  overdueDays: number;
  responsible: string;
}

export type CompletedFields = Record<string, Record<string, string>>;

type StepStatus = "done" | "current" | "upcoming";

export function DebtProcessDrawer({
  steps,
  stepAnim,
  open,
  onOpenChange,
  onAdvance,
  onRollback,
  onFieldChange,
  completedFields,
  history,
  summary,
  error,
}: {
  steps: CollectionSubStep[];
  stepAnim?: StepAnim;
  open: boolean;
  onOpenChange: (o: boolean) => void;
  onAdvance: () => void;
  onRollback: (comment: string) => void;
  onFieldChange: (stepId: string, key: string, value: string) => void;
  completedFields: CompletedFields;
  history: DebtHistoryEntry[];
  summary: DebtSummary;
  error?: string | null;
}) {
  const currentIdx = steps.findIndex((s) => s.status === "current");
  const current = currentIdx === -1 ? null : steps[currentIdx];
  const currentMeta = current ? stepMetaByTitle[current.title] : null;

  const [rollbackOpen, setRollbackOpen] = useState(false);
  const [rollbackComment, setRollbackComment] = useState("");

  const handleRollback = () => {
    if (!rollbackComment.trim()) return;
    onRollback(rollbackComment.trim());
    setRollbackComment("");
    setRollbackOpen(false);
  };

  const canRollback = currentIdx > 0;

  // Build a flat timeline of items: stage headers + steps in order.
  type TimelineItem =
    | { kind: "stage"; stage: string; active: boolean; done: boolean }
    | { kind: "step"; step: CollectionSubStep; globalIndex: number; status: StepStatus };

  const items: TimelineItem[] = [];
  for (const stage of stageOrder) {
    const stageSteps = steps.map((s, i) => ({ s, i })).filter(({ s }) => s.stage === stage);
    if (stageSteps.length === 0) continue;
    const active = stageSteps.some(({ s }) => s.status === "current");
    const done = stageSteps.every(({ s }) => s.status === "done");
    items.push({ kind: "stage", stage, active, done });
    for (const { s, i } of stageSteps) {
      const status: StepStatus =
        s.status === "current" ? "current" : s.status === "done" ? "done" : "upcoming";
      items.push({ kind: "step", step: s, globalIndex: i, status });
    }
  }

  return (
    <InModalDrawer open={open} onOpenChange={onOpenChange}>
      {/* Header */}
      <div className="px-6 pt-6 pb-4">
        <h2 className="text-lg font-semibold tracking-tight">Работа с задолженностью</h2>
        <p className="mt-1 text-xs text-muted-foreground">
          Этапы взыскания, SLA и обязательные данные
        </p>
        {/* compact summary chips */}
        <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-xs">
          <Chip label="Просрочка" value={summary.overdueAmount} accent={summary.overdueDays > 0} />
          <Chip label="Дней" value={summary.overdueDays > 0 ? `${summary.overdueDays}` : "—"} />
          <Chip label="Текущий" value={current?.title ?? "—"} />
          <Chip label="План" value={current?.plannedDate ?? "—"} />
          <Chip label="Ответственный" value={summary.responsible} />
        </div>
      </div>

      <div className="px-6 pb-6 space-y-6">
        {/* Timeline */}
        <section className="relative">
          {/* vertical line */}
          <div className="absolute left-[11px] top-2 bottom-2 w-px bg-border" aria-hidden="true" />
          <ul className="space-y-5">
            {items.map((item, idx) => {
              if (item.kind === "stage") {
                return (
                  <li key={`stage-${item.stage}-${idx}`} className="relative pl-8">
                    <span
                      className={`absolute left-[7px] top-1.5 h-2 w-2 rounded-full ring-2 ring-background ${
                        item.active
                          ? "bg-primary"
                          : item.done
                            ? "bg-emerald-500"
                            : "bg-muted-foreground/30"
                      }`}
                    />
                    <div
                      className={`text-[11px] font-semibold uppercase tracking-wide ${
                        item.active ? "text-foreground" : "text-muted-foreground"
                      }`}
                    >
                      {item.stage}
                    </div>
                  </li>
                );
              }
              const { step, status } = item;
              const meta = stepMetaByTitle[step.title];
              const isCurrent = status === "current";
              const isDone = status === "done";
              const dueDate =
                isCurrent && meta && step.startDate ? computeDue(step.startDate, meta) : null;
              const remaining = dueDate ? diffDays(TODAY, dueDate) : null;
              const overdue = remaining !== null && remaining < 0;

              return (
                <li key={step.id} className="relative pl-8">
                  {/* marker */}
                  <span
                    key={`dot-${stepAnim?.tick ?? "static"}-${step.id}`}
                    className={`absolute left-[3px] top-0.5 flex h-[18px] w-[18px] items-center justify-center rounded-full ring-2 ring-background transition-transform duration-500 ${
                      isCurrent
                        ? overdue
                          ? "bg-amber-500"
                          : "bg-primary"
                        : isDone
                          ? "bg-emerald-500"
                          : "border border-border bg-background"
                    } ${isCurrent && stepAnim ? "scale-110" : "scale-100"}`}
                  >
                    {isDone && <Check className="h-3 w-3 text-white" />}
                    {isCurrent && <span className="h-1.5 w-1.5 rounded-full bg-white" />}
                  </span>

                  {/* content */}
                  <div
                    className={`rounded-lg ${
                      isCurrent ? "border border-border bg-slate-50/70 p-3" : "px-0 py-0.5"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div
                        className={`text-sm leading-tight ${
                          isCurrent
                            ? "font-semibold text-foreground"
                            : isDone
                              ? "font-medium text-muted-foreground"
                              : "text-muted-foreground"
                        }`}
                      >
                        {step.title}
                      </div>
                      <StatusBadge status={status} overdue={overdue} />
                    </div>

                    {meta && (isCurrent || isDone) && (
                      <div
                        className={`mt-1 text-xs leading-snug ${
                          isCurrent ? "text-muted-foreground" : "text-muted-foreground/80"
                        }`}
                      >
                        {meta.description}
                      </div>
                    )}

                    {/* meta line */}
                    {isCurrent && (
                      <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-muted-foreground">
                        {meta?.slaLabel && (
                          <span>
                            SLA: <b className="text-foreground">{meta.slaLabel}</b>
                          </span>
                        )}
                        {step.startDate && (
                          <span>
                            Старт: <b className="text-foreground">{step.startDate}</b>
                          </span>
                        )}
                        {dueDate && (
                          <span>
                            План: <b className="text-foreground">{formatDDMMYYYY(dueDate)}</b>
                          </span>
                        )}
                        {remaining !== null && (
                          <span
                            className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-medium ${
                              overdue
                                ? "bg-amber-50 text-amber-800 border border-amber-100"
                                : "bg-emerald-50 text-emerald-800 border border-emerald-100"
                            }`}
                          >
                            {overdue ? (
                              <>
                                <AlertTriangle className="h-3 w-3" /> Просрочено на{" "}
                                {Math.abs(remaining)} дн.
                              </>
                            ) : (
                              <>
                                <Clock className="h-3 w-3" /> Осталось {remaining} дн.
                              </>
                            )}
                          </span>
                        )}
                        {!dueDate && meta?.slaType === "none" && (
                          <span className="rounded-full bg-muted px-2 py-0.5">Без SLA</span>
                        )}
                      </div>
                    )}

                    {isCurrent && meta?.control && (
                      <div className="mt-2 text-[11px] text-muted-foreground">
                        <span>Контроль: </span>
                        <span className="text-foreground">{meta.control}</span>
                      </div>
                    )}

                    {/* Required fields inline under current step */}
                    {isCurrent &&
                      currentMeta?.requiredFields &&
                      currentMeta.requiredFields.length > 0 && (
                        <div className="mt-3 space-y-2 border-t border-border/70 pt-3">
                          <div className="text-[11px] font-medium text-foreground">
                            Данные для перехода
                          </div>
                          {currentMeta.requiredFields.map((f) => (
                            <FieldInput
                              key={f.key}
                              field={f}
                              value={completedFields[step.id]?.[f.key] ?? ""}
                              onChange={(v) => onFieldChange(step.id, f.key, v)}
                            />
                          ))}
                        </div>
                      )}

                    {/* Inline actions under current step */}
                    {isCurrent && (
                      <div className="mt-3 space-y-2">
                        {error && (
                          <div className="flex items-start gap-2 rounded-md border border-amber-200 bg-amber-50 px-2.5 py-1.5 text-[11px] text-amber-900">
                            <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                            <div>{error}</div>
                          </div>
                        )}
                        <div className="flex flex-wrap gap-2">
                          <button
                            onClick={onAdvance}
                            className="inline-flex items-center gap-1.5 rounded-md bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white shadow-sm transition hover:bg-emerald-700"
                          >
                            <ArrowRight className="h-3.5 w-3.5" /> На следующий этап
                          </button>
                          {canRollback && !rollbackOpen && (
                            <button
                              onClick={() => setRollbackOpen(true)}
                              className="inline-flex items-center gap-1.5 rounded-md border border-border bg-white px-3 py-1.5 text-xs font-medium text-muted-foreground transition hover:bg-muted/40 hover:text-foreground"
                            >
                              <ArrowLeft className="h-3.5 w-3.5" /> Вернуть этап
                            </button>
                          )}
                        </div>
                        {canRollback && rollbackOpen && (
                          <div className="rounded-md border border-border bg-white p-2.5 space-y-2">
                            <div className="text-[11px] font-medium text-foreground">
                              Причина отката
                            </div>
                            <textarea
                              value={rollbackComment}
                              onChange={(e) => setRollbackComment(e.target.value)}
                              rows={2}
                              placeholder="Комментарий обязателен"
                              className="w-full resize-none rounded-md border border-border bg-white px-2 py-1.5 text-xs outline-none focus:border-foreground/30"
                            />
                            <div className="flex gap-2">
                              <button
                                onClick={handleRollback}
                                disabled={!rollbackComment.trim()}
                                className="rounded-md bg-foreground px-2.5 py-1 text-xs font-medium text-background disabled:opacity-40"
                              >
                                Подтвердить
                              </button>
                              <button
                                onClick={() => {
                                  setRollbackOpen(false);
                                  setRollbackComment("");
                                }}
                                className="rounded-md border border-border bg-white px-2.5 py-1 text-xs font-medium text-muted-foreground hover:bg-muted/40"
                              >
                                Отмена
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        </section>

        {/* History */}
        <section>
          <div className="mb-2 flex items-center gap-1.5">
            <HistoryIcon className="h-3.5 w-3.5 text-muted-foreground" />
            <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              История действий
            </h3>
          </div>
          {history.length === 0 ? (
            <div className="text-xs text-muted-foreground">История пуста</div>
          ) : (
            <ul className="space-y-1.5">
              {history.slice(0, 3).map((h, i) => (
                <li key={i} className="text-xs leading-snug text-muted-foreground">
                  <span className="text-foreground">{h.date}</span> · {h.action} ·{" "}
                  <span className="text-foreground">{h.step}</span> · {h.user}
                  {h.comment && (
                    <div className="mt-0.5 text-[11px] italic text-muted-foreground/80">
                      «{h.comment}»
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </InModalDrawer>
  );
}

function Chip({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="flex items-baseline gap-1">
      <span className="text-[11px] uppercase tracking-wide text-muted-foreground">{label}:</span>
      <span className={`text-xs font-medium ${accent ? "text-amber-700" : "text-foreground"}`}>
        {value}
      </span>
    </div>
  );
}

function StatusBadge({ status, overdue }: { status: StepStatus; overdue: boolean }) {
  if (status === "current") {
    return (
      <span
        className={`shrink-0 inline-flex items-center rounded-full px-2 h-5 text-[11px] font-medium ${
          overdue
            ? "bg-amber-50 text-amber-800 border border-amber-100"
            : "bg-primary/10 text-primary border border-primary/15"
        }`}
      >
        {overdue ? "Просрочен" : "Текущий"}
      </span>
    );
  }
  if (status === "done") {
    return (
      <span className="shrink-0 inline-flex items-center rounded-full px-2 h-5 text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-100">
        Завершён
      </span>
    );
  }
  return (
    <span className="shrink-0 inline-flex items-center rounded-full px-2 h-5 text-[11px] font-medium bg-muted text-muted-foreground">
      Ожидает
    </span>
  );
}

function FieldInput({
  field,
  value,
  onChange,
}: {
  field: RequiredField;
  value: string;
  onChange: (v: string) => void;
}) {
  if (field.type === "file") {
    const mockName =
      field.key === "actSverki"
        ? "Акт сверки.pdf"
        : field.key === "execListFile"
          ? "Исполнительный лист.pdf"
          : "Документ.pdf";
    const attached = !!value;
    return (
      <div>
        <label className="mb-1 block text-[11px] font-medium text-foreground">{field.label}</label>
        {attached ? (
          <div className="flex items-center justify-between rounded-md border border-emerald-200 bg-emerald-50/60 px-2.5 py-1.5 text-xs">
            <span className="inline-flex items-center gap-1.5 text-emerald-900">
              <FileText className="h-3.5 w-3.5" /> {value}
            </span>
            <button
              onClick={() => onChange("")}
              className="text-[11px] text-muted-foreground hover:text-foreground"
            >
              Удалить
            </button>
          </div>
        ) : (
          <button
            onClick={() => onChange(mockName)}
            className="inline-flex items-center gap-1.5 rounded-md border border-dashed border-border bg-white px-2.5 py-1.5 text-xs text-muted-foreground hover:bg-muted/40 hover:text-foreground"
          >
            <Paperclip className="h-3.5 w-3.5" /> Прикрепить файл
          </button>
        )}
      </div>
    );
  }
  return (
    <div>
      <label className="mb-1 block text-[11px] font-medium text-foreground">{field.label}</label>
      <input
        type={field.type === "date" ? "date" : field.type === "number" ? "number" : "text"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={field.placeholder}
        className="w-full rounded-md border border-border bg-white px-2.5 py-1.5 text-xs outline-none focus:border-foreground/30"
      />
    </div>
  );
}
