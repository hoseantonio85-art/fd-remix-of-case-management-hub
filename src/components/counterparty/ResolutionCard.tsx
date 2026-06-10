import { AlertTriangle, CheckCircle2, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

type Variant = "negative" | "positive";

export function ResolutionCard({
  title,
  description,
  onDetailsClick,
  variant = "negative",
}: {
  title: string;
  description: string;
  onDetailsClick: () => void;
  variant?: Variant;
}) {
  const isPositive = variant === "positive";
  const wrapper = isPositive
    ? "rounded-[22px] border border-emerald-100 bg-gradient-to-br from-emerald-50 via-emerald-50/60 to-white p-5"
    : "rounded-[22px] border border-rose-100 bg-gradient-to-br from-rose-50 via-orange-50 to-white p-5";
  const iconWrap = isPositive
    ? "flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/70 text-emerald-600"
    : "flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/70 text-rose-600";
  const Icon = isPositive ? CheckCircle2 : AlertTriangle;
  const buttonClass = isPositive
    ? "h-8 rounded-full border-emerald-200 bg-white/80 px-3 text-xs text-foreground hover:bg-white"
    : "h-8 rounded-full border-rose-200 bg-white/80 px-3 text-xs text-foreground hover:bg-white";
  return (
    <div className={wrapper}>
      <div className="flex items-start gap-3">
        <div className={iconWrap}>
          <Icon className="h-4 w-4" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-base font-semibold leading-snug text-foreground">
            {title}
          </div>
          <p className="mt-1.5 text-xs leading-snug text-muted-foreground">
            {description}
          </p>
          <div className="mt-3">
            <Button
              size="sm"
              variant="outline"
              className={buttonClass}
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
