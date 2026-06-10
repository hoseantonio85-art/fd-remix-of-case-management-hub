import { Info } from "lucide-react";

type Tone = "emerald" | "green" | "slate";

interface Factor {
  id: string;
  tag: string;
  tone: Tone;
  title: string;
  text: string;
}

const toneChip: Record<Tone, string> = {
  emerald: "bg-emerald-50 text-emerald-700 border border-emerald-100",
  green: "bg-green-50 text-green-700 border border-green-100",
  slate: "bg-slate-50 text-slate-600 border border-slate-200",
};

const factors: Factor[] = [
  {
    id: "f1",
    tag: "Подтверждено",
    tone: "emerald",
    title: "Регистрационные риски не выявлены",
    text: "Компания действует, признаки ликвидации, банкротства и недостоверности сведений не обнаружены.",
  },
  {
    id: "f2",
    tag: "Без критичных факторов",
    tone: "green",
    title: "Финансовые ограничения не блокируют сделку",
    text: "Не выявлены признаки, которые препятствуют заключению сделки в стандартном процессе.",
  },
  {
    id: "f3",
    tag: "Проверено",
    tone: "slate",
    title: "Репутационные признаки в норме",
    text: "Существенные судебные и репутационные факторы риска не обнаружены.",
  },
];

const DESCRIPTION = "Признаки, которые подтверждают возможность заключения сделки.";

export function TrustFactorsWidget() {
  return (
    <div className="rounded-2xl border border-border bg-white p-4">
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

      <ul className="mt-2.5 space-y-1.5">
        {factors.map((f) => (
          <li key={f.id}>
            <div className="w-full rounded-xl border border-border bg-white p-3 text-left">
              <span
                className={`inline-flex h-5 items-center rounded-full px-2 text-[11px] font-medium ${toneChip[f.tone]}`}
              >
                {f.tag}
              </span>
              <div className="mt-1 text-sm font-medium text-foreground">{f.title}</div>
              <div className="mt-0.5 text-xs leading-snug text-muted-foreground">{f.text}</div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
