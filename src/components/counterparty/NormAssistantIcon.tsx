import { Sparkles } from "@/shared/ui";
import { cn } from "@/lib/utils";

/**
 * Единая иконка NORM AI / ассистента.
 * Минималистичная, стеклянная, в rose-палитре.
 * Используется во всех assistant / NORM AI карточках интерфейса
 * (кроме логотипа в sidebar/menu).
 */
export function NormAssistantIcon({
  size = "md",
  tone = "rose",
  className,
}: {
  size?: "sm" | "md" | "lg";
  tone?: "rose" | "emerald";
  className?: string;
}) {
  const dim = size === "lg" ? "h-10 w-10" : size === "sm" ? "h-8 w-8" : "h-9 w-9";
  const icon = size === "lg" ? "h-5 w-5" : size === "sm" ? "h-4 w-4" : "h-[18px] w-[18px]";
  const toneClasses =
    tone === "emerald"
      ? "border-emerald-100/80 bg-white/70 text-emerald-600 shadow-[0_1px_2px_rgba(16,185,129,0.08)]"
      : "border-rose-100/80 bg-white/70 text-rose-600 shadow-[0_1px_2px_rgba(244,63,94,0.08)]";
  const iconShadow =
    tone === "emerald"
      ? "drop-shadow-[0_1px_1px_rgba(16,185,129,0.15)]"
      : "drop-shadow-[0_1px_1px_rgba(244,63,94,0.15)]";
  return (
    <div
      className={cn(
        "relative flex shrink-0 items-center justify-center rounded-full",
        "border backdrop-blur-md",
        "ring-1 ring-inset ring-white/60",
        toneClasses,
        dim,
        className,
      )}
      aria-hidden
    >
      <Sparkles className={cn(icon, iconShadow)} strokeWidth={1.75} />
    </div>
  );
}
