import { useEffect, useState } from "react";
import { Check, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { InModalDrawer } from "./InModalDrawer";
import { getToneForTag, toneStyles } from "./header-theme";

export const CORRECTION_TAGS = [
  "Нет риска",
  "Риск дефолта",
  "Просрочено",
  "Просрочено с риском дефолта",
] as const;

export type CorrectionTag = (typeof CORRECTION_TAGS)[number];

export type CorrectionPayload = {
  comment: string;
  tag: CorrectionTag;
  monitoringDate: string;
};

export function AssessmentCorrectionDrawer({
  open,
  onOpenChange,
  onSubmit,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  onSubmit: (p: CorrectionPayload) => void;
}) {
  const [comment, setComment] = useState("");
  const [tag, setTag] = useState<CorrectionTag | null>(null);
  const [date, setDate] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (open) {
      setComment("");
      setTag(null);
      setDate("");
      setSubmitted(false);
    }
  }, [open]);

  const errors = {
    comment: !comment.trim(),
    tag: !tag,
    date: !date.trim(),
  };

  const handleSubmit = () => {
    setSubmitted(true);
    if (errors.comment || errors.tag || errors.date) return;
    onSubmit({ comment: comment.trim(), tag: tag!, monitoringDate: date });
    onOpenChange(false);
  };

  return (
    <InModalDrawer open={open} onOpenChange={onOpenChange}>
      <div className="p-6">
        <h2 className="text-lg font-semibold">Корректировка оценки</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Укажите, почему результат оценки нужно изменить, выберите новый статус
          контрагента и дату возврата на мониторинг.
        </p>

        <div className="mt-6 space-y-6">
          {/* Comment */}
          <div>
            <label className="mb-1.5 block text-sm font-medium">Комментарий</label>
            <Textarea
              rows={4}
              placeholder="Опишите, почему вы не согласны с текущей оценкой"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className={cn(
                "min-h-[104px]",
                submitted && errors.comment && "border-rose-400 focus-visible:ring-rose-300",
              )}
            />
            {submitted && errors.comment && (
              <div className="mt-1 text-xs text-rose-600">Добавьте комментарий</div>
            )}
          </div>

          {/* Tag */}
          <div>
            <label className="mb-2 block text-sm font-medium">Новый статус контрагента</label>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {CORRECTION_TAGS.map((t) => {
                const tone = getToneForTag(t);
                const styles = toneStyles[tone];
                const selected = tag === t;
                return (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTag(t)}
                    className={cn(
                      "flex items-center justify-between gap-2 rounded-xl border px-3 py-2.5 text-left transition",
                      "border-transparent hover:border-slate-200",
                      styles.badge,
                      selected && "ring-2 ring-primary ring-offset-1",
                    )}
                  >
                    <span className="text-sm font-medium">{t}</span>
                    {selected && <Check className="h-4 w-4" />}
                  </button>
                );
              })}
            </div>
            {submitted && errors.tag && (
              <div className="mt-1 text-xs text-rose-600">Выберите новый статус</div>
            )}
          </div>

          {/* Date */}
          <div>
            <label className="mb-1.5 block text-sm font-medium">
              Дата возврата на мониторинг
            </label>
            <Input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className={cn(
                submitted && errors.date && "border-rose-400 focus-visible:ring-rose-300",
              )}
            />
            <div className="mt-1.5 flex items-start gap-1.5 text-xs text-muted-foreground">
              <Info className="mt-0.5 h-3 w-3 shrink-0" />
              <span>
                С этой даты агент возобновит мониторинг и будет обновлять оценку по новым
                данным.
              </span>
            </div>
            {submitted && errors.date && (
              <div className="mt-1 text-xs text-rose-600">
                Укажите дату возврата на мониторинг
              </div>
            )}
          </div>

          <div className="flex gap-3 pt-1">
            <Button variant="ghost" className="flex-1" onClick={() => onOpenChange(false)}>
              Отменить
            </Button>
            <Button className="flex-1" onClick={handleSubmit}>
              Отправить
            </Button>
          </div>
        </div>
      </div>
    </InModalDrawer>
  );
}
