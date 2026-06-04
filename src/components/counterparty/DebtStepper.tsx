import { Check, AlertTriangle } from "lucide-react";
import type { CollectionSubStep } from "@/lib/mock-data";

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
  highlightStepId,
}: {
  steps: CollectionSubStep[];
  onAdvance?: () => void;
  error?: string | null;
  highlightStepId?: string | null;
}) {
  const current = steps.find((s) => s.status === "current");
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

      <div className="rounded-xl border border-border bg-white p-5">
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
                <div className="ml-1 space-y-1.5 border-l border-border pl-5">
                  {stageSteps.map((s) => (
                    <div key={s.id} className="relative">
                      <div className="absolute -left-[26px] top-1.5">
                        {s.status === "done" ? (
                          <div className="flex h-4 w-4 items-center justify-center rounded-full bg-primary text-primary-foreground">
                            <Check className="h-2.5 w-2.5" />
                          </div>
                        ) : s.status === "current" ? (
                          <div
                            className={`h-4 w-4 rounded-full border-2 ${
                              s.overdue ? "border-amber-500 bg-amber-100" : "border-primary bg-primary/20"
                            }`}
                          />
                        ) : (
                          <div className="h-4 w-4 rounded-full border-2 border-border bg-white" />
                        )}
                      </div>
                      <div
                        className={`rounded-md px-2.5 py-1.5 ${
                          s.status === "current"
                            ? s.overdue
                              ? "border border-amber-300 bg-amber-50/50"
                              : "border border-primary/20 bg-primary/5"
                            : ""
                        }`}
                      >
                        <div className="flex flex-wrap items-center gap-2">
                          <div
                            className={`text-sm ${
                              s.status === "upcoming"
                                ? "text-muted-foreground"
                                : "font-medium text-foreground"
                            }`}
                          >
                            {s.title}
                          </div>
                          {highlightStepId === s.id && s.status === "current" && (
                            <span className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[10px] font-medium text-emerald-700">
                              Обновлено после решения по риску
                            </span>
                          )}
                        </div>
                        {s.status === "current" && (
                          <div className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-muted-foreground">
                            {s.startDate && <span>Старт: <b className="text-foreground">{s.startDate}</b></span>}
                            {s.sla && <span>SLA: <b className="text-foreground">{s.sla}</b></span>}
                            {s.plannedDate && <span>План: <b className="text-foreground">{s.plannedDate}</b></span>}
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
                  ))}
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
