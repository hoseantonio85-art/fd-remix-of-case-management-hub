import { Sparkles, ChevronRight, RefreshCw, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export function AssistantSummaryCard({
  onOpen,
  onRun,
  running,
  lastUpdatedLabel,
}: {
  onOpen: () => void;
  onRun: () => void;
  running?: boolean;
  lastUpdatedLabel?: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-white p-4 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
          <Sparkles className="h-4 w-4" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
            NORM AI · Оценка благонадёжности
          </div>
          <p className="mt-1 text-sm leading-snug text-foreground">
            Я проверил контрагента по 43 критериям благонадёжности. Выявлены критические маркеры по
            деловой репутации и признаки ограничений ФНС. За последний период появились 2 новых
            фактора, требующих проверки.
          </p>
          {lastUpdatedLabel && (
            <div className="mt-1.5 text-[11px] text-muted-foreground">{lastUpdatedLabel}</div>
          )}
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <Button size="sm" className="h-8 px-3 text-xs" onClick={onOpen}>
              Открыть оценку
              <ChevronRight className="h-3.5 w-3.5" />
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="h-8 px-3 text-xs"
              onClick={onRun}
              disabled={running}
            >
              {running ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" /> Запуск оценки…
                </>
              ) : (
                <>
                  <RefreshCw className="h-3.5 w-3.5" /> Запустить оценку
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
