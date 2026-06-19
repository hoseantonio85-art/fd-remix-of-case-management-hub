import React from 'react';

export enum EAlign {
  top = 'top',
  middle = 'middle',
  bottom = 'bottom',
  baseline = 'baseline',
  stretch = 'stretch',
}

export enum EJustifyContent {
  start = 'start',
  end = 'end',
  center = 'center',
  around = 'around',
  between = 'between',
  stretch = 'stretch',
}

export enum EDirection {
  row = 'row',
  column = 'column',
}

export type TRowProps = {
  align?: keyof typeof EAlign;
  justify?: keyof typeof EJustifyContent;
  direction?: keyof typeof EDirection;
  mb?: number;
  wrap?: boolean;
  noFlex?: boolean;
  gutter?:
    | number
    | [number, number]
    | [number, number, number]
    | [number, number, number, number];
} & React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
>;

export const colSpanValues = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] as const;

export type TColProps = {
  span?: (typeof colSpanValues)[number];
} & React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
>;
