import { useEffect, useMemo, useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { measuresByRisk, type RiskSignal } from "@/lib/mock-data";

export type DecisionKind = "confirm" | "dismiss" | "verify";

export type RiskSavePayload =
  | { kind: "confirm"; date: string; measures: string[]; comment: string; responsible: string }
  | { kind: "dismiss"; date: string; comment: string; responsible: string }
  | { kind: "verify"; date: string; plannedDate: string; comment: string; responsible: string };

const kindBadge: Record<string, string> = {
  required: "bg-foreground/5 text-foreground border border-border",
  recommended: "bg-primary/10 text-primary",
  situational: "bg-muted text-muted-foreground",
};
const kindLabel: Record<string, string> = {
  required: "обязательная",
  recommended: "рекомендуемая",
  situational: "по ситуации",
};

const titleByMode: Record<DecisionKind, string> = {
  confirm: "Подтверждение риска",
  dismiss: "Снятие риска",
  verify: "Дополнительная проверка",
};

const saveLabelByMode: Record<DecisionKind, string> = {
  confirm: "Сохранить решение",
  dismiss: "Снять риск",
  verify: "Отправить на проверку",
};

export function RiskDrawer({
  risk,
  initialDecision,
  open,
  onOpenChange,
  onSave,
}: {
  risk: RiskSignal | null;
  initialDecision: DecisionKind;
  open: boolean;
  onOpenChange: (o: boolean) => void;
  onSave: (riskId: string, payload: RiskSavePayload) => void;
}) {
  const mode = initialDecision;
  const [selected, setSelected] = useState<string[]>([]);
  const [date, setDate] = useState(new Date().toLocaleDateString("ru-RU"));
  const [plannedDate, setPlannedDate] = useState("");
  const [comment, setComment] = useState("");
  const [responsible, setResponsible] = useState("Михайлова Е.");

  useEffect(() => {
    if (open) {
      setSelected([]);
      setDate(new Date().toLocaleDateString("ru-RU"));
      setPlannedDate(new Date(Date.now() + 7 * 86400000).toLocaleDateString("ru-RU"));
      setComment("");
      setResponsible("Михайлова Е.");
    }
  }, [open, risk?.id, mode]);

  const measures = useMemo(() => (risk ? measuresByRisk[risk.type] ?? [] : []), [risk]);

  if (!risk) return null;

  const toggle = (m: string) =>
    setSelected((p) => (p.includes(m) ? p.filter((x) => x !== m) : [...p, m]));

  const canSave =
    mode === "confirm"
      ? selected.length > 0
      : mode === "dismiss"
        ? comment.trim().length > 0
        : comment.trim().length > 0 && responsible.trim().length > 0 && plannedDate.trim().length > 0;

  const handleSave = () => {
    if (!canSave) return;
    if (mode === "confirm")
      onSave(risk.id, { kind: "confirm", date, measures: selected, comment, responsible });
    else if (mode === "dismiss")
      onSave(risk.id, { kind: "dismiss", date, comment, responsible });
    else onSave(risk.id, { kind: "verify", date, plannedDate, comment, responsible });
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full overflow-y-auto bg-white sm:max-w-xl">
        <SheetHeader>
          <SheetTitle>{titleByMode[mode]}</SheetTitle>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          <div className="rounded-xl border border-border bg-slate-50/60 p-4">
            <div className="text-[11px] uppercase tracking-wide text-muted-foreground">Выбранный риск</div>
            <div className="mt-1 font-semibold">{risk.type}</div>
            <div className="mt-1 text-sm text-muted-foreground">{risk.description}</div>
            <div className="mt-2 text-xs text-muted-foreground">
              Источник: {risk.source} · Обнаружено: {risk.detectedAt}
            </div>
          </div>

          {mode === "confirm" && (
            <div>
              <div className="mb-2 text-sm font-semibold">Меры реагирования</div>
              <div className="space-y-2">
                {measures.map((m) => {
                  const checked = selected.includes(m.name);
                  return (
                    <label
                      key={m.name}
                      className={`flex cursor-pointer items-start gap-3 rounded-lg border p-3 transition ${
                        checked ? "border-primary bg-primary/5" : "border-border bg-card hover:bg-accent/40"
                      }`}
                    >
                      <Checkbox checked={checked} onCheckedChange={() => toggle(m.name)} className="mt-0.5" />
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-sm font-medium">{m.name}</span>
                          <span className={`rounded-full px-2 py-0.5 text-[10px] ${kindBadge[m.kind]}`}>
                            {kindLabel[m.kind]}
                          </span>
                        </div>
                        <div className="mt-0.5 text-xs text-muted-foreground">{m.hint}</div>
                      </div>
                    </label>
                  );
                })}
              </div>
              {selected.length === 0 && (
                <div className="mt-2 text-xs text-muted-foreground">Выберите хотя бы одну меру</div>
              )}
            </div>
          )}

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs text-muted-foreground">Дата решения</label>
              <Input value={date} onChange={(e) => setDate(e.target.value)} />
            </div>
            {mode === "verify" && (
              <div>
                <label className="mb-1 block text-xs text-muted-foreground">
                  Ответственный <span className="text-destructive">*</span>
                </label>
                <Input value={responsible} onChange={(e) => setResponsible(e.target.value)} />
              </div>
            )}
            {mode === "verify" && (
              <div className="sm:col-span-2">
                <label className="mb-1 block text-xs text-muted-foreground">
                  Плановая дата проверки <span className="text-destructive">*</span>
                </label>
                <Input value={plannedDate} onChange={(e) => setPlannedDate(e.target.value)} />
              </div>
            )}
            <div className="sm:col-span-2">
              <label className="mb-1 block text-xs text-muted-foreground">
                Комментарий{" "}
                {(mode === "dismiss" || mode === "verify") && (
                  <span className="text-destructive">*</span>
                )}
              </label>
              <Textarea
                rows={3}
                placeholder="Опишите контекст принятого решения…"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
            </div>
          </div>

          <div className="flex gap-3 pt-1">
            <Button variant="outline" className="flex-1" onClick={() => onOpenChange(false)}>
              Отмена
            </Button>
            <Button className="flex-1" disabled={!canSave} onClick={handleSave}>
              {saveLabelByMode[mode]}
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
