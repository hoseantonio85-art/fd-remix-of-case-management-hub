import { ReactNode, useEffect } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Drawer-like panel that opens INSIDE its parent (the surrounding modal),
 * not over the whole page. The parent container MUST be `relative` and
 * `overflow-hidden`.
 */
export function InModalDrawer({
  open,
  onOpenChange,
  children,
  className,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  children: ReactNode;
  className?: string;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onOpenChange(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onOpenChange]);

  if (!open) return null;
  return (
    <>
      <div
        className="absolute inset-0 z-30 bg-slate-900/20 backdrop-blur-[1px] animate-in fade-in duration-150"
        onClick={() => onOpenChange(false)}
      />
      <div
        className={cn(
          "absolute inset-y-0 right-0 z-40 flex w-full max-w-xl flex-col overflow-y-auto rounded-3xl bg-white shadow-2xl animate-in slide-in-from-right duration-200",
          className,
        )}
      >
        <button
          onClick={() => onOpenChange(false)}
          className="absolute right-4 top-4 z-10 rounded-full bg-white/80 p-1.5 text-muted-foreground backdrop-blur transition hover:bg-white"
          aria-label="Закрыть"
        >
          <X className="h-4 w-4" />
        </button>
        {children}
      </div>
    </>
  );
}
