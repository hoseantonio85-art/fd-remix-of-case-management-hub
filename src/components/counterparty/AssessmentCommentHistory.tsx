import { History } from "lucide-react";
import { InModalDrawer } from "./InModalDrawer";

export type CommentRecord = {
  id: string;
  dateTime: string;
  author: string;
  groupTitles: string[];
  comment: string;
};

export function CommentHistoryEntry({
  count,
  lastDate,
  onOpen,
}: {
  count: number;
  lastDate: string;
  onOpen: () => void;
}) {
  const sub =
    count === 0
      ? "Комментариев пока нет"
      : `${count} ${
          count === 1 ? "комментарий" : "комментариев"
        } · последнее изменение ${lastDate.toLowerCase()}`;
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
        <span className="block text-sm font-semibold text-foreground">
          История оценки
        </span>
        <span className="block text-[11px] text-muted-foreground">{sub}</span>
      </span>
    </div>
  );
}

export function CommentHistoryDrawer({
  open,
  onOpenChange,
  records,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  records: CommentRecord[];
}) {
  return (
    <InModalDrawer open={open} onOpenChange={onOpenChange}>
      <div className="flex min-h-full flex-col">
        <div className="flex-1 overflow-y-auto p-6">
          <h2 className="text-lg font-semibold">История оценки</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Комментарии и изменения по результатам оценки контрагента.
          </p>

          {records.length === 0 ? (
            <div className="mt-6 rounded-2xl border border-dashed border-slate-200 bg-white p-6 text-center text-sm text-muted-foreground">
              Комментариев пока нет
            </div>
          ) : (
            <ol className="mt-6 space-y-4">
              {records.map((r) => (
                <li
                  key={r.id}
                  className="rounded-2xl border border-slate-200 bg-white p-4"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
                    <span>{r.dateTime}</span>
                    <span>{r.author}</span>
                  </div>
                  <div className="mt-3">
                    <div className="text-[11px] uppercase tracking-wide text-muted-foreground">
                      Группы оценки
                    </div>
                    <div className="mt-1 text-sm text-foreground">
                      {r.groupTitles.join(", ")}
                    </div>
                  </div>
                  <div className="mt-3">
                    <div className="text-[11px] uppercase tracking-wide text-muted-foreground">
                      Комментарий
                    </div>
                    <div className="mt-1 rounded-xl bg-slate-50 px-3 py-2 text-sm text-foreground">
                      {r.comment}
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          )}
        </div>
      </div>
    </InModalDrawer>
  );
}
