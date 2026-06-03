import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, ArrowRight } from "lucide-react";
import type { Contract } from "@/lib/mock-data";

export function ContractDrawer({
  contract,
  measures,
  open,
  onOpenChange,
  onAddOverdue,
  onAdvanceStage,
}: {
  contract: Contract | null;
  measures: string[];
  open: boolean;
  onOpenChange: (o: boolean) => void;
  onAddOverdue: (id: string, amount: number, days: number) => void;
  onAdvanceStage: (id: string) => void;
}) {
  const [amount, setAmount] = useState("");
  const [days, setDays] = useState("");

  if (!contract) return null;
  const overdue = contract.overdue > 0;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full overflow-y-auto sm:max-w-xl">
        <SheetHeader>
          <div
            className={`inline-flex w-fit items-center rounded-full px-2.5 py-1 text-xs ${
              overdue ? "bg-destructive/10 text-destructive" : "bg-muted text-muted-foreground"
            }`}
          >
            {overdue ? "Есть просроченная задолженность" : "Без просрочки"}
          </div>
          <SheetTitle className="!mt-2">{contract.number}</SheetTitle>
          <p className="text-sm text-muted-foreground">Договор по контрагенту</p>
        </SheetHeader>

        <div className="mt-6 space-y-5">
          <div className="rounded-xl border border-border p-4">
            <div className="flex justify-between py-1.5 text-sm">
              <span className="text-muted-foreground">Общая задолженность</span>
              <span className="font-semibold">{contract.debt.toFixed(1)} млн. ₽</span>
            </div>
            <div className="flex justify-between py-1.5 text-sm">
              <span className="text-muted-foreground">Просроченная задолженность</span>
              <span className={`font-semibold ${overdue ? "text-destructive" : ""}`}>
                {contract.overdue.toFixed(1)} млн. ₽
              </span>
            </div>
            <div className="flex justify-between py-1.5 text-sm">
              <span className="text-muted-foreground">Дней просрочки</span>
              <span className="font-medium">{contract.overdueDays || "—"}</span>
            </div>
            <div className="flex justify-between py-1.5 text-sm">
              <span className="text-muted-foreground">Этап взыскания</span>
              <span className="font-medium">{contract.collectionStage ?? "Не начато"}</span>
            </div>
          </div>

          <div>
            <div className="mb-2 text-sm font-semibold">Принятые меры реагирования</div>
            {measures.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {measures.map((m) => (
                  <span key={m} className="rounded-full bg-primary/10 px-3 py-1 text-xs text-primary">
                    {m}
                  </span>
                ))}
              </div>
            ) : (
              <div className="text-sm text-muted-foreground">Меры пока не выбраны</div>
            )}
          </div>

          <div className="rounded-xl border border-border p-4">
            <div className="mb-3 text-sm font-semibold">Добавить запись о просрочке</div>
            <div className="grid grid-cols-2 gap-2">
              <Input placeholder="Сумма, ₽" value={amount} onChange={(e) => setAmount(e.target.value)} />
              <Input placeholder="Дней" value={days} onChange={(e) => setDays(e.target.value)} />
            </div>
            <Button
              variant="outline"
              className="mt-3 w-full"
              onClick={() => {
                if (!amount) return;
                onAddOverdue(contract.id, Number(amount) / 1_000_000, Number(days) || 0);
                setAmount("");
                setDays("");
              }}
            >
              <Plus className="mr-2 h-4 w-4" /> Добавить просрочку
            </Button>
          </div>

          <Button className="w-full" onClick={() => onAdvanceStage(contract.id)}>
            <ArrowRight className="mr-2 h-4 w-4" /> Перевести на следующий этап взыскания
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
