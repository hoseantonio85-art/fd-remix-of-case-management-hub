import { useState } from "react";
import { ChevronDown, Info } from "@/shared/ui";
import { cn } from "@/lib/utils";

type TrustTone = "emerald" | "teal" | "slate";

interface TrustFactor {
  id: string;
  title: string;
  tone: TrustTone;
  tag: string;
  short: string;
  full: string;
}

const toneMeta: Record<TrustTone, string> = {
  emerald: "bg-emerald-50 text-emerald-700 border border-emerald-100",
  teal: "bg-teal-50 text-teal-700 border border-teal-100",
  slate: "bg-slate-50 text-slate-600 border border-slate-200",
};

const factors: TrustFactor[] = [
  {
    id: "t1",
    tone: "emerald",
    tag: "Подтверждено",
    title: "Регистрационные риски не выявлены",
    short: "Признаки ликвидации и недостоверности не обнаружены.",
    full: "Компания действует, признаки ликвидации, банкротства и недостоверности сведений не обнаружены. Регистрационные данные не блокируют заключение сделки.",
  },
  {
    id: "t2",
    tone: "emerald",
    tag: "Без критичных факторов",
    title: "Финансовые ограничения не блокируют сделку",
    short: "Блокирующих финансовых факторов нет.",
    full: "По результатам проверки не выявлены финансовые признаки, которые препятствуют заключению сделки в стандартном процессе согласования.",
  },
  {
    id: "t3",
    tone: "teal",
    tag: "Проверено",
    title: "Репутационные признаки в норме",
    short: "Существенных судебных и репутационных рисков нет.",
    full: "Судебные и репутационные факторы не содержат критичных признаков, которые требуют блокировки сделки или дополнительного ограничения.",
  },
  {
    id: "t4",
    tone: "teal",
    tag: "Стабильно",
    title: "Корпоративные сведения без критичных изменений",
    short: "Критичных изменений в регистрационном профиле нет.",
    full: "В регистрационном профиле не выявлены изменения, которые могут указывать на нестабильность корпоративного контроля или признаки недостоверности.",
  },
  {
    id: "t5",
    tone: "slate",
    tag: "Доступно",
    title: "Данных достаточно для вывода",
    short: "Оценка сформирована на достаточном наборе данных.",
    full: "Для ключевых групп проверки достаточно данных, чтобы сформировать позитивную резолюцию без дополнительных ручных уточнений.",
  },
];

const VISIBLE_COUNT = 2;
const DESCRIPTION = "Признаки, которые подтверждают возможность заключения сделки.";

export function TrustFactorsWidget() {
  const [openId, setOpenId] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(false);

  const visible = expanded ? factors : factors.slice(0, VISIBLE_COUNT);
  const hiddenCount = factors.length - VISIBLE_COUNT;

  const handleToggleExpand = () => {
    if (expanded && openId) {
      const stillVisible = factors.slice(0, VISIBLE_COUNT).some((f) => f.id === openId);
      if (!stillVisible) setOpenId(null);
    }
    setExpanded((v) => !v);
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4">
      <div className="flex items-center gap-1.5">
        <div className="text-sm font-semibold text-foreground">Факторы доверия</div>
        <span
          tabIndex={0}
          title={DESCRIPTION}
          aria-label={DESCRIPTION}
          className="inline-flex cursor-help text-muted-foreground hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-full"
        >
          <Info className="h-3.5 w-3.5" />
        </span>
      </div>
      <ul className="mt-3 space-y-2.5">
        {visible.map((f) => {
          const isOpen = openId === f.id;
          return (
            <li key={f.id}>
              <button
                type="button"
                onClick={() => setOpenId(isOpen ? null : f.id)}
                aria-expanded={isOpen}
                className={cn(
                  "w-full rounded-xl border px-3 py-3 text-left transition-colors",
                  isOpen
                    ? "border-slate-200 bg-slate-50"
                    : "border-slate-100 bg-slate-50/60 hover:bg-slate-50",
                )}
              >
                <div className="flex items-start gap-2">
                  <div className="min-w-0 flex-1">
                    <span
                      className={cn(
                        "inline-flex h-5 items-center rounded-full px-2 text-[11px] font-medium",
                        toneMeta[f.tone],
                      )}
                    >
                      {f.tag}
                    </span>
                    <div className="mt-1.5 text-[13px] font-medium leading-snug text-foreground">
                      {f.title}
                    </div>
                    <div
                      className={cn(
                        "mt-1 text-xs leading-5 text-slate-600",
                        !isOpen && "line-clamp-1",
                      )}
                    >
                      {f.short}
                    </div>
                    {isOpen && (
                      <div className="mt-2 text-xs leading-relaxed text-foreground/80">
                        {f.full}
                      </div>
                    )}
                  </div>
                  <ChevronDown
                    className={cn(
                      "mt-0.5 h-4 w-4 shrink-0 text-muted-foreground transition-transform",
                      isOpen && "rotate-180",
                    )}
                  />
                </div>
              </button>
            </li>
          );
        })}
      </ul>

      {hiddenCount > 0 && (
        <button
          type="button"
          onClick={handleToggleExpand}
          className="mt-2 text-xs font-medium text-foreground/70 hover:text-foreground"
        >
          {expanded ? "Свернуть" : `Показать ещё ${hiddenCount}`}
        </button>
      )}
    </div>
  );
}
