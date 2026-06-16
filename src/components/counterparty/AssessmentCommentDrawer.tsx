import { useEffect, useState } from "react";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { InModalDrawer } from "./InModalDrawer";
import {
  type AssessmentGroup,
  type AssessmentGroupId,
  groupCounts,
} from "@/lib/assessment-data";

export type AssessmentCommentPayload = {
  groupIds: AssessmentGroupId[];
  groupTitles: string[];
  comment: string;
};

export function AssessmentCommentDrawer({
  open,
  onOpenChange,
  groups,
  onSubmit,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  groups: AssessmentGroup[];
  onSubmit: (p: AssessmentCommentPayload) => void;
}) {
  const [selected, setSelected] = useState<AssessmentGroupId[]>([]);
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (open) {
      setSelected([]);
      setComment("");
      setSubmitted(false);
    }
  }, [open]);

  const toggle = (id: AssessmentGroupId) =>
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );

  const errors = {
    groups: selected.length === 0,
    comment: !comment.trim(),
  };

  const handleSave = () => {
    setSubmitted(true);
    if (errors.groups || errors.comment) return;
    const chosen = groups.filter((g) => selected.includes(g.id));
    onSubmit({
      groupIds: chosen.map((g) => g.id),
      groupTitles: chosen.map((g) => g.title),
      comment: comment.trim(),
    });
    onOpenChange(false);
  };

  return (
    <InModalDrawer open={open} onOpenChange={onOpenChange}>
      <div className="flex min-h-full flex-col">
        <div className="flex-1 overflow-y-auto p-6 pb-4">
          <h2 className="text-lg font-semibold">Замечание к оценке</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Выберите группы оценки, к которым относится замечание, и опишите,
            с чем вы не согласны.
          </p>

          <div className="mt-6">
            <label className="mb-2 block text-sm font-medium">
              Группы оценки
            </label>
            <div className="grid grid-cols-1 gap-2">
              {groups.map((g) => {
                const isSelected = selected.includes(g.id);
                const counts = groupCounts(g);
                const negatives = g.criteria
                  .filter((c) => c.passed === false)
                  .slice(0, 2);
                return (
                  <button
                    key={g.id}
                    type="button"
                    onClick={() => toggle(g.id)}
                    className={cn(
                      "flex items-start gap-3 rounded-xl border px-3 py-2.5 text-left transition",
                      isSelected
                        ? "border-primary bg-primary/5"
                        : "border-slate-200 bg-white hover:border-slate-300",
                    )}
                  >
                    <span
                      className={cn(
                        "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border",
                        isSelected
                          ? "border-primary bg-primary text-white"
                          : "border-slate-300 bg-white",
                      )}
                    >
                      {isSelected && <Check className="h-3.5 w-3.5" />}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-medium text-foreground">
                        {g.title}
                      </span>
                      <span className="mt-0.5 block text-xs text-muted-foreground">
                        {counts.risk} риск(ов) · {counts.clear} без нарушений ·{" "}
                        {counts.no_data} нет данных
                      </span>
                      {negatives.length > 0 && (
                        <span className="mt-2 block space-y-1">
                          {negatives.map((c) => (
                            <span
                              key={c.number}
                              className="block rounded-md bg-rose-50/70 px-2 py-1 text-xs text-rose-900"
                            >
                              {c.title}
                            </span>
                          ))}
                        </span>
                      )}
                    </span>
                  </button>
                );
              })}
            </div>
            {submitted && errors.groups && (
              <div className="mt-1.5 text-xs text-rose-600">
                Выберите хотя бы одну группу
              </div>
            )}
          </div>

          <div className="mt-6">
            <label className="mb-1.5 block text-sm font-medium">
              Замечание
            </label>
            <Textarea
              rows={5}
              placeholder="Опишите, с чем вы не согласны в выбранных группах оценки"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className={cn(
                "min-h-[120px]",
                submitted &&
                  errors.comment &&
                  "border-rose-400 focus-visible:ring-rose-300",
              )}
            />
            {submitted && errors.comment && (
              <div className="mt-1 text-xs text-rose-600">
                Добавьте замечание
              </div>
            )}
          </div>
        </div>

        <div className="sticky bottom-0 z-10 mt-auto flex shrink-0 gap-3 border-t border-border bg-white px-6 py-4">
          <Button
            variant="ghost"
            className="flex-1"
            onClick={() => onOpenChange(false)}
          >
            Отменить
          </Button>
          <Button className="flex-1" onClick={handleSave}>
            Сохранить замечание
          </Button>
        </div>
      </div>
    </InModalDrawer>
  );
}
