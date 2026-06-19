import { ReactNode } from 'react';

import { EIconName } from '@/icons';
import { InputNumberProps as VInputNumberProperties } from '@v-uik/input-number';
import { InputChangeReason, InputChangeEvent } from '@v-uik/input';

export type TInputNumberSizes = 'S' | 'M' | 'L' | 'XL';

export interface IInputNumberProperties
  extends Omit<
    VInputNumberProperties,
    | 'size'
    | 'suffix'
    | 'prefix'
    | 'labelProps'
    | 'canClear'
    | 'valueType'
    | 'value'
    | 'onChange'
  > {
  label?: string;
  labelInside?: boolean;
  /** Упрощенное визуальное представление компонента, без возможности поменять значение */
  viewOnly?: boolean;
  readonly?: boolean;
  noArrows?: boolean;
  size?: TInputNumberSizes;
  icon?: keyof typeof EIconName;
  tooltip?: ReactNode | ReactNode[];
  value?: number | null;
  onChange?: (
    value: number | null,
    event: InputChangeEvent,
    reason?: InputChangeReason,
  ) => void;
}
