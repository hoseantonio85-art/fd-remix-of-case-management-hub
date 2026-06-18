import { useState } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X, AlertTriangle, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { largeModalContentClass } from "@/lib/modal-styles";
import {
  type Assessment,
  type AssessmentGroup,
  MAIN_GROUP_IDS,
} from "@/lib/assessment-data";
import { GroupCard, AssessmentInfoWidget } from "./AssessmentModal";
import {
  LEVEL_ORDER,
  LevelAccordion,
  RISKS,
  RisksCounter,
  CONTRACT_ERRORS,
  ErrorCard,
  type Level,
} from "./ContractAssessmentModal";
import { InModalDrawer } from "./InModalDrawer";

export function ComplexAssessmentModal({
  assessment,
  open,
  onOpenChange,
  positive = true,
  onDelete,
  onAddToList,
}: {
  assessment: Assessment | null;
  open: boolean;
  onOpenChange: (o: boolean) => void;
  positive?: boolean;
  onDelete?: () => void;
  onAddToList?: () => void;
}) {
  if (!assessment) return null;

  const headerBg = positive
    ? "bg-gradient-to-b from-emerald-50 via-emerald-50/40 to-transparent"
    : "bg-gradient-to-b from-rose-50 via-rose-50/40 to-transparent";
  const resolutionBadge = positive
    ? { label: "Сделки заключать можно", chip: "bg-emerald-100 text-emerald-900" }
    : { label: "Не заключать сделки", chip: "bg-rose-100 text-rose-900" };

  const grouped: Record<Level, typeof RISKS> = {
    very_high: RISKS.filter((r) => r.level === "very_high"),
    high: RISKS.filter((r) => r.level === "high"),
    medium: RISKS.filter((r) => r.level === "medium"),
    low: RISKS.filter((r) => r.level === "low"),
  };
  const topLevel: Level =
    LEVEL_ORDER.find((l) => grouped[l].length > 0) ?? "low";
  const topMeta = levelMeta[topLevel];

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
            <div className={cn("shrink-0 px-5 pt-6 pb-6 lg:px-10", headerBg)}>
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
                <span
                  className={cn(
                    "inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-medium",
                    resolutionBadge.chip,
                  )}
                >
                  {resolutionBadge.label}
                </span>
              </div>
              <h2 className="mt-3 text-2xl font-semibold tracking-tight text-foreground">
                Оценка контрагента {assessment.counterpartyName}
              </h2>
              <div className="mt-1 text-xs text-muted-foreground">
                ИНН {assessment.inn}
              </div>
            </div>

            {/* Body */}
            <div className="min-h-0 flex-1 overflow-y-auto bg-white px-5 py-6 lg:px-10">
              <div className="grid gap-y-6 gap-x-5 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-x-12">
                <aside className="order-2 lg:col-start-2 lg:row-start-1 lg:mt-9">
                  <div className="space-y-3 lg:sticky lg:top-0">
                    <AssessmentInfoWidget
                      inn={assessment.inn}
                      contractFile="dogovor_uslugi_v3.pdf"
                    />
                  </div>
                </aside>

                <section className="order-1 space-y-7 lg:col-start-1 lg:row-start-1">
                  {/* Counterparty assessment */}
                  <div>
                    <h3 className="text-base font-semibold text-foreground">
                      Оценка контрагента
                    </h3>
                    <div className="mt-3 grid grid-cols-1 gap-2.5">
                      {MAIN_GROUP_IDS.map((id) => {
                        const g = assessment.groups.find((x) => x.id === id);
                        if (!g) return null;
                        return (
                          <GroupCard
                            key={g.id}
                            group={g as AssessmentGroup}
                            onOpen={() => {}}
                          />
                        );
                      })}
                    </div>
                  </div>

                  {/* Contract assessment */}
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-base font-semibold text-foreground">
                        Оценка договоров
                      </h3>
                      <RisksCounter count={RISKS.length} />
                      <span
                        className={cn(
                          "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-medium",
                          topMeta.chip,
                        )}
                      >
                        {topLevel === "very_high" && (
                          <ArrowUp className="h-3 w-3" />
                        )}
                        {topMeta.label}
                      </span>
                    </div>
                    <div className="mt-3 space-y-3">
                      {LEVEL_ORDER.map((lvl) => (
                        <LevelAccordion
                          key={lvl}
                          level={lvl}
                          risks={grouped[lvl]}
                        />
                      ))}
                    </div>
                  </div>
                </section>
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
                  onClick={onAddToList}
                  className="h-12 flex-1 rounded-full text-sm font-medium"
                >
                  Добавить в список дебиторов
                </Button>
              </div>
            </div>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
