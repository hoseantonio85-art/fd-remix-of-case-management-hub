import * as React from "react";
import { Button, type ButtonProps } from "./adapters/kit";
import type { EIconName } from "@sber-orm/ui-kit";

export interface EllipseIconButtonProps extends Omit<
  ButtonProps,
  "variant" | "size" | "iconOnly" | "children" | "fullWidth" | "icon" | "className"
> {
  icon: keyof typeof EIconName;
  "aria-label": string;
}

/**
 * Штатная корпоративная круглая icon-кнопка (32×32 px) для close / back / utility navigation.
 *
 * Строгий API: компонент НЕ принимает `className` и никаких визуальных
 * или positioning-классов. Для absolute-позиционирования оборачивай в
 * внешний wrapper (`<span className="absolute right-4 top-4 z-10">`).
 */
export function EllipseIconButton({ icon, type = "button", ...rest }: EllipseIconButtonProps) {
  return (
    <Button
      {...rest}
      type={type}
      variant={"ellipse" as ButtonProps["variant"]}
      size={"XS" as ButtonProps["size"]}
      icon={icon}
      iconOnly
    />
  );
}
