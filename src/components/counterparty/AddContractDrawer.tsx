import { useEffect, useState } from "react";
import { InModalDrawer } from "./InModalDrawer";
import { Button } from "@/shared/ui";
import { Input } from "@/shared/ui";
import type { Contract } from "@/domain/counterparty";

const CONTRACT_STAGES = [
  "Мониторинг",
  "Досудебное урегулирование",
  "Передача в ДРПА",
  "Судебное взыскание",
  "Сопровождение банкротства",
  "Сопровождение ликвидации",
] as const;

const DEFAULT_STAGE: string = CONTRACT_STAGES[0];

const parseNum = (v: string) => {
  const n = Number(v.replace(/[^\d.,-]/g, "").replace(",", "."));
  return Number.isFinite(n) ? n : 0;
};

const toIsoDate = (v: string) => {
  // input type=date already yields YYYY-MM-DD; convert to ru locale for display
  if (!v) return "";
  const [y, m, d] = v.split("-");
  if (!y || !m || !d) return v;
  return `${d}.${m}.${y}`;
};

export function AddContractDrawer({
  open,
  onOpenChange,
  onAdd,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  onAdd: (contract: Contract) => void;
}) {
  const [name, setName] = useState("");
  const [debt, setDebt] = useState("");
  const [overdue, setOverdue] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [stage, setStage] = useState<string>(DEFAULT_STAGE);
  const [showErrors, setShowErrors] = useState(false);

  useEffect(() => {
    if (open) {
      setName("");
      setDebt("");
      setOverdue("");
      setDueDate("");
      setStage(DEFAULT_STAGE);
      setShowErrors(false);
    }
  }, [open]);

  const errors = {
    name: !name.trim(),
    debt: !debt.trim(),
    overdue: !overdue.trim(),
    dueDate: !dueDate,
    stage: !stage,
  };
  const hasError = Object.values(errors).some(Boolean);

  const handleSubmit = () => {
    if (hasError) {
      setShowErrors(true);
      return;
    }
    const overdueAmount = parseNum(overdue);
    const dueDateRu = toIsoDate(dueDate);
    const contract: Contract = {
      id: `c-${Date.now()}`,
      number: name.trim(),
      date: new Date().toLocaleDateString("ru-RU"),
      amount: parseNum(debt),
      debt: parseNum(debt),
      overdue: overdueAmount,
      overdueDays: 0,
      measures: "",
      collectionStage: stage,
      overdueHistory:
        overdueAmount > 0 ? [{ date: dueDateRu, amount: overdueAmount, days: 0 }] : [],
    };
    onAdd(contract);
    onOpenChange(false);
  };

  return (
    <InModalDrawer open={open} onOpenChange={onOpenChange}>
      <div className="flex h-full flex-col">
        <div className="flex-1 overflow-y-auto p-6 pb-4">
          <h2 className="text-lg font-semibold tracking-tight text-foreground">Добавить договор</h2>

          <div className="mt-5 space-y-4">
            <Field
              label="Название договора"
              error={showErrors && errors.name ? "Обязательное поле" : null}
            >
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Например, Договор поставки № 245"
              />
            </Field>

            <Field
              label="Задолженность"
              error={showErrors && errors.debt ? "Обязательное поле" : null}
            >
              <Input
                value={debt}
                onChange={(e) => setDebt(e.target.value)}
                placeholder="0 ₽"
                inputMode="decimal"
              />
            </Field>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Field
                label="Просрочка"
                error={showErrors && errors.overdue ? "Обязательное поле" : null}
              >
                <Input
                  value={overdue}
                  onChange={(e) => setOverdue(e.target.value)}
                  placeholder="0 ₽"
                  inputMode="decimal"
                />
              </Field>
              <Field
                label="Срок исполнения / дата оплаты"
                error={showErrors && errors.dueDate ? "Обязательное поле" : null}
              >
                <Input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
              </Field>
            </div>

            <Field
              label="Этапы урегулирования"
              error={showErrors && errors.stage ? "Обязательное поле" : null}
            >
              <select
                value={stage}
                onChange={(e) => setStage(e.target.value)}
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                {CONTRACT_STAGES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </Field>
          </div>
        </div>

        <div className="flex gap-3 border-t border-border bg-white px-6 py-4">
          <Button
            type="button"
            variant="ghost"
            className="flex-1"
            onClick={() => onOpenChange(false)}
          >
            Отменить
          </Button>
          <Button type="button" className="flex-1" onClick={handleSubmit}>
            Добавить
          </Button>
        </div>
      </div>
    </InModalDrawer>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string | null;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1">
      <label className="text-xs font-medium text-muted-foreground">{label}</label>
      {children}
      {error && <div className="text-[11px] text-rose-600">{error}</div>}
    </div>
  );
}
