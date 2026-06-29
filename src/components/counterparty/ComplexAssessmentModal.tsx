import { useState } from "react";
import { DialogPrimitive } from "@/shared/ui";
import { AlertTriangle, ChevronRight, EllipseIconButton, StatusBadge } from "@/shared/ui";
import { Button } from "@/shared/ui";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/shared/ui";
import { cn } from "@/lib/utils";
import { largeModalContentClass } from "@/lib/modal-styles";
import { type Assessment, type AssessmentGroup, MAIN_GROUP_IDS } from "@/domain/assessment";
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
import { SourcesDrawer, DEFAULT_CONTRACT_SOURCE } from "./SourcesDrawer";
import { CounterpartyHeaderMeta } from "./CounterpartyHeaderMeta";


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
  const [tab, setTab] = useState<"counterparty" | "contract">("counterparty");
  const [errorsOpen, setErrorsOpen] = useState(false);
  const [sourcesOpen, setSourcesOpen] = useState(false);


  if (!assessment) return null;

  const headerBg = positive
    ? "bg-gradient-to-b from-emerald-50 via-emerald-50/40 to-transparent"
    : "bg-gradient-to-b from-rose-50 via-rose-50/40 to-transparent";
  const resolutionLabel = positive ? "Сделки заключать можно" : "Не заключать сделки";
  const resolutionTone = positive ? "success" : "danger";

  const grouped: Record<Level, typeof RISKS> = {
    very_high: RISKS.filter((r) => r.level === "very_high"),
    high: RISKS.filter((r) => r.level === "high"),
    medium: RISKS.filter((r) => r.level === "medium"),
    low: RISKS.filter((r) => r.level === "low"),
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
            <div className={cn("shrink-0 px-5 pt-6 pb-6 pr-16 lg:px-10 lg:pr-20", headerBg)}>
              <span className="absolute right-5 top-5 z-10">
                <EllipseIconButton
                  icon="cross"
                  aria-label="Закрыть"
                  onClick={() => onOpenChange(false)}
                />
              </span>
              <div className="flex flex-wrap items-center gap-1.5">
                <StatusBadge tone={resolutionTone} size="regular">
                  {resolutionLabel}
                </StatusBadge>
              </div>
              <h2 className="mt-3 text-2xl font-semibold tracking-tight text-foreground">
                Оценка контрагента {assessment.counterpartyName}
              </h2>
              <CounterpartyHeaderMeta
                inn={assessment.inn}
                status="действующая"
                contractType="Договор об оказании услуг"
              />
            </div>

            {/* Body */}
            <div className="min-h-0 flex-1 overflow-y-auto bg-white px-5 py-6 lg:px-10">
              <Tabs
                value={tab}
                onValueChange={(v) => setTab(v as "counterparty" | "contract")}
                className="w-full"
              >
                <TabsList className="mb-5">
                  <TabsTrigger value="counterparty">Проверка контрагента</TabsTrigger>
                  <TabsTrigger value="contract">Проверка по договору</TabsTrigger>
                </TabsList>

                <div className="grid gap-y-5 gap-x-5 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-x-12">
                  <section className="order-1 lg:col-start-1 lg:row-start-1">
                    <TabsContent value="counterparty" className="mt-0">
                      <div className="grid grid-cols-1 gap-2.5">
                        {MAIN_GROUP_IDS.map((id) => {
                          const g = assessment.groups.find((x) => x.id === id);
                          if (!g) return null;
                          return (
                            <GroupCard key={g.id} group={g as AssessmentGroup} onOpen={() => {}} />
                          );
                        })}
                      </div>
                    </TabsContent>
                    <TabsContent value="contract" className="mt-0">
                      <div className="space-y-3">
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
                      </div>
                    </TabsContent>
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
              </Tabs>
            </div>

            <InModalDrawer open={errorsOpen} onOpenChange={setErrorsOpen}>
              <div className="px-6 pt-6 pb-4 pr-16">
                <h3 className="text-lg font-semibold text-foreground">Ошибки документа</h3>
                <p className="mt-1 text-[13px] text-muted-foreground">
                  Найдено {CONTRACT_ERRORS.length} ошибок, которые могут повлиять на корректность
                  договора.
                </p>
              </div>
              <div className="space-y-2 px-6 pb-6">
                {CONTRACT_ERRORS.map((e) => (
                  <ErrorCard key={e.id} err={e} />
                ))}
              </div>
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
              <div className="flex gap-3">
                <Button variant="outline" size="lg" onClick={onDelete} className="flex-1">
                  Удалить
                </Button>
                <Button size="lg" onClick={onAddToList} className="flex-1">
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
