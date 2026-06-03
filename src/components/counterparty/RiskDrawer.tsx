import { useEffect, useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import type { RiskSignal } from "@/lib/mock-data";

export function RiskDrawer({
  risk,
  open,
  onOpenChange,
  onSave,
}: {
  risk: RiskSignal | null;
  open: boolean;
  onOpenChange: (o: boolean) => void;
  onSave: (riskId: string, payload: { date: string; measures: string[]; comment: string }) => void;
}) {
  const [selected, setSelected] = useState<string[]>([]);
  const [date, setDate] = useState(new Date().toLocaleDateString("ru-RU"));
  const [comment, setComment] = useState("");

  useEffect(() => {
    if (open) {
      setSelected([]);
      setDate(new Date().toLocaleDateString("ru-RU"));
      setComment("");
    }
  }, [open, risk?.id]);

  if (!risk) return null;

  const toggle = (m: string) =>
    setSelected((prev) => (prev.includes(m) ? prev.filter((x) => x !== m) : [...prev, m]));

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full overflow-y-auto sm:max-w-xl">
        <SheetHeader>
          <SheetTitle>Подтверждение риска</SheetTitle>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          <div className="rounded-xl border border-border bg-muted/50 p-4">
            <div className="text-xs uppercase tracking-wide text-muted-foreground">Выбранный риск</div>
            <div className="mt-1 font-semibold">{risk.type}</div>
            <div className="mt-1 text-sm text-muted-foreground">{risk.description}</div>
            <div className="mt-2 text-xs text-muted-foreground">
              Источник: {risk.source} · {risk.detectedAt}
            </div>
          </div>

          <div>
            <div className="mb-3 text-sm font-semibold">Меры реагирования</div>
            <div className="grid grid-cols-1 gap-2">
              {risk.availableMeasures.map((m) => {
                const checked = selected.includes(m);
                return (
                  <label
                    key={m}
                    className={`flex cursor-pointer items-start gap-3 rounded-xl border p-3 transition ${
                      checked ? "border-primary bg-primary/5" : "border-border bg-card hover:bg-accent/40"
                    }`}
                  >
                    <Checkbox checked={checked} onCheckedChange={() => toggle(m)} className="mt-0.5" />
                    <span className="text-sm">{m}</span>
                  </label>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3">
            <div>
              <label className="mb-1 block text-xs text-muted-foreground">Дата решения</label>
              <Input value={date} onChange={(e) => setDate(e.target.value)} />
            </div>
            <div>
              <label className="mb-1 block text-xs text-muted-foreground">Комментарий</label>
              <Textarea
                rows={3}
                placeholder="Опишите контекст принятого решения…"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <Button variant="outline" className="flex-1" onClick={() => onOpenChange(false)}>
              Отмена
            </Button>
            <Button
              className="flex-1"
              disabled={selected.length === 0}
              onClick={() => {
                onSave(risk.id, { date, measures: selected, comment });
                onOpenChange(false);
              }}
            >
              Сохранить решение
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
