import { TTagKinds } from '@v-uik/tag';
import React, { FormEvent } from 'react';

import { EComponentColors } from '../../types';

export interface ICheckboxChipsProps {
  disabled?: boolean;
  value: string[];
  items: {
    title: React.ReactNode;
    counter?: number;
    color?: EComponentColors;
    id: string;
  }[];
  kind?: Exclude<TTagKinds, 'color'>;
  wrap?: boolean;
  onChange?: (value: string[], event: FormEvent<HTMLElement>) => void;
  error?: boolean;
  labelBold?: boolean;
  inline?: boolean;
  required?: boolean;
  label?: string;
  helperText?: string;
  readonly?: boolean;
  testId?: string;
}
