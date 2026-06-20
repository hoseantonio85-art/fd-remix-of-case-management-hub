import { Check, AlertTriangle } from "@/shared/ui";
import type { CollectionSubStep } from "@/domain/counterparty";
import type { StepAnim } from "./DebtSummaryCard";

const stages = [
  "Досудебное урегулирование",
  "Судебная работа",
  "Принудительное взыскание",
  "Завершение работы",
];

export function DebtStepper({
  steps,
  onAdvance,
  error,
  stepAnim,
}: {
  steps: CollectionSubStep[];
  onAdvance?: () => void;
  error?: string | null;
  stepAnim?: StepAnim;
}) {
  const current = steps.find((s) => s.status === "current");
  const animating = !!stepAnim;
  const isForward = stepAnim?.direction === "forward";
  const containerFlash = animating
    ? isForward
      ? "border-emerald-300 shadow-[0_0_0_4px_rgba(16,185,129,0.08)]"
      : "border-slate-300 shadow-[0_0_0_4px_rgba(100,116,139,0.08)]"
    : "border-border";
  return (
    <section>
      <div className="mb-3 flex items-center justify-between gap-2">
        <h3 className="text-base font-semibold">Работа с задолженностью</h3>
        {onAdvance && (
          <button
            onClick={onAdvance}
            className="rounded-md border border-border bg-white px-3 py-1.5 text-xs font-medium hover:bg-accent"
          >
            Перевести на следующий этап
          </button>
        )}
      </div>

      {error && (
        <div className="mb-3 rounded-md border border-amber-300 bg-amber-50 px-3 py-2 text-xs text-amber-900">
          {error}
        </div>
      )}

      <div
        className={`rounded-xl border bg-white p-5 transition-all duration-700 ${containerFlash}`}
      >
        <div className="space-y-5">
          {stages.map((stage) => {
            const stageSteps = steps.filter((s) => s.stage === stage);
            const stageDone = stageSteps.length > 0 && stageSteps.every((s) => s.status === "done");
            const stageActive = stageSteps.some((s) => s.status === "current");
            return (
              <div key={stage}>
                <div className="mb-2 flex items-center gap-2">
                  <div
                    className={`h-1.5 w-1.5 rounded-full ${
                      stageDone || stageActive ? "bg-primary" : "bg-muted-foreground/30"
                    }`}
                  />
                  <div
                    className={`text-[11px] font-semibold uppercase tracking-wide ${
                      stageActive ? "text-foreground" : "text-muted-foreground"
                    }`}
                  >
                    {stage}
                  </div>
                </div>
                <div className="ml-1 space-y-1.5 border-l border-border pl-7">
                  {stageSteps.map((s) => {
                    const isCurrent = s.status === "current";
                    const animateThis = isCurrent && animating;
                    const globalIdx = steps.findIndex((x) => x.id === s.id);
                    const num = globalIdx + 1;
                    return (
                      <div key={s.id} className="relative">
                        <div className="absolute -left-[34px] top-0.5">
                          {isCurrent ? (
                            <div
                              key={`cur-${stepAnim?.tick ?? "static"}-${s.id}`}
                              className={`flex h-6 w-6 items-center justify-center rounded-full border-2 border-emerald-500 bg-emerald-50 text-[10px] font-semibold text-emerald-700 transition-transform duration-500 ${animateThis ? "scale-125" : "scale-100"}`}
                            >
                              {num}
                            </div>
                          ) : (
                            <div className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-border bg-white text-[10px] font-semibold text-muted-foreground">
                              {num}
                            </div>
                          )}
                        </div>
                        <div
                          className={`rounded-md px-2.5 py-1.5 ${
                            isCurrent
                              ? s.overdue
                                ? "border border-amber-300 bg-amber-50/50"
                                : "border border-primary/20 bg-primary/5"
                              : ""
                          }`}
                        >
                          <div
                            key={`t-${s.id}-${isCurrent ? (stepAnim?.tick ?? "static") : "static"}`}
                            className={`text-sm ${
                              s.status === "upcoming"
                                ? "text-muted-foreground"
                                : "font-medium text-foreground"
                            } ${animateThis ? "animate-fade-in" : ""}`}
                          >
                            {s.title}
                          </div>
                          {isCurrent && (
                            <div className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-muted-foreground">
                              {s.startDate && (
                                <span>
                                  Старт: <b className="text-foreground">{s.startDate}</b>
                                </span>
                              )}
                              {s.sla && (
                                <span>
                                  SLA: <b className="text-foreground">{s.sla}</b>
                                </span>
                              )}
                              {s.plannedDate && (
                                <span>
                                  План: <b className="text-foreground">{s.plannedDate}</b>
                                </span>
                              )}
                              {s.overdue ? (
                                <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 font-medium text-amber-900">
                                  <AlertTriangle className="h-3 w-3" /> Срок истёк
                                </span>
                              ) : (
                                <span className="rounded-full bg-primary/10 px-2 py-0.5 font-medium text-primary">
                                  В работе
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {current?.nextAction && (
          <div className="mt-4 rounded-md bg-muted/50 px-3 py-2 text-xs">
            <span className="text-muted-foreground">Следующее действие: </span>
            <span className="font-medium">{current.nextAction}</span>
          </div>
        )}
      </div>
    </section>
  );
}
