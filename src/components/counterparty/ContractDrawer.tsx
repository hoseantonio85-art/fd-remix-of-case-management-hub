import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Plus,
  ChevronDown,
  ChevronRight,
  CheckCircle2,
  AlertTriangle,
  Paperclip,
  History as HistoryIcon,
  X,
  Pencil,
  Trash2,
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

type Repayment = { amount: number; date: string };
type LocalOverdue = OverdueRecord & {
  source?: string;
  stage: string;
  repayments: Repayment[];
};
type DebtAdjustment = {
  id: string;
  date: string;
  type: "increase" | "decrease";
  amount: number; // в млн
};
type ChangeEntry = {
  date: string;
  author: string;
  action: string;
  details?: string;
};

const DEFAULT_RESPONSIBLE = "Михайлова Екатерина";

export function ContractDrawer({
  contract,
  counterpartyName,
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

  // Overdue add form
  const [amount, setAmount] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [newOverdueStage, setNewOverdueStage] = useState<string>(SETTLEMENT_STAGES[0]);
  const [overdues, setOverdues] = useState<LocalOverdue[]>([]);
  const [overdueError, setOverdueError] = useState<string | null>(null);
  const [showAddOverdue, setShowAddOverdue] = useState(false);
  const [expandedOverdues, setExpandedOverdues] = useState<Record<number, boolean>>({ 0: true });
  const [payOpenIdx, setPayOpenIdx] = useState<number | null>(null);
  const [payAmount, setPayAmount] = useState("");
  const [payDate, setPayDate] = useState("");
  const [payError, setPayError] = useState<string | null>(null);

  // Debt adjustments
  const [adjustments, setAdjustments] = useState<DebtAdjustment[]>([]);
  const [showAddAdjustment, setShowAddAdjustment] = useState(false);
  const [adjAmount, setAdjAmount] = useState("");
  const [adjDate, setAdjDate] = useState("");
  const [adjType, setAdjType] = useState<"increase" | "decrease">("increase");
  const [adjError, setAdjError] = useState<string | null>(null);

  // Change history
  const [historyOpen, setHistoryOpen] = useState(false);
  const [changeHistory, setChangeHistory] = useState<ChangeEntry[]>([]);

  useEffect(() => {
    if (!contract || !open) return;
    const stageStart = stageToStartStep[contract.collectionStage ?? ""] ?? 1;
    setStepIdx(stageStart);
    setAmount("");
    setDueDate("");
    setNewOverdueStage(SETTLEMENT_STAGES[0]);
    setShowAddOverdue(false);
    setOverdueError(null);
    setHistoryOpen(false);
    setChangeHistory([]);
    setAdjustments([]);
    setShowAddAdjustment(false);
    setAdjAmount("");
    setAdjDate("");
    setAdjType("increase");
    setAdjError(null);
    setPayOpenIdx(null);
    setPayAmount("");
    setPayDate("");
    setPayError(null);
    setOverdues(
      contract.overdueHistory.map((h) => ({
        ...h,
        source: "NORM AI",
        stage: "Досудебное урегулирование",
        repayments: [],
      })),
    );
  }, [contract?.id, open]);

  const computedDays = (() => {
    const base = parseDDMMYYYY(dueDate);
    if (!base) return null;
    const d = diffDays(base, TODAY);
    return d > 0 ? d : 0;
  })();

  const logChange = (action: string, details?: string) => {
    setChangeHistory((prev) => [
      { date: formatDDMMYYYY(TODAY), author: DEFAULT_RESPONSIBLE, action, details },
      ...prev,
    ]);
  };

  if (!contract) return null;

  // Effective aggregates
  const adjDelta = adjustments.reduce(
    (s, a) => s + (a.type === "increase" ? a.amount : -a.amount),
    0,
  );
  const effectiveDebt = Math.max(0, contract.debt + adjDelta);

  const remainOf = (o: LocalOverdue) =>
    Math.max(0, o.amount - o.repayments.reduce((s, r) => s + r.amount, 0));

  const effectiveOverdue = overdues.reduce((s, o) => s + remainOf(o), 0);
  const hasOverdue = effectiveOverdue > 0;
  const tone = hasOverdue ? "danger" : "safe";
  const styles = toneStyles[tone];
  const tagLabel = hasOverdue ? "Есть просроченная задолженность" : "Без просрочки";

  const handleAddOverdue = () => {
    const amountNum = Number(amount);
    if (!amount || !Number.isFinite(amountNum) || amountNum <= 0) {
      setOverdueError("Введите сумму просрочки");
      return;
    }
    if (!dueDate || !parseDDMMYYYY(dueDate)) {
      setOverdueError("Укажите срок исполнения");
      return;
    }
    setOverdueError(null);
    const days = computedDays ?? 0;
    const amtMln = amountNum / 1_000_000;
    const record: OverdueRecord = {
      date: dueDate,
      amount: amtMln,
      days,
      comment: newOverdueStage,
    };
    onAddOverdue(contract.id, record);
    setOverdues((prev) => [
      { ...record, source: DEFAULT_RESPONSIBLE, stage: newOverdueStage, repayments: [] },
      ...prev,
    ]);
    logChange(
      "Добавлена просроченная ДЗ",
      `${amtMln.toFixed(2)} млн ₽ · ${newOverdueStage}`,
    );
    toast.success("Просроченная ДЗ добавлена");
    setAmount("");
    setDueDate("");
    setNewOverdueStage(SETTLEMENT_STAGES[0]);
    setShowAddOverdue(false);
  };

  const handleEditOverdue = (
    i: number,
    patch: Partial<Pick<LocalOverdue, "amount" | "date" | "stage">>,
  ) => {
    setOverdues((arr) => {
      const next = [...arr];
      const cur = next[i];
      const updated = { ...cur, ...patch };
      // recompute days
      const base = parseDDMMYYYY(updated.date);
      updated.days = base ? Math.max(0, diffDays(base, TODAY)) : updated.days;
      next[i] = updated;
      return next;
    });
  };

  const commitOverdueEdit = (i: number) => {
    const o = overdues[i];
    if (!o) return;
    onUpdateContract?.(contract.id, {});
    logChange(
      "Изменена просроченная ДЗ",
      `${o.amount.toFixed(2)} млн ₽ · ${o.date} · ${o.stage}`,
    );
    toast.success("Просроченная ДЗ обновлена");
  };

  const handleAddAdjustment = () => {
    const n = Number(adjAmount.replace(",", "."));
    if (!adjAmount || !Number.isFinite(n) || n <= 0) {
      setAdjError("Введите сумму корректировки");
      return;
    }
    if (!adjDate || !parseDDMMYYYY(adjDate)) {
      setAdjError("Укажите дату корректировки");
      return;
    }
    const amtMln = n / 1_000_000;
    if (adjType === "decrease" && effectiveDebt - amtMln < 0) {
      setAdjError("Задолженность не может стать отрицательной");
      return;
    }
    setAdjError(null);
    const entry: DebtAdjustment = {
      id: Math.random().toString(36).slice(2),
      date: adjDate,
      type: adjType,
      amount: amtMln,
    };
    setAdjustments((prev) => [entry, ...prev]);
    const newDebt = Math.max(
      0,
      effectiveDebt + (adjType === "increase" ? amtMln : -amtMln),
    );
    onUpdateContract?.(contract.id, { debt: newDebt });
    logChange(
      "Корректировка задолженности",
      `${adjType === "increase" ? "+" : "−"}${amtMln.toFixed(2)} млн ₽ · ${adjDate}`,
    );
    toast.success("Задолженность обновлена");
    setAdjAmount("");
    setAdjDate("");
    setAdjType("increase");
    setShowAddAdjustment(false);
  };

  const handleAddRepayment = (i: number) => {
    const n = Number(payAmount.replace(",", "."));
    const o = overdues[i];
    if (!o) return;
    if (!payAmount || !Number.isFinite(n) || n <= 0) {
      setPayError("Введите сумму погашения");
      return;
    }
    if (!payDate || !parseDDMMYYYY(payDate)) {
      setPayError("Укажите дату погашения");
      return;
    }
    const amtMln = n / 1_000_000;
    const remain = remainOf(o);
    if (amtMln - remain > 1e-9) {
      setPayError("Сумма погашения больше остатка просрочки");
      return;
    }
    setPayError(null);
    const wasFull = remain - amtMln < 1e-9;
    setOverdues((arr) => {
      const next = [...arr];
      next[i] = { ...o, repayments: [{ amount: amtMln, date: payDate }, ...o.repayments] };
      return next;
    });
    const newOverdueTotal = Math.max(0, effectiveOverdue - amtMln);
    onUpdateContract?.(contract.id, { overdue: newOverdueTotal });
    logChange(
      wasFull ? "Просрочка погашена полностью" : "Внесено погашение",
      `${amtMln.toFixed(2)} млн ₽ · ${payDate}`,
    );
    toast.success(wasFull ? "Погашение внесено" : "Погашение внесено");
    setPayAmount("");
    setPayDate("");
    setPayOpenIdx(null);
  };

  return (
    <InModalDrawer open={open} onOpenChange={onOpenChange}>
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
          <DebtCard label="Задолженность" value={`${effectiveDebt.toFixed(1)} млн. ₽`} />
          <DebtCard
            label="Просроченная задолженность"
            value={`${effectiveOverdue.toFixed(1)} млн. ₽`}
            accent={hasOverdue}
          />
        </div>
      </div>

      <div className="space-y-4 px-6 pb-24 pt-4">
        {/* DEBT ADJUSTMENTS */}
        <section className="rounded-2xl border border-border bg-white p-4">
          <div className="mb-3 flex items-center justify-between gap-2">
            <div className="text-base font-semibold">Задолженность</div>
            <button
              type="button"
              aria-label="Добавить корректировку"
              onClick={() => {
                setShowAddAdjustment((v) => !v);
                setAdjError(null);
              }}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-muted/40 text-muted-foreground transition hover:bg-muted"
            >
              {showAddAdjustment ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
            </button>
          </div>

          {showAddAdjustment && (
            <div className="mb-3 rounded-2xl border border-border bg-muted/30 p-3">
              <div className="space-y-2">
                <div>
                  <div className="mb-1 text-xs text-muted-foreground">Тип операции</div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => { setAdjType("increase"); setAdjError(null); }}
                      className={`flex h-9 flex-1 items-center justify-center rounded-full border text-sm font-medium transition ${adjType === "increase" ? "border-primary bg-primary text-primary-foreground" : "border-border bg-muted/40 text-muted-foreground hover:bg-muted"}`}
                    >
                      Увеличить
                    </button>
                    <button
                      type="button"
                      onClick={() => { setAdjType("decrease"); setAdjError(null); }}
                      className={`flex h-9 flex-1 items-center justify-center rounded-full border text-sm font-medium transition ${adjType === "decrease" ? "border-primary bg-primary text-primary-foreground" : "border-border bg-muted/40 text-muted-foreground hover:bg-muted"}`}
                    >
                      Уменьшить
                    </button>
                  </div>
                </div>
                <LabeledInput
                  label="Сумма"
                  value={adjAmount}
                  onChange={(v) => {
                    setAdjAmount(v);
                    setAdjError(null);
                  }}
                  placeholder="100000"
                />
                <LabeledInput
                  label="Дата погашения"
                  value={adjDate}
                  onChange={setAdjDate}
                  placeholder="ДД.ММ.ГГГГ"
                />
              </div>
              {adjError && (
                <div className="mt-2 flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-900">
                  <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                  {adjError}
                </div>
              )}
              <div className="mt-3 flex items-center gap-2">
                <Button size="sm" className="flex-1" onClick={handleAddAdjustment} disabled={!adjAmount || !adjDate}>
                  Добавить корректировку
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    setShowAddAdjustment(false);
                    setAdjError(null);
                  }}
                >
                  Отмена
                </Button>
              </div>
            </div>
          )}

          {adjustments.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border px-3 py-2 text-center text-xs text-muted-foreground">
              Корректировок пока нет
            </div>
          ) : (
            <div className="space-y-2">
              {adjustments.map((a) => (
                <div key={a.id} className="rounded-2xl bg-muted/50 p-3">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium">
                      <span className={a.type === "increase" ? "text-foreground" : "text-emerald-700"}>
                        {a.type === "increase" ? "+" : "−"}
                        {a.amount.toLocaleString("ru-RU", { maximumFractionDigits: 2 })} млн ₽
                      </span>{" "}
                      <span className="text-muted-foreground">
                        · {a.type === "increase" ? "Увеличение" : "Уменьшение"}
                      </span>
                    </div>
                    <div className="text-xs text-muted-foreground">{a.date}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

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
              }}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-muted/40 text-muted-foreground transition hover:bg-muted"
            >
              {showAddOverdue ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
            </button>
          </div>

          {showAddOverdue && (
            <div className="mb-3 rounded-2xl border border-border bg-muted/30 p-3">
              <div className="space-y-2">
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
                  label="Срок исполнения / дата оплаты"
                  value={dueDate}
                  onChange={setDueDate}
                  placeholder="ДД.ММ.ГГГГ"
                />
                <div>
                  <div className="mb-1 text-xs text-muted-foreground">Этапы урегулирования</div>
                  <Select value={newOverdueStage} onValueChange={(v) => setNewOverdueStage(v)}>
                    <SelectTrigger className="h-9 w-full border-input text-sm shadow-sm">
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
                <Button size="sm" className="flex-1" onClick={handleAddOverdue} disabled={!amount || !dueDate}>
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

          {overdues.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border px-3 py-6 text-center text-xs text-muted-foreground">
              Записей о просрочке пока нет
            </div>
          ) : (
            <div className="space-y-2">
              {overdues.map((o, i) => {
                const expanded = !!expandedOverdues[i];
                const remain = remainOf(o);
                const paid = o.amount - remain;
                const fullyPaid = remain <= 1e-9 && o.repayments.length > 0;
                return (
                  <div
                    key={i}
                    className={`rounded-2xl p-3 ${fullyPaid ? "bg-emerald-50" : "bg-muted/50"}`}
                  >
                    <button
                      type="button"
                      onClick={() => setExpandedOverdues((s) => ({ ...s, [i]: !s[i] }))}
                      className="flex w-full items-center gap-3 text-left"
                    >
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-muted-foreground shadow-sm">
                        {expanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                      </span>
                      <div className="flex-1 text-sm font-medium">
                        {o.amount.toLocaleString("ru-RU", { maximumFractionDigits: 2 })} млн. ₽{" "}
                        <span className="text-muted-foreground">
                          {o.days} {pluralDays(o.days)}
                        </span>
                        {paid > 0 && !fullyPaid && (
                          <span className="ml-2 text-xs text-emerald-700">
                            погашено {paid.toLocaleString("ru-RU", { maximumFractionDigits: 2 })} млн ₽
                          </span>
                        )}
                      </div>
                      {fullyPaid && (
                        <span className="inline-flex items-center rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-medium text-emerald-800">
                          Погашено полностью
                        </span>
                      )}
                    </button>

                    {expanded && (
                      <div className="mt-3 space-y-2">
                        <div className="grid grid-cols-2 gap-2">
                          <div className="rounded-xl border border-border bg-white px-3 py-2">
                            <div className="text-[11px] text-muted-foreground">Сумма</div>
                            <Input
                              className="h-7 border-0 px-0 text-sm font-medium shadow-none focus-visible:ring-0"
                              value={String(Math.round(o.amount * 1_000_000))}
                              onChange={(e) => {
                                const n = Number(e.target.value.replace(/[^\d]/g, ""));
                                if (Number.isFinite(n)) handleEditOverdue(i, { amount: n / 1_000_000 });
                              }}
                              onBlur={() => commitOverdueEdit(i)}
                            />
                          </div>
                          <div className="rounded-xl border border-border bg-white px-3 py-2">
                            <div className="text-[11px] text-muted-foreground">Срок исполнения</div>
                            <Input
                              className="h-7 border-0 px-0 text-sm font-medium shadow-none focus-visible:ring-0"
                              value={o.date}
                              placeholder="ДД.ММ.ГГГГ"
                              onChange={(e) => handleEditOverdue(i, { date: e.target.value })}
                              onBlur={() => commitOverdueEdit(i)}
                            />
                          </div>
                        </div>
                        <div className="rounded-xl border border-border bg-white px-3 py-1.5">
                          <div className="text-[11px] text-muted-foreground">Этапы урегулирования</div>
                          <Select
                            value={o.stage}
                            onValueChange={(v) => {
                              handleEditOverdue(i, { stage: v });
                              commitOverdueEdit(i);
                            }}
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

                        {o.repayments.length > 0 && (
                          <div className="rounded-xl border border-border bg-white px-3 py-2">
                            <div className="mb-1 text-[11px] text-muted-foreground">Погашения</div>
                            <div className="space-y-1">
                              {o.repayments.map((r, ri) => (
                                <div key={ri} className="flex justify-between text-xs">
                                  <span className="text-foreground">
                                    {r.amount.toLocaleString("ru-RU", { maximumFractionDigits: 2 })} млн ₽
                                  </span>
                                  <span className="text-muted-foreground">{r.date}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {!fullyPaid && payOpenIdx === i && (
                          <div className="rounded-2xl border border-border bg-muted/30 p-3">
                            <div className="space-y-2">
                              <LabeledInput
                                label="Сумма погашения, ₽"
                                value={payAmount}
                                onChange={(v) => {
                                  setPayAmount(v);
                                  setPayError(null);
                                }}
                                placeholder="50000"
                              />
                              <LabeledInput
                                label="Дата погашения"
                                value={payDate}
                                onChange={setPayDate}
                                placeholder="ДД.ММ.ГГГГ"
                              />
                            </div>
                            {payError && (
                              <div className="mt-2 flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-900">
                                <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                                {payError}
                              </div>
                            )}
                            <div className="mt-3 flex items-center gap-2">
                              <Button
                                size="sm"
                                className="flex-1"
                                onClick={() => handleAddRepayment(i)}
                                disabled={!payAmount || !payDate}
                              >
                                Сохранить погашение
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => {
                                  setPayOpenIdx(null);
                                  setPayError(null);
                                  setPayAmount("");
                                  setPayDate("");
                                }}
                              >
                                Отмена
                              </Button>
                            </div>
                          </div>
                        )}

                        {!fullyPaid && payOpenIdx !== i && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="w-full"
                            onClick={() => {
                              setPayOpenIdx(i);
                              setPayError(null);
                              setPayAmount("");
                              setPayDate(formatDDMMYYYY(TODAY));
                            }}
                          >
                            Внести погашение
                          </Button>
                        )}
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
        <Button
          type="button"
          variant="outline"
          className="h-11 w-full rounded-xl"
          onClick={() => setHistoryOpen(true)}
        >
          <HistoryIcon className="mr-1.5 h-4 w-4" />
          История изменений
        </Button>
      </div>

      {/* Change history overlay */}
      {historyOpen && (
        <div className="absolute inset-0 z-50 flex flex-col bg-white">
          <div className="flex items-start justify-between border-b border-border px-6 py-4">
            <div>
              <h3 className="text-lg font-semibold">История изменений</h3>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Действия по договору: корректировки, просрочки, погашения.
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
                    <div className="text-foreground">{h.action}</div>
                    {h.details && (
                      <div className="mt-1 text-muted-foreground">{h.details}</div>
                    )}
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
