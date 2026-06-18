import { useState } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X, ChevronDown, ArrowUp, Flame, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { largeModalContentClass } from "@/lib/modal-styles";

export type Level = "very_high" | "high" | "medium" | "low";

type ContractRisk = {
  id: string;
  level: Level;
  category: string; // вид риска
  title: string;
  description: string;
};

export const levelMeta: Record<
  Level,
  { label: string; chip: string; iconWrap: string; icon: string }
> = {
  very_high: {
    label: "Очень высокий",
    chip: "bg-rose-100 text-rose-900",
    iconWrap: "bg-rose-50 text-rose-600",
    icon: "text-rose-600",
  },
  high: {
    label: "Высокий",
    chip: "bg-rose-50 text-rose-700",
    iconWrap: "bg-rose-50/70 text-rose-500",
    icon: "text-rose-500",
  },
  medium: {
    label: "Средний",
    chip: "bg-amber-100 text-amber-900",
    iconWrap: "bg-amber-50 text-amber-600",
    icon: "text-amber-600",
  },
  low: {
    label: "Низкий",
    chip: "bg-slate-100 text-slate-700",
    iconWrap: "bg-slate-50 text-slate-500",
    icon: "text-slate-500",
  },
};

export const RISKS: ContractRisk[] = [
  {
    id: "vh-1",
    level: "very_high",
    category: "Технологические риски",
    title: "Финансовые потери из-за расхождения цен",
    description:
      "Договор допускает расхождение цены в сервисе и на кассе, обязывает Исполнителя исполнять заказ по ошибочной цене, а компенсацию разниц согласовывает лишь в индивидуальном порядке без автоматического механизма возмещения.",
  },
  {
    id: "h-1",
    level: "high",
    category: "Регуляторные риски",
    title: "Штрафные санкции за некорректную категоризацию",
    description:
      "Заказчик передает данные о спецкатегориях (алкоголь, лекарства), но финальная ответственность за соответствие категорий на витрине возложена на Исполнителя, что создает риск штрафов из-за чужих ошибок.",
  },
  {
    id: "h-2",
    level: "high",
    category: "Риски контрагентов",
    title: "Снижение оборота из-за сокращения сети",
    description:
      "Заказчик вправе сократить адресную программу до 20%, но лимит перерасчета оборота также ограничен 20%, что не покрывает реальные убытки от разрыва логистики и роста удельных расходов.",
  },
  {
    id: "h-3",
    level: "high",
    category: "Риски физической безопасности",
    title: "Хищение средств с корпоративных карт",
    description:
      "Физические карты Исполнителя хранятся в магазинах Заказчика и передаются курьерам, при этом Заказчик прямо освобожден от ответственности за их сохранность — все убытки несет Исполнитель.",
  },
  {
    id: "m-1",
    level: "medium",
    category: "Процессные риски",
    title: "Оплата завышенных сумм из-за автоматического согласования",
    description:
      "Отчеты и УПД автоматически считаются согласованными, если Заказчик не направил мотивированные возражения в течение 3–5 рабочих дней, что лишает возможности оспорить сумму постфактум.",
  },
  {
    id: "m-2",
    level: "medium",
    category: "Процессные риски",
    title: "Убытки от невозмещенных затрат на промокоды",
    description:
      "Выдача промокодов — исключительно инициатива Исполнителя за его счет, и Заказчик не возмещает эти расходы даже при наличии скрытых дефектов товара.",
  },
];

export const LEVEL_ORDER: Level[] = ["very_high", "high", "medium", "low"];

function HeaderLevelTag({ level }: { level: Level }) {
  const m = levelMeta[level];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-medium",
        m.chip,
      )}
    >
      {level === "very_high" && <ArrowUp className="h-3 w-3" />}
      {m.label}
    </span>
  );
}

function RiskCard({ risk }: { risk: ContractRisk }) {
  const [open, setOpen] = useState(false);
  const m = levelMeta[risk.level];
  return (
    <div className="rounded-xl border border-slate-200 bg-white">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center gap-3 px-3 py-3 text-left"
      >
        <div
          className={cn(
            "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
            m.iconWrap,
          )}
        >
          <Flame className="h-4 w-4" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-sm font-medium text-foreground">{risk.title}</div>
          <div className="mt-0.5 flex items-center gap-1.5 text-[12px] text-muted-foreground">
            <ChevronDown
              className={cn("h-3.5 w-3.5 transition", open && "rotate-180")}
            />
            <span>{risk.category}</span>
          </div>
        </div>
        <span
          className={cn(
            "inline-flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-medium",
            m.chip,
          )}
        >
          {risk.level === "very_high" && <ArrowUp className="h-3 w-3" />}
          {m.label}
        </span>
      </button>
      {open && (
        <div className="border-t border-slate-100 px-3 pb-3 pt-2">
          <div className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
            Описание
          </div>
          <div className="mt-1 text-sm leading-relaxed text-foreground">
            {risk.description}
          </div>
        </div>
      )}
    </div>
  );
}

export function LevelAccordion({
  level,
  risks,
}: {
  level: Level;
  risks: ContractRisk[];
}) {
  const [open, setOpen] = useState(level === "very_high" || level === "high");
  const m = levelMeta[level];
  const count = risks.length;
  const countLabel = (() => {
    const n = count % 10;
    const n100 = count % 100;
    if (n === 1 && n100 !== 11) return "риск";
    if (n >= 2 && n <= 4 && (n100 < 12 || n100 > 14)) return "риска";
    return "рисков";
  })();
  return (
    <div className="rounded-2xl border border-border bg-white">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left"
      >
        <div className="flex items-center gap-2">
          <span
            className={cn(
              "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-medium",
              m.chip,
            )}
          >
            {level === "very_high" && <ArrowUp className="h-3 w-3" />}
            {m.label}
          </span>
          <span className="text-[12px] text-muted-foreground">
            · {count} {countLabel}
          </span>
        </div>
        <ChevronDown
          className={cn(
            "h-4 w-4 text-muted-foreground transition",
            open && "rotate-180",
          )}
        />
      </button>
      {open && (
        <div className="space-y-2 border-t border-slate-100 px-3 py-3">
          {risks.length === 0 ? (
            <div className="rounded-lg bg-slate-50 px-3 py-4 text-center text-[12px] text-muted-foreground">
              Риски данного уровня не выявлены
            </div>
          ) : (
            risks.map((r) => <RiskCard key={r.id} risk={r} />)
          )}
        </div>
      )}
    </div>
  );
}

function InfoBlock() {
  return (
    <div className="rounded-2xl border border-border bg-white p-4">
      <div className="text-sm font-semibold text-foreground">Информация</div>
      <div className="mt-3 space-y-3 text-[13px]">
        <div>
          <div className="text-[11px] uppercase tracking-wide text-muted-foreground">
            Дата проверки
          </div>
          <div className="mt-0.5 text-foreground">18.06.2026</div>
        </div>
        <div>
          <div className="text-[11px] uppercase tracking-wide text-muted-foreground">
            Инициатор
          </div>
          <div className="mt-0.5 text-foreground">Измайлова Л.Д.</div>
        </div>
        <div>
          <div className="text-[11px] uppercase tracking-wide text-muted-foreground">
            Автор
          </div>
          <div className="mt-0.5 text-foreground">Норм</div>
        </div>
        <div>
          <div className="text-[11px] uppercase tracking-wide text-muted-foreground">
            Источник
          </div>
          <a
            href="#"
            onClick={(e) => e.preventDefault()}
            className="mt-1 inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-[12px] font-medium text-foreground hover:bg-slate-100"
          >
            <Download className="h-3.5 w-3.5 text-muted-foreground" />
            dogovor_uslugi_v3.pdf
          </a>
        </div>
      </div>
    </div>
  );
}

export function ContractAssessmentModal({
  open,
  onOpenChange,
  onDelete,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  onDelete?: () => void;
}) {
  const grouped: Record<Level, ContractRisk[]> = {
    very_high: RISKS.filter((r) => r.level === "very_high"),
    high: RISKS.filter((r) => r.level === "high"),
    medium: RISKS.filter((r) => r.level === "medium"),
    low: RISKS.filter((r) => r.level === "low"),
  };
  const topLevel: Level =
    LEVEL_ORDER.find((l) => grouped[l].length > 0) ?? "low";

  const headerGradient: Record<Level, string> = {
    very_high:
      "bg-gradient-to-b from-rose-50 via-rose-50/40 to-transparent",
    high: "bg-gradient-to-b from-rose-50 via-rose-50/40 to-transparent",
    medium:
      "bg-gradient-to-b from-amber-50 via-amber-50/40 to-transparent",
    low: "bg-gradient-to-b from-slate-50 via-slate-50/40 to-transparent",
  };

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-slate-900/40 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <DialogPrimitive.Content
          className={cn(
            largeModalContentClass,
            "duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 sm:max-w-[calc(100vw-32px)] sm:rounded-3xl",
          )}
        >
          <div className="relative flex min-h-0 flex-1 flex-col">
            {/* Header */}
            <div
              className={cn(
                "shrink-0 px-5 pt-6 pb-6 lg:px-10",
                headerGradient[topLevel],
              )}
            >
              <div className="absolute right-5 top-5 flex items-center gap-2">
                <button
                  onClick={() => onOpenChange(false)}
                  className="rounded-full bg-white p-1.5 text-muted-foreground hover:bg-muted"
                  aria-label="Закрыть"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="flex flex-wrap items-center gap-1.5">
                <HeaderLevelTag level={topLevel} />
              </div>
              <h2 className="mt-3 text-2xl font-semibold tracking-tight text-foreground">
                Договор № 24/06-У
              </h2>
              <div className="mt-1 text-[13px] text-muted-foreground">
                Договор об оказании услуг · от 08.06.2026
              </div>
            </div>

            {/* Body */}
            <div className="min-h-0 flex-1 overflow-y-auto bg-white px-5 py-6 lg:px-10">
              <div className="grid gap-y-5 gap-x-5 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-x-12">
                <section className="order-1 space-y-3 lg:col-start-1 lg:row-start-1">
                  {LEVEL_ORDER.map((lvl) => (
                    <LevelAccordion
                      key={lvl}
                      level={lvl}
                      risks={grouped[lvl]}
                    />
                  ))}
                </section>
                <aside className="order-2 lg:col-start-2 lg:row-start-1">
                  <div className="lg:sticky lg:top-0">
                    <InfoBlock />
                  </div>
                </aside>
              </div>
            </div>

            {/* Footer */}
            <div className="shrink-0 border-t border-border bg-white px-5 py-4 lg:px-10">
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={onDelete}
                  className="h-12 flex-1 rounded-full text-sm font-medium"
                >
                  Удалить
                </Button>
                <Button
                  onClick={() => onOpenChange(false)}
                  className="h-12 flex-1 rounded-full bg-emerald-600 text-sm font-medium text-white hover:bg-emerald-700"
                >
                  Закрыть
                </Button>
              </div>
            </div>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
