import { useEffect, useMemo, useState } from "react";
import { Dialog, DialogContent } from "@/shared/ui";
import { cn } from "@/lib/utils";
import { largeModalContentClass } from "@/lib/modal-styles";
import { toast } from "sonner";
import { Button } from "@/shared/ui";

import { ChevronRight, ChevronDown, X, CheckCircle2, Info as InfoIcon, Plus } from "@/shared/ui";

import type {
  Counterparty,
  Contract,
  RiskSignal,
  CollectionSubStep,
  OverdueRecord,
} from "@/domain/counterparty";
import { RiskDrawer, type DecisionKind, type RiskSavePayload } from "./RiskDrawer";
import { ContractDrawer } from "./ContractDrawer";

import {
  DebtProcessDrawer,
  type DebtHistoryEntry,
  type CompletedFields,
} from "./DebtProcessDrawer";
import { stepMetaByTitle } from "@/lib/debt-process";
import { getToneForTag, toneStyles } from "./header-theme";
import { CounterpartyStatusBadge } from "./CounterpartyStatusBadge";
import { getCounterpartyProblemIndicators, problemIndicatorMeta } from "@/lib/problem-indicators";
import { ResolutionCard } from "./ResolutionCard";
import { AssessmentModal, type AssessmentStatus, type Disagreement } from "./AssessmentModal";
import type { Assessment } from "@/domain/assessment";
import { useAssessment } from "@/hooks/useAssessment";
import { useCounterpartyCard } from "@/hooks/useCounterpartyCard";
import { defaultOgrn, defaultRegistrationInfo } from "./RegistrationInfoWidget";
import { RegistrationInfoDrawer } from "./RegistrationInfoDrawer";
import { AddContractDrawer } from "./AddContractDrawer";
import { CounterpartyHeaderMeta } from "./CounterpartyHeaderMeta";

const toFiniteNumber = (value: unknown) => {
  const numberValue = Number(value ?? 0);
  return Number.isFinite(numberValue) ? numberValue : 0;
};

export function CounterpartyModal({
  counterparty,
  open,
  onOpenChange,
  onStatusChange,
}: {
  counterparty: Counterparty | null;
  open: boolean;
  onOpenChange: (o: boolean) => void;
  onStatusChange?: (inn: string, status: Counterparty["status"]) => void;
}) {
  // Состояние карточки (risks/contracts/steps) + персистентные мутации — в hook.
  const {
    risks,
    setRisks,
    contracts,
    setContracts,
    steps,
    setSteps,
    persistRisk,
    persistContract,
    persistCollectionStep,
  } = useCounterpartyCard(counterparty, open);
  const [editing, setEditing] = useState<RiskSignal | null>(null);
  const [initialDecision, setInitialDecision] = useState<DecisionKind>("confirm");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [contractDrawer, setContractDrawer] = useState<Contract | null>(null);
  const [stepperError, setStepperError] = useState<string | null>(null);

  const [debtDrawerOpen, setDebtDrawerOpen] = useState(false);
  const [notification, setNotification] = useState<{
    tone: "success" | "info";
    text: string;
  } | null>(null);
  const [stepAnim, setStepAnim] = useState<{
    direction: "forward" | "backward";
    tick: number;
  } | null>(null);
  const [completedFields, setCompletedFields] = useState<CompletedFields>({});
  const [history, setHistory] = useState<DebtHistoryEntry[]>([]);
  const [assessmentOpen, setAssessmentOpen] = useState(false);
  const {
    assessment,
    loading: assessmentRunning,
    error: assessmentError,
    run: runAssessment,
    reset: resetAssessment,
  } = useAssessment();
  const [assessmentStatus, setAssessmentStatus] = useState<AssessmentStatus>("pending");
  const [assessmentConfirmedAt, setAssessmentConfirmedAt] = useState<string | undefined>(undefined);
  const [assessmentDisagreement, setAssessmentDisagreement] = useState<Disagreement | null>(null);
  const [registrationOpen, setRegistrationOpen] = useState(false);
  const [addContractOpen, setAddContractOpen] = useState(false);
  const [infoExpanded, setInfoExpanded] = useState(false);
  const ASSESSMENT_USER = "Михайлова Екатерина";

  useEffect(() => {
    if (counterparty && open) {
      const nextCollection = Array.isArray(counterparty.collection) ? counterparty.collection : [];
      // risks/contracts/steps инициализируются в useCounterpartyCard.
      setStepperError(null);
      setNotification(null);
      setStepAnim(null);
      setCompletedFields({});
      resetAssessment();
      void runAssessment(counterparty.name, counterparty.inn, {
        source: "auto",
        variant: counterparty.status === "no_risk" ? "positive" : "negative",
      });
      setAssessmentStatus("pending");
      setAssessmentConfirmedAt(undefined);
      setAssessmentDisagreement(null);
      setAssessmentOpen(false);
      const curStep = nextCollection.find((s) => s.status === "current");
      setHistory(
        curStep
          ? [
              {
                date: curStep.startDate ?? "—",
                action: "Создан кейс",
                step: curStep.title,
                user: "NORM AI",
              },
            ]
          : [],
      );
    }
  }, [counterparty, open]);

  // Auto-clear the highlight after the animation window.
  useEffect(() => {
    if (!stepAnim) return;
    const t = setTimeout(() => setStepAnim(null), 1400);
    return () => clearTimeout(t);
  }, [stepAnim]);

  const confirmed = useMemo(() => risks.filter((r) => r.status === "confirmed"), [risks]);
  const totalOverdue = contracts.reduce((acc, c) => {
    return acc + toFiniteNumber(c?.overdue);
  }, 0);
  const totalOverdueLabel = `${totalOverdue.toFixed(1)} млн. ₽`;
  const currentStage = steps.find((s) => s.status === "current");
  const allMeasures = confirmed.flatMap((r) => r.decision?.measures ?? []);

  const overdueStartDate = useMemo(() => {
    const dates = contracts
      .flatMap((c) => (c.overdueHistory ?? []).map((h) => h.date))
      .filter(Boolean);
    if (dates.length === 0) return "";
    const parsed = dates
      .map((d) => {
        const m = d.match(/^(\d{2})\.(\d{2})\.(\d{4})$/);
        return m ? new Date(+m[3], +m[2] - 1, +m[1]) : null;
      })
      .filter((d): d is Date => !!d);
    if (parsed.length === 0) return dates[0];
    const min = parsed.reduce((a, b) => (a < b ? a : b));
    const dd = String(min.getDate()).padStart(2, "0");
    const mm = String(min.getMonth() + 1).padStart(2, "0");
    return `${dd}.${mm}.${min.getFullYear()}`;
  }, [contracts]);

  const maxOverdueDays = useMemo(
    () =>
      contracts.reduce((m, c) => {
        return Math.max(m, toFiniteNumber(c?.overdueDays));
      }, 0),
    [contracts],
  );

  if (!counterparty) return null;

  // Сдвигает текущий этап на delta, возвращает изменённые шаги для persist.
  const shiftCurrentStep = (delta: 1 | -1): CollectionSubStep[] => {
    const curIdx = steps.findIndex((s) => s.status === "current");
    if (curIdx === -1) return [];
    const targetIdx = Math.max(0, Math.min(steps.length - 1, curIdx + delta));
    if (targetIdx === curIdx) return [];
    const changed: CollectionSubStep[] = [];
    const next = steps.map((s, i) => {
      if (i < targetIdx) {
        if (s.status !== "done") {
          const u = { ...s, status: "done" as const, overdue: false };
          changed.push(u);
          return u;
        }
        return s;
      }
      if (i === targetIdx) {
        const u: CollectionSubStep = {
          ...s,
          status: "current",
          startDate: new Date().toLocaleDateString("ru-RU"),
          sla: s.sla ?? "7 дней",
          plannedDate:
            s.plannedDate ?? new Date(Date.now() + 7 * 86400000).toLocaleDateString("ru-RU"),
          overdue: false,
          nextAction: s.nextAction ?? "Запланировать следующее действие",
        };
        changed.push(u);
        return u;
      }
      if (s.status !== "upcoming") {
        const u = { ...s, status: "upcoming" as const };
        changed.push(u);
        return u;
      }
      return s;
    });
    setSteps(next);
    return changed;
  };
  const moveCurrentStep = (delta: 1 | -1) => shiftCurrentStep(delta);

  const handleSave = (riskId: string, payload: RiskSavePayload) => {
    const prevRisk = risks.find((r) => r.id === riskId);
    const prevStatus = prevRisk?.status;
    if (!prevRisk) return;

    const updatedRisk: RiskSignal =
      payload.kind === "confirm"
        ? {
            ...prevRisk,
            status: "confirmed",
            decision: {
              date: payload.date,
              measures: payload.measures,
              comment: payload.comment,
              responsible: payload.responsible,
            },
            verification: undefined,
            dismissal: undefined,
          }
        : payload.kind === "dismiss"
          ? {
              ...prevRisk,
              status: "dismissed",
              dismissal: {
                date: payload.date,
                comment: payload.comment,
                responsible: payload.responsible,
              },
              decision: undefined,
              verification: undefined,
            }
          : {
              ...prevRisk,
              status: "verification",
              verification: {
                date: payload.date,
                plannedDate: payload.plannedDate,
                comment: payload.comment,
                responsible: payload.responsible,
              },
              decision: undefined,
              dismissal: undefined,
            };

    setRisks((prev) => prev.map((r) => (r.id === riskId ? updatedRisk : r)));

    // Persist обновлённое решение по риску; откат при ошибке.
    void persistRisk(updatedRisk)
      .then(() => toast.success("Решение по риску сохранено"))
      .catch(() => {
        setRisks((prev) => prev.map((r) => (r.id === riskId ? prevRisk : r)));
        toast.error("Не удалось сохранить решение по риску");
      });

    if (payload.kind === "verify") {
      setNotification({
        tone: "info",
        text: "Сигнал отправлен на проверку. Этап работы с задолженностью не изменился.",
      });
      return;
    }

    if (payload.kind === "dismiss") {
      if (prevStatus === "confirmed") {
        moveCurrentStep(-1);
        setStepAnim({ direction: "backward", tick: Date.now() });
        setTimeout(() => {
          setSteps((cur) => {
            const c = cur.find((s) => s.status === "current");
            setNotification({
              tone: "info",
              text: c
                ? `Риск снят. Этап работы с задолженностью возвращен: ${c.title}`
                : "Риск снят.",
            });
            return cur;
          });
        }, 0);
      } else {
        setNotification({
          tone: "info",
          text: "Риск снят. Этап работы с задолженностью не изменился.",
        });
      }
      return;
    }

    // confirm
    if (prevStatus === "confirmed") {
      setSteps((cur) => {
        const c = cur.find((s) => s.status === "current");
        setNotification({
          tone: "success",
          text: c
            ? `Решение по риску обновлено. Текущий этап: ${c.title}`
            : "Решение по риску обновлено.",
        });
        return cur;
      });
      return;
    }
    moveCurrentStep(1);
    setStepAnim({ direction: "forward", tick: Date.now() });
    setTimeout(() => {
      setSteps((cur) => {
        const c = cur.find((s) => s.status === "current");
        setNotification({
          tone: "success",
          text: c
            ? `Риск подтвержден. Этап работы с задолженностью изменен: ${c.title}`
            : "Риск подтвержден.",
        });
        return cur;
      });
    }, 0);
  };

  const pushHistory = (entry: DebtHistoryEntry) => setHistory((prev) => [entry, ...prev]);

  const handleFieldChange = (stepId: string, key: string, value: string) => {
    setCompletedFields((prev) => ({
      ...prev,
      [stepId]: { ...(prev[stepId] ?? {}), [key]: value },
    }));
    setStepperError(null);
  };

  const advanceStage = () => {
    setStepperError(null);
    const idx = steps.findIndex((s) => s.status === "current");
    if (idx === -1) return;
    const cur = steps[idx];
    const next = steps[idx + 1];
    if (!next) {
      setStepperError("Это последний этап процесса.");
      return;
    }

    const curMeta = stepMetaByTitle[cur.title];
    const curFields = completedFields[cur.id] ?? {};
    if (curMeta?.requiredFields?.length) {
      const missing = curMeta.requiredFields.filter((f) => !curFields[f.key]?.toString().trim());
      if (missing.length > 0) {
        setStepperError("Заполните обязательные данные для перехода на следующий этап.");
        return;
      }
    }

    // Rule 1: cannot enter "Судебная работа" stage without act of reconciliation
    if (next.stage === "Судебная работа" && cur.stage === "Досудебное урегулирование") {
      const reconciliationStep = steps.find((s) => s.title === "Сверка взаиморасчетов");
      const reconciliationDone =
        reconciliationStep &&
        (reconciliationStep.status === "done" ||
          !!completedFields[reconciliationStep.id]?.actSverki);
      if (!reconciliationDone) {
        setStepperError("Для перехода к судебной работе приложите акт сверки взаиморасчетов.");
        return;
      }
    }
    // Rule 2
    if (
      next.title === "Ведется исполнительное производство" &&
      cur.title !== "Получен судебный акт"
    ) {
      setStepperError("Нельзя перейти к исполнительному производству без судебного акта.");
      return;
    }
    // Rule 3
    if (next.title === "Задолженность погашена" && totalOverdue > 0) {
      setStepperError("Нельзя закрыть кейс: остается просроченная задолженность.");
      return;
    }

    const doneStep: CollectionSubStep = { ...steps[idx], status: "done", overdue: false };
    const nextStep: CollectionSubStep = {
      ...steps[idx + 1],
      status: "current",
      startDate: new Date().toLocaleDateString("ru-RU"),
      sla: steps[idx + 1].sla ?? "7 дней",
      plannedDate:
        steps[idx + 1].plannedDate ??
        new Date(Date.now() + 7 * 86400000).toLocaleDateString("ru-RU"),
      overdue: false,
      nextAction: steps[idx + 1].nextAction ?? "Запланировать следующее действие",
    };
    setSteps((prev) => {
      const arr = [...prev];
      arr[idx] = doneStep;
      arr[idx + 1] = nextStep;
      return arr;
    });
    setStepAnim({ direction: "forward", tick: Date.now() });
    pushHistory({
      date: new Date().toLocaleDateString("ru-RU"),
      action: "Переведен этап",
      step: next.title,
      user: counterparty?.risks?.[0]?.decision?.responsible ?? "Михайлова Екатерина",
    });
    // Persist обновлённые этапы; откат при ошибке.
    Promise.all([persistCollectionStep(doneStep), persistCollectionStep(nextStep)])
      .then(() => toast.success("Этап переведён"))
      .catch(() => {
        setSteps((_prev) => steps);
        toast.error("Не удалось сохранить переход этапа");
      });
  };

  const rollbackStage = (comment: string) => {
    setStepperError(null);
    const idx = steps.findIndex((s) => s.status === "current");
    if (idx <= 0) return;
    const prevStep = steps[idx - 1];
    const updatedCurrent: CollectionSubStep = { ...steps[idx], status: "upcoming" };
    const updatedPrev: CollectionSubStep = { ...prevStep, status: "current", overdue: false };
    setSteps((prev) =>
      prev.map((s, i) => (i === idx ? updatedCurrent : i === idx - 1 ? updatedPrev : s)),
    );
    setStepAnim({ direction: "backward", tick: Date.now() });
    pushHistory({
      date: new Date().toLocaleDateString("ru-RU"),
      action: "Откат этапа",
      step: prevStep.title,
      user: "Михайлова Екатерина",
      comment,
    });
    setNotification({
      tone: "info",
      text: "Этап возвращен. Комментарий сохранен в истории.",
    });
    Promise.all([persistCollectionStep(updatedCurrent), persistCollectionStep(updatedPrev)]).catch(
      () => {
        setSteps((_p) => steps);
        toast.error("Не удалось сохранить откат этапа");
      },
    );
  };

  const advanceContractStage = (id: string) => {
    const stageOrder = [
      "Досудебное урегулирование",
      "Судебная работа",
      "Принудительное взыскание",
      "Завершение работы",
    ];
    let updated: Contract | null = null;
    setContracts((prev) =>
      prev.map((c) => {
        if (c.id !== id) return c;
        const i = stageOrder.indexOf(c.collectionStage ?? "");
        const next: Contract = {
          ...c,
          collectionStage: stageOrder[Math.min(i + 1, stageOrder.length - 1)] || stageOrder[0],
        };
        updated = next;
        return next;
      }),
    );
    if (updated) {
      void persistContract(updated).catch(() => toast.error("Не удалось сохранить этап договора"));
    }
  };

  const addOverdue = (id: string, record: OverdueRecord) => {
    let nextContract: Contract | null = null;
    setContracts((prev) =>
      prev.map((c) => {
        if (c.id !== id) return c;
        const updated: Contract = {
          ...c,
          overdue: toFiniteNumber(c.overdue) + toFiniteNumber(record.amount),
          overdueDays: Math.max(toFiniteNumber(c.overdueDays), toFiniteNumber(record.days)),
          overdueHistory: [record, ...(c.overdueHistory ?? [])],
        };
        nextContract = updated;
        return updated;
      }),
    );
    setContractDrawer((prev) =>
      prev && prev.id === id
        ? {
            ...prev,
            overdue: toFiniteNumber(prev.overdue) + toFiniteNumber(record.amount),
            overdueDays: Math.max(toFiniteNumber(prev.overdueDays), toFiniteNumber(record.days)),
            overdueHistory: [record, ...(prev.overdueHistory ?? [])],
          }
        : prev,
    );
    if (nextContract) void persistContract(nextContract);
  };

  const problemIndicators = getCounterpartyProblemIndicators(counterparty)
    .map((key) => {
      const meta = problemIndicatorMeta[key] as
        | Partial<(typeof problemIndicatorMeta)[typeof key]>
        | undefined;
      const Icon = meta?.icon;
      const label = meta?.label;
      if (!Icon || !label) return null;
      return {
        key,
        Icon,
        label,
        activeBorder: meta.activeBorder ?? "border-border",
        activeBg: meta.activeBg ?? "bg-white",
        iconColor: meta.iconColor ?? "text-muted-foreground",
      };
    })
    .filter((item): item is NonNullable<typeof item> => item !== null);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn(
          largeModalContentClass,
          "gap-0 [&>button]:hidden sm:max-w-[calc(100vw-32px)] sm:rounded-3xl",
        )}
      >
        <div className="relative flex min-h-0 flex-1 flex-col">
          {/* Header */}
          {(() => {
            const categoryLabel: Record<Counterparty["status"], string> = {
              no_risk: "Нет риска",
              risk: "Риск дефолта",
              overdue: "Просрочено",
              overdue_risk: "Просрочено с риском дефолта",
            };
            const tagLabel = categoryLabel[counterparty.status];
            const tone = getToneForTag(tagLabel);
            const styles = toneStyles[tone];
            return (
              <div className={`shrink-0 px-5 pt-6 pb-6 lg:px-10 ${styles.gradient}`}>
                <button
                  onClick={() => onOpenChange(false)}
                  className="absolute right-5 top-5 rounded-full bg-white/70 p-1.5 text-muted-foreground backdrop-blur hover:bg-white"
                  aria-label="Закрыть"
                >
                  <X className="h-4 w-4" />
                </button>
                <div className="flex flex-wrap items-center gap-1.5">
                  <CounterpartyStatusBadge tag={tagLabel} />
                  {problemIndicators.map((item) => {
                    const Icon = item.Icon;
                    return (
                      <span
                        key={item.key}
                        aria-label={item.label}
                        title={item.label}
                        className={`inline-flex h-7 w-7 cursor-help items-center justify-center rounded-full border ${item.activeBorder} ${item.activeBg} transition hover:brightness-95`}
                      >
                        <Icon className={`h-3.5 w-3.5 ${item.iconColor}`} />
                      </span>
                    );
                  })}
                </div>
                <h2 className="mt-3 text-2xl font-semibold tracking-tight text-foreground min-w-0 truncate">
                  {counterparty.name}
                </h2>
                <CounterpartyHeaderMeta inn={counterparty.inn} />
              </div>
            );
          })()}

          <div className="grid grid-cols-1 gap-y-6 gap-x-6 bg-white px-5 py-6 lg:grid-cols-[minmax(0,1fr)_300px] lg:gap-x-8 lg:px-10 min-h-0 flex-1 overflow-y-auto">
            <div className="space-y-6 min-w-0">
              {counterparty.status === "no_risk" ? (
                <ResolutionCard
                  variant="positive"
                  title="Сделки заключать можно"
                  description="Критически значимых факторов риска не выявлено. Контрагент может быть допущен к заключению сделки в рамках стандартного процесса согласования."
                  onDetailsClick={() => setAssessmentOpen(true)}
                />
              ) : (
                <ResolutionCard
                  title="Рекомендуется не заключать новые сделки"
                  description="По оценке благонадёжности выявлены критичные и финансовые маркеры. До проверки спорных критериев заключение новых сделок нежелательно."
                  onDetailsClick={() => setAssessmentOpen(true)}
                />
              )}
              <div className="grid grid-cols-2 gap-3">
                <DebtCard label="Общая задолженность" value={counterparty.totalDebt} />
                <DebtCard
                  label="Просроченная задолженность"
                  value={totalOverdueLabel}
                  accent={totalOverdue > 0}
                />
              </div>
              {notification && (
                <div
                  className={`flex items-start gap-2.5 rounded-xl border px-3.5 py-3 text-sm ${
                    notification.tone === "success"
                      ? "border-emerald-200 bg-emerald-50/70 text-emerald-900"
                      : "border-border bg-slate-50 text-foreground"
                  }`}
                  role="status"
                >
                  {notification.tone === "success" ? (
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                  ) : (
                    <InfoIcon className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                  )}
                  <div className="flex-1 leading-snug">{notification.text}</div>
                  <button
                    onClick={() => setNotification(null)}
                    className="shrink-0 rounded p-0.5 text-muted-foreground transition hover:bg-black/5 hover:text-foreground"
                    aria-label="Закрыть уведомление"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              )}

              {/* Section: Contracts */}
              <section>
                <SectionTitle title="Договоры" count={contracts.length} muted />
                <div className="overflow-hidden rounded-xl border border-border bg-white">
                  {contracts.map((c, i) => {
                    const amount = toFiniteNumber(c.amount);
                    const debt = toFiniteNumber(c.debt);
                    const overdueAmount = toFiniteNumber(c.overdue);
                    const historyDays = (c.overdueHistory ?? []).map((h) => toFiniteNumber(h.days));
                    const overdueDays =
                      historyDays.length > 0
                        ? Math.max(...historyDays)
                        : toFiniteNumber(c.overdueDays);
                    const overdue = overdueAmount > 0;
                    return (
                      <button
                        key={c.id ?? i}
                        onClick={() => setContractDrawer(c)}
                        className={`flex w-full items-center gap-4 px-4 py-3 text-left transition hover:bg-muted/40 ${
                          i > 0 ? "border-t border-border" : ""
                        }`}
                      >
                        <div className="grid min-w-0 flex-1 grid-cols-2 gap-3 sm:grid-cols-5">
                          <Cell
                            label="Договор"
                            value={c.number ?? "—"}
                            sub={`от ${c.date ?? "—"}`}
                          />
                          <Cell label="Сумма" value={`${amount.toFixed(1)} млн. ₽`} />
                          <Cell label="Задолженность" value={`${debt.toFixed(1)} млн. ₽`} />
                          <Cell
                            label="Просрочено"
                            value={overdue ? `${overdueAmount.toFixed(1)} млн. ₽` : "нет"}
                            sub={overdue ? `${overdueDays} дн.` : undefined}
                            accent={overdue}
                          />
                          <Cell label="Этап" value={c.collectionStage ?? "—"} />
                        </div>
                        <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
                      </button>
                    );
                  })}
                </div>

                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setAddContractOpen(true)}
                  className="mt-3 h-11 w-full justify-center rounded-xl border border-border bg-slate-50 text-sm font-medium text-foreground hover:bg-slate-100"
                >
                  <Plus className="mr-1.5 h-4 w-4" />
                  Добавить договор
                </Button>

                <AddContractDrawer
                  open={addContractOpen}
                  onOpenChange={setAddContractOpen}
                  onAdd={(c) => {
                    setContracts((prev) => [...prev, c]);
                    void persistContract(c);
                    toast.success("Договор добавлен");
                  }}
                />
              </section>
            </div>

            <div className="self-start">
              <CounterpartyInfoWidget />
            </div>
          </div>
        </div>

        {/* In-modal drawers */}
        <DebtProcessDrawer
          steps={steps}
          stepAnim={stepAnim}
          open={debtDrawerOpen}
          onOpenChange={(o) => {
            setDebtDrawerOpen(o);
            if (!o) setStepperError(null);
          }}
          onAdvance={advanceStage}
          onRollback={rollbackStage}
          onFieldChange={handleFieldChange}
          completedFields={completedFields}
          history={history}
          summary={{
            overdueAmount: totalOverdueLabel,
            overdueStartDate,
            overdueDays: maxOverdueDays,
            responsible: "Михайлова Екатерина",
          }}
          error={stepperError}
        />

        <RiskDrawer
          risk={editing}
          initialDecision={initialDecision}
          open={drawerOpen}
          onOpenChange={setDrawerOpen}
          onSave={handleSave}
        />

        <ContractDrawer
          counterpartyName={counterparty.name}
          caseStatusLabel={counterparty.tag}
          confirmedRisks={confirmed.map((r) => r.type)}
          contract={contractDrawer}
          measures={allMeasures}
          open={!!contractDrawer}
          onOpenChange={(o) => !o && setContractDrawer(null)}
          onAddOverdue={addOverdue}
          onAdvanceStage={(id) => {
            advanceContractStage(id);
            setContractDrawer((prev) => {
              if (!prev) return prev;
              const stages = [
                "Досудебное урегулирование",
                "Судебная работа",
                "Принудительное взыскание",
                "Завершение работы",
              ];
              const i = stages.indexOf(prev.collectionStage ?? "");
              return {
                ...prev,
                collectionStage: stages[Math.min(i + 1, stages.length - 1)] || stages[0],
              };
            });
          }}
          onUpdateContract={(id, patch) => {
            setContracts((prev) =>
              prev.map((c) => {
                if (c.id !== id) return c;
                const updated = { ...c, ...patch };
                void persistContract(updated);
                return updated;
              }),
            );
            setContractDrawer((prev) => (prev && prev.id === id ? { ...prev, ...patch } : prev));
          }}
        />

        <RegistrationInfoDrawer
          open={registrationOpen}
          onOpenChange={setRegistrationOpen}
          counterpartyName={counterparty.name}
          inn={counterparty.inn}
          ogrn={defaultOgrn}
        />
      </DialogContent>
      <AssessmentModal
        assessment={assessment}
        open={assessmentOpen}
        onOpenChange={setAssessmentOpen}
        onBack={() => setAssessmentOpen(false)}
        onCloseFlow={() => {
          setAssessmentOpen(false);
          onOpenChange(false);
        }}
        status={assessmentStatus}
        disagreement={assessmentDisagreement}
        defaultInn={counterparty.inn}
        running={assessmentRunning}
        error={assessmentError}
        onRetry={() =>
          void runAssessment(counterparty.name, counterparty.inn, {
            source: "auto",
            variant: counterparty.status === "no_risk" ? "positive" : "negative",
          })
        }
        positive={counterparty.status === "no_risk"}
        onRun={(inn) => {
          void runAssessment(counterparty.name, inn, {
            source: "manual",
            variant: counterparty.status === "no_risk" ? "positive" : "negative",
          }).then((a) => {
            if (a) {
              setAssessmentStatus("updated");
              setAssessmentConfirmedAt(undefined);
              setAssessmentDisagreement(null);
            }
          });
        }}
        onConfirm={() => {
          setAssessmentStatus("confirmed");
          setAssessmentConfirmedAt(new Date().toLocaleDateString("ru-RU"));
          setAssessmentDisagreement(null);
        }}
        onDisagree={(d) => {
          setAssessmentDisagreement(d);
          setAssessmentStatus("disagreed");
        }}
        onStatusChange={(s) => onStatusChange?.(counterparty.inn, s)}
      />
    </Dialog>
  );
}

function Stat({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div>
      <div className="text-[11px] uppercase tracking-wide text-muted-foreground">{label}</div>
      <div className={`mt-0.5 text-sm font-semibold ${accent ? "text-amber-700" : ""}`}>
        {value}
      </div>
    </div>
  );
}

function DebtCard({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="rounded-xl border border-border bg-white px-4 py-3">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className={`mt-1 text-lg font-semibold ${accent ? "text-rose-600" : "text-foreground"}`}>
        {value}
      </div>
    </div>
  );
}

function SectionTitle({
  title,
  count,
  tone,
  muted,
}: {
  title: string;
  count: number;
  tone?: "warn";
  muted?: boolean;
}) {
  const cls =
    tone === "warn"
      ? "bg-amber-100 text-amber-900"
      : muted
        ? "bg-muted text-muted-foreground"
        : "bg-primary/10 text-primary";
  return (
    <div className="mb-3 flex items-center gap-2">
      <h3 className="text-base font-semibold">{title}</h3>
      <span className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${cls}`}>{count}</span>
    </div>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <div className="rounded-xl border border-dashed border-border bg-white p-6 text-center text-sm text-muted-foreground">
      {text}
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <div className="text-[11px] uppercase tracking-wide text-muted-foreground">{label}</div>
      <div className="mt-0.5 text-sm leading-snug text-foreground break-words">{value}</div>
    </div>
  );
}

function Cell({
  label,
  value,
  sub,
  accent,
}: {
  label: string;
  value: string;
  sub?: string;
  accent?: boolean;
}) {
  return (
    <div className="min-w-0">
      <div className="text-[10px] uppercase tracking-wide text-muted-foreground">{label}</div>
      <div className={`truncate text-sm font-medium ${accent ? "text-amber-700" : ""}`}>
        {value}
      </div>
      {sub && <div className="text-[11px] text-muted-foreground">{sub}</div>}
    </div>
  );
}

function CounterpartyInfoWidget() {
  return (
    <div className="rounded-2xl border border-border bg-white p-4">
      <h4 className="text-base font-semibold">Информация</h4>
      <div className="mt-3 space-y-3">
        <InfoRow label="Обновлено из 1С" value="31.03.26" />
        <InfoRow label="Отредактировано" value="01.04.2027" />
        <InfoRow label="Автор" value="Иванов Иван Иванович" />
      </div>
    </div>
  );
}
