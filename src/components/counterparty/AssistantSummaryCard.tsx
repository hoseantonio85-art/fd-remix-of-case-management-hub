import { Sparkles, ChevronRight, CheckCircle2, AlertTriangle, RotateCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NormAssistantIcon } from "./NormAssistantIcon";
import type { AssessmentStatus, Disagreement } from "./AssessmentModal";

type StateMeta = {
  badgeLabel: string;
  badgeCls: string;
  borderCls: string;
  iconBg: string;
  iconText: string;
  Icon: typeof Sparkles;
  text: string;
};

const stateMeta: Record<AssessmentStatus, StateMeta> = {
  pending: {
    badgeLabel: "Оценка требует подтверждения",
    badgeCls: "bg-amber-50 text-amber-800 border-amber-200",
    borderCls: "border-border",
    iconBg: "bg-primary/10",
    iconText: "text-primary",
    Icon: Sparkles,
    text: "Я проверил контрагента по 43 критериям благонадёжности. Выявлены критические маркеры по деловой репутации и признаки ограничений ФНС. За последний период появились 2 новых фактора, требующих проверки.",
  },
  confirmed: {
    badgeLabel: "Оценка подтверждена",
    badgeCls: "bg-emerald-50 text-emerald-800 border-emerald-200",
    borderCls: "border-emerald-200",
    iconBg: "bg-emerald-50",
    iconText: "text-emerald-700",
    Icon: CheckCircle2,
    text: "Оценка контрагента подтверждена. По результатам проверки зафиксированы критические маркеры и факторы, требующие контроля. Рекомендую использовать подтверждённую оценку при принятии решения по рискам и работе с задолженностью.",
  },
  disagreed: {
    badgeLabel: "Не согласовано",
    badgeCls: "bg-slate-100 text-slate-700 border-slate-200",
    borderCls: "border-slate-200",
    iconBg: "bg-amber-50",
    iconText: "text-amber-700",
    Icon: AlertTriangle,
    text: "По оценке контрагента зафиксировано несогласие. Комментарий сохранён и будет учитываться при дальнейшей проверке. Рекомендую открыть оценку и проверить спорные критерии.",
  },
  updated: {
    badgeLabel: "Оценка обновлена, требуется подтверждение",
    badgeCls: "bg-primary/10 text-primary border-primary/20",
    borderCls: "border-primary/20",
    iconBg: "bg-primary/10",
    iconText: "text-primary",
    Icon: RotateCw,
    text: "Оценка обновлена по запущенному ИНН. Обнаружены новые факторы за последний период. Проверьте результат и подтвердите или оставьте комментарий к несогласию.",
  },
  review: {
    badgeLabel: "Оценка на пересмотре",
    badgeCls: "bg-violet-50 text-violet-700 border-violet-200",
    borderCls: "border-violet-200",
    iconBg: "bg-violet-50",
    iconText: "text-violet-700",
    Icon: RotateCw,
    text: "По оценке отправлены замечания. Выбранные группы переданы на повторную проверку.",
  },
};

export function AssistantSummaryCard({
  onOpen,
  status,
  confirmedAt,
  confirmedBy,
  disagreement,
  sourceLabel,
}: {
  onOpen: () => void;
  status: AssessmentStatus;
  confirmedAt?: string;
  confirmedBy?: string;
  disagreement?: Disagreement | null;
  sourceLabel?: string;
}) {
  const m = stateMeta[status];
  return (
    <div className={`rounded-2xl border ${m.borderCls} bg-white p-4 shadow-sm`}>
      <div className="flex items-start gap-3">
        <NormAssistantIcon size="sm" />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <div className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
              NORM AI · Оценка благонадёжности
            </div>
            <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium ${m.badgeCls}`}>
              {m.badgeLabel}
            </span>
          </div>
          <p className="mt-1 text-sm leading-snug text-foreground">{m.text}</p>

          {status === "confirmed" && (confirmedAt || confirmedBy) && (
            <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[11px] text-muted-foreground">
              <span>Статус: <b className="font-medium text-emerald-700">Оценка подтверждена</b></span>
              {confirmedBy && <span>· Подтвердил: <b className="font-medium text-foreground">{confirmedBy}</b></span>}
              {confirmedAt && <span>· Дата: <b className="font-medium text-foreground">{confirmedAt}</b></span>}
            </div>
          )}

          {status === "disagreed" && disagreement && (
            <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[11px] text-muted-foreground">
              <span>Статус: <b className="font-medium text-foreground">Не согласовано</b></span>
              <span>· Причина: <b className="font-medium text-foreground">{disagreement.reason}</b></span>
              {confirmedBy && <span>· Автор: <b className="font-medium text-foreground">{confirmedBy}</b></span>}
            </div>
          )}

          {status === "updated" && sourceLabel && (
            <div className="mt-2 text-[11px] text-muted-foreground">Источник: {sourceLabel}</div>
          )}

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <Button size="sm" className="h-8 px-3 text-xs" onClick={onOpen}>
              Открыть оценку
              <ChevronRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
