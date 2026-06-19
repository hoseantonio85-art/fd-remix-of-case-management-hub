import { ReactNode } from 'react';

import { ComboboxEvent, ComboboxProps, Options } from '@v-uik/combo-box';
import { TreeProps } from '@v-uik/tree';

import { EIconName } from '@/icons';
import { TComponentSizes } from '@/types';

export type { ComboboxEvent } from '@v-uik/combo-box';
export type { TreeItem } from '@v-uik/tree';
export type { Instance as PopperInstance } from '@popperjs/core';

export type TSelectProperties = Omit<ComboboxProps<unknown>, 'size'> & {
  labelInside?: boolean;
  tree?: boolean;
  treeProps?: Partial<TreeProps>;
  readonly?: boolean;
  size?: TComponentSizes;
  tooltip?: ReactNode | ReactNode[];
  icon?: keyof typeof EIconName;
  isComplexPart?: boolean;
  showOptionValue?: boolean;
  showOptionSearch?: boolean;
  showDroplistButtons?: boolean;
  emptyOptionsText?: string;
  optionRenderLimit?: number;
  onListSubmit?: (value: Options<unknown>) => void;
  testId?: string;
  iconClassName?: string;
  hideChevron?: boolean;
  showValueTooltip?: boolean;
  useCustomSearch?: boolean;
  useChips?: boolean;
  onChipRemove?: (value: string) => void;
};

export interface IIndicatorProperties {
  canClear?: boolean;
  opened: boolean;
  disabled?: boolean;
  clearValue(event: ComboboxEvent): void;
}
