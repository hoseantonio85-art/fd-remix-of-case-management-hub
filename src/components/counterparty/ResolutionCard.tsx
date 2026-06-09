import { AlertTriangle, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ResolutionCard({
  title,
  description,
  onDetailsClick,
}: {
  title: string;
  description: string;
  onDetailsClick: () => void;
}) {
  return (
    <div className="rounded-[22px] border border-rose-100 bg-gradient-to-br from-rose-50 via-orange-50 to-white p-5">
      <div className="flex items-start gap-3">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/70 text-rose-600">
          <AlertTriangle className="h-4 w-4" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-[11px] font-medium uppercase tracking-wide text-rose-700/80">
            Резолюция
          </div>
          <div className="mt-1 text-base font-semibold leading-snug text-foreground">
            {title}
          </div>
          <p className="mt-1.5 text-xs leading-snug text-muted-foreground">
            {description}
          </p>
          <div className="mt-3">
            <Button
              size="sm"
              variant="outline"
              className="h-8 rounded-full border-rose-200 bg-white/80 px-3 text-xs text-foreground hover:bg-white"
              onClick={onDetailsClick}
            >
              Подробнее
              <ChevronRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
