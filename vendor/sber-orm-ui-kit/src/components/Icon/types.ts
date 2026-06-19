import React from 'react';

import { EIconName } from '../../icons';

export type TSize = 'sm' | 'md' | 'lg' | 'xlg';

export enum EVariant {
  Fill = 'fill',
  Stroke = 'stroke',
}

export type TVariant = typeof EVariant;

export type TIconProperties = {
  name: keyof typeof EIconName;
  width?: number;
  height?: number;
  stroke?: string;
  iconStyles?: React.CSSProperties;
  variant?: EVariant;
  title?: string;
  inline?: boolean;
  size?: TSize;
  onClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
} & React.HTMLAttributes<HTMLDivElement>;

export interface ISvgProperties {
  variant: TVariant;
  width: number;
  height: number;
}
