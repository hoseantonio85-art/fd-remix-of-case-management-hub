import { Download, FileClock, FileText, History } from "@/shared/ui";
import { Button } from "@/shared/ui";
import { cn } from "@/lib/utils";
import { InModalDrawer } from "./InModalDrawer";
import { CounterpartyStatusBadge } from "./CounterpartyStatusBadge";

// ---------- Types ----------

export type CorrectionRecord = {
  id: string;
  dateTime: string; // e.g. "Сегодня, 15:42" or full date
  author: string;
  fromTag: string;
  toTag: string;
  comment: string;
  monitoringDate: string;
};

export type DownloadRecord = {
  id: string;
  dateTime: string;
  tag: string;
  fileName: string;
};

// ---------- Correction history ----------

export function CorrectionHistoryEntry({
  count,
  lastDate,
  onOpen,
}: {
  count: number;
  lastDate: string;
  onOpen: () => void;
}) {
  if (count === 0) return null;
  const label = count === 1 ? "1 корректировка" : `${count} корректировки`;
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onOpen}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onOpen();
        }
      }}
      className="group flex w-full cursor-pointer items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3 text-left transition hover:bg-slate-50"
    >
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-700">
        <History className="h-4 w-4" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-semibold text-foreground">История оценки</span>
        <span className="block text-[11px] text-muted-foreground">
          {label} · последнее изменение {lastDate.toLowerCase()}
        </span>
      </span>
    </div>
  );
}

export function CorrectionHistoryDrawer({
  open,
  onOpenChange,
  records,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  records: CorrectionRecord[];
}) {
  return (
    <InModalDrawer open={open} onOpenChange={onOpenChange}>
      <div className="flex min-h-full flex-col">
        <div className="flex-1 p-6">
          <h2 className="pr-16 text-lg font-semibold">История оценки</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Ручные корректировки статуса контрагента и причины изменений.
          </p>

          <ol className="mt-6 space-y-4">
            {records.map((r) => (
              <li key={r.id} className="rounded-2xl border border-slate-200 bg-white p-4">
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
                  <span>{r.dateTime}</span>
                  <span>{r.author}</span>
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <CounterpartyStatusBadge tag={r.fromTag} size="compact" />
                  <span className="text-muted-foreground">→</span>
                  <CounterpartyStatusBadge tag={r.toTag} size="compact" />
                </div>
                <p className="mt-3 text-sm text-foreground">{r.comment}</p>
                <div className="mt-3 rounded-xl bg-slate-50 px-3 py-2">
                  <div className="text-[11px] uppercase tracking-wide text-muted-foreground">
                    Возврат на мониторинг
                  </div>
                  <div className="mt-0.5 text-sm font-medium text-foreground">
                    {r.monitoringDate}
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground">
                    С этой даты агент возобновит мониторинг и будет обновлять оценку по новым
                    данным.
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </InModalDrawer>
  );
}

// ---------- Download history ----------

export function DownloadHistoryEntry({
  count,
  lastDate,
  onOpen,
}: {
  count: number;
  lastDate: string | null;
  onOpen: () => void;
}) {
  const sub =
    count === 0
      ? "Отчёты ещё не скачивали"
      : `${count} ${count === 1 ? "файл" : "файла"} · последний скачан ${(
          lastDate ?? ""
        ).toLowerCase()}`;
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onOpen}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onOpen();
        }
      }}
      className="group flex w-full cursor-pointer items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3 text-left transition hover:bg-slate-50"
    >
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-700">
        <FileClock className="h-4 w-4" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-semibold text-foreground">История скачивания</span>
        <span className="block text-[11px] text-muted-foreground">{sub}</span>
      </span>
    </div>
  );
}

export function DownloadHistoryDrawer({
  open,
  onOpenChange,
  records,
  onRedownload,
  onDownloadAll,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  records: DownloadRecord[];
  onRedownload: (r: DownloadRecord) => void;
  onDownloadAll?: () => void;
}) {
  return (
    <InModalDrawer open={open} onOpenChange={onOpenChange}>
      <div className="flex h-full min-h-full flex-col">
        <div className="flex-1 overflow-y-auto p-6">
          <div className="pr-16">
            <h2 className="text-lg font-semibold">История скачивания</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Скачанные отчёты по оценке контрагента.
            </p>
          </div>

          {records.length === 0 ? (
            <div className="mt-6 rounded-2xl border border-dashed border-slate-200 bg-white p-6 text-center text-sm text-muted-foreground">
              Отчёты ещё не скачивали
            </div>
          ) : (
            <ol className="mt-6 space-y-3">
              {records.map((r) => (
                <li
                  key={r.id}
                  className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white p-3"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-700">
                    <FileText className="h-4 w-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <CounterpartyStatusBadge tag={r.tag} size="compact" />
                      <span className="text-xs text-muted-foreground">{r.dateTime}</span>
                    </div>
                    <div className="mt-1 truncate text-sm font-medium text-foreground">
                      {r.fileName}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="shrink-0 gap-1 text-xs"
                    onClick={() => onRedownload(r)}
                  >
                    <Download className="h-3.5 w-3.5" /> Скачать повторно
                  </Button>
                </li>
              ))}
            </ol>
          )}
        </div>
        {onDownloadAll ? (
          <div className="sticky bottom-0 border-t border-slate-200 bg-white p-4">
            <Button
              className={cn(
                "w-full gap-2",
                records.length === 0 && "opacity-50 cursor-not-allowed",
              )}
              disabled={records.length === 0}
              onClick={onDownloadAll}
            >
              <Download className="h-4 w-4" /> Скачать весь отчёт
            </Button>
          </div>
        ) : null}
      </div>
    </InModalDrawer>
  );
}
