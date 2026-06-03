import { Check, AlertTriangle, Circle } from "lucide-react";
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
}: {
  steps: CollectionSubStep[];
  onAdvance?: () => void;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold">Работа с задолженностью</h3>
        {onAdvance && (
          <button
            onClick={onAdvance}
            className="rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-medium hover:bg-accent"
          >
            Перевести на следующий этап
          </button>
        )}
      </div>

      <div className="space-y-6">
        {stages.map((stage) => {
          const stageSteps = steps.filter((s) => s.stage === stage);
          const stageDone = stageSteps.every((s) => s.status === "done");
          const stageActive = stageSteps.some((s) => s.status === "current");
          return (
            <div key={stage}>
              <div className="mb-2 flex items-center gap-2">
                <div
                  className={`h-2 w-2 rounded-full ${
                    stageDone ? "bg-primary" : stageActive ? "bg-primary" : "bg-muted-foreground/30"
                  }`}
                />
                <div
                  className={`text-xs font-semibold uppercase tracking-wide ${
                    stageActive ? "text-foreground" : "text-muted-foreground"
                  }`}
                >
                  {stage}
                </div>
              </div>
              <div className="ml-1 space-y-2 border-l border-border pl-5">
                {stageSteps.map((s) => (
                  <div key={s.id} className="relative">
                    <div className="absolute -left-[27px] top-1.5">
                      {s.status === "done" ? (
                        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground">
                          <Check className="h-3 w-3" />
                        </div>
                      ) : s.status === "current" ? (
                        <div
                          className={`flex h-5 w-5 items-center justify-center rounded-full ${
                            s.overdue ? "bg-destructive text-white" : "bg-primary text-primary-foreground"
                          }`}
                        >
                          {s.overdue ? <AlertTriangle className="h-3 w-3" /> : <Circle className="h-2 w-2 fill-current" />}
                        </div>
                      ) : (
                        <div className="h-5 w-5 rounded-full border-2 border-border bg-background" />
                      )}
                    </div>
                    <div
                      className={`rounded-lg px-3 py-2 ${
                        s.status === "current"
                          ? s.overdue
                            ? "bg-destructive/5 border border-destructive/30"
                            : "bg-primary/5 border border-primary/30"
                          : ""
                      }`}
                    >
                      <div
                        className={`text-sm ${
                          s.status === "upcoming" ? "text-muted-foreground" : "text-foreground font-medium"
                        }`}
                      >
                        {s.title}
                      </div>
                      {s.status === "current" && (
                        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                          <span>Старт: <b className="text-foreground">{s.startDate}</b></span>
                          <span>SLA: <b className="text-foreground">{s.sla}</b></span>
                          <span>План: <b className="text-foreground">{s.plannedDate}</b></span>
                          <span
                            className={`rounded-full px-2 py-0.5 ${
                              s.overdue
                                ? "bg-destructive/10 text-destructive font-medium"
                                : "bg-primary/10 text-primary font-medium"
                            }`}
                          >
                            {s.overdue ? "Просрочено" : "В работе"}
                          </span>
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
    </div>
  );
}
