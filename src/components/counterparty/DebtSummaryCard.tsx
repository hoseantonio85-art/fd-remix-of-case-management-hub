import { AlertTriangle, Info } from "lucide-react";
import type { CollectionSubStep } from "@/lib/mock-data";

export function DebtSummaryCard({
  steps,
  onOpenDetails,
}: {
  steps: CollectionSubStep[];
  onOpenDetails: () => void;
}) {
  const currentIdx = steps.findIndex((s) => s.status === "current");
  const items: { step: CollectionSubStep; kind: "current" | "next" }[] = [];
  if (currentIdx !== -1) {
    items.push({ step: steps[currentIdx], kind: "current" });
    for (let i = currentIdx + 1; i < steps.length && items.length < 3; i++) {
      items.push({ step: steps[i], kind: "next" });
    }
  } else {
    steps.slice(0, 3).forEach((s) => items.push({ step: s, kind: "next" }));
  }

  return (
    <div className="rounded-2xl border border-border bg-white p-5">
      <div className="mb-4 flex items-center gap-1.5">
        <h3 className="text-sm font-semibold">Работа с задолженностью</h3>
        <Info className="h-3.5 w-3.5 text-muted-foreground" />
      </div>

      <div className="space-y-0">
        {items.map((it, i) => {
          const isCurrent = it.kind === "current";
          const overdue = isCurrent && it.step.overdue;
          const isLast = i === items.length - 1;
          return (
            <div key={it.step.id} className="relative flex gap-3">
              <div className="flex flex-col items-center">
                <div
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 text-[11px] font-semibold ${
                    isCurrent
                      ? overdue
                        ? "border-amber-500 text-amber-700"
                        : "border-rose-400 text-rose-600"
                      : "border-border text-muted-foreground"
                  }`}
                >
                  {i + 1}
                </div>
                {!isLast && <div className="my-1 w-px flex-1 bg-border" />}
              </div>
              <div className={`flex-1 ${isLast ? "" : "pb-4"}`}>
                <div
                  className={`text-sm leading-tight ${
                    isCurrent ? "font-semibold text-foreground" : "text-muted-foreground"
                  }`}
                >
                  {it.step.title}
                </div>
                <div className="mt-1 text-[12px] text-muted-foreground">
                  {isCurrent ? (
                    overdue ? (
                      <span className="inline-flex items-center gap-1 text-amber-700">
                        <AlertTriangle className="h-3 w-3" /> Срок истёк
                      </span>
                    ) : it.step.plannedDate ? (
                      <>Дедлайн: {it.step.plannedDate}</>
                    ) : it.step.sla ? (
                      <>SLA: {it.step.sla}</>
                    ) : (
                      "В работе"
                    )
                  ) : i === 1 ? (
                    it.step.sla ? `План: ${it.step.sla}` : "Следующий этап"
                  ) : (
                    "Далее"
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <button
        onClick={onOpenDetails}
        className="mt-4 w-full rounded-lg border border-border bg-white px-3 py-2 text-sm font-medium text-foreground transition hover:bg-muted/40"
      >
        Подробнее
      </button>
    </div>
  );
}
