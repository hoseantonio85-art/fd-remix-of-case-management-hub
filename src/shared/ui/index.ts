/**
 * Корпоративный UI-kit — единственный рекомендованный источник базовых компонентов
 * для нового кода. Re-export нужен, чтобы продуктовый код импортировал из
 * `@/shared/ui`, а не из `@/components/ui/*` (shadcn legacy) или `lucide-react`.
 *
 * При переезде на пакет `@sber-orm/ui-kit` из npm-registry достаточно поменять
 * этот файл — все потребители продолжат работать без правок.
 */
export {
  Button,
  Input,
  Textarea,
  Checkbox,
  Switch,
  Badge,
  Loader,
  Tooltip,
  Chips,
  Icon,
  EIconName,
  // Typography
  Text,
  Title,
  ETitleSize,
  ETextSize,
} from "@sber-orm/ui-kit";

export type {
  IButtonProperties,
  TButtonVariants,
  TButtonSizes,
} from "@sber-orm/ui-kit";
