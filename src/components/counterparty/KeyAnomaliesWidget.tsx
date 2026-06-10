import { useState } from "react";
import { ChevronDown } from "lucide-react";
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
    short: "ССЧ — 11 человек при выручке 150,5 млн ₽, основные средства — 0 ₽.",
    full: "При заявленной годовой выручке 150,5 млн ₽ среднесписочная численность сотрудников составляет всего 11 человек, а строка баланса «Основные средства» равна 0 ₽. В сочетании с недостоверностью адреса это подтверждает высокий риск фирмы-пустышки.",
  },
  {
    id: "a2",
    title: "Аномалия структуры баланса",
    severity: "block",
    short: "Чистый убыток превышает официальную выручку за неполный год деятельности.",
    full: "Глубокий чистый убыток за первый неполный год деятельности составил 13 243 000 ₽, что превышает официальную выручку организации 11 361 000 ₽ на 16%. Это указывает на существенную диспропорцию финансовой модели.",
  },
  {
    id: "a3",
    title: "Аномалия графа собственности",
    severity: "block",
    short: "Связанные лица ранее участвовали в компаниях, закрытых ФНС из-за долгов и недостоверных данных.",
    full: "По данным ФНС, Калашов В. П. ранее владел и руководил организациями в Ивановской и Ленинградской областях, которые были принудительно закрыты налоговой службой из-за долгов и недостоверных данных. Наблюдается повторение негативного исторического паттерна на новом активе.",
  },
  {
    id: "a4",
    title: "Корпоративная миграция и стартап-контроль",
    severity: "amplify",
    short: "Компания моложе года, при этом уже зафиксирована частая смена ответственных лиц.",
    full: "Возраст компании — 9 месяцев. В истории ЕГРЮЛ зафиксирована высокая скорость смены ответственных лиц и заявителей с момента регистрации в сентябре 2025 года. Это усиливает риск нестабильности корпоративного контроля.",
  },
  {
    id: "a5",
    title: "Структура баланса",
    severity: "context",
    short: "Высокая доля заемных обязательств при небольшой доле собственного капитала.",
    full: "Наблюдается высокая доля заемных обязательств в структуре баланса: высокая кредиторская задолженность при относительно небольшой доле собственного капитала. Для рекламного бизнеса, работающего по агентской модели, это может быть допустимой отраслевой нормой, но в связке с другими аномалиями усиливает общий риск.",
  },
];

export function KeyAnomaliesWidget() {
  const [openId, setOpenId] = useState<string | null>(null);

  const counts = anomalies.reduce(
    (acc, a) => {
      acc[a.severity] += 1;
      return acc;
    },
    { block: 0, amplify: 0, context: 0 } as Record<AnomalySeverity, number>,
  );

  return (
    <div className="rounded-2xl border border-border bg-white p-4">
      <div className="text-sm font-semibold text-foreground">Ключевые аномалии</div>
      <p className="mt-0.5 text-[11px] leading-snug text-muted-foreground">
        Факторы, повлиявшие на резолюцию «Не заключать сделки».
      </p>
      <div className="mt-2 text-[11px] text-muted-foreground">
        {counts.block} блокируют сделку · {counts.amplify} усиливает риск · {counts.context} контекст
      </div>

      <ul className="mt-3 space-y-2">
        {anomalies.map((a) => {
          const isOpen = openId === a.id;
          const meta = severityMeta[a.severity];
          return (
            <li key={a.id}>
              <button
                type="button"
                onClick={() => setOpenId(isOpen ? null : a.id)}
                aria-expanded={isOpen}
                className={cn(
                  "w-full rounded-xl border p-3 text-left transition-colors",
                  isOpen ? "border-foreground/20 bg-muted/40" : "border-border bg-white hover:bg-muted/30",
                )}
              >
                <div className="flex items-start gap-2">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="text-sm font-medium text-foreground">{a.title}</span>
                      <span
                        className={cn(
                          "inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium",
                          meta.chip,
                        )}
                      >
                        {meta.label}
                      </span>
                    </div>
                    <div className="mt-1 text-xs leading-snug text-muted-foreground">{a.short}</div>
                    {isOpen && (
                      <div className="mt-2 text-xs leading-relaxed text-foreground/80">{a.full}</div>
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
    </div>
  );
}
