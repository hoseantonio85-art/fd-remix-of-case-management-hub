import React, { MouseEventHandler } from 'react';

/** Интерфейс стилей для элементов скроллбара */

export type TAxis = 'x' | 'y';

export interface IAxisProperties extends React.HTMLAttributes<HTMLDivElement> {
  axis?: TAxis;
}
export interface ITrackProperties extends IAxisProperties {
  opacity?: number;
  border?: boolean;
}

/** Интерфейс главного компонента */
export interface IScrollbarProperties {
  /** Контент для скролла */
  children?: React.ReactNode;
  /** Автоматическое скрытие треков */
  autoHide?: boolean;
  className?: string;
  /** Свойства для горизонтального трека */
  trackXProps?: Omit<IAxisProperties, 'axis'>;
  /** Свойства для горизонтального ползунка */
  thumbXProps?: Omit<IAxisProperties, 'axis'>;
  /** Свойства для вертикального трека */
  trackYProps?: Omit<IAxisProperties, 'axis'>;
  /** Свойства для вертикального ползунка */
  thumbYProps?: Omit<IAxisProperties, 'axis'>;
  /** Минимальный размер ползунка */
  thumbMinSize?: number;
  /** Максимальный размер ползунка */
  thumbMaxSize?: number;
  /** Ref на контент */
  contentRef?: React.Ref<HTMLElement>;
  // TODO сделать actionRef
  /** Время скрытия полосы прокрутки */
  timeout?: number;
  /** Максимальный размер ползунка */
  contentMaxSize?: number | string;
  /** Есть ли рамка */
  border?: boolean;

  onMouseEnter?: MouseEventHandler<HTMLDivElement>;
  onMouseLeave?: MouseEventHandler<HTMLDivElement>;
}

export interface IAxis<T> {
  dragOffset: number;
  isOverflowing: boolean;
  isVisible?: boolean;
  isDrag: boolean;
  thumbSize: number;
  track: T;
  thumb: T;
}

export interface IAxes<T> {
  x: IAxis<T>;
  y: IAxis<T>;
}
