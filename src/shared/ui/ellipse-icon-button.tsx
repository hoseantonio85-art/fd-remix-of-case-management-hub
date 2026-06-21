import * as React from "react";
import { Button, type ButtonProps } from "./adapters/kit";
import type { EIconName } from "@sber-orm/ui-kit";
import { cn } from "@/lib/utils";

export interface EllipseIconButtonProps extends Omit<
  ButtonProps,
  "variant" | "size" | "iconOnly" | "children" | "fullWidth" | "icon"
> {
  icon: keyof typeof EIconName;
  "aria-label": string;
}

/**
 * Штатная корпоративная круглая icon-кнопка для close / back / utility navigation.
 * Жёстко зафиксированы variant="ellipse" и size="XS" (фактически 32×32 px).
 */
export function EllipseIconButton({
  icon,
  className,
  type = "button",
  ...rest
}: EllipseIconButtonProps) {
  return (
    <Button
      {...rest}
      type={type}
      variant={"ellipse" as ButtonProps["variant"]}
      size={"XS" as ButtonProps["size"]}
      icon={icon}
      iconOnly
      fullWidth={false}
      className={cn("shrink-0", className)}
    />
  );
}
