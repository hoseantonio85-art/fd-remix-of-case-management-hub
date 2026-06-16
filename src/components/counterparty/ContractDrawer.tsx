import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Plus,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  AlertTriangle,
  Paperclip,
  History as HistoryIcon,
  Info as InfoIcon,
  RefreshCcw,
  X,
  ChevronRight,
  Trash2,
  Pencil,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const SETTLEMENT_STAGES = [
  "Мониторинг",
  "Досудебное урегулирование",
  "Передача в ДРПА",
  "Судебное взыскание",
  "Сопровождение банкротства",
  "Сопровождение ликвидации",
] as const;
import type { Contract, OverdueRecord } from "@/lib/mock-data";
import { toneStyles } from "./header-theme";
import { InModalDrawer } from "./InModalDrawer";
import {
  stepMetaByTitle,
  parseDDMMYYYY,
  formatDDMMYYYY,
  computeDue,
  diffDays,
  TODAY,
  type RequiredField,
} from "@/lib/debt-process";

// Full 10-step process (must align with debt-process.ts)
const STEPS = [
  "Коммуникация с должником",
  "Сверка взаиморасчетов",
  "Достигнуты договоренности",
  "Подготовка к обращению в суд",
  "Ведется судебная работа",
  "Получен судебный акт",
  "Ведется исполнительное производство",
  "Банкротство должника",
  "Задолженность погашена",
  "Создание резерва / списание",
] as const;

const stageByStep: Record<string, string> = {
  "Коммуникация с должником": "Досудебное урегулирование",
  "Сверка взаиморасчетов": "Досудебное урегулирование",
  "Достигнуты договоренности": "Досудебное урегулирование",
  "Подготовка к обращению в суд": "Судебная работа",
  "Ведется судебная работа": "Судебная работа",
  "Получен судебный акт": "Судебная работа",
  "Ведется исполнительное производство": "Принудительное взыскание",
  "Банкротство должника": "Принудительное взыскание",
  "Задолженность погашена": "Завершение работы",
  "Создание резерва / списание": "Завершение работы",
};

const stageToStartStep: Record<string, number> = {
  "Досудебное урегулирование": 1,
  "Судебная работа": 3,
  "Принудительное взыскание": 6,
  "Завершение работы": 8,
};

type StepHistoryEntry = {
  date: string;
  action: string;
  step: string;
  user: string;
  comment?: string;
};

type LocalOverdue = OverdueRecord & { source?: string };

const DEFAULT_RESPONSIBLE = "Михайлова Екатерина";

export function ContractDrawer({
  contract,
  counterpartyName,
  caseStatusLabel,
  confirmedRisks = [],
  measures,
  open,
  onOpenChange,
  onAddOverdue,
  onAdvanceStage,
  onUpdateContract,
}: {
  contract: Contract | null;
  counterpartyName?: string;
  caseStatusLabel?: string;
  confirmedRisks?: string[];
  measures: string[];
  open: boolean;
  onOpenChange: (o: boolean) => void;
  onAddOverdue: (id: string, record: OverdueRecord) => void;
  onAdvanceStage: (id: string) => void;
  onUpdateContract?: (id: string, patch: Partial<Contract>) => void;
}) {
  const [stepIdx, setStepIdx] = useState(1);
  const [stepStartedAt, setStepStartedAt] = useState<string>(formatDDMMYYYY(TODAY));
  const [completedFields, setCompletedFields] = useState<
    Record<number, Record<string, string>>
  >({});
  const [history, setHistory] = useState<StepHistoryEntry[]>([]);
  const [editing, setEditing] = useState(false);
  const [transitionComment, setTransitionComment] = useState("");
  const [completionDate, setCompletionDate] = useState(formatDDMMYYYY(TODAY));
  const [transitionError, setTransitionError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  // Overdue add form
  const [amount, setAmount] = useState("");
  const [occurDate, setOccurDate] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [overdueComment, setOverdueComment] = useState("");
  const [localOverdues, setLocalOverdues] = useState<LocalOverdue[]>([]);
  const [overdueError, setOverdueError] = useState<string | null>(null);
  const [showAddOverdue, setShowAddOverdue] = useState(false);
  const [overdueAddedNotice, setOverdueAddedNotice] = useState(false);
  const [expandedOverdues, setExpandedOverdues] = useState<Record<number, boolean>>({ 0: true });
  const [overdueStages, setOverdueStages] = useState<Record<number, string>>({});

  // Update data form + change history
  type ChangeEntry = {
    date: string;
    author: string;
    from: { number: string; debt: number; overdue: number; stage: string };
    to: { number: string; debt: number; overdue: number; stage: string };
  };
  const [updateOpen, setUpdateOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [editName, setEditName] = useState("");
  const [editDebt, setEditDebt] = useState("");
  const [editOverdueAmt, setEditOverdueAmt] = useState("");
  const [editStage, setEditStage] = useState<string>("");
  const [changeHistory, setChangeHistory] = useState<ChangeEntry[]>([]);

  useEffect(() => {
    if (!contract || !open) return;
    const stageStart = stageToStartStep[contract.collectionStage ?? ""] ?? 1;
    setStepIdx(stageStart);
    setStepStartedAt(formatDDMMYYYY(TODAY));
    setCompletedFields({});
    setEditing(false);
    setTransitionComment("");
    setTransitionError(null);
    setNotice(null);
    setCompletionDate(formatDDMMYYYY(TODAY));
    setAmount("");
    setOccurDate("");
    setDueDate("");
    setOverdueComment("");
    setLocalOverdues([]);
    setShowAddOverdue(false);
    setOverdueAddedNotice(false);
    setOverdueError(null);
    setUpdateOpen(false);
    setHistoryOpen(false);
    setChangeHistory([]);
    setHistory([
      {
        date: formatDDMMYYYY(TODAY),
        action: "Создан этап",
        step: STEPS[stageStart],
        user: "NORM AI",
      },
    ]);
  }, [contract?.id, open]);

  const currentTitle = STEPS[stepIdx];
  const nextTitle = STEPS[stepIdx + 1];
  const prevTitle = stepIdx > 0 ? STEPS[stepIdx - 1] : null;
  const curMeta = stepMetaByTitle[currentTitle];

  const dueDateObj = useMemo(
    () => (curMeta ? computeDue(stepStartedAt, curMeta) : null),
    [curMeta, stepStartedAt],
  );

  const daysRemaining = dueDateObj ? diffDays(TODAY, dueDateObj) : null;

  if (!contract) return null;

  const overdue = contract.overdue > 0;
  const tone = overdue ? "danger" : "safe";
  const styles = toneStyles[tone];
  const tagLabel = overdue ? "Есть просроченная задолженность" : "Без просрочки";

  const computedDays = (() => {
    const base = parseDDMMYYYY(dueDate) ?? parseDDMMYYYY(occurDate);
    if (!base) return null;
    const d = diffDays(base, TODAY);
    return d > 0 ? d : 0;
  })();

  const requiredFields: RequiredField[] = curMeta?.requiredFields ?? [];
  const curFields = completedFields[stepIdx] ?? {};

  const validateTransition = (): string | null => {
    if (!nextTitle) return "Это последний этап процесса.";
    const missing = requiredFields.filter(
      (f) => !curFields[f.key]?.toString().trim(),
    );
    if (missing.length > 0) return "Заполните обязательные данные для перехода";

    // Rule: act of reconciliation required to enter Судебная работа
    if (
      stageByStep[nextTitle] === "Судебная работа" &&
      stageByStep[currentTitle] === "Досудебное урегулирование"
    ) {
      // current step must either be "Сверка взаиморасчетов" with file uploaded,
      // or previously completed.
      const sverkaIdx = STEPS.indexOf("Сверка взаиморасчетов");
      const sverkaDone =
        stepIdx > sverkaIdx ||
        !!completedFields[sverkaIdx]?.actSverki ||
        (currentTitle === "Сверка взаиморасчетов" && !!curFields.actSverki);
      if (!sverkaDone) {
        return "Для перехода к судебной работе приложите акт сверки взаиморасчетов";
      }
    }
    // Rule: cannot enter ИП without judicial act
    if (nextTitle === "Ведется исполнительное производство") {
      const sudIdx = STEPS.indexOf("Получен судебный акт");
      if (stepIdx < sudIdx) {
        return "Нельзя перейти к исполнительному производству без судебного акта";
      }
    }
    // Rule: cannot close as paid with overdue > 0
    if (nextTitle === "Задолженность погашена" && contract.overdue > 0) {
      return "Нельзя закрыть договор: остается просроченная задолженность";
    }
    return null;
  };

  const handleConfirmTransition = () => {
    const err = validateTransition();
    if (err) {
      setTransitionError(err);
      return;
    }
    const newIdx = stepIdx + 1;
    const prevStage = stageByStep[currentTitle];
    const nextStage = stageByStep[STEPS[newIdx]];
    setStepIdx(newIdx);
    setStepStartedAt(formatDDMMYYYY(TODAY));
    setEditing(false);
    setTransitionError(null);
    setHistory((h) => [
      {
        date: formatDDMMYYYY(TODAY),
        action: "Переведен этап",
        step: STEPS[newIdx],
        user: DEFAULT_RESPONSIBLE,
        comment: transitionComment || undefined,
      },
      ...h,
    ]);
    setTransitionComment("");
    if (prevStage !== nextStage) {
      onAdvanceStage(contract.id);
      setNotice(
        "Этап по договору обновлен. Общий этап кейса обновится по правилам процесса.",
      );
    } else {
      setNotice("Этап по договору обновлен. Общий этап кейса не изменился");
    }
  };

  const handleFieldChange = (key: string, value: string) => {
    setCompletedFields((prev) => ({
      ...prev,
      [stepIdx]: { ...(prev[stepIdx] ?? {}), [key]: value },
    }));
    setTransitionError(null);
  };

  const handleAddOverdue = () => {
    const amountNum = Number(amount);
    if (!amount || !Number.isFinite(amountNum) || amountNum <= 0) {
      setOverdueError("Введите сумму просрочки");
      return;
    }
    if (!occurDate || !parseDDMMYYYY(occurDate)) {
      setOverdueError("Укажите дату возникновения просрочки");
      return;
    }
    setOverdueError(null);
    const days = computedDays ?? 0;
    const record: OverdueRecord = {
      date: occurDate,
      amount: amountNum / 1_000_000,
      days,
      comment: overdueComment || undefined,
    };
    onAddOverdue(contract.id, record);
    setLocalOverdues((prev) => [{ ...record, source: DEFAULT_RESPONSIBLE }, ...prev]);
    setHistory((h) => [
      {
        date: formatDDMMYYYY(TODAY),
        action: "Добавлена просрочка",
        step: currentTitle,
        user: DEFAULT_RESPONSIBLE,
        comment: `${record.amount.toFixed(2)} млн ₽ · ${days} дн.`,
      },
      ...h,
    ]);
    setAmount("");
    setOccurDate("");
    setDueDate("");
    setOverdueComment("");
    setShowAddOverdue(false);
    setOverdueAddedNotice(true);
  };

  const allOverdues: LocalOverdue[] = [
    ...localOverdues,
    ...contract.overdueHistory.map((h) => ({ ...h, source: "NORM AI" })),
  ];

  return (
    <InModalDrawer open={open} onOpenChange={onOpenChange} className="overflow-hidden">
      {/* HEADER */}
      <div className={`px-6 pt-6 pb-5 ${styles.gradient}`}>
        <span
          className={`inline-flex w-fit items-center rounded-full px-2.5 py-1 text-[11px] font-medium ${styles.badge}`}
        >
          {tagLabel}
        </span>
        <h2 className="mt-3 text-2xl font-semibold tracking-tight">{contract.number}</h2>
        {counterpartyName && (
          <p className="mt-1 text-sm text-muted-foreground">{counterpartyName}</p>
        )}
        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <DebtCard label="Задолженность" value={`${contract.debt.toFixed(1)} млн. ₽`} />
          <DebtCard
            label="Просроченная задолженность"
            value={`${contract.overdue.toFixed(1)} млн. ₽`}
            accent={overdue}
            right={
              overdue && contract.overdueDays > 0
                ? `${contract.overdueDays} ${pluralDays(contract.overdueDays)} просрочки`
                : undefined
            }
          />
        </div>
      </div>

      <div className="space-y-4 px-6 pb-24 pt-4">
        {notice && (
          <div className="flex items-start gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs text-emerald-900">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
            <div className="flex-1">{notice}</div>
            <button
              onClick={() => setNotice(null)}
              className="text-emerald-700 hover:underline"
            >
              Скрыть
            </button>
          </div>
        )}


        {/* OVERDUE HISTORY + INLINE ADD */}
        <section className="rounded-2xl border border-border bg-white p-4">
          <div className="mb-3 flex items-center justify-between gap-2">
            <div className="text-base font-semibold">Просроченная ДЗ</div>
            <button
              type="button"
              aria-label="Добавить просрочку"
              onClick={() => {
                setShowAddOverdue((v) => !v);
                setOverdueError(null);
                setOverdueAddedNotice(false);
              }}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-muted/40 text-muted-foreground transition hover:bg-muted"
            >
              {showAddOverdue ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
            </button>
          </div>

          {overdueAddedNotice && !showAddOverdue && (
            <div className="mb-3 flex items-start gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs text-emerald-900">
              <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0" />
              <div className="flex-1">Просрочка добавлена</div>
              <button
                onClick={() => setOverdueAddedNotice(false)}
                className="text-emerald-700 hover:underline"
              >
                Скрыть
              </button>
            </div>
          )}

          {showAddOverdue && (
            <div className="mb-3 rounded-2xl border border-border bg-muted/30 p-3">
              <div className="grid grid-cols-2 gap-2">
                <LabeledInput
                  label="Сумма просроченной ДЗ, ₽"
                  value={amount}
                  onChange={(v) => {
                    setAmount(v);
                    setOverdueError(null);
                  }}
                  placeholder="100000"
                />
                <LabeledInput
                  label="Дата возникновения"
                  value={occurDate}
                  onChange={(v) => {
                    setOccurDate(v);
                    setOverdueError(null);
                  }}
                  placeholder="ДД.ММ.ГГГГ"
                />
                <LabeledInput
                  label="Срок исполнения / дата оплаты"
                  value={dueDate}
                  onChange={setDueDate}
                  placeholder="ДД.ММ.ГГГГ"
                />
                <LabeledInput
                  label="Комментарий"
                  value={overdueComment}
                  onChange={setOverdueComment}
                  placeholder="—"
                />
              </div>
              {computedDays !== null && (
                <div className="mt-2 text-xs text-muted-foreground">
                  Дней просрочки:{" "}
                  <span className="font-medium text-foreground">{computedDays}</span>
                </div>
              )}
              {overdueError && (
                <div className="mt-2 flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-900">
                  <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                  {overdueError}
                </div>
              )}
              <div className="mt-3 flex items-center gap-2">
                <Button
                  size="sm"
                  className="flex-1"
                  onClick={handleAddOverdue}
                  disabled={!amount || !occurDate}
                >
                  Добавить запись
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    setShowAddOverdue(false);
                    setOverdueError(null);
                  }}
                >
                  Отмена
                </Button>
              </div>
            </div>
          )}

          {allOverdues.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border px-3 py-6 text-center text-xs text-muted-foreground">
              Записей о просрочке пока нет
            </div>
          ) : (
            <div className="space-y-2">
              {allOverdues.map((h, i) => {
                const expanded = !!expandedOverdues[i];
                const stage = overdueStages[i] ?? "Досудебное урегулирование";
                return (
                  <div
                    key={i}
                    className="rounded-2xl bg-muted/50 p-3"
                  >
                    <button
                      type="button"
                      onClick={() =>
                        setExpandedOverdues((s) => ({ ...s, [i]: !s[i] }))
                      }
                      className="flex w-full items-center gap-3 text-left"
                    >
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-muted-foreground shadow-sm">
                        {expanded ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                      </span>
                      <div className="text-sm font-medium">
                        {h.amount.toLocaleString("ru-RU", { maximumFractionDigits: 1 })} млн. ₽{" "}
                        <span className="text-muted-foreground">
                          {h.days} {pluralDays(h.days)}
                        </span>
                      </div>
                    </button>

                    {expanded && (
                      <div className="mt-3 space-y-2">
                        <div className="grid grid-cols-2 gap-2">
                          <div className="rounded-xl border border-border bg-white px-3 py-2">
                            <div className="text-[11px] text-muted-foreground">Сумма</div>
                            <div className="text-sm font-medium text-foreground">
                              {Math.round(h.amount * 1_000_000).toLocaleString("ru-RU")}
                            </div>
                          </div>
                          <div className="rounded-xl border border-border bg-white px-3 py-2">
                            <div className="text-[11px] text-muted-foreground">
                              Срок исполнения
                            </div>
                            <div className="text-sm font-medium text-foreground">
                              {h.date}
                            </div>
                          </div>
                        </div>
                        <div className="rounded-xl border border-border bg-white px-3 py-1.5">
                          <div className="text-[11px] text-muted-foreground">
                            Этапы урегулирования
                          </div>
                          <Select
                            value={stage}
                            onValueChange={(v) =>
                              setOverdueStages((s) => ({ ...s, [i]: v }))
                            }
                          >
                            <SelectTrigger className="h-7 border-0 px-0 text-sm font-medium shadow-none focus:ring-0">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {SETTLEMENT_STAGES.map((s) => (
                                <SelectItem key={s} value={s}>
                                  {s}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setLocalOverdues((arr) => {
                              const localCount = arr.length;
                              if (i < localCount) {
                                return arr.filter((_, idx) => idx !== i);
                              }
                              return arr;
                            });
                          }}
                          className="inline-flex items-center gap-1.5 px-1 pt-1 text-xs text-muted-foreground hover:text-foreground"
                        >
                          <Trash2 className="h-3.5 w-3.5" /> Удалить
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </section>


      </div>

      {/* Fixed footer */}
      <div className="sticky bottom-0 z-20 border-t border-border bg-white px-6 py-4">
        <div className="flex flex-col gap-2 sm:flex-row">
          <Button
            type="button"
            variant="outline"
            className="h-11 flex-1 rounded-xl"
            onClick={() => setHistoryOpen(true)}
          >
            <HistoryIcon className="mr-1.5 h-4 w-4" />
            История изменений
          </Button>
          <Button
            type="button"
            className="h-11 flex-1 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700"
            onClick={() => {
              setEditName(contract.number);
              setEditDebt(String(contract.debt));
              setEditOverdueAmt(String(contract.overdue));
              setEditStage(STEPS[stepIdx]);
              setUpdateOpen(true);
            }}
          >
            <Pencil className="mr-1.5 h-4 w-4" />
            Внести изменения
          </Button>
        </div>
      </div>

      {/* Update form overlay */}
      {updateOpen && (
        <div className="absolute inset-0 z-50 flex flex-col bg-white">
          <div className="flex items-start justify-between border-b border-border px-6 py-4">
            <div>
              <h3 className="text-lg font-semibold">Обновить данные договора</h3>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Измените текущие значения. Старые данные попадут в историю изменений.
              </p>
            </div>
            <button
              onClick={() => setUpdateOpen(false)}
              className="rounded-full p-1.5 text-muted-foreground hover:bg-muted"
              aria-label="Закрыть"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="flex-1 space-y-3 overflow-y-auto px-6 py-4">
            <LabeledInput label="Задолженность" value={editDebt} onChange={setEditDebt} placeholder="0" />
            <LabeledInput label="Просрочка" value={editOverdueAmt} onChange={setEditOverdueAmt} placeholder="0" />
            <div>
              <div className="mb-1 text-xs text-muted-foreground">Этап</div>
              <select
                value={editStage}
                onChange={(e) => setEditStage(e.target.value)}
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                {STEPS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-2 border-t border-border bg-white px-6 py-4">
            <Button variant="outline" onClick={() => setUpdateOpen(false)}>
              Отменить
            </Button>
            <Button
              className="bg-emerald-600 text-white hover:bg-emerald-700"
              onClick={() => {
                const parseNum = (v: string) => {
                  const n = Number(String(v).replace(/[^\d.,-]/g, "").replace(",", "."));
                  return Number.isFinite(n) ? n : 0;
                };
                const newName = editName.trim() || contract.number;
                const newDebt = parseNum(editDebt);
                const newOverdue = parseNum(editOverdueAmt);
                const newStage = editStage || STEPS[stepIdx];
                const oldStage = STEPS[stepIdx];
                const entry: ChangeEntry = {
                  date: formatDDMMYYYY(TODAY),
                  author: "Измайлова Л.Д. • Инициатор",
                  from: {
                    number: contract.number,
                    debt: contract.debt,
                    overdue: contract.overdue,
                    stage: oldStage,
                  },
                  to: { number: newName, debt: newDebt, overdue: newOverdue, stage: newStage },
                };
                setChangeHistory((prev) => [entry, ...prev]);
                const newIdx = STEPS.indexOf(newStage as (typeof STEPS)[number]);
                if (newIdx >= 0 && newIdx !== stepIdx) setStepIdx(newIdx);
                onUpdateContract?.(contract.id, {
                  number: newName,
                  debt: newDebt,
                  overdue: newOverdue,
                  collectionStage: stageByStep[newStage] ?? contract.collectionStage,
                });
                setUpdateOpen(false);
                toast.success("Данные договора обновлены");
              }}
            >
              Сохранить
            </Button>
          </div>
        </div>
      )}

      {/* Change history overlay */}
      {historyOpen && (
        <div className="absolute inset-0 z-50 flex flex-col bg-white">
          <div className="flex items-start justify-between border-b border-border px-6 py-4">
            <div>
              <h3 className="text-lg font-semibold">История изменений</h3>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Предыдущие значения договора и изменения данных.
              </p>
            </div>
            <button
              onClick={() => setHistoryOpen(false)}
              className="rounded-full p-1.5 text-muted-foreground hover:bg-muted"
              aria-label="Закрыть"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto px-6 py-4">
            {changeHistory.length === 0 ? (
              <div className="rounded-xl border border-dashed border-border px-4 py-8 text-center text-sm text-muted-foreground">
                Изменений пока нет
              </div>
            ) : (
              <div className="space-y-3">
                {changeHistory.map((h, i) => (
                  <div key={i} className="rounded-xl border border-border bg-white p-3 text-xs">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="font-medium text-foreground">{h.date}</span>
                      <span className="text-muted-foreground">{h.author}</span>
                    </div>
                    <div className="space-y-1 text-muted-foreground">
                      <div>
                        Название договора:{" "}
                        <span className="text-foreground">{h.from.number}</span> →{" "}
                        <span className="text-foreground">{h.to.number}</span>
                      </div>
                      <div>
                        Задолженность:{" "}
                        <span className="text-foreground">{h.from.debt.toFixed(1)} млн ₽</span> →{" "}
                        <span className="text-foreground">{h.to.debt.toFixed(1)} млн ₽</span>
                      </div>
                      <div>
                        Просрочка:{" "}
                        <span className="text-foreground">{h.from.overdue.toFixed(1)} млн ₽</span> →{" "}
                        <span className="text-foreground">{h.to.overdue.toFixed(1)} млн ₽</span>
                      </div>
                      <div>
                        Этап: <span className="text-foreground">{h.from.stage}</span> →{" "}
                        <span className="text-foreground">{h.to.stage}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </InModalDrawer>
  );
}

function Field({
  label,
  value,
  valueClass = "",
}: {
  label: string;
  value: string;
  valueClass?: string;
}) {
  return (
    <div>
      <div className="text-[11px] uppercase tracking-wide text-muted-foreground">{label}</div>
      <div className={`mt-1 text-sm font-medium ${valueClass}`}>{value}</div>
    </div>
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
    const fileName = value || `${field.label}.pdf`;
    return (
      <div>
        <div className="mb-1 text-xs text-muted-foreground">{field.label}</div>
        {value ? (
          <div className="flex items-center gap-2 rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs text-emerald-900">
            <Paperclip className="h-3.5 w-3.5" /> {fileName}
            <button
              onClick={() => onChange("")}
              className="ml-auto text-emerald-700 hover:underline"
            >
              удалить
            </button>
          </div>
        ) : (
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={() => onChange(`${field.label}.pdf`)}
          >
            <Paperclip className="mr-2 h-3.5 w-3.5" /> Прикрепить {field.label.toLowerCase()}
          </Button>
        )}
      </div>
    );
  }
  return (
    <div>
      <div className="mb-1 text-xs text-muted-foreground">{field.label}</div>
      <Input
        placeholder={field.placeholder ?? (field.type === "date" ? "ДД.ММ.ГГГГ" : "")}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

function Card({
  title,
  icon,
  children,
}: {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-xl border border-border bg-white p-4">
      <div className="mb-3 flex items-center gap-1.5 text-sm font-semibold">
        {icon}
        {title}
      </div>
      {children}
    </section>
  );
}

function Row({
  label,
  value,
  valueClass = "",
}: {
  label: string;
  value: string;
  valueClass?: string;
}) {
  return (
    <div className="flex justify-between py-1 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className={`font-medium ${valueClass}`}>{value}</span>
    </div>
  );
}

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full border border-border bg-white px-2.5 py-0.5 text-xs">
      {children}
    </span>
  );
}

function LabeledInput({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div>
      <div className="mb-1 text-xs text-muted-foreground">{label}</div>
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
    </div>
  );
}

function pluralDays(n: number) {
  const m10 = n % 10;
  const m100 = n % 100;
  if (m10 === 1 && m100 !== 11) return "день";
  if (m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14)) return "дня";
  return "дней";
}

function DebtCard({
  label,
  value,
  accent,
  right,
}: {
  label: string;
  value: string;
  accent?: boolean;
  right?: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-white px-4 py-3">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="mt-1 flex items-center justify-between">
        <div className={`text-lg font-semibold ${accent ? "text-rose-600" : "text-foreground"}`}>
          {value}
        </div>
        {right && (
          <div className="text-xs text-muted-foreground whitespace-nowrap">{right}</div>
        )}
      </div>
    </div>
  );
}
