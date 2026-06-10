import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Единая иконка NORM AI / ассистента.
 * Минималистичная, стеклянная, в rose-палитре.
 * Используется во всех assistant / NORM AI карточках интерфейса
 * (кроме логотипа в sidebar/menu).
 */
export function NormAssistantIcon({
  size = "md",
  className,
}: {
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const dim =
    size === "lg" ? "h-10 w-10" : size === "sm" ? "h-8 w-8" : "h-9 w-9";
  const icon =
    size === "lg" ? "h-5 w-5" : size === "sm" ? "h-4 w-4" : "h-[18px] w-[18px]";
  return (
    <div
      className={cn(
        "relative flex shrink-0 items-center justify-center rounded-full",
        "border border-rose-100/80 bg-white/70 text-rose-600",
        "shadow-[0_1px_2px_rgba(244,63,94,0.08)] backdrop-blur-md",
        "ring-1 ring-inset ring-white/60",
        dim,
        className,
      )}
      aria-hidden
    >
      <Sparkles className={cn(icon, "drop-shadow-[0_1px_1px_rgba(244,63,94,0.15)]")} strokeWidth={1.75} />
    </div>
  );
}
