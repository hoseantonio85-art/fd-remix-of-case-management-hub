import { useState } from "react";
import { DialogPrimitive } from "@/shared/ui";
import {
  ChevronDown,
  Flame,
  AlertTriangle,
  ChevronRight,
  EllipseIconButton,
  StatusBadge,
  type StatusTone,
} from "@/shared/ui";
import { Button } from "@/shared/ui";
import { cn } from "@/lib/utils";
import { largeModalContentClass } from "@/lib/modal-styles";
import { AssessmentInfoWidget } from "./AssessmentModal";
import { InModalDrawer } from "./InModalDrawer";
import { SourcesDrawer, DEFAULT_CONTRACT_SOURCE } from "./SourcesDrawer";


type ContractError = {
  id: string;
  title: string;
  summary: string;
  description: string;
  justification: string;
};

export type ContractErrorGroup = {
  document: string;
  errors: ContractError[];
};

export const CONTRACT_ERRORS: ContractError[] = [
  {
    id: "e1",
    title: "Ошибка 1",
    summary: "Некорректные подписи и опечатки в Приложении №2.",
    description:
      "В подписях Приложения №2 со стороны Исполнителя указана подпись «И.П.», хотя сторона является ООО. Также допущены опечатки в фамилии и должности.",
    justification:
      "Приложение №2: Исполнитель, Заказчик, ООО «Инстамарт Сервис», Генеральный директор, «/Блухов П.А./ И.П.», «Фиансовый лиректор».",
  },
  {
    id: "e2",
    title: "Ошибка 2",
    summary: "Дублирование отчетного периода с разными суммами в п. 4.1.",
    description:
      "В таблице расчета вознаграждения в пункте 4.1 дважды указан отчетный период «октябрь 2021 г.» с разными суммами.",
    justification:
      "Пункт 4.1: в таблице указано «октябрь 2021 г.» с суммами 51 739 441,98 и 7 841 398,79 без пояснения разбивки.",
  },
  {
    id: "e3",
    title: "Ошибка 3",
    summary: "В шапке Приложения №2 дата окончания периода раньше даты начала.",
    description:
      "В шапке Приложения №2 указан период претензии, где дата окончания раньше даты начала.",
    justification: "Приложение №2: «за период с 01.....2022 по 30......2021 г.».",
  },
  {
    id: "e4",
    title: "Ошибка 4",
    summary: "Ошибки в реквизитах и подписях, «И.П.» для ООО.",
    description:
      "В реквизитах и подписях допущены ошибки в написании должности и фамилии, а также указана подпись «И.П.» для ООО.",
    justification: "Приложение №2: «Фиансовый лиректор /Иванов Д.А./», «/Блухов П.А./ И.П.».",
  },
  {
    id: "e5",
    title: "Ошибка 5",
    summary: "Ошибка в нумерации этапов программы лояльности в п. 3.2.25.",
    description: "В пункте 3.2.25 допущена ошибка в нумерации этапов программы лояльности.",
    justification:
      "Пункт 3.2.25: «Программа лояльности реализуется в 2 этапа: 1ый этап ... 20й этап списание баллов ... Плановая дата реализации _ Зий, 4ый квартал 2022 года».",
  },
];

export const CONTRACT_ERROR_GROUPS: ContractErrorGroup[] = [
  {
    document: "Договор_оказания_услуг.pdf",
    errors: CONTRACT_ERRORS.slice(0, 2),
  },
  {
    document: "Приложение_№2.pdf",
    errors: CONTRACT_ERRORS.slice(2),
  },
];

export function ErrorCard({ err }: { err: ContractError }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-xl border border-slate-200 bg-white hover:bg-slate-50/50 transition">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-start gap-3 px-3 py-3 text-left"
      >
        <div className="min-w-0 flex-1">
          <div className="text-sm font-medium text-foreground">{err.title}</div>
          <div className="mt-0.5 line-clamp-2 text-[12px] text-muted-foreground">{err.summary}</div>
        </div>
        <ChevronDown
          className={cn(
            "mt-1 h-4 w-4 shrink-0 text-muted-foreground transition",
            open && "rotate-180",
          )}
        />
      </button>
      {open && (
        <div className="border-t border-slate-100 px-3 py-3">
          <div className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
            Описание
          </div>
          <div className="mt-1 text-sm leading-relaxed text-foreground">{err.description}</div>
        </div>
      )}
    </div>
  );
}

export function ContractErrorsDrawerContent() {
  const totalErrors = CONTRACT_ERROR_GROUPS.reduce((sum, g) => sum + g.errors.length, 0);
  const totalDocs = CONTRACT_ERROR_GROUPS.length;
  return (
    <>
      <div className="px-6 pt-6 pb-4 pr-16">
        <h3 className="text-lg font-semibold text-foreground">Ошибки в документах</h3>
        <p className="mt-1 text-[13px] text-muted-foreground">
          Найдено {totalErrors} ошибок в {totalDocs} документах
        </p>
      </div>
      <div className="space-y-5 px-6 pb-6">
        {CONTRACT_ERROR_GROUPS.map((group) => (
          <div key={group.document} className="space-y-2">
            <div className="text-sm font-medium text-foreground">{group.document}</div>
            <div className="space-y-2">
              {group.errors.map((e) => (
                <ErrorCard key={e.id} err={e} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}


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

export function RisksCounter({ count }: { count: number }) {
  return (
    <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full border border-slate-200 bg-white px-1.5 text-xs font-semibold text-foreground">
      {count}
    </span>
  );
}

const levelTone: Record<Level, StatusTone> = {
  very_high: "danger",
  high: "danger",
  medium: "warning",
  low: "neutral",
};

function HeaderLevelTag({ level }: { level: Level }) {
  return (
    <StatusBadge tone={levelTone[level]} size="regular">
      {levelMeta[level].label}
    </StatusBadge>
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
          className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-lg", m.iconWrap)}
        >
          <Flame className="h-4 w-4" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-sm font-medium text-foreground">{risk.title}</div>
          <div className="mt-0.5 flex items-center gap-1.5 text-[12px] text-muted-foreground">
            <ChevronDown className={cn("h-3.5 w-3.5 transition", open && "rotate-180")} />
            <span>{risk.category}</span>
          </div>
        </div>
      </button>
      {open && (
        <div className="border-t border-slate-100 px-3 pb-3 pt-2">
          <div className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
            Описание
          </div>
          <div className="mt-1 text-sm leading-relaxed text-foreground">{risk.description}</div>
        </div>
      )}
    </div>
  );
}

export function LevelAccordion({ level, risks }: { level: Level; risks: ContractRisk[] }) {
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
          <StatusBadge tone={levelTone[level]} size="compact">
            {m.label}
          </StatusBadge>
          <span className="text-[12px] text-muted-foreground">
            · {count} {countLabel}
          </span>
        </div>
        <ChevronDown
          className={cn("h-4 w-4 text-muted-foreground transition", open && "rotate-180")}
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

export function ContractAssessmentModal({
  open,
  onOpenChange,
  onDelete,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  onDelete?: () => void;
}) {
  const [errorsOpen, setErrorsOpen] = useState(false);
  const [sourcesOpen, setSourcesOpen] = useState(false);

  const grouped: Record<Level, ContractRisk[]> = {
    very_high: RISKS.filter((r) => r.level === "very_high"),
    high: RISKS.filter((r) => r.level === "high"),
    medium: RISKS.filter((r) => r.level === "medium"),
    low: RISKS.filter((r) => r.level === "low"),
  };
  const topLevel: Level = LEVEL_ORDER.find((l) => grouped[l].length > 0) ?? "low";

  const headerGradient: Record<Level, string> = {
    very_high: "bg-gradient-to-b from-rose-50 via-rose-50/40 to-transparent",
    high: "bg-gradient-to-b from-rose-50 via-rose-50/40 to-transparent",
    medium: "bg-gradient-to-b from-amber-50 via-amber-50/40 to-transparent",
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
                "shrink-0 px-5 pt-6 pb-6 pr-16 lg:px-10 lg:pr-20",
                headerGradient[topLevel],
              )}
            >
              <span className="absolute right-5 top-5 z-10">
                <EllipseIconButton
                  icon="cross"
                  aria-label="Закрыть"
                  onClick={() => onOpenChange(false)}
                />
              </span>
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
                  <button
                    type="button"
                    onClick={() => setErrorsOpen(true)}
                    className="flex w-full items-center gap-3 rounded-2xl border border-rose-100 bg-rose-50 px-4 py-3 text-left text-rose-900 transition hover:bg-rose-100/70"
                  >
                    <AlertTriangle className="h-4 w-4 shrink-0" />
                    <span className="flex-1 text-sm font-medium">
                      Обнаружено {CONTRACT_ERRORS.length} ошибок в документе
                    </span>
                    <span className="inline-flex items-center gap-1 text-[12px] font-medium">
                      Перейти
                      <ChevronRight className="h-4 w-4" />
                    </span>
                  </button>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-semibold text-foreground">Риски</h3>
                    <RisksCounter count={RISKS.length} />
                  </div>
                  {LEVEL_ORDER.map((lvl) => (
                    <LevelAccordion key={lvl} level={lvl} risks={grouped[lvl]} />
                  ))}
                </section>
                <aside className="order-2 lg:col-start-2 lg:row-start-1">
                  <div className="lg:sticky lg:top-0">
                    <AssessmentInfoWidget
                      contractFile="dogovor_uslugi_v3.pdf"
                      onOpenSources={() => setSourcesOpen(true)}
                    />

                  </div>
                </aside>
              </div>
            </div>

            <InModalDrawer open={errorsOpen} onOpenChange={setErrorsOpen}>
              <ContractErrorsDrawerContent />
            </InModalDrawer>

            <SourcesDrawer
              open={sourcesOpen}
              onOpenChange={setSourcesOpen}
              sections={[
                { title: "Документ проверки", files: [DEFAULT_CONTRACT_SOURCE] },
              ]}
            />


            {/* Footer */}
            <div className="shrink-0 border-t border-border bg-white px-5 py-4 lg:px-10">
              <Button variant="outline" size="lg" onClick={onDelete} className="w-full">
                Удалить
              </Button>
            </div>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
