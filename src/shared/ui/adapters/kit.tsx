/**
 * Реальные adapters над корпоративным @sber-orm/ui-kit.
 *
 * Эти adapters экспортируют shadcn-совместимые сигнатуры базовых controls
 * (Button, Input, Textarea, Checkbox, Switch, Tooltip-нет, Badge, Loader, Chips),
 * чтобы продуктовый код продолжал работать без изменений call-site, а в DOM
 * рендерились настоящие корпоративные компоненты.
 *
 * Импорт строго из `@/shared/ui`.
 *
 * Несовместимые случаи (Button asChild, составной Tooltip из shadcn, Dialog/Sheet,
 * сложные Radix-Select) остаются в `legacy/shadcn` и перечислены в MIGRATION_REPORT.
 */
import * as React from "react";
import {
  Button as KitButton,
  Input as KitInput,
  Textarea as KitTextarea,
  Checkbox as KitCheckbox,
  Switch as KitSwitch,
  Badge as KitBadge,
  Chips as KitChips,
  Loader as KitLoader,
  Text as KitText,
  Title as KitTitle,
  Icon as KitIcon,
  EBadgeSize,
  type IButtonProperties,
  type IInputProperties,
  type ITextareaProperties,
  type ICheckboxProperties,
  type ISwitchProps,
  type IBadgeProps,
  type IChipsProps,
  type ILoaderProps,
} from "@sber-orm/ui-kit";
import { cn } from "@/lib/utils";

// ---------- Typography / Icon / Loader (kit native) ----------
export const Text = KitText;
export const Title = KitTitle;
export const Icon = KitIcon;
export { EIconName, ETitleSize, ETextSize } from "@sber-orm/ui-kit";

// ---------- Loader ----------
export type LoaderProps = ILoaderProps;
export const Loader = KitLoader;

// ---------- Button ----------
type ShadcnButtonVariant = "default" | "outline" | "secondary" | "ghost" | "destructive" | "link";
type ShadcnButtonSize = "default" | "sm" | "lg" | "icon";

const variantMap: Record<ShadcnButtonVariant, IButtonProperties["variant"]> = {
  default: "primary",
  outline: "secondary",
  secondary: "tertiary",
  ghost: "ghost",
  destructive: "danger",
  link: "ghost",
};

const sizeMap: Record<ShadcnButtonSize, IButtonProperties["size"]> = {
  default: "M",
  sm: "S",
  lg: "L",
  icon: "M",
};

export interface ButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "size"> {
  variant?: ShadcnButtonVariant | IButtonProperties["variant"];
  size?: ShadcnButtonSize | IButtonProperties["size"];
  loading?: boolean;
  asChild?: boolean;
  fullWidth?: boolean;
  icon?: IButtonProperties["icon"];
  iconAfter?: IButtonProperties["iconAfter"];
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { variant = "default", size = "default", asChild, loading, children, className, ...rest },
    ref,
  ) => {
    // asChild — несовместимо с kit Button (он всегда рендерит <button>). Fallback на native button
    // с минимальными классами, чтобы layout не ломался. Реальное использование — единичное (см. отчёт).
    if (asChild) {
      const child = React.Children.only(children) as React.ReactElement;
      return React.cloneElement(child, { className: cn(className, child.props.className) });
    }

    const isShadcnVariant = (variant as string) in variantMap;
    const kitVariant = isShadcnVariant
      ? variantMap[variant as ShadcnButtonVariant]
      : (variant as IButtonProperties["variant"]);

    const isShadcnSize = (size as string) in sizeMap;
    const kitSize = isShadcnSize
      ? sizeMap[size as ShadcnButtonSize]
      : (size as IButtonProperties["size"]);

    const iconOnly = size === "icon" || rest["aria-label"] === undefined ? size === "icon" : false;
    const link = variant === "link";

    return (
      <KitButton
        ref={ref}
        variant={kitVariant}
        size={kitSize}
        iconOnly={iconOnly}
        link={link}
        loading={loading}
        className={className}
        {...rest}
      >
        {children}
      </KitButton>
    );
  },
);
Button.displayName = "Button";

// buttonVariants kept as a no-op stub for call sites that only need the class string.
// Returns className as-is so layout utilities still work.
export const buttonVariants = (opts?: { className?: string }) => opts?.className ?? "";

// ---------- Input ----------
export interface InputProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "onChange" | "size" | "prefix"
> {
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ onChange, className, ...rest }, ref) => {
    return (
      <KitInput
        ref={ref}
        fullWidth
        classes={{ container: className }}
        {...(rest as Partial<IInputProperties>)}
        onChange={(value, event) => {
          // адаптируем kit onChange(value, event) к shadcn onChange(event)
          if (event && onChange) onChange(event);
        }}
      />
    );
  },
);
Input.displayName = "Input";

// ---------- Textarea ----------
export interface TextareaProps extends Omit<
  React.TextareaHTMLAttributes<HTMLTextAreaElement>,
  "onChange" | "size"
> {
  onChange?: React.ChangeEventHandler<HTMLTextAreaElement>;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ onChange, className, ...rest }, ref) => {
    return (
      <KitTextarea
        fullWidth
        // ref не пробрасываем — kit Textarea не forwardRef, продуктовые call-site ref не используют
        {...(rest as Partial<ITextareaProperties>)}
        ref={ref as never}
        onChange={(value, event) => {
          if (event && onChange) onChange(event);
        }}
      />
    );
  },
);
Textarea.displayName = "Textarea";

// ---------- Checkbox ----------
export interface CheckboxProps extends Omit<ICheckboxProperties, "onChange"> {
  onCheckedChange?: (checked: boolean) => void;
}

export const Checkbox = ({ onCheckedChange, ...rest }: CheckboxProps) => {
  return (
    <KitCheckbox
      {...rest}
      onChange={(event) => {
        onCheckedChange?.(event.target.checked);
      }}
    />
  );
};

// ---------- Switch ----------
export interface SwitchProps extends Omit<ISwitchProps, "onChange"> {
  onCheckedChange?: (checked: boolean) => void;
}

export const Switch = ({ onCheckedChange, ...rest }: SwitchProps) => {
  return (
    <KitSwitch
      {...rest}
      onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
        onCheckedChange?.(event.target.checked);
      }}
    />
  );
};

// ---------- Badge ----------
type ShadcnBadgeVariant = "default" | "secondary" | "destructive" | "outline";
const badgeVariantMap: Record<ShadcnBadgeVariant, IBadgeProps["variant"]> = {
  default: "blue",
  secondary: "gray",
  destructive: "red",
  outline: "outlined",
};

export interface BadgeProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "color"> {
  variant?: ShadcnBadgeVariant | IBadgeProps["variant"];
}

export const Badge = ({ variant = "default", className, children, ...rest }: BadgeProps) => {
  const kitVariant =
    (variant as string) in badgeVariantMap
      ? badgeVariantMap[variant as ShadcnBadgeVariant]
      : (variant as IBadgeProps["variant"]);
  return (
    <KitBadge variant={kitVariant} size={EBadgeSize.xxs} className={className} {...rest}>
      {children}
    </KitBadge>
  );
};
export const badgeVariants = (opts?: { className?: string }) => opts?.className ?? "";

// ---------- Chips ----------
export const Chips = KitChips;
export type { IChipsProps };

/**
 * Centralized semantic mapping for chips/badges → kit palette.
 * Используйте эти ключи в продуктовом коде, а не сырые цвета Tailwind.
 */
export type SemanticTone = "success" | "warning" | "danger" | "info" | "neutral";
export const semanticBadgeVariant: Record<SemanticTone, IBadgeProps["variant"]> = {
  success: "green",
  warning: "yellow",
  danger: "red",
  info: "blue",
  neutral: "gray",
};
