import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { CheckCircle2, FileText, Loader2 } from "lucide-react";
import type { CheckProcessStatus } from "./CheckProcessPill";

export type CheckProcess = {
  inn: string;
  fileNames: string[];
  status: CheckProcessStatus;
};

const STAGES = [
  "Данные получены",
  "Документы анализируются",
  "Оценка формируется",
];

export function CheckProcessDrawer({
  open,
  onOpenChange,
  process,
  onOpenAssessment,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  process: CheckProcess | null;
  onOpenAssessment: () => void;
}) {
  if (!process) return null;
  const isDone = process.status === "done";
  const activeStage = isDone ? STAGES.length - 1 : 1;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="flex w-full flex-col gap-0 p-0 sm:max-w-md">
        <div className="border-b border-border px-6 pt-6 pb-4">
          <div className="text-base font-semibold tracking-tight">Проверка контрагента</div>
          <div className="mt-1 text-[12px] text-muted-foreground">ИНН {process.inn}</div>
        </div>

        <div className="flex-1 space-y-5 overflow-y-auto px-6 py-5">
          <div>
            <div className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
              Статус
            </div>
            <div className="mt-1.5 inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-[12px] font-medium text-slate-700">
              {isDone ? (
                <>
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                  Проверка завершена
                </>
              ) : (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />
                  На проверке
                </>
              )}
            </div>
          </div>

          <div>
            <div className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
              Этапы
            </div>
            <ol className="mt-2 space-y-2">
              {STAGES.map((s, i) => {
                const done = isDone || i < activeStage;
                const active = !isDone && i === activeStage;
                return (
                  <li
                    key={s}
                    className={`flex items-center gap-2.5 rounded-lg border px-3 py-2 text-[13px] transition ${
                      active
                        ? "border-primary/30 bg-primary/5 text-foreground animate-pulse"
                        : done
                        ? "border-emerald-200 bg-emerald-50/60 text-foreground"
                        : "border-border bg-white text-muted-foreground"
                    }`}
                  >
                    <span
                      className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-semibold ${
                        done
                          ? "bg-emerald-500 text-white"
                          : active
                          ? "bg-primary text-primary-foreground"
                          : "bg-slate-200 text-slate-500"
                      }`}
                    >
                      {done ? <CheckCircle2 className="h-3 w-3" /> : i + 1}
                    </span>
                    {s}
                  </li>
                );
              })}
            </ol>
          </div>

          {process.fileNames.length > 0 && (
            <div>
              <div className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                Документы
              </div>
              <ul className="mt-2 space-y-1.5">
                {process.fileNames.map((n, i) => (
                  <li
                    key={i}
                    className="flex items-center gap-2 rounded-lg border border-border bg-white px-2.5 py-1.5 text-[12px]"
                  >
                    <FileText className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                    <span className="truncate">{n}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {!isDone && (
            <p className="text-[12px] text-muted-foreground">
              Обычно проверка занимает до 10 минут. Уведомление придёт на почту.
            </p>
          )}
          {isDone && (
            <p className="text-[12px] text-muted-foreground">
              Результат готов. Откройте оценку, чтобы посмотреть детали.
            </p>
          )}
        </div>

        {isDone && (
          <div className="shrink-0 border-t border-border bg-white px-6 py-3">
            <Button onClick={onOpenAssessment} className="w-full rounded-full">
              Открыть оценку
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
