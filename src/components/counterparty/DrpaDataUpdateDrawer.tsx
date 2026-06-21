import { useMemo, useState } from "react";
import { Sheet, SheetContent, StatusBadge } from "@/shared/ui";
import { Button } from "@/shared/ui";
import { Input } from "@/shared/ui";
import { Pencil, Plus, CheckCircle2, ShieldCheck } from "@/shared/ui";
import { toast } from "sonner";
import type { Contract, Counterparty } from "@/domain/counterparty";

const CONTRACT_STAGES = [
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

const todayLabel = () => {
  const d = new Date();
  return `${String(d.getDate()).padStart(2, "0")}.${String(d.getMonth() + 1).padStart(2, "0")}.${d.getFullYear()}`;
};

const parseNum = (v: string) => {
  const n = Number(
    String(v)
      .replace(/[^\d.,-]/g, "")
      .replace(",", "."),
  );
  return Number.isFinite(n) ? n : 0;
};

export type DrpaCardData = {
  counterparty: Counterparty;
  contracts: Contract[];
  updated: boolean;
};

export function DrpaDataUpdateDrawer({
  open,
  onOpenChange,
  cards,
  setCards,
  confirmed,
  onConfirm,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  cards: DrpaCardData[];
  setCards: React.Dispatch<React.SetStateAction<DrpaCardData[]>>;
  confirmed: boolean;
  onConfirm: () => void;
}) {
  const total = cards.length;
  const updatedCount = cards.filter((c) => c.updated).length;
  const allDone = total > 0 && updatedCount === total;
  const readOnly = confirmed;

  const updateContract = (inn: string, contractId: string, patch: Partial<Contract>) => {
    setCards((prev) =>
      prev.map((card) =>
        card.counterparty.inn === inn
          ? {
              ...card,
              updated: true,
              contracts: card.contracts.map((c) =>
                c.id === contractId ? { ...c, ...patch, date: todayLabel() } : c,
              ),
            }
          : card,
      ),
    );
  };

  const addContract = (inn: string, c: Contract) => {
    setCards((prev) =>
      prev.map((card) =>
        card.counterparty.inn === inn
          ? { ...card, updated: true, contracts: [...card.contracts, c] }
          : card,
      ),
    );
  };

  const markActual = (inn: string) => {
    setCards((prev) =>
      prev.map((card) => (card.counterparty.inn === inn ? { ...card, updated: true } : card)),
    );
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="flex w-full flex-col gap-0 overflow-hidden p-0 sm:max-w-[860px] lg:w-[70vw]"
      >
        {/* Header */}
        <div className="border-b border-border bg-white px-6 pt-6 pb-4">
          <div className="pr-10">
            <h2 className="text-xl font-semibold tracking-tight">Обновление данных для ДРПА</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Актуализируйте договоры контрагентов с просрочкой более 30 дней на 01.07.2026. После
              подтверждения данные будут зафиксированы.
            </p>
          </div>
          <div className="mt-4">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-foreground">
                Обновлено {updatedCount} из {total} контрагентов
              </span>
              {confirmed && (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-800">
                  <ShieldCheck className="h-3 w-3" />
                  Зафиксировано
                </span>
              )}
            </div>
            <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-emerald-500 transition-all"
                style={{ width: total === 0 ? "0%" : `${(updatedCount / total) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Scroll content */}
        <div className="flex-1 overflow-y-auto bg-slate-50 px-6 py-5 pb-28">
          {cards.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border bg-white px-6 py-12 text-center">
              <h3 className="text-base font-semibold">Нет контрагентов для обновления</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Контрагенты с просрочкой более 30 дней не найдены.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {cards.map((card) => (
                <DrpaCounterpartyCard
                  key={card.counterparty.inn}
                  card={card}
                  readOnly={readOnly}
                  onUpdateContract={(cid, patch) => {
                    updateContract(card.counterparty.inn, cid, patch);
                    toast.success("Договор обновлён");
                  }}
                  onAddContract={(c) => {
                    addContract(card.counterparty.inn, c);
                    toast.success("Договор добавлен");
                  }}
                  onMarkActual={() => {
                    markActual(card.counterparty.inn);
                    toast.success("Данные отмечены как актуальные");
                  }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-border bg-white px-6 py-4">
          {confirmed ? (
            <div className="flex items-center justify-center gap-2 rounded-xl bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800">
              <ShieldCheck className="h-4 w-4" />
              Данные подтверждены для отправки в ДРПА
            </div>
          ) : (
            <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="text-sm text-muted-foreground">
                Обновлено <span className="font-medium text-foreground">{updatedCount}</span> из{" "}
                <span className="font-medium text-foreground">{total}</span>
              </div>
              <Button disabled={!allDone} onClick={onConfirm} size="lg">
                Подтвердить данные
              </Button>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}

function DrpaCounterpartyCard({
  card,
  readOnly,
  onUpdateContract,
  onAddContract,
  onMarkActual,
}: {
  card: DrpaCardData;
  readOnly: boolean;
  onUpdateContract: (id: string, patch: Partial<Contract>) => void;
  onAddContract: (c: Contract) => void;
  onMarkActual: () => void;
}) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [addOpen, setAddOpen] = useState(false);

  const totalOverdue = useMemo(
    () => card.contracts.reduce((s, c) => s + (Number(c.overdue) || 0), 0),
    [card.contracts],
  );
  const totalDebt = useMemo(
    () => card.contracts.reduce((s, c) => s + (Number(c.debt) || 0), 0),
    [card.contracts],
  );

  const subline = `ИНН ${card.counterparty.inn} · задолженность ${totalDebt.toFixed(1)} млн ₽ · просрочка ${totalOverdue.toFixed(1)} млн ₽ · ${card.contracts.length} ${pluralContracts(card.contracts.length)}`;

  return (
    <section className="rounded-2xl border border-border bg-white p-4 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <h3 className="text-base font-semibold leading-tight">{card.counterparty.name}</h3>
          <p className="mt-1 text-xs text-muted-foreground">{subline}</p>
        </div>
        <StatusTag updated={card.updated} />
      </div>

      <div className="mt-3 space-y-2">
        {card.contracts.map((c) =>
          editingId === c.id && !readOnly ? (
            <ContractEditForm
              key={c.id}
              contract={c}
              onCancel={() => setEditingId(null)}
              onSave={(patch) => {
                onUpdateContract(c.id, patch);
                setEditingId(null);
              }}
            />
          ) : (
            <ContractRow
              key={c.id}
              contract={c}
              readOnly={readOnly}
              onEdit={() => setEditingId(c.id)}
            />
          ),
        )}

        {!readOnly &&
          (addOpen ? (
            <ContractAddForm
              onCancel={() => setAddOpen(false)}
              onAdd={(c) => {
                onAddContract(c);
                setAddOpen(false);
              }}
            />
          ) : (
            <Button
              type="button"
              variant="secondary"
              onClick={() => setAddOpen(true)}
              className="h-10 w-full justify-center rounded-xl border border-border bg-slate-50 text-sm font-medium text-foreground hover:bg-slate-100"
            >
              <Plus className="mr-1.5 h-4 w-4" />
              Добавить договор
            </Button>
          ))}
      </div>

      {!readOnly && !card.updated && (
        <div className="mt-3 flex justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={onMarkActual}
            className="h-9 rounded-full text-xs"
          >
            <CheckCircle2 className="mr-1.5 h-3.5 w-3.5" />
            Данные актуальны
          </Button>
        </div>
      )}
    </section>
  );
}

function StatusTag({ updated }: { updated: boolean }) {
  return updated ? (
    <StatusBadge tone="success" className="shrink-0">
      Обновлено
    </StatusBadge>
  ) : (
    <StatusBadge tone="warning" className="shrink-0">
      Требует обновления
    </StatusBadge>
  );
}

function ContractRow({
  contract,
  readOnly,
  onEdit,
}: {
  contract: Contract;
  readOnly: boolean;
  onEdit: () => void;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-border bg-white px-3 py-2.5">
      <div className="grid min-w-0 flex-1 grid-cols-2 gap-2 sm:grid-cols-5">
        <Cell label="Договор" value={contract.number} sub={`от ${contract.date}`} />
        <Cell label="Задолженность" value={`${Number(contract.debt).toFixed(1)} млн ₽`} />
        <Cell
          label="Просрочка"
          value={
            Number(contract.overdue) > 0 ? `${Number(contract.overdue).toFixed(1)} млн ₽` : "нет"
          }
          sub={Number(contract.overdue) > 0 ? `${contract.overdueDays} дн.` : undefined}
          accent={Number(contract.overdue) > 0}
        />
        <Cell label="Этап" value={contract.collectionStage ?? "—"} />
        <Cell label="Обновлён" value={contract.date} />
      </div>
      {!readOnly && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onEdit}
          className="h-8 shrink-0 px-2 text-xs"
          aria-label="Редактировать договор"
        >
          <Pencil className="h-3.5 w-3.5" />
        </Button>
      )}
    </div>
  );
}

function Cell({
  label,
  value,
  sub,
  accent,
}: {
  label: string;
  value: string;
  sub?: string;
  accent?: boolean;
}) {
  return (
    <div className="min-w-0">
      <div className="text-[10px] uppercase tracking-wide text-muted-foreground">{label}</div>
      <div className={`truncate text-sm font-medium ${accent ? "text-amber-700" : ""}`}>
        {value}
      </div>
      {sub && <div className="text-[11px] text-muted-foreground">{sub}</div>}
    </div>
  );
}

function ContractEditForm({
  contract,
  onCancel,
  onSave,
}: {
  contract: Contract;
  onCancel: () => void;
  onSave: (patch: Partial<Contract>) => void;
}) {
  const [name, setName] = useState(contract.number);
  const [debt, setDebt] = useState(String(contract.debt));
  const [overdue, setOverdue] = useState(String(contract.overdue));
  const [stage, setStage] = useState<string>(contract.collectionStage ?? CONTRACT_STAGES[0]);

  return (
    <div className="space-y-3 rounded-xl border border-primary/30 bg-primary/5 p-3">
      <FormGrid>
        <Field label="Название договора">
          <Input value={name} onChange={(e) => setName(e.target.value)} />
        </Field>
        <Field label="Задолженность">
          <Input value={debt} onChange={(e) => setDebt(e.target.value)} placeholder="0" />
        </Field>
        <Field label="Просрочка">
          <Input value={overdue} onChange={(e) => setOverdue(e.target.value)} placeholder="0" />
        </Field>
        <Field label="Этап">
          <StageSelect value={stage} onChange={setStage} />
        </Field>
      </FormGrid>
      <div className="flex justify-end gap-2">
        <Button variant="outline" size="sm" onClick={onCancel}>
          Отменить
        </Button>
        <Button
          size="sm"
          onClick={() =>
            onSave({
              number: name.trim() || contract.number,
              debt: parseNum(debt),
              overdue: parseNum(overdue),
              collectionStage: stage,
            })
          }
        >
          Сохранить
        </Button>
      </div>
    </div>
  );
}

function ContractAddForm({
  onCancel,
  onAdd,
}: {
  onCancel: () => void;
  onAdd: (c: Contract) => void;
}) {
  const [name, setName] = useState("");
  const [debt, setDebt] = useState("");
  const [overdue, setOverdue] = useState("");
  const [stage, setStage] = useState<string>("");
  const [error, setError] = useState(false);

  const submit = () => {
    if (!name.trim() || !debt.trim() || !overdue.trim() || !stage) {
      setError(true);
      return;
    }
    onAdd({
      id: `c-${Date.now()}`,
      number: name.trim(),
      date: todayLabel(),
      amount: parseNum(debt),
      debt: parseNum(debt),
      overdue: parseNum(overdue),
      overdueDays: 0,
      measures: "",
      collectionStage: stage,
      overdueHistory: [],
    });
  };

  return (
    <div className="space-y-3 rounded-xl border border-border bg-slate-50 p-3">
      <FormGrid>
        <Field label="Название договора" error={error && !name.trim()}>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Например, Договор поставки № 245"
          />
        </Field>
        <Field label="Задолженность" error={error && !debt.trim()}>
          <Input value={debt} onChange={(e) => setDebt(e.target.value)} placeholder="0 ₽" />
        </Field>
        <Field label="Просрочка" error={error && !overdue.trim()}>
          <Input value={overdue} onChange={(e) => setOverdue(e.target.value)} placeholder="0 ₽" />
        </Field>
        <Field label="Этап" error={error && !stage}>
          <StageSelect value={stage} onChange={setStage} placeholder="Выберите этап" />
        </Field>
      </FormGrid>
      <div className="flex justify-end gap-2">
        <Button variant="outline" size="sm" onClick={onCancel}>
          Отменить
        </Button>
        <Button size="sm" onClick={submit}>
          Добавить
        </Button>
      </div>
    </div>
  );
}

function FormGrid({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">{children}</div>;
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1">
      <label className="text-xs font-medium text-muted-foreground">{label}</label>
      {children}
      {error && <div className="text-[11px] text-rose-600">Обязательное поле</div>}
    </div>
  );
}

function StageSelect({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="flex h-9 w-full rounded-md border border-input bg-white px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
    >
      {placeholder !== undefined && <option value="">{placeholder}</option>}
      {CONTRACT_STAGES.map((s) => (
        <option key={s} value={s}>
          {s}
        </option>
      ))}
    </select>
  );
}

function pluralContracts(n: number) {
  const m10 = n % 10;
  const m100 = n % 100;
  if (m10 === 1 && m100 !== 11) return "договор";
  if (m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14)) return "договора";
  return "договоров";
}
