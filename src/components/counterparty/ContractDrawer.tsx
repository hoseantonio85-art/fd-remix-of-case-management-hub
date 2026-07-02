import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import {
  Button,
  Input,
  SimpleSelect,
  RadioChips,
  StatusBadge,
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
  EllipseIconButton,
} from "@/shared/ui";

const SETTLEMENT_STAGES = [
  "Мониторинг",
  "Досудебное урегулирование",
  "Передача в ДРПА",
  "Судебное взыскание",
  "Сопровождение банкротства",
  "Сопровождение ликвидации",
] as const;
import type { Contract, OverdueRecord } from "@/domain/counterparty";
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

type Repayment = { id: string; amount: number; date: string };
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
  const [editRepayment, setEditRepayment] = useState<{
    overdueIdx: number;
    repaymentId: string;
  } | null>(null);
  const [editRepaymentAmount, setEditRepaymentAmount] = useState("");
  const [editRepaymentDate, setEditRepaymentDate] = useState("");
  const [editRepaymentError, setEditRepaymentError] = useState<string | null>(null);
  const [editOvIdx, setEditOvIdx] = useState<number | null>(null);
  const [editOvAmount, setEditOvAmount] = useState("");
  const [editOvDate, setEditOvDate] = useState("");
  const [editOvStage, setEditOvStage] = useState<string>(SETTLEMENT_STAGES[0]);
  const [editOvError, setEditOvError] = useState<string | null>(null);

  // Debt adjustments
  const [adjustments, setAdjustments] = useState<DebtAdjustment[]>([]);
  const [showAddAdjustment, setShowAddAdjustment] = useState(false);
  const [adjAmount, setAdjAmount] = useState("");
  const [adjDate, setAdjDate] = useState("");
  const [adjType, setAdjType] = useState<"increase" | "decrease">("increase");
  const [adjError, setAdjError] = useState<string | null>(null);
  const [editAdjId, setEditAdjId] = useState<string | null>(null);
  const [editAdjAmount, setEditAdjAmount] = useState("");
  const [editAdjDate, setEditAdjDate] = useState("");
  const [editAdjType, setEditAdjType] = useState<"increase" | "decrease">("increase");
  const [editAdjError, setEditAdjError] = useState<string | null>(null);
  const [expandedAdjustments, setExpandedAdjustments] = useState<Record<string, boolean>>({});

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
    setEditAdjId(null);
    setEditAdjAmount("");
    setEditAdjDate("");
    setEditAdjType("increase");
    setEditAdjError(null);
    setExpandedAdjustments({});
    setPayOpenIdx(null);
    setPayAmount("");
    setPayDate("");
    setPayError(null);
    setEditRepayment(null);
    setEditRepaymentAmount("");
    setEditRepaymentDate("");
    setEditRepaymentError(null);
    setEditOvIdx(null);
    setEditOvError(null);
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
    logChange("Добавлена просроченная ДЗ", `${amtMln.toFixed(2)} млн ₽ · ${newOverdueStage}`);
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
    logChange("Изменена просроченная ДЗ", `${o.amount.toFixed(2)} млн ₽ · ${o.date} · ${o.stage}`);
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
    const newDebt = Math.max(0, effectiveDebt + (adjType === "increase" ? amtMln : -amtMln));
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

  const openEditAdjustment = (a: DebtAdjustment) => {
    setEditAdjId(a.id);
    setEditAdjAmount(String(Math.round(a.amount * 1_000_000)));
    setEditAdjDate(a.date);
    setEditAdjType(a.type);
    setEditAdjError(null);
    setShowAddAdjustment(false);
    setExpandedAdjustments((s) => ({ ...s, [a.id]: true }));
  };

  const handleSaveAdjEdit = () => {
    if (!editAdjId) return;
    const a = adjustments.find((x) => x.id === editAdjId);
    if (!a) return;
    const n = Number(editAdjAmount.replace(",", "."));
    if (!editAdjAmount || !Number.isFinite(n) || n <= 0) {
      setEditAdjError("Введите сумму корректировки");
      return;
    }
    if (!editAdjDate || !parseDDMMYYYY(editAdjDate)) {
      setEditAdjError("Укажите дату корректировки");
      return;
    }
    const amtMln = n / 1_000_000;
    const next = adjustments.map((x) =>
      x.id === a.id ? { ...x, amount: amtMln, date: editAdjDate, type: editAdjType } : x,
    );
    const delta = next.reduce((s, x) => s + (x.type === "increase" ? x.amount : -x.amount), 0);
    if (contract.debt + delta < 0) {
      setEditAdjError("Задолженность не может стать отрицательной");
      return;
    }
    setAdjustments(next);
    const newDebt = Math.max(0, contract.debt + delta);
    onUpdateContract?.(contract.id, { debt: newDebt });
    logChange(
      "Корректировка задолженности изменена",
      `${editAdjType === "increase" ? "+" : "−"}${amtMln.toFixed(2)} млн ₽ · ${editAdjDate}`,
    );
    toast.success("Задолженность обновлена");
    setEditAdjId(null);
  };

  const handleDeleteAdjustment = (id: string) => {
    const a = adjustments.find((x) => x.id === id);
    if (!a) return;
    const next = adjustments.filter((x) => x.id !== id);
    setAdjustments(next);
    const delta = next.reduce((s, x) => s + (x.type === "increase" ? x.amount : -x.amount), 0);
    const newDebt = Math.max(0, contract.debt + delta);
    onUpdateContract?.(contract.id, { debt: newDebt });
    logChange(
      "Удалена корректировка задолженности",
      `${a.type === "increase" ? "+" : "−"}${a.amount.toFixed(2)} млн ₽ · ${a.date}`,
    );
    toast.success("Задолженность удалена");
    if (editAdjId === id) setEditAdjId(null);
  };

  const handleDeleteOverdue = (i: number) => {
    const o = overdues[i];
    if (!o) return;
    const next = overdues.filter((_, k) => k !== i);
    setOverdues(next);
    const newOverdueTotal = next.reduce(
      (s, x) => s + Math.max(0, x.amount - x.repayments.reduce((a, r) => a + r.amount, 0)),
      0,
    );
    onUpdateContract?.(contract.id, { overdue: newOverdueTotal });
    logChange("Удалена просроченная ДЗ", `${o.amount.toFixed(2)} млн ₽ · ${o.date}`);
    toast.success("Просроченная ДЗ удалена");
    setExpandedOverdues((s) => {
      const ns: Record<number, boolean> = {};
      Object.keys(s).forEach((k) => {
        const idx = Number(k);
        if (idx < i) ns[idx] = s[idx];
        else if (idx > i) ns[idx - 1] = s[idx];
      });
      return ns;
    });
    if (payOpenIdx === i) setPayOpenIdx(null);
  };

  const openEditOverdue = (i: number) => {
    const o = overdues[i];
    if (!o) return;
    setEditOvIdx(i);
    setEditOvAmount(String(Math.round(o.amount * 1_000_000)));
    setEditOvDate(o.date);
    setEditOvStage(o.stage);
    setEditOvError(null);
    setExpandedOverdues((s) => ({ ...s, [i]: true }));
  };

  const handleSaveOverdueEdit = () => {
    if (editOvIdx === null) return;
    const o = overdues[editOvIdx];
    if (!o) return;
    const n = Number(editOvAmount.replace(",", "."));
    if (!editOvAmount || !Number.isFinite(n) || n <= 0) {
      setEditOvError("Введите сумму просрочки");
      return;
    }
    if (!editOvDate || !parseDDMMYYYY(editOvDate)) {
      setEditOvError("Укажите срок исполнения");
      return;
    }
    const amtMln = n / 1_000_000;
    const paidSum = o.repayments.reduce((s, r) => s + r.amount, 0);
    if (amtMln - paidSum < -1e-9) {
      setEditOvError("Сумма меньше уже внесённых погашений");
      return;
    }
    const base = parseDDMMYYYY(editOvDate);
    const days = base ? Math.max(0, diffDays(base, TODAY)) : o.days;
    const next = overdues.map((x, k) =>
      k === editOvIdx ? { ...x, amount: amtMln, date: editOvDate, stage: editOvStage, days } : x,
    );
    setOverdues(next);
    const newOverdueTotal = next.reduce(
      (s, x) => s + Math.max(0, x.amount - x.repayments.reduce((a, r) => a + r.amount, 0)),
      0,
    );
    onUpdateContract?.(contract.id, { overdue: newOverdueTotal });
    logChange(
      "Изменена просроченная ДЗ",
      `${amtMln.toFixed(2)} млн ₽ · ${editOvDate} · ${editOvStage}`,
    );
    toast.success("Просроченная ДЗ обновлена");
    setEditOvIdx(null);
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
      const newRepayment: Repayment = {
        id: Math.random().toString(36).slice(2),
        amount: amtMln,
        date: payDate,
      };
      next[i] = { ...o, repayments: [newRepayment, ...o.repayments] };
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
    <InModalDrawer open={open} onOpenChange={onOpenChange} className="overflow-hidden">
      <div className="relative flex h-full min-h-0 flex-col">
        {/* HEADER */}
        <div className={`shrink-0 px-6 pt-6 pb-5 pr-16 ${styles.gradient}`}>
          <StatusBadge tone={hasOverdue ? "danger" : "success"} size="regular">
            {tagLabel}
          </StatusBadge>
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

        <div className="min-h-0 flex-1 overflow-y-auto space-y-4 px-6 pb-6 pt-4">
          {/* DEBT ADJUSTMENTS */}
          <section className="rounded-2xl border border-border bg-white p-4">
            <div className="mb-3 flex items-center justify-between gap-2">
              <div className="text-base font-semibold">Задолженность</div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                iconOnly
                aria-label="Добавить корректировку"
                onClick={() => {
                  setShowAddAdjustment((v) => !v);
                  setAdjError(null);
                }}
              >
                {showAddAdjustment ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
              </Button>
            </div>

            {showAddAdjustment && (
              <div className="mb-3 rounded-2xl border border-border bg-muted/30 p-3">
                <div className="space-y-2">
                  <RadioChips
                    label="Тип операции"
                    value={adjType}
                    items={[
                      { id: "increase", title: "Увеличить" },
                      { id: "decrease", title: "Уменьшить" },
                    ]}
                    onChange={(id) => {
                      setAdjType(id as "increase" | "decrease");
                      setAdjError(null);
                    }}
                  />
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
                  <Button
                    size="sm"
                    className="flex-1"
                    onClick={handleAddAdjustment}
                    disabled={!adjAmount || !adjDate}
                  >
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
                {adjustments.map((a) => {
                  const expanded = !!expandedAdjustments[a.id];
                  const isEditing = editAdjId === a.id;
                  const sign = a.type === "increase" ? "+" : "−";
                  const typeLabel = a.type === "increase" ? "Увеличение" : "Уменьшение";
                  return (
                    <div key={a.id} className="rounded-2xl bg-muted/50 p-3">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            setExpandedAdjustments((s) => ({ ...s, [a.id]: !s[a.id] }))
                          }
                          className="flex min-w-0 flex-1 items-center gap-3 text-left"
                        >
                          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-muted-foreground shadow-sm">
                            {expanded ? (
                              <ChevronDown className="h-4 w-4" />
                            ) : (
                              <ChevronRight className="h-4 w-4" />
                            )}
                          </span>
                          <div className="min-w-0 flex-1 text-sm font-medium">
                            <span
                              className={
                                a.type === "increase" ? "text-foreground" : "text-emerald-700"
                              }
                            >
                              {sign}
                              {a.amount.toLocaleString("ru-RU", { maximumFractionDigits: 2 })} млн ₽
                            </span>{" "}
                            <span className="text-muted-foreground">· {a.date}</span>
                          </div>
                        </button>
                        <div className="flex shrink-0 items-center gap-1">
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            iconOnly
                            aria-label="Редактировать"
                            onClick={(e) => {
                              e.stopPropagation();
                              openEditAdjustment(a);
                            }}
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            iconOnly
                            aria-label="Удалить"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteAdjustment(a.id);
                            }}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </div>

                      {expanded && (
                        <div className="mt-3">
                          {isEditing ? (
                            <div className="rounded-2xl border border-border bg-white p-3">
                              <div className="space-y-2">
                                <RadioChips
                                  label="Тип операции"
                                  value={editAdjType}
                                  items={[
                                    { id: "increase", title: "Увеличить" },
                                    { id: "decrease", title: "Уменьшить" },
                                  ]}
                                  onChange={(id) => {
                                    setEditAdjType(id as "increase" | "decrease");
                                    setEditAdjError(null);
                                  }}
                                />
                                <LabeledInput
                                  label="Сумма"
                                  value={editAdjAmount}
                                  onChange={(v) => {
                                    setEditAdjAmount(v);
                                    setEditAdjError(null);
                                  }}
                                  placeholder="100000"
                                />
                                <LabeledInput
                                  label="Дата погашения"
                                  value={editAdjDate}
                                  onChange={setEditAdjDate}
                                  placeholder="ДД.ММ.ГГГГ"
                                />
                                {editAdjError && (
                                  <div className="flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-900">
                                    <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                                    {editAdjError}
                                  </div>
                                )}
                                <div className="flex items-center gap-2">
                                  <Button
                                    size="sm"
                                    className="flex-1"
                                    onClick={handleSaveAdjEdit}
                                    disabled={!editAdjAmount || !editAdjDate}
                                  >
                                    Сохранить
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => setEditAdjId(null)}
                                  >
                                    Отмена
                                  </Button>
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className="space-y-2">
                              <div>
                                <div className="text-xs text-muted-foreground">Тип операции</div>
                                <div className="text-sm font-medium text-foreground">
                                  {typeLabel}
                                </div>
                              </div>
                              <div>
                                <div className="text-xs text-muted-foreground">Сумма</div>
                                <div className="text-sm font-medium text-foreground">
                                  {sign}
                                  {a.amount.toLocaleString("ru-RU", {
                                    maximumFractionDigits: 2,
                                  })}{" "}
                                  млн ₽
                                </div>
                              </div>
                              <div>
                                <div className="text-xs text-muted-foreground">Дата погашения</div>
                                <div className="text-sm font-medium text-foreground">{a.date}</div>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          {/* OVERDUE HISTORY + INLINE ADD */}
          <section className="rounded-2xl border border-border bg-white p-4">
            <div className="mb-3 flex items-center justify-between gap-2">
              <div className="text-base font-semibold">Просроченная ДЗ</div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                iconOnly
                aria-label="Добавить просрочку"
                onClick={() => {
                  setShowAddOverdue((v) => !v);
                  setOverdueError(null);
                }}
              >
                {showAddOverdue ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
              </Button>
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
                  <SimpleSelect
                    label="Этапы урегулирования"
                    labelInside
                    value={newOverdueStage}
                    onChange={setNewOverdueStage}
                    options={SETTLEMENT_STAGES.map((s) => ({ value: s, label: s }))}
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
                    disabled={!amount || !dueDate}
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
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setExpandedOverdues((s) => ({ ...s, [i]: !s[i] }))}
                          className="flex min-w-0 flex-1 items-center gap-3 text-left"
                        >
                          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-muted-foreground shadow-sm">
                            {expanded ? (
                              <ChevronDown className="h-4 w-4" />
                            ) : (
                              <ChevronRight className="h-4 w-4" />
                            )}
                          </span>
                          <div className="min-w-0 flex-1 text-sm font-medium">
                            {o.amount.toLocaleString("ru-RU", { maximumFractionDigits: 2 })} млн. ₽{" "}
                            <span className="text-muted-foreground">
                              {o.days} {pluralDays(o.days)}
                            </span>
                            {paid > 0 && !fullyPaid && (
                              <span className="ml-2 text-xs text-emerald-700">
                                погашено{" "}
                                {paid.toLocaleString("ru-RU", { maximumFractionDigits: 2 })} млн ₽
                              </span>
                            )}
                          </div>
                        </button>
                        {fullyPaid && (
                          <StatusBadge tone="success" size="compact" className="shrink-0">
                            Погашено полностью
                          </StatusBadge>
                        )}
                        <div className="flex shrink-0 items-center gap-1">
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            iconOnly
                            aria-label="Редактировать"
                            onClick={(e) => {
                              e.stopPropagation();
                              openEditOverdue(i);
                            }}
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            iconOnly
                            aria-label="Удалить"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteOverdue(i);
                            }}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </div>

                      {expanded && (
                        <div className="mt-3 space-y-2">
                          {editOvIdx === i ? (
                            <div className="rounded-2xl border border-border bg-white p-3">
                              <div className="space-y-2">
                                <LabeledInput
                                  label="Сумма просроченной ДЗ, ₽"
                                  value={editOvAmount}
                                  onChange={(v) => {
                                    setEditOvAmount(v);
                                    setEditOvError(null);
                                  }}
                                  placeholder="100000"
                                />
                                <LabeledInput
                                  label="Срок исполнения / дата оплаты"
                                  value={editOvDate}
                                  onChange={(v) => {
                                    setEditOvDate(v);
                                    setEditOvError(null);
                                  }}
                                  placeholder="ДД.ММ.ГГГГ"
                                />
                                <SimpleSelect
                                  label="Этапы урегулирования"
                                  labelInside
                                  value={editOvStage}
                                  onChange={setEditOvStage}
                                  options={SETTLEMENT_STAGES.map((s) => ({ value: s, label: s }))}
                                />
                              </div>
                              {editOvError && (
                                <div className="mt-2 flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-900">
                                  <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                                  {editOvError}
                                </div>
                              )}
                              <div className="mt-3 flex items-center gap-2">
                                <Button
                                  size="sm"
                                  className="flex-1"
                                  onClick={handleSaveOverdueEdit}
                                  disabled={!editOvAmount || !editOvDate}
                                >
                                  Сохранить
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => setEditOvIdx(null)}
                                >
                                  Отменить
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <div className="space-y-2">
                              <div>
                                <div className="text-xs text-muted-foreground">Сумма</div>
                                <div className="text-sm font-medium text-foreground">
                                  {o.amount.toLocaleString("ru-RU", { maximumFractionDigits: 2 })}{" "}
                                  млн ₽
                                </div>
                              </div>
                              <div>
                                <div className="text-xs text-muted-foreground">Срок исполнения</div>
                                <div className="text-sm font-medium text-foreground">{o.date}</div>
                              </div>
                              <div>
                                <div className="text-xs text-muted-foreground">Этап</div>
                                <div className="mt-0.5">
                                  <StatusBadge tone="neutral" size="compact">
                                    {o.stage}
                                  </StatusBadge>
                                </div>
                              </div>
                            </div>
                          )}

                          {o.repayments.length > 0 && (
                            <div className="rounded-xl border border-border bg-white px-3 py-2">
                              <div className="mb-1 text-[11px] text-muted-foreground">
                                Погашения
                              </div>
                              <div className="space-y-1">
                                {o.repayments.map((r, ri) => (
                                  <div key={ri} className="flex justify-between text-xs">
                                    <span className="text-foreground">
                                      {r.amount.toLocaleString("ru-RU", {
                                        maximumFractionDigits: 2,
                                      })}{" "}
                                      млн ₽
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

        {/* Footer */}
        <div className="shrink-0 border-t border-border bg-white px-6 py-4">
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={() => setHistoryOpen(true)}
          >
            <HistoryIcon className="h-4 w-4" />
            История изменений
          </Button>
        </div>

        {/* Change history overlay */}
        {historyOpen && (
          <div className="absolute inset-0 z-50 flex flex-col bg-white">
            <div className="flex items-start justify-between gap-3 border-b border-border px-6 py-4">
              <div className="min-w-0 flex-1">
                <h3 className="text-lg font-semibold">История изменений</h3>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  Действия по договору: корректировки, просрочки, погашения.
                </p>
              </div>
              <EllipseIconButton
                icon="cross"
                aria-label="Закрыть"
                onClick={() => setHistoryOpen(false)}
              />
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
                      {h.details && <div className="mt-1 text-muted-foreground">{h.details}</div>}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </InModalDrawer>
  );
}

// Thin wrapper preserving the (value, v) string API of legacy call sites,
// while rendering corporate Input with floating labelInside.
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
    <Input
      label={label}
      labelInside
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
    />
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
        {right && <div className="text-xs text-muted-foreground whitespace-nowrap">{right}</div>}
      </div>
    </div>
  );
}
