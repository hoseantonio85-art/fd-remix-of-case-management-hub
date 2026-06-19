import React from 'react';

import { EComponentColors } from '../../types';

export enum EBadgeSize {
  /**
   * @deprecated Use "xxs" instead
   */
  md = 'md',
  /**
   * @deprecated Use "xxxs" instead
   */
  sm = 'sm',
  xxs = 'xxs',
  xxxs = 'xxxs',
}

interface IBadgePropsDefault {
  mb?: number;
}

export interface IBadgeProps
  extends IBadgePropsDefault,
    Omit<React.HTMLAttributes<HTMLDivElement>, keyof IBadgePropsDefault> {
  size?: EBadgeSize;
  variant?: keyof typeof EComponentColors;
  thin?: boolean;
}
