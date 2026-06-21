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
 * Штатная корпоративная круглая icon-кнопка (32×32 px) для close / back / utility navigation.
 *
 * ВАЖНО: компонент НЕ принимает позиционирующих классов.
 * Если нужно absolute-позиционирование, оборачивай в внешний wrapper
 * (`<span className="absolute right-4 top-4 z-10">`), а сам Button оставляй чистым.
 *
 * Разрешённые классы: `shrink-0`, `pointer-events-*`, `opacity-*`.
 */
const FORBIDDEN_CLASS = /(^|\s)(absolute|fixed|relative|sticky|inset-|right-|left-|top-|bottom-|z-)/;

export function EllipseIconButton({
  icon,
  className,
  type = "button",
  ...rest
}: EllipseIconButtonProps) {
  if (className && FORBIDDEN_CLASS.test(className)) {
    if (typeof process !== "undefined" && process.env?.NODE_ENV !== "production") {
      // eslint-disable-next-line no-console
      console.warn(
        "[EllipseIconButton] positioning classes are forbidden on the button itself. " +
          "Wrap it in an absolutely positioned <span> instead. Got:",
        className,
      );
    }
  }
  return (
    <Button
      {...rest}
      type={type}
      variant={"ellipse" as ButtonProps["variant"]}
      size={"XS" as ButtonProps["size"]}
      icon={icon}
      iconOnly
      className={cn("shrink-0", className)}
    />
  );
}
