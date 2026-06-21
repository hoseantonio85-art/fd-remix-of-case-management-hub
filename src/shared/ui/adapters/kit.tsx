/**
 * Реальные adapters над корпоративным @sber-orm/ui-kit.
 *
 * Эти adapters экспортируют shadcn-совместимые сигнатуры базовых controls
 * (Button, Input, Textarea, Checkbox, Switch, Badge, Loader, Chips),
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
  RadioChips as KitRadioChips,
  CheckboxChips as KitCheckboxChips,
  Select as KitSelect,
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
  type IRadioChipsProps,
  type ICheckboxChipsProps,
  type ILoaderProps,
  type EIconName,
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

// sm 32px → XS, default 36px → S, lg 40px → M, icon → XS+iconOnly
const sizeMap: Record<ShadcnButtonSize, IButtonProperties["size"]> = {
  default: "S",
  sm: "XS",
  lg: "M",
  icon: "XS",
};

export interface ButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "size"> {
  variant?: ShadcnButtonVariant | IButtonProperties["variant"];
  size?: ShadcnButtonSize | IButtonProperties["size"];
  loading?: boolean;
  asChild?: boolean;
  fullWidth?: boolean;
  iconOnly?: boolean;
  icon?: IButtonProperties["icon"];
  iconAfter?: IButtonProperties["iconAfter"];
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "default",
      size = "default",
      asChild,
      loading,
      iconOnly,
      children,
      className,
      ...rest
    },
    ref,
  ) => {
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

    const effectiveIconOnly = iconOnly ?? size === "icon";
    const link = variant === "link";

    return (
      <KitButton
        ref={ref}
        variant={kitVariant}
        size={kitSize}
        iconOnly={effectiveIconOnly}
        link={link}
        loading={loading}
        className={className}
        {...rest}
      >
        {effectiveIconOnly ? (
          children
        ) : (
          <span className="inline-flex min-w-0 items-center justify-center gap-2">{children}</span>
        )}
      </KitButton>
    );
  },
);
Button.displayName = "Button";

// buttonVariants kept as a no-op stub for call sites that only need the class string.
export const buttonVariants = (opts?: { className?: string }) => opts?.className ?? "";

// ---------- Input ----------
type KitInputSize = NonNullable<IInputProperties["size"]>;
export interface InputProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "onChange" | "size" | "prefix"
> {
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  label?: string;
  labelInside?: boolean;
  helperText?: React.ReactNode;
  error?: boolean;
  required?: boolean;
  size?: KitInputSize;
  viewOnly?: boolean;
  readonly?: boolean;
  icon?: keyof typeof EIconName;
  tooltip?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      onChange,
      className,
      label,
      labelInside,
      helperText,
      error,
      required,
      size,
      viewOnly,
      readonly,
      icon,
      tooltip,
      ...rest
    },
    ref,
  ) => {
    return (
      <KitInput
        ref={ref}
        fullWidth
        classes={{ container: className }}
        label={label}
        labelInside={labelInside}
        helperText={helperText as string | undefined}
        error={error}
        required={required}
        size={size}
        viewOnly={viewOnly}
        readonly={readonly}
        icon={icon}
        tooltip={tooltip}
        {...(rest as Partial<IInputProperties>)}
        onChange={(_value, event) => {
          if (event && onChange) onChange(event as React.ChangeEvent<HTMLInputElement>);
        }}
      />
    );
  },
);
Input.displayName = "Input";

// ---------- Textarea ----------
type KitTextareaSize = NonNullable<ITextareaProperties["size"]>;
export interface TextareaProps extends Omit<
  React.TextareaHTMLAttributes<HTMLTextAreaElement>,
  "onChange" | "size"
> {
  onChange?: React.ChangeEventHandler<HTMLTextAreaElement>;
  label?: string;
  labelInside?: boolean;
  helperText?: React.ReactNode;
  error?: boolean;
  required?: boolean;
  size?: KitTextareaSize;
  resize?: ITextareaProperties["resize"];
  canClear?: boolean;
}

export const Textarea = ({
  onChange,
  className,
  label,
  labelInside,
  helperText,
  error,
  required,
  size,
  resize,
  canClear,
  ...rest
}: TextareaProps) => {
  return (
    <KitTextarea
      fullWidth
      classes={{ container: className }}
      label={label}
      labelInside={labelInside}
      helperText={helperText as string | undefined}
      error={error}
      required={required}
      size={size}
      resize={resize}
      canClear={canClear}
      {...(rest as Partial<ITextareaProperties>)}
      onChange={(_value, event) => {
        if (event && onChange) onChange(event as React.ChangeEvent<HTMLTextAreaElement>);
      }}
    />
  );
};
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
        // Kit Checkbox signature: onChange(event). Use event.target.checked.
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

// ---------- Badge (legacy shadcn-compatible re-export) ----------
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
export const RadioChips = KitRadioChips;
export const CheckboxChips = KitCheckboxChips;
export type { IChipsProps, IRadioChipsProps, ICheckboxChipsProps };

// ---------- SimpleSelect (kit Select) ----------
export interface SimpleSelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SimpleSelectProps {
  label?: string;
  labelInside?: boolean;
  options: SimpleSelectOption[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  error?: boolean;
  helperText?: React.ReactNode;
  required?: boolean;
  disabled?: boolean;
  size?: "S" | "M" | "L";
  className?: string;
}

/**
 * Корпоративный простой Select поверх @sber-orm/ui-kit Select.
 * Заменяет нативный <select> и Radix-композицию для одиночного выбора из плоского списка.
 */
export const SimpleSelect = ({
  label,
  labelInside,
  options,
  value,
  onChange,
  placeholder,
  error,
  helperText,
  required,
  disabled,
  size,
  className,
}: SimpleSelectProps) => {
  const kitOptions = React.useMemo(
    () =>
      options.map((option) => ({
        id: option.value,
        label: option.label,
        disabled: option.disabled,
      })),
    [options],
  );
  return (
    <KitSelect
      label={label}
      labelInside={labelInside}
      options={kitOptions}
      value={value ?? null}
      size={size ?? "M"}
      placeholder={placeholder}
      error={error}
      helperText={helperText as string | undefined}
      required={required}
      disabled={disabled}
      isSearchable={false}
      className={className}
      onChange={(nextValue: unknown) => {
        onChange?.(normalizeKitSelectValue(nextValue));
      }}
    />
  );
};

type KitSelectValue = unknown;
function normalizeKitSelectValue(value: KitSelectValue): string {
  if (value == null) return "";
  if (Array.isArray(value)) {
    const first = value[0];
    return first == null ? "" : String(first);
  }
  if (typeof value === "object" && "value" in (value as Record<string, unknown>)) {
    const inner = (value as { value: unknown }).value;
    return inner == null ? "" : String(inner);
  }
  return String(value);
}

/**
 * Centralized semantic mapping for chips/badges → kit palette.
 */
export type SemanticTone = "success" | "warning" | "danger" | "info" | "neutral" | "violet";
export const semanticBadgeVariant: Record<SemanticTone, IBadgeProps["variant"]> = {
  success: "green",
  warning: "yellow",
  danger: "red",
  info: "blue",
  neutral: "gray",
  violet: "violet",
};
