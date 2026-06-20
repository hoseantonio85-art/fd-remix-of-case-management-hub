import { Dialog, DialogContent } from "@/shared/ui";
import { largeModalContentClass } from "@/lib/modal-styles";
import { CounterpartyStatusBadge } from "./CounterpartyStatusBadge";
import { Clock, X } from "@/shared/ui";
import { Button } from "@/shared/ui";
import type { Counterparty } from "@/lib/mock-data";
import { CounterpartyHeaderMeta } from "./CounterpartyHeaderMeta";

export function PendingAssessmentModal({
  counterparty,
  open,
  onOpenChange,
}: {
  counterparty: Counterparty | null;
  open: boolean;
  onOpenChange: (o: boolean) => void;
}) {
  if (!counterparty) return null;
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={`${largeModalContentClass} [&>button]:hidden`}>
        <div className="border-b border-border bg-gradient-to-b from-slate-50 via-slate-50/40 to-transparent px-6 pt-6 pb-5">
          <button
            onClick={() => onOpenChange(false)}
            className="absolute right-4 top-4 rounded p-1 text-muted-foreground hover:bg-muted"
            aria-label="Закрыть"
          >
            <X className="h-4 w-4" />
          </button>
          <CounterpartyStatusBadge tag="На оценке" />
          <h2 className="mt-3 text-xl font-semibold tracking-tight">{counterparty.name}</h2>
          <CounterpartyHeaderMeta inn={counterparty.inn} />
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-10">
          <div className="mx-auto max-w-md text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Clock className="h-6 w-6" />
            </div>
            <h3 className="mt-4 text-base font-semibold text-foreground">Оценка формируется</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Мы собираем данные из источников и анализируем документы. Обычно это занимает до 10
              минут. Уведомление придёт на почту.
            </p>
          </div>
        </div>

        <div className="flex justify-end border-t border-border bg-white px-6 py-3">
          <Button variant="outline" size="sm" onClick={() => onOpenChange(false)}>
            Закрыть
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
