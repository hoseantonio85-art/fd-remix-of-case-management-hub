import { useEffect, useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle, ShieldCheck, Search, ChevronRight, Pencil, CheckCircle2, XCircle } from "lucide-react";
import type { Counterparty, Contract, RiskSignal, CollectionSubStep } from "@/lib/mock-data";
import { RiskDrawer } from "./RiskDrawer";
import { ContractDrawer } from "./ContractDrawer";
import { DebtStepper } from "./DebtStepper";

export function CounterpartyModal({
  counterparty,
  open,
  onOpenChange,
}: {
  counterparty: Counterparty | null;
  open: boolean;
  onOpenChange: (o: boolean) => void;
}) {
  const [risks, setRisks] = useState<RiskSignal[]>([]);
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [steps, setSteps] = useState<CollectionSubStep[]>([]);
  const [editing, setEditing] = useState<RiskSignal | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [contractDrawer, setContractDrawer] = useState<Contract | null>(null);

  useEffect(() => {
    if (counterparty && open) {
      setRisks(counterparty.risks.map((r) => ({ ...r })));
      setContracts(counterparty.contracts.map((c) => ({ ...c })));
      setSteps(counterparty.collection.map((s) => ({ ...s })));
    }
  }, [counterparty, open]);

  if (!counterparty) return null;

  const pending = risks.filter((r) => r.status === "pending");
  const decided = risks.filter((r) => r.status === "confirmed");
  const dismissed = risks.filter((r) => r.status === "dismissed");

  const allMeasures = decided.flatMap((r) => r.decision?.measures ?? []);

  const openConfirm = (r: RiskSignal) => {
    setEditing(r);
    setDrawerOpen(true);
  };

  const handleSave = (riskId: string, payload: { date: string; measures: string[]; comment: string }) => {
    setRisks((prev) =>
      prev.map((r) => (r.id === riskId ? { ...r, status: "confirmed", decision: payload } : r)),
    );
  };

  const handleDismiss = (r: RiskSignal) => {
    setRisks((prev) =>
      prev.map((x) =>
        x.id === r.id
          ? {
              ...x,
              status: "dismissed",
              dismissal: { date: new Date().toLocaleDateString("ru-RU"), comment: "Снято по результатам проверки" },
            }
          : x,
      ),
    );
  };

  const advanceStage = () => {
    setSteps((prev) => {
      const idx = prev.findIndex((s) => s.status === "current");
      if (idx === -1) return prev;
      const next = [...prev];
      next[idx] = { ...next[idx], status: "done", overdue: false };
      if (next[idx + 1]) {
        next[idx + 1] = {
          ...next[idx + 1],
          status: "current",
          startDate: new Date().toLocaleDateString("ru-RU"),
          sla: "7 дней",
          plannedDate: new Date(Date.now() + 7 * 86400000).toLocaleDateString("ru-RU"),
          overdue: false,
        };
      }
      return next;
    });
  };

  const advanceContractStage = (id: string) => {
    const stageOrder = [
      "Досудебное урегулирование",
      "Судебная работа",
      "Принудительное взыскание",
      "Завершение работы",
    ];
    setContracts((prev) =>
      prev.map((c) => {
        if (c.id !== id) return c;
        const i = stageOrder.indexOf(c.collectionStage ?? "");
        return { ...c, collectionStage: stageOrder[Math.min(i + 1, stageOrder.length - 1)] || stageOrder[0] };
      }),
    );
  };

  const addOverdue = (id: string, amount: number, days: number) => {
    setContracts((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, overdue: c.overdue + amount, overdueDays: Math.max(c.overdueDays, days) } : c,
      ),
    );
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-h-[92vh] w-[96vw] max-w-5xl gap-0 overflow-y-auto p-0">
          {/* Header */}
          <div className="bg-gradient-to-b from-destructive/5 to-transparent px-8 pt-8 pb-6">
            <div className="inline-flex items-center rounded-full bg-destructive/10 px-2.5 py-1 text-xs text-destructive">
              {counterparty.tag}
            </div>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight">{counterparty.name}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{counterparty.inn}</p>

            <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-border bg-card p-4">
                <div className="text-sm text-muted-foreground">Общая задолженность</div>
                <div className="mt-1 text-2xl font-semibold">{counterparty.totalDebt}</div>
              </div>
              <div className="rounded-xl border border-border bg-card p-4">
                <div className="text-sm text-muted-foreground">Просроченная задолженность</div>
                <div className="mt-1 text-2xl font-semibold text-destructive">{counterparty.overdueDebt}</div>
              </div>
            </div>
          </div>

          <div className="space-y-6 px-8 pb-8">
            {/* Section 1: Requires decision */}
            <section>
              <div className="mb-3 flex items-center gap-2">
                <h3 className="text-lg font-semibold">Требуют решения</h3>
                <span className="rounded-full bg-destructive/10 px-2 py-0.5 text-xs font-medium text-destructive">
                  {pending.length}
                </span>
              </div>
              {pending.length === 0 ? (
                <div className="rounded-xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
                  Активных сигналов нет — все риски обработаны
                </div>
              ) : (
                <div className="space-y-3">
                  {pending.map((r) => (
                    <div key={r.id} className="rounded-xl border border-border bg-card p-4">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div className="flex items-start gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-destructive/10 text-destructive">
                            <AlertTriangle className="h-5 w-5" />
                          </div>
                          <div>
                            <div className="font-semibold">{r.type}</div>
                            <div className="mt-0.5 text-sm text-muted-foreground">{r.description}</div>
                            <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground">
                              <span>Источник: <b className="text-foreground">{r.source}</b></span>
                              <span>Обнаружено: <b className="text-foreground">{r.detectedAt}</b></span>
                            </div>
                          </div>
                        </div>
                        <span className="rounded-full bg-muted px-2.5 py-1 text-xs">Требует проверки</span>
                      </div>
                      <div className="mt-4 flex flex-wrap gap-2">
                        <Button size="sm" onClick={() => openConfirm(r)}>
                          <CheckCircle2 className="mr-1.5 h-4 w-4" /> Подтвердить риск
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleDismiss(r)}>
                          <XCircle className="mr-1.5 h-4 w-4" /> Снять риск
                        </Button>
                        <Button size="sm" variant="ghost">
                          <Search className="mr-1.5 h-4 w-4" /> Доп. проверка
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Section 2: Decisions */}
            {(decided.length > 0 || dismissed.length > 0) && (
              <section>
                <div className="mb-3 flex items-center gap-2">
                  <h3 className="text-lg font-semibold">Принятые решения</h3>
                  <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                    {decided.length + dismissed.length}
                  </span>
                </div>
                <div className="space-y-3">
                  {decided.map((r) => (
                    <div key={r.id} className="rounded-xl border border-primary/30 bg-primary/5 p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
                            <ShieldCheck className="h-5 w-5" />
                          </div>
                          <div>
                            <div className="font-semibold">{r.type}</div>
                            <div className="mt-0.5 text-xs text-muted-foreground">
                              Подтверждено · {r.decision?.date}
                            </div>
                            <div className="mt-2 flex flex-wrap gap-1.5">
                              {r.decision?.measures.map((m) => (
                                <span
                                  key={m}
                                  className="rounded-full bg-background px-2.5 py-1 text-xs font-medium text-foreground border border-border"
                                >
                                  {m}
                                </span>
                              ))}
                            </div>
                            {r.decision?.comment && (
                              <div className="mt-2 text-sm text-muted-foreground italic">
                                «{r.decision.comment}»
                              </div>
                            )}
                          </div>
                        </div>
                        <Button size="sm" variant="ghost" onClick={() => openConfirm(r)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  {dismissed.map((r) => (
                    <div key={r.id} className="rounded-xl border border-border bg-muted/40 p-4">
                      <div className="flex items-start gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
                          <XCircle className="h-5 w-5" />
                        </div>
                        <div>
                          <div className="font-semibold text-muted-foreground">{r.type}</div>
                          <div className="mt-0.5 text-xs text-muted-foreground">
                            Риск снят · {r.dismissal?.date}
                          </div>
                          <div className="mt-1 text-sm italic text-muted-foreground">
                            {r.dismissal?.comment}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Section 3: Debt collection */}
            <DebtStepper steps={steps} onAdvance={advanceStage} />

            {/* Section 4: Contracts */}
            <section>
              <div className="mb-3 flex items-center gap-2">
                <h3 className="text-lg font-semibold">Договоры</h3>
                <span className="text-sm text-muted-foreground">{contracts.length}</span>
              </div>
              <div className="overflow-hidden rounded-xl border border-border">
                {contracts.map((c, i) => {
                  const overdue = c.overdue > 0;
                  return (
                    <button
                      key={c.id}
                      onClick={() => setContractDrawer(c)}
                      className={`flex w-full items-center gap-4 px-4 py-3 text-left transition hover:bg-accent/40 ${
                        i > 0 ? "border-t border-border" : ""
                      }`}
                    >
                      <div className="flex-1 min-w-0 grid grid-cols-2 gap-3 sm:grid-cols-4">
                        <div>
                          <div className="text-xs text-muted-foreground">Договор</div>
                          <div className="text-sm font-medium">{c.number}</div>
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground">Задолженность</div>
                          <div className="text-sm font-medium">{c.debt.toFixed(1)} млн. ₽</div>
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground">Просроченная</div>
                          <div className={`text-sm font-medium ${overdue ? "text-destructive" : ""}`}>
                            {overdue ? `${c.overdue.toFixed(1)} млн. ₽ · ${c.overdueDays} дн.` : "нет"}
                          </div>
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground">Этап взыскания</div>
                          <div className="text-sm font-medium">{c.collectionStage ?? "—"}</div>
                        </div>
                      </div>
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </button>
                  );
                })}
              </div>
            </section>
          </div>
        </DialogContent>
      </Dialog>

      <RiskDrawer
        risk={editing}
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        onSave={handleSave}
      />

      <ContractDrawer
        contract={contractDrawer}
        measures={allMeasures}
        open={!!contractDrawer}
        onOpenChange={(o) => !o && setContractDrawer(null)}
        onAddOverdue={(id, amt, days) => {
          addOverdue(id, amt, days);
          setContractDrawer((prev) => (prev ? { ...prev, overdue: prev.overdue + amt, overdueDays: Math.max(prev.overdueDays, days) } : prev));
        }}
        onAdvanceStage={(id) => {
          advanceContractStage(id);
          setContractDrawer((prev) => {
            if (!prev) return prev;
            const stages = ["Досудебное урегулирование", "Судебная работа", "Принудительное взыскание", "Завершение работы"];
            const i = stages.indexOf(prev.collectionStage ?? "");
            return { ...prev, collectionStage: stages[Math.min(i + 1, stages.length - 1)] || stages[0] };
          });
        }}
      />
    </>
  );
}
