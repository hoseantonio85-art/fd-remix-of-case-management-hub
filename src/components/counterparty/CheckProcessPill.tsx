import { CheckCircle2 } from "lucide-react";

export type CheckProcessStatus = "running" | "done";

export function CheckProcessPill({
  status,
  onClick,
}: {
  status: CheckProcessStatus;
  onClick: () => void;
}) {
  const isDone = status === "done";
  return (
    <button
      onClick={onClick}
      className="group inline-flex items-center gap-3 rounded-full border border-slate-200 bg-white py-1.5 pl-1.5 pr-4 shadow-sm transition hover:shadow-md animate-in fade-in zoom-in-95 duration-300"
    >
      <span className="relative flex h-9 w-9 shrink-0 items-center justify-center">
        {isDone ? (
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 transition-all duration-300">
            <CheckCircle2 className="h-5 w-5" />
          </span>
        ) : (
          <>
            <svg className="h-9 w-9 -rotate-90" viewBox="0 0 36 36">
              <circle
                cx="18"
                cy="18"
                r="15"
                fill="none"
                stroke="hsl(var(--muted))"
                strokeWidth="3"
              />
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
          </>
        )}
      </span>
      <span className="flex flex-col items-start leading-tight">
        <span className="text-[13px] font-semibold text-foreground transition-opacity duration-300">
          {isDone ? "Проверка завершена" : "Проверка запущена"}
        </span>
        <span className="text-[11px] text-muted-foreground transition-opacity duration-300">
          {isDone ? "Результат готов" : "Идёт обработка"}
        </span>
      </span>
    </button>
  );
}
