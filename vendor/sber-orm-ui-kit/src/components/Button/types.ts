import { EIconName } from '../../icons';

export type TButtonVariants =
  | 'primary'
  | 'secondary'
  | 'tertiary'
  | 'warning'
  | 'danger'
  | 'ghost'
  | 'ellipse'
  | 'function'
  | 'ai';

export type TButtonSizes = 'XXS' | 'XS' | 'S' | 'M' | 'L' | 'XL';

export interface IButtonProperties
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  // Вариант кнопки из дизайн системы
  variant?: TButtonVariants;
  // Показывает спиннер внутри кнопки поверх текста
  loading?: boolean;
  size?: TButtonSizes;
  iconOnly?: boolean;
  icon?: keyof typeof EIconName;
  iconAfter?: keyof typeof EIconName;
  children?: React.ReactNode | React.ReactNode[];
  link?: boolean;
  // Добавлено для совместимости с @v-uik/button
  fullWidth?: boolean;
  // Дополнительные атрибуты button
  className?: string;
  disabled?: boolean;
}
