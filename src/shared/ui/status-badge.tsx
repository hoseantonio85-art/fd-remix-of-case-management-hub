import * as React from "react";
import { Badge as KitBadge, EBadgeSize, type IBadgeProps } from "@sber-orm/ui-kit";
import { cn } from "@/lib/utils";

export type StatusTone = "success" | "warning" | "danger" | "info" | "neutral" | "violet";

const toneToVariant: Record<StatusTone, IBadgeProps["variant"]> = {
  success: "green",
  warning: "yellow",
  danger: "red",
  info: "blue",
  neutral: "gray",
  violet: "violet",
};

export interface StatusBadgeProps {
  tone: StatusTone;
  className?: string;
  children: React.ReactNode;
}

/**
 * Корпоративный Badge с фиксированной высотой 24 px (size xxs) и
 * семантическим тоном. Запрещены ручные Tailwind-классы цвета фона/текста/рамки.
 */
export function StatusBadge({ tone, className, children }: StatusBadgeProps) {
  return (
    <KitBadge variant={toneToVariant[tone]} size={EBadgeSize.xxs} className={cn(className)}>
      {children}
    </KitBadge>
  );
}
