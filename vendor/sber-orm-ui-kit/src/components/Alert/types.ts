import React, { JSX } from 'react';

import { IButtonProperties } from '@/components/Button';
import { EIconName } from '@/icons';

export enum EAlertStatus {
  success = 'success',
  danger = 'danger',
  // Todo удалить после доработки на бэке
  error = 'error',
  info = 'info',
  warning = 'warning',
  discovery = 'discovery',
  ai = 'ai',
}

export type TAlertStatus = keyof typeof EAlertStatus;

export type TAlertAction = Omit<IButtonProperties, 'variant'> & {
  title?: string;
};

export interface IAlertProperties {
  status: TAlertStatus;
  title?: string;
  actions?: TAlertAction[];
  message?: string | JSX.Element;
  mb?: number;
  onClose?(event?: React.MouseEvent): void;
  id?: string;
  isOpen?: boolean;
  customIcon?: EIconName;
}
