import { useState } from "react";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { CheckCircle2, Loader2, ClipboardList } from "lucide-react";
import { cn } from "@/lib/utils";

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

type CheckTypeFilter = "all" | CheckRecordType;

function formatDateOnly(ts: number) {
  const d = new Date(ts);
  return d.toLocaleDateString("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function getRecordType(c: CheckRecord): CheckRecordType {
  const hasInn = !!c.inn;
  const hasFiles = c.fileNames.length > 0;
  return c.type ?? (hasInn && hasFiles ? "complex" : hasInn ? "counterparty" : "contract");
}

const typeBadgeLabel: Record<CheckRecordType, string> = {
  counterparty: "Контрагент",
  complex: "Контрагент + договор",
  contract: "Договор",
};

const FILTERS: { value: CheckTypeFilter; label: string }[] = [
  { value: "all", label: "Все" },
  { value: "counterparty", label: "Контрагент" },
  { value: "complex", label: "Контрагент + договор" },
  { value: "contract", label: "Договор" },
];

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
  const [filter, setFilter] = useState<CheckTypeFilter>("all");

  const counts: Record<CheckTypeFilter, number> = {
    all: checks.length,
    counterparty: checks.filter((c) => getRecordType(c) === "counterparty").length,
    complex: checks.filter((c) => getRecordType(c) === "complex").length,
    contract: checks.filter((c) => getRecordType(c) === "contract").length,
  };

  const filtered = filter === "all" ? checks : checks.filter((c) => getRecordType(c) === filter);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="flex w-full flex-col gap-0 p-0 sm:max-w-md">
        <div className="border-b border-border px-6 pt-6 pb-4">
          <div className="text-base font-semibold tracking-tight">Проверки</div>
          <div className="mt-1 text-[12px] text-muted-foreground">
            {checks.length === 0 ? "Нет активных проверок" : `Всего: ${checks.length}`}
          </div>
        </div>

        {checks.length > 0 && (
          <div className="border-b border-border px-6 py-3">
            <div className="flex flex-wrap gap-1.5">
              {FILTERS.map((f) => {
                const active = filter === f.value;
                return (
                  <button
                    key={f.value}
                    type="button"
                    onClick={() => setFilter(f.value)}
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium transition",
                      active
                        ? "border-primary/30 bg-primary/5 text-primary"
                        : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50",
                    )}
                  >
                    {f.label}
                    <span
                      className={cn(
                        "rounded-full px-1.5 py-px text-[10px]",
                        active ? "bg-white/70 text-primary" : "bg-slate-100 text-slate-600",
                      )}
                    >
                      {counts[f.value]}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

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
          ) : filtered.length === 0 ? (
            <div className="py-8 text-center text-[12px] text-muted-foreground">
              Нет проверок этого типа
            </div>
          ) : (
            <ul className="space-y-2.5">
              {filtered.map((c) => {
                const isDone = c.status === "done";
                const recordType = getRecordType(c);
                const isContract = recordType === "contract";
                const isComplex = recordType === "complex";
                const clickable = isDone;
                const title = isContract ? "Договор № 24/06-У" : "ООО „Альтаир Логистик“";
                const meta = isComplex
                  ? `ИНН ${c.inn} · Договор об оказании услуг · ${formatDateOnly(c.createdAt)} · Измайлова Л.Д.`
                  : isContract
                    ? `Договор об оказании услуг · ${formatDateOnly(c.createdAt)} · Измайлова Л.Д.`
                    : `ИНН ${c.inn} · ${formatDateOnly(c.createdAt)} · Измайлова Л.Д.`;
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
                      <div className="flex flex-wrap items-center gap-1.5">
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
                        <span className="inline-flex items-center rounded-full border border-violet-100 bg-violet-50 px-2 py-0.5 text-[11px] font-medium text-violet-700">
                          {typeBadgeLabel[recordType]}
                        </span>
                      </div>
                      <div className="text-sm font-semibold text-foreground">{title}</div>
                      <div className="text-[11px] text-muted-foreground">{meta}</div>
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
