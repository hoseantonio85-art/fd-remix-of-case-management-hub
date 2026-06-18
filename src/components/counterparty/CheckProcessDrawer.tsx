import { Sheet, SheetContent } from "@/components/ui/sheet";
import { CheckCircle2, Loader2, ClipboardList } from "lucide-react";

export type CheckProcessStatus = "running" | "done";
export type CheckRecordType = "counterparty" | "contract" | "complex";

export type CheckRecord = {
  id: string;
  inn?: string;
  fileNames: string[];
  status: CheckProcessStatus;
  createdAt: number;
  type?: CheckRecordType;
};

function formatDate(ts: number) {
  const d = new Date(ts);
  return d.toLocaleString("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatDateOnly(ts: number) {
  const d = new Date(ts);
  return d.toLocaleDateString("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export function ChecksDrawer({
  open,
  onOpenChange,
  checks,
  onOpenCheck,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  checks: CheckRecord[];
  onOpenCheck: (c: CheckRecord) => void;
}) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="flex w-full flex-col gap-0 p-0 sm:max-w-md">
        <div className="border-b border-border px-6 pt-6 pb-4">
          <div className="text-base font-semibold tracking-tight">Проверки</div>
          <div className="mt-1 text-[12px] text-muted-foreground">
            {checks.length === 0
              ? "Нет активных проверок"
              : `Всего: ${checks.length}`}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5">
          {checks.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-500">
                <ClipboardList className="h-6 w-6" />
              </div>
              <div className="text-sm font-semibold text-foreground">Проверок пока нет</div>
              <p className="mt-1.5 max-w-xs text-[12px] text-muted-foreground">
                Запустите проверку по ИНН и документам, чтобы получить результат оценки.
              </p>
            </div>
          ) : (
            <ul className="space-y-2.5">
              {checks.map((c) => {
                const isDone = c.status === "done";
                const hasInn = !!c.inn;
                const hasFiles = c.fileNames.length > 0;
                const recordType: CheckRecordType =
                  c.type ?? (hasInn && hasFiles ? "complex" : hasInn ? "counterparty" : "contract");
                const isContract = recordType === "contract";
                const isComplex = recordType === "complex";
                const clickable = isDone;
                const title = isContract ? "Договор № 24/06-У" : "ООО „Альтаир Логистик“";
                const meta = isComplex
                  ? `ИНН ${c.inn} · Комплексная проверка · ${formatDateOnly(c.createdAt)} · Измайлова Л.Д.`
                  : isContract
                    ? `Договор об оказании услуг · Проверка по договору · ${formatDateOnly(c.createdAt)} · Измайлова Л.Д.`
                    : `ИНН ${c.inn} · Проверка по ИНН · ${formatDateOnly(c.createdAt)} · Измайлова Л.Д.`;
                return (
                  <li key={c.id}>
                    <button
                      disabled={!clickable}
                      onClick={() => clickable && onOpenCheck(c)}
                      className={`flex w-full flex-col gap-2 rounded-2xl border bg-white px-4 py-3 text-left transition animate-in fade-in slide-in-from-right-1 ${
                        clickable
                          ? "border-border hover:border-slate-300 hover:shadow-sm cursor-pointer"
                          : "border-border cursor-default"
                      }`}
                    >
                      <div>
                        {isDone ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-700">
                            <CheckCircle2 className="h-3 w-3" />
                            Проверка завершена
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-700">
                            <Loader2 className="h-3 w-3 animate-spin text-primary" />
                            На проверке
                          </span>
                        )}
                      </div>
                      <div className="text-sm font-semibold text-foreground">
                        {title}
                      </div>
                      <div className="text-[11px] text-muted-foreground">
                        {meta}
                      </div>
                      {!isDone && (
                        <div className="text-[11px] text-muted-foreground">
                          Результат формируется
                        </div>
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
