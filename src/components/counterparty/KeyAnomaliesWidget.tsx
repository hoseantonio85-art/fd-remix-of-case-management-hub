import { useState } from "react";
import { ChevronDown, Info } from "lucide-react";
import { cn } from "@/lib/utils";

type AnomalySeverity = "block" | "amplify" | "context";

interface Anomaly {
  id: string;
  title: string;
  severity: AnomalySeverity;
  short: string;
  full: string;
}

const severityMeta: Record<AnomalySeverity, { label: string; chip: string }> = {
  block: { label: "Блокирует сделку", chip: "bg-rose-50 text-rose-700 border border-rose-100" },
  amplify: { label: "Усиливает риск", chip: "bg-amber-50 text-amber-800 border border-amber-100" },
  context: { label: "Контекст", chip: "bg-slate-50 text-slate-600 border border-slate-200" },
};

const anomalies: Anomaly[] = [
  {
    id: "a1",
    title: "Критический дефицит ресурсов",
    severity: "block",
    short: "11 сотрудников при выручке 150,5 млн ₽.",
    full: "При заявленной годовой выручке 150,5 млн ₽ среднесписочная численность сотрудников составляет всего 11 человек, а строка баланса «Основные средства» равна 0 ₽. В сочетании с недостоверностью адреса это подтверждает высокий риск фирмы-пустышки.",
  },
  {
    id: "a2",
    title: "Аномалия структуры баланса",
    severity: "block",
    short: "Убыток превышает выручку за период.",
    full: "Глубокий чистый убыток за первый неполный год деятельности составил 13 243 000 ₽, что превышает официальную выручку организации 11 361 000 ₽ на 16%. Это указывает на существенную диспропорцию финансовой модели.",
  },
  {
    id: "a3",
    title: "Аномалия графа собственности",
    severity: "block",
    short: "Связанные лица были в компаниях, закрытых ФНС.",
    full: "По данным ФНС, Калашов В. П. ранее владел и руководил организациями в Ивановской и Ленинградской областях, которые были принудительно закрыты налоговой службой из-за долгов и недостоверных данных. Наблюдается повторение негативного исторического паттерна на новом активе.",
  },
  {
    id: "a4",
    title: "Корпоративная миграция и стартап-контроль",
    severity: "amplify",
    short: "Молодая компания с частой сменой ответственных лиц.",
    full: "Возраст компании — 9 месяцев. В истории ЕГРЮЛ зафиксирована высокая скорость смены ответственных лиц и заявителей с момента регистрации в сентябре 2025 года. Это усиливает риск нестабильности корпоративного контроля.",
  },
  {
    id: "a5",
    title: "Структура баланса",
    severity: "context",
    short: "Высокая доля заёмных обязательств.",
    full: "Наблюдается высокая доля заемных обязательств в структуре баланса: высокая кредиторская задолженность при относительно небольшой доле собственного капитала. Для рекламного бизнеса, работающего по агентской модели, это может быть допустимой отраслевой нормой, но в связке с другими аномалиями усиливает общий риск.",
  },
];

const VISIBLE_COUNT = 2;
const DESCRIPTION = "Факторы, которые повлияли на резолюцию «Не заключать сделки».";

export function KeyAnomaliesWidget() {
  const [openId, setOpenId] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(false);

  const visible = expanded ? anomalies : anomalies.slice(0, VISIBLE_COUNT);
  const hiddenCount = anomalies.length - VISIBLE_COUNT;

  const handleToggleExpand = () => {
    if (expanded && openId) {
      const stillVisible = anomalies.slice(0, VISIBLE_COUNT).some((a) => a.id === openId);
      if (!stillVisible) setOpenId(null);
    }
    setExpanded((v) => !v);
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4">
      <div className="flex items-center gap-1.5">
        <div className="text-sm font-semibold text-foreground">Ключевые аномалии</div>
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
        {visible.map((a) => {
          const isOpen = openId === a.id;
          const meta = severityMeta[a.severity];
          return (
            <li key={a.id}>
              <button
                type="button"
                onClick={() => setOpenId(isOpen ? null : a.id)}
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
                        meta.chip,
                      )}
                    >
                      {meta.label}
                    </span>
                    <div className="mt-1.5 text-[13px] font-medium leading-snug text-foreground">
                      {a.title}
                    </div>
                    <div
                      className={cn(
                        "mt-1 text-xs leading-5 text-slate-600",
                        !isOpen && "line-clamp-1",
                      )}
                    >
                      {a.short}
                    </div>
                    {isOpen && (
                      <div className="mt-2 text-xs leading-relaxed text-foreground/80">
                        {a.full}
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
