import { useEffect, useState } from "react";
import { InModalDrawer } from "./InModalDrawer";
import { Button, Input, SimpleSelect } from "@/shared/ui";
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
            <Input
              label="Название договора"
              labelInside
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Например, Договор поставки № 245"
              error={showErrors && errors.name}
              helperText={showErrors && errors.name ? "Обязательное поле" : undefined}
            />

            <Input
              label="Задолженность"
              labelInside
              required
              value={debt}
              onChange={(e) => setDebt(e.target.value)}
              placeholder="0 ₽"
              inputMode="decimal"
              error={showErrors && errors.debt}
              helperText={showErrors && errors.debt ? "Обязательное поле" : undefined}
            />

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Input
                label="Просрочка"
                labelInside
                required
                value={overdue}
                onChange={(e) => setOverdue(e.target.value)}
                placeholder="0 ₽"
                inputMode="decimal"
                error={showErrors && errors.overdue}
                helperText={showErrors && errors.overdue ? "Обязательное поле" : undefined}
              />
              <Input
                label="Срок исполнения / дата оплаты"
                labelInside
                required
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                error={showErrors && errors.dueDate}
                helperText={showErrors && errors.dueDate ? "Обязательное поле" : undefined}
              />
            </div>

            <SimpleSelect
              label="Этапы урегулирования"
              labelInside
              required
              value={stage}
              onChange={setStage}
              options={CONTRACT_STAGES.map((s) => ({ value: s, label: s }))}
              error={showErrors && errors.stage}
              helperText={showErrors && errors.stage ? "Обязательное поле" : undefined}
            />
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

