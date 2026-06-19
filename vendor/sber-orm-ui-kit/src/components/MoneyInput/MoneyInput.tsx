import { ReactNode } from 'react';

import { InputNumberProps as VInputNumberProperties } from '@v-uik/input-number';

import { InputNumber } from '../InputNumber';
import {
  IInputNumberProperties,
  TInputNumberSizes,
} from '../InputNumber/types';

export type TMoneyInputProperties = Omit<
  VInputNumberProperties,
  'value' | 'onChange' | 'size'
> & {
  label?: string;
  labelInside?: boolean;
  labelBold?: boolean;
  value?: number | null;
  size?: TInputNumberSizes;
  onChange?: IInputNumberProperties['onChange'];
  /** Упрощенное визуальное представление компонента, без возможности поменять значение */
  viewOnly?: boolean;
  readonly?: boolean;
  tooltip?: ReactNode | ReactNode[];
};

export const MoneyInput = ({
  labelBold = false,
  labelInside,
  onChange,
  viewOnly,
  ...properties
}: TMoneyInputProperties) => {
  const handleChange: IInputNumberProperties['onChange'] = (
    value,
    event,
    reason,
  ) => {
    if (properties.readonly) {
      return;
    }

    onChange?.(value, event, reason);
  };

  return (
    <InputNumber
      icon='ruble'
      labelInside
      {...properties}
      onChange={handleChange}
      noArrows
    />
  );
};
