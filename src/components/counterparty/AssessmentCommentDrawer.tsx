import { useEffect, useState } from "react";
import { ChevronDown, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { InModalDrawer } from "./InModalDrawer";
import { type AssessmentGroup, type AssessmentGroupId } from "@/lib/assessment-data";

export type AssessmentCommentPayload = {
  comments: { groupId: AssessmentGroupId; groupTitle: string; text: string }[];
};

export function AssessmentCommentDrawer({
  open,
  onOpenChange,
  groups,
  initialComments,
  onSubmit,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  groups: AssessmentGroup[];
  initialComments?: Partial<Record<AssessmentGroupId, string>>;
  onSubmit: (p: AssessmentCommentPayload) => void;
}) {
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (open) {
      const init: Record<string, string> = {};
      const exp: Record<string, boolean> = {};
      groups.forEach((g) => {
        const v = initialComments?.[g.id] ?? "";
        init[g.id] = v;
        exp[g.id] = !!v;
      });
      setDrafts(init);
      setExpanded(exp);
      setSubmitted(false);
    }
  }, [open, groups, initialComments]);

  const hasAny = Object.values(drafts).some((v) => v.trim().length > 0);

  const handleSave = () => {
    setSubmitted(true);
    if (!hasAny) return;
    const comments = groups
      .filter((g) => (drafts[g.id] ?? "").trim().length > 0)
      .map((g) => ({
        groupId: g.id,
        groupTitle: g.title,
        text: drafts[g.id].trim(),
      }));
    onSubmit({ comments });
    onOpenChange(false);
  };

  return (
    <InModalDrawer open={open} onOpenChange={onOpenChange}>
      <div className="flex min-h-full flex-col">
        <div className="flex-1 overflow-y-auto p-6 pb-4">
          <h2 className="text-lg font-semibold">Замечание к оценке</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Выберите группы оценки и оставьте комментарий по каждой из них.
          </p>

          <div className="mt-6 space-y-2">
            {groups.map((g) => {
              const isOpen = !!expanded[g.id];
              const value = drafts[g.id] ?? "";
              const filled = value.trim().length > 0;
              return (
                <div
                  key={g.id}
                  className={cn(
                    "rounded-xl border bg-white transition",
                    filled ? "border-primary/40" : "border-slate-200",
                  )}
                >
                  <button
                    type="button"
                    onClick={() => setExpanded((p) => ({ ...p, [g.id]: !p[g.id] }))}
                    className="flex w-full items-center gap-3 px-3 py-3 text-left"
                  >
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-medium text-foreground">{g.title}</span>
                      {filled && (
                        <span className="mt-0.5 block text-xs text-muted-foreground line-clamp-1">
                          {value.trim()}
                        </span>
                      )}
                    </span>
                    {filled && <MessageSquare className="h-4 w-4 shrink-0 text-primary" />}
                    <ChevronDown
                      className={cn(
                        "h-4 w-4 shrink-0 text-muted-foreground transition",
                        isOpen && "rotate-180",
                      )}
                    />
                  </button>
                  {isOpen && (
                    <div className="border-t border-slate-100 px-3 py-3">
                      <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                        Комментарий по группе
                      </label>
                      <Textarea
                        rows={4}
                        placeholder="Опишите, с чем вы не согласны в этой группе"
                        value={value}
                        onChange={(e) => setDrafts((p) => ({ ...p, [g.id]: e.target.value }))}
                        className="min-h-[96px]"
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {submitted && !hasAny && (
            <div className="mt-3 text-xs text-rose-600">Добавьте хотя бы один комментарий</div>
          )}
        </div>

        <div className="sticky bottom-0 z-10 mt-auto flex shrink-0 gap-3 border-t border-border bg-white px-6 py-4">
          <Button variant="ghost" className="flex-1" onClick={() => onOpenChange(false)}>
            Отменить
          </Button>
          <Button className="flex-1" onClick={handleSave}>
            Сохранить замечания
          </Button>
        </div>
      </div>
    </InModalDrawer>
  );
}
