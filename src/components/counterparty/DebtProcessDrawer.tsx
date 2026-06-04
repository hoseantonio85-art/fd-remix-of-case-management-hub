import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import type { CollectionSubStep } from "@/lib/mock-data";
import { DebtStepper } from "./DebtStepper";
import { InModalDrawer } from "./InModalDrawer";
import type { StepAnim } from "./DebtSummaryCard";

export function DebtProcessDrawer({
  steps,
  stepAnim,
  open,
  onOpenChange,
  onAdvance,
  error,
}: {
  steps: CollectionSubStep[];
  stepAnim?: StepAnim;
  open: boolean;
  onOpenChange: (o: boolean) => void;
  onAdvance: () => void;
  error?: string | null;
}) {
  return (
    <InModalDrawer open={open} onOpenChange={onOpenChange}>
      <div className="bg-gradient-to-b from-slate-50 via-slate-50/40 to-transparent px-6 pt-6 pb-5">
        <h2 className="text-2xl font-semibold tracking-tight">Работа с задолженностью</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Полный процесс по стадиям и этапам взыскания
        </p>
      </div>
      <div className="px-6 pb-6 pt-2 space-y-4">
        <DebtStepper steps={steps} stepAnim={stepAnim} error={error} />
        <Button className="w-full" variant="secondary" onClick={onAdvance}>
          <ArrowRight className="mr-2 h-4 w-4" /> Перевести на следующий этап
        </Button>
      </div>
    </InModalDrawer>
  );
}
