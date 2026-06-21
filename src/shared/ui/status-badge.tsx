import * as React from "react";
import { Badge as KitBadge, EBadgeSize, type IBadgeProps } from "@sber-orm/ui-kit";
import { cn } from "@/lib/utils";

export type StatusTone = "success" | "warning" | "danger" | "info" | "neutral" | "violet";

/**
 * Семантический размер статусов:
 * - "compact" (20 px, EBadgeSize.xxxs) — плотные статусы в списках, строках, карточках,
 *   таймлайнах, метаинформации.
 * - "regular" (24 px, EBadgeSize.xxs) — основной/акцентный статус в шапке карточки,
 *   drawer или крупного процесса.
 */
export type StatusBadgeSize = "compact" | "regular";

const toneToVariant: Record<StatusTone, IBadgeProps["variant"]> = {
  success: "green",
  warning: "yellow",
  danger: "red",
  info: "blue",
  neutral: "gray",
  violet: "violet",
};

const sizeMap: Record<StatusBadgeSize, EBadgeSize> = {
  compact: EBadgeSize.xxxs,
  regular: EBadgeSize.xxs,
};

export interface StatusBadgeProps {
  tone: StatusTone;
  size?: StatusBadgeSize | EBadgeSize;
  className?: string;
  children: React.ReactNode;
}

/**
 * Корпоративный Badge с фиксированной высотой и семантическим тоном.
 * Запрещены ручные Tailwind-классы цвета фона/текста/рамки/высоты/радиуса.
 */
export function StatusBadge({ tone, size = "compact", className, children }: StatusBadgeProps) {
  const kitSize =
    typeof size === "string" && size in sizeMap
      ? sizeMap[size as StatusBadgeSize]
      : (size as EBadgeSize);
  return (
    <KitBadge variant={toneToVariant[tone]} size={kitSize} className={cn(className)}>
      {children}
    </KitBadge>
  );
}
