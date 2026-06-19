import React from 'react';
import { EIconName } from '@/icons';
import { EComponentColors } from '../../types';

export enum ELevelState {
  default = 'default',
  low = 'low',
  medium = 'medium',
  high = 'high',
  critical = 'critical',
}

export type TLevelSize = 'sm' | 'md';

export interface ILevelProps extends React.HTMLAttributes<HTMLDivElement> {
  withBadge?: boolean;
  iconRight?: boolean;
  t?: (key: string) => string;
  size?: TLevelSize;
  state?: keyof typeof ELevelState | string;
  icon?: keyof typeof EIconName;
  variant?: keyof typeof EComponentColors;
  text?: string;
}
