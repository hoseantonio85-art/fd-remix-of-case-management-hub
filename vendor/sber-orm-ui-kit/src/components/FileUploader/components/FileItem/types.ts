import React, { ComponentPropsWithRef } from 'react';
import type { ElementSizeType } from '@v-uik/common';
import type { FileItemOwnProps } from '@v-uik/file-uploader';

import { EIconName } from '@/icons';
import { type TButtonSizes } from '@/components/Button';

/** Информация о файле */
export interface IFileProps {
  /** Идентификатор файла из ЕСМ */
  fileId: string;
  /** Название файла */
  filename?: string;
  /**
   * Размер загруженного файла в байтах
   * @format int64
   * @example 14939
   */
  size?: number;
  /**
   * Расширение загруженного файла
   * @example "xlsx"
   */
  extension?: string;
}

type TFileItemOwnProps = Omit<
  FileItemOwnProps,
  | 'classes'
  | 'info'
  | 'renderIconButtons'
  | 'progressType'
  | 'status'
  | 'errorText'
>;

export type TFileItemProps = TFileItemOwnProps & {
  file: IFileProps;
  /**
   * Список строк с дополнительной информацией.
   */
  extra?: (string | React.ReactNode)[];
  /**
   * Строка с ошибкой.
   */
  error?: string;
  /**
   * Заголовок элемента.
   */
  title?: string;
  /**
   * Отображать кнопку удаления в одной колонке.
   */
  canRemove?: boolean;
  /**
   * Отображать кнопку скачивания в одной колонке.
   */
  canDownload?: boolean;
  /**
   * Калбек для кнопки удаления.
   */
  onRemove?: React.MouseEventHandler<HTMLButtonElement>;
  /**
   * Калбек для кнопки скачивания.
   */
  onDownload?: React.MouseEventHandler<HTMLButtonElement>;
  /**
   * Вспомогательный элемент перед полем Info
   */
  infoPrefix?: React.ReactNode;
  /**
   * Пропсы removeButtonProps для кнопки удаления
   */
  removeButtonProps?: Partial<ComponentPropsWithRef<'button'>>;
  /**
   * Пропсы iconProps для иконки файла
   */
  iconProps?: Partial<Omit<IFileIconProps, 'extension' | 'error'>>;
  /**
   * Флаг для дизайна адаптированного под чат
   */
  chat?: boolean;
  /**
   * id для тестового data-атрибута
   */
  testId?: string;
};

export interface IFileIconProps extends ComponentPropsWithRef<'div'> {
  extension: string;
  error?: boolean;
  stroke?: boolean;
}

export type TFileExtrasProps = {
  items?: (string | React.ReactNode)[];
  error?: string;
};

export enum EFileType {
  default = 'file',
  excel = 'xlsx',
  word = 'docx',
  pdf = 'pdf',
  archive = 'archive',
  powerPoint = 'powerPoint',
}

export const fileIconMap: {
  [key in EFileType as string]: keyof typeof EIconName;
} = {
  [EFileType.archive]: 'archive',
  [EFileType.excel]: 'excel',
  [EFileType.pdf]: 'pdf',
  [EFileType.powerPoint]: 'powerPoint',
  [EFileType.word]: 'word',
} as const;

export const fileIconFilledMap: {
  [key in EFileType as string]: keyof typeof EIconName;
} = {
  [EFileType.archive]: 'archiveFill',
  [EFileType.excel]: 'excelFill',
  [EFileType.pdf]: 'pdfFill',
  [EFileType.powerPoint]: 'powerPointFill',
  [EFileType.word]: 'wordFill',
} as const;

export enum EFileSizeUnit {
  bytes = 'байт',
  KB = 'Кб',
  MB = 'Мб',
}

export const fileActionSize: Record<ElementSizeType, TButtonSizes> = {
  sm: 'XXS',
  md: 'XS',
  lg: 'M',
};
