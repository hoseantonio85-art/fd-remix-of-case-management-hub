import React, { AnchorHTMLAttributes } from 'react';

export enum ETitleSize {
  H900 = 'H900',
  H800 = 'H800',
  H700 = 'H700',
  H600 = 'H600',
  H500 = 'H500',
  H400 = 'H400',
  H300 = 'H300',
  H200 = 'H200',
  H100 = 'H100',
}

export enum ETextSize {
  xxlg = 'xxlg',
  xlg = 'xlg',
  lg = 'lg',
  md = 'md',
  sm = 'sm',
}

export interface ITypographyPropertiesDefault {
  uppercase?: boolean;
  mb?: number;
  onClick?: (event: React.MouseEvent) => void;
}

export type TTypographyProps = ITypographyPropertiesDefault &
  Omit<
    React.HTMLAttributes<HTMLDivElement>,
    keyof ITypographyPropertiesDefault
  >;

export type TTitleProps = TTypographyProps & {
  size: keyof typeof ETitleSize;
  thin?: boolean;
  nowrap?: boolean;
  white?: boolean;
};

export type TLinkProps = ITypographyPropertiesDefault &
  Omit<
    AnchorHTMLAttributes<HTMLAnchorElement>,
    keyof ITypographyPropertiesDefault
  > & {
    bold?: boolean;
    size?: keyof typeof ETextSize;
  };

export type TTextProps = TTypographyProps & {
  link?: boolean;
  bold?: boolean;
  disabled?: boolean;
  medium?: boolean;
  tooltip?: boolean;
  code?: boolean;
  nowrap?: boolean;
  wrap?: boolean;
  size?: keyof typeof ETextSize;
  white?: boolean;
};
