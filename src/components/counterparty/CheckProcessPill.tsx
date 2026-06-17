import { useEffect, useRef, useState } from "react";
import { CheckCircle2, ClipboardList, Sparkles } from "lucide-react";

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

  const [pulse, setPulse] = useState(false);
  const prevTotal = useRef(total);
  useEffect(() => {
    if (total !== prevTotal.current) {
      prevTotal.current = total;
      setPulse(true);
      const t = setTimeout(() => setPulse(false), 900);
      return () => clearTimeout(t);
    }
  }, [total]);

  let subtitle = "Нет проверок";
  if (isRunning) subtitle = `${runningCount} в обработке`;
  else if (isDoneOnly)
    subtitle = `${doneCount} ${
      doneCount === 1
        ? "результат готов"
        : doneCount < 5
          ? "результата готовы"
          : "результатов готовы"
    }`;

  return (
    <button
      onClick={onClick}
      className={`group inline-flex items-center gap-3 rounded-full bg-white py-2 pl-2 pr-5 shadow-sm transition hover:shadow-md ${
        pulse ? "ring-2 ring-primary/40 ring-offset-2 scale-105" : ""
      }`}
      style={{ transition: "box-shadow 0.2s, transform 0.3s, ring 0.3s" }}
    >
      <span className="relative flex h-10 w-10 shrink-0 items-center justify-center">
        {isEmpty && (
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-500">
            <ClipboardList className="h-5 w-5" />
          </span>
        )}

        {isDoneOnly && (
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 transition-all duration-300 animate-in zoom-in-95 fade-in">
            <CheckCircle2 className="h-5 w-5" />
          </span>
        )}

        {isRunning && (
          <span className="relative flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
            <svg
              className="absolute inset-0 h-10 w-10 animate-spin"
              viewBox="0 0 40 40"
            >
              <defs>
                <linearGradient
                  id="checkGradient"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="0%"
                >
                  <stop offset="0%" stopColor="hsl(var(--primary))" />
                  <stop offset="100%" stopColor="#8b5cf6" />
                </linearGradient>
              </defs>
              <circle
                cx="20"
                cy="20"
                r="15"
                fill="none"
                stroke="#E5EDFF"
                strokeWidth="3"
              />
              <circle
                cx="20"
                cy="20"
                r="15"
                fill="none"
                stroke="url(#checkGradient)"
                strokeWidth="3"
                strokeLinecap="round"
                strokeDasharray="94.2"
                strokeDashoffset="55"
              />
            </svg>
            <Sparkles className="relative h-4 w-4 text-primary" />
          </span>
        )}
      </span>

      <span className="flex flex-col items-start leading-tight">
        <span className="text-[13px] font-semibold text-foreground">
          Проверки
        </span>
        <span className="text-[11px] text-muted-foreground">{subtitle}</span>
      </span>
    </button>
  );
}
