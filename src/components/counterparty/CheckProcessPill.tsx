import { CheckCircle2, ClipboardList } from "lucide-react";

export type CheckProcessStatus = "running" | "done";

export function ChecksWidget({
  runningCount,
  doneCount,
  onClick,
}: {
  runningCount: number;
  doneCount: number;
  onClick: () => void;
}) {
  const total = runningCount + doneCount;
  const isEmpty = total === 0;
  const isRunning = runningCount > 0;
  const isDoneOnly = !isRunning && doneCount > 0;

  let subtitle = "Нет проверок";
  if (isRunning) subtitle = `${runningCount} в обработке`;
  else if (isDoneOnly)
    subtitle = `${doneCount} ${
      doneCount === 1 ? "результат готов" : doneCount < 5 ? "результата готовы" : "результатов готовы"
    }`;

  return (
    <button
      onClick={onClick}
      className="group inline-flex items-center gap-3 rounded-full border border-slate-200 bg-white py-1.5 pl-1.5 pr-4 shadow-sm transition hover:shadow-md"
    >
      <span className="relative flex h-9 w-9 shrink-0 items-center justify-center">
        {isEmpty && (
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-500">
            <ClipboardList className="h-5 w-5" />
          </span>
        )}
        {isDoneOnly && (
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 transition-all duration-300 animate-in zoom-in-95 fade-in">
            <CheckCircle2 className="h-5 w-5" />
          </span>
        )}
        {isRunning && (
          <svg className="h-9 w-9 -rotate-90" viewBox="0 0 36 36">
            <circle cx="18" cy="18" r="15" fill="none" stroke="hsl(var(--muted))" strokeWidth="3" />
            <circle
              cx="18"
              cy="18"
              r="15"
              fill="none"
              stroke="hsl(var(--primary))"
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray="94.2"
              strokeDashoffset="60"
              className="animate-[spin_1.2s_linear_infinite] origin-center"
              style={{ transformOrigin: "center" }}
            />
          </svg>
        )}
      </span>
      <span className="flex flex-col items-start leading-tight">
        <span className="text-[13px] font-semibold text-foreground">Проверки</span>
        <span className="text-[11px] text-muted-foreground">{subtitle}</span>
      </span>
    </button>
  );
}
