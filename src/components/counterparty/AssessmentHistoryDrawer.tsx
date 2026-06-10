import { useState } from "react";
import { ChevronDown, Download, FileClock, GitCompare } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { InModalDrawer } from "./InModalDrawer";

type Resolution = "negative" | "positive";

interface Version {
  id: string;
  label: string; // v4
  date: string;
  resolution: Resolution;
  source: string;
  changes: string[];
  details: {
    groups: { name: string; note: string }[];
    criteria: { name: string; note: string }[];
  };
}

const negativeVersions: Version[] = [
  {
    id: "v4",
    label: "v4",
    date: "Сегодня, 14:32",
    resolution: "negative",
    source: "NORM AI · автообновление",
    changes: [
      "Добавлен риск в группе «Финансы и налоги»",
      "2 критерия перешли из «Нет данных» в «Выявлен риск»",
      "Обновлены регистрационные сведения",
    ],
    details: {
      groups: [
        { name: "Финансы и налоги", note: "+1 риск" },
        { name: "Юридический статус", note: "данные обновлены" },
        { name: "Судебная нагрузка", note: "без изменений" },
      ],
      criteria: [
        { name: "Смена руководителя", note: "Нет данных → Выявлен риск" },
        { name: "Финансовый анализ", note: "Нет данных → Выявлен риск" },
        { name: "Судебная нагрузка", note: "Нет данных → Нарушений нет" },
      ],
    },
  },
  {
    id: "v3",
    label: "v3",
    date: "28.05.2026, 11:10",
    resolution: "negative",
    source: "Пользователь · ручной запуск",
    changes: [
      "Резолюция не изменилась",
      "Уточнены негативные факторы",
      "Обновлены судебные источники",
    ],
    details: {
      groups: [
        { name: "Судебная нагрузка", note: "источники обновлены" },
        { name: "Финансы и налоги", note: "уточнены факторы" },
      ],
      criteria: [
        { name: "Судебные иски", note: "детали обновлены" },
        { name: "Налоговые маркеры", note: "без изменений" },
      ],
    },
  },
  {
    id: "v2",
    label: "v2",
    date: "12.05.2026, 09:45",
    resolution: "negative",
    source: "NORM AI · плановое обновление",
    changes: [
      "Появились первые признаки финансовой неустойчивости",
      "Часть критериев была без данных",
      "Проверены регистрационные сведения",
    ],
    details: {
      groups: [
        { name: "Финансы и налоги", note: "первые риски" },
        { name: "Регистрационные сведения", note: "проверены" },
      ],
      criteria: [
        { name: "Финансовая устойчивость", note: "Нет данных → Признаки риска" },
        { name: "ЕГРЮЛ", note: "актуализирован" },
      ],
    },
  },
  {
    id: "v1",
    label: "v1",
    date: "18.04.2026, 16:20",
    resolution: "positive",
    source: "Пользователь · первичная оценка",
    changes: [
      "Первичная оценка контрагента",
      "Критические риски не выявлены",
      "Сформирован базовый профиль проверки",
    ],
    details: {
      groups: [
        { name: "Регистрационные сведения", note: "норма" },
        { name: "Финансы и налоги", note: "норма" },
        { name: "Судебная нагрузка", note: "норма" },
      ],
      criteria: [
        { name: "Базовый профиль", note: "сформирован" },
      ],
    },
  },
];

const positiveVersions: Version[] = [
  {
    id: "v4",
    label: "v4",
    date: "Сегодня, 14:32",
    resolution: "positive",
    source: "NORM AI · автообновление",
    changes: [
      "Резолюция не изменилась",
      "Обновлены регистрационные сведения",
      "Критические факторы риска не выявлены",
    ],
    details: {
      groups: [
        { name: "Регистрационные сведения", note: "данные обновлены" },
        { name: "Финансовые показатели", note: "без критичных факторов" },
        { name: "Судебная нагрузка", note: "нарушений нет" },
      ],
      criteria: [
        { name: "ЕГРЮЛ", note: "актуализирован" },
        { name: "Финансовый анализ", note: "без отклонений" },
      ],
    },
  },
  {
    id: "v3",
    label: "v3",
    date: "28.05.2026, 11:10",
    resolution: "positive",
    source: "Пользователь · ручной запуск",
    changes: [
      "Проверены финансовые показатели",
      "Судебные и репутационные признаки в норме",
      "Ограничения для сделки не выявлены",
    ],
    details: {
      groups: [
        { name: "Финансовые показатели", note: "проверены" },
        { name: "Судебная нагрузка", note: "норма" },
      ],
      criteria: [
        { name: "Репутация", note: "норма" },
      ],
    },
  },
  {
    id: "v2",
    label: "v2",
    date: "12.05.2026, 09:45",
    resolution: "positive",
    source: "NORM AI · плановое обновление",
    changes: [
      "Обновлены данные по ЕГРЮЛ",
      "Регистрационные риски не обнаружены",
      "Финансовые ограничения не блокируют сделку",
    ],
    details: {
      groups: [
        { name: "Регистрационные сведения", note: "обновлены" },
      ],
      criteria: [
        { name: "ЕГРЮЛ", note: "актуализирован" },
      ],
    },
  },
  {
    id: "v1",
    label: "v1",
    date: "18.04.2026, 16:20",
    resolution: "positive",
    source: "Пользователь · первичная оценка",
    changes: [
      "Первичная оценка контрагента",
      "Сформирован базовый профиль проверки",
      "Критические риски не выявлены",
    ],
    details: {
      groups: [
        { name: "Базовый профиль", note: "сформирован" },
      ],
      criteria: [
        { name: "Базовая проверка", note: "выполнена" },
      ],
    },
  },
];

function ResolutionBadge({ resolution }: { resolution: Resolution }) {
  return resolution === "negative" ? (
    <span className="inline-flex h-5 items-center rounded-full bg-rose-50 px-2 text-[11px] font-medium text-rose-700 border border-rose-100">
      Не заключать сделки
    </span>
  ) : (
    <span className="inline-flex h-5 items-center rounded-full bg-emerald-50 px-2 text-[11px] font-medium text-emerald-700 border border-emerald-100">
      Сделки заключать можно
    </span>
  );
}

export function AssessmentHistoryEntry({
  positive,
  onOpen,
}: {
  positive: boolean;
  onOpen: () => void;
}) {
  const versions = positive ? positiveVersions : negativeVersions;
  return (
    <button
      type="button"
      onClick={onOpen}
      className="flex w-full items-center gap-3 rounded-2xl border border-border bg-white p-3 text-left transition hover:bg-slate-50"
    >
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-600">
        <FileClock className="h-4 w-4" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-semibold text-foreground">История оценки</span>
        <span className="block text-[11px] text-muted-foreground">
          {versions.length} версии · последнее обновление сегодня
        </span>
      </span>
      <span className="text-[11px] font-medium text-muted-foreground">Открыть ›</span>
    </button>
  );
}

export function AssessmentHistoryDrawer({
  open,
  onOpenChange,
  positive,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  positive: boolean;
}) {
  const versions = positive ? positiveVersions : negativeVersions;
  const [expanded, setExpanded] = useState<string | null>(null);

  const handleDownloadAll = () => toast.success("История оценки скачана");
  const handleDownloadVersion = () => toast.success("Отчёт версии скачан");
  const handleCompare = () => toast.success("Сравнение версий скачано");

  return (
    <InModalDrawer open={open} onOpenChange={onOpenChange}>
      {/* Header */}
      <div className="px-6 pt-6 pb-4">
        <div className="flex items-start justify-between gap-3 pr-8">
          <div className="min-w-0">
            <h2 className="text-lg font-semibold tracking-tight">История оценки</h2>
            <p className="mt-1 text-xs text-muted-foreground">
              Версии оценки, изменения между ними и доступные отчёты.
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleDownloadAll}
            className="shrink-0 h-8 gap-1.5 rounded-full text-xs"
          >
            <Download className="h-3.5 w-3.5" /> Скачать всё
          </Button>
        </div>

        {/* Summary */}
        <div className="mt-4 grid grid-cols-2 gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-3">
          <SummaryStat label="Текущая версия" value={versions[0].label} />
          <SummaryStat label="Всего оценок" value={`${versions.length}`} />
          <SummaryStat label="Последняя оценка" value="Сегодня, 14:32" />
          <SummaryStat label="Изменений" value="6" />
        </div>
      </div>

      {/* Timeline */}
      <div className="px-6 pb-6">
        <div className="relative">
          <div
            className="absolute left-[11px] top-2 bottom-2 w-px bg-slate-200"
            aria-hidden="true"
          />
          <ul className="space-y-4">
            {versions.map((v, idx) => {
              const isCurrent = idx === 0;
              const isOpen = expanded === v.id;
              const isLast = idx === versions.length - 1;
              return (
                <li key={v.id} className="relative pl-8">
                  <span
                    className={cn(
                      "absolute left-[5px] top-2 h-[14px] w-[14px] rounded-full ring-2 ring-white",
                      isCurrent
                        ? v.resolution === "negative"
                          ? "bg-rose-500"
                          : "bg-emerald-500"
                        : "bg-slate-300",
                    )}
                  />
                  <div className="rounded-2xl border border-slate-100 bg-white p-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span className="text-sm font-semibold text-foreground">
                            {v.label}
                          </span>
                          {isCurrent ? (
                            <span className="inline-flex h-5 items-center rounded-full bg-primary/10 px-2 text-[11px] font-medium text-primary border border-primary/15">
                              Текущая
                            </span>
                          ) : (
                            <span className="inline-flex h-5 items-center rounded-full bg-muted px-2 text-[11px] font-medium text-muted-foreground">
                              Архивная
                            </span>
                          )}
                          <ResolutionBadge resolution={v.resolution} />
                        </div>
                        <div className="mt-1 text-[11px] text-muted-foreground">
                          {v.date} · {v.source}
                        </div>
                      </div>
                    </div>

                    <ul className="mt-2 space-y-1">
                      {v.changes.map((c, i) => (
                        <li
                          key={i}
                          className="flex gap-1.5 text-xs leading-snug text-muted-foreground"
                        >
                          <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-muted-foreground/50" />
                          <span>{c}</span>
                        </li>
                      ))}
                    </ul>

                    {isOpen && (
                      <div className="mt-3 space-y-3 border-t border-border/70 pt-3">
                        <div>
                          <div className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                            Изменившиеся группы
                          </div>
                          <ul className="mt-1.5 space-y-1">
                            {v.details.groups.map((g, i) => (
                              <li key={i} className="flex justify-between gap-3 text-xs">
                                <span className="text-foreground">{g.name}</span>
                                <span className="text-muted-foreground">{g.note}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <div className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                            Изменившиеся критерии
                          </div>
                          <ul className="mt-1.5 space-y-1">
                            {v.details.criteria.map((c, i) => (
                              <li key={i} className="flex justify-between gap-3 text-xs">
                                <span className="text-foreground">{c.name}</span>
                                <span className="text-muted-foreground">{c.note}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}

                    <div className="mt-3 flex flex-wrap items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => setExpanded(isOpen ? null : v.id)}
                        className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-[11px] font-medium text-foreground/70 hover:bg-muted/50 hover:text-foreground"
                      >
                        <ChevronDown
                          className={cn(
                            "h-3.5 w-3.5 transition-transform",
                            isOpen && "rotate-180",
                          )}
                        />
                        {isOpen ? "Свернуть" : "Подробнее"}
                      </button>
                      <button
                        type="button"
                        onClick={handleDownloadVersion}
                        className="inline-flex items-center gap-1 rounded-md border border-border bg-white px-2 py-1 text-[11px] font-medium text-foreground/80 hover:bg-muted/50"
                      >
                        <Download className="h-3.5 w-3.5" /> Скачать
                      </button>
                      {!isLast && (
                        <button
                          type="button"
                          onClick={handleCompare}
                          className="inline-flex items-center gap-1 rounded-md border border-border bg-white px-2 py-1 text-[11px] font-medium text-foreground/80 hover:bg-muted/50"
                        >
                          <GitCompare className="h-3.5 w-3.5" /> Сравнить
                        </button>
                      )}
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </InModalDrawer>
  );
}

function SummaryStat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[11px] uppercase tracking-wide text-muted-foreground">{label}</div>
      <div className="mt-0.5 text-sm font-medium text-foreground">{value}</div>
    </div>
  );
}
