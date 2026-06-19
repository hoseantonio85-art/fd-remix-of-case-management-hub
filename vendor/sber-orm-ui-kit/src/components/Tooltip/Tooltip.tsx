import { ReactNode } from 'react';
import {
  Tooltip as VTooltip,
  TooltipProps as VTooltipProps,
} from '@v-uik/tooltip';
import { DropdownProps } from '@v-uik/dropdown';
import { Placement } from '@popperjs/core';

import classes from './styles.module.scss';

export interface ITooltipProps extends Omit<VTooltipProps, 'content'> {
  canShow?: boolean;
  placement?: Placement;
  content?: ReactNode | ReactNode[];
  fallbackPlacements?: Placement[];
}

export const Tooltip = (props: ITooltipProps) => {
  const {
    canShow = true,
    children,
    placement = 'top',
    content,
    dropdownProps,
    fallbackPlacements,
    ...rest
  } = props;
  const baseClasses = { ...classes };

  const dropdownProperties = {
    placement,
    modifiers: [
      {
        name: 'offset',
        options: {
          offset: ({ placement }: { placement: Placement }) => {
            switch (placement) {
              case 'top-start':
              case 'bottom-start':
                return [-16, 16];
              case 'top-end':
              case 'bottom-end':
                return [16, 16];
              case 'left-start':
              case 'right-start':
                return [-16, 16];
              case 'left-end':
              case 'right-end':
                return [16, 16];
              case 'left':
              case 'right':
                return [0, 16];
              default:
                return [16, 16];
            }
          },
        },
      },
      { name: 'computeStyles', options: { gpuAcceleration: false } },
      { name: 'flip', options: { fallbackPlacements } },
    ] as DropdownProps['modifiers'],
    content,
    ...dropdownProps,
  };

  if (!canShow) {
    return children;
  }

  return (
    <VTooltip
      classes={baseClasses}
      dropdownProps={dropdownProperties}
      {...rest}
    >
      {children}
    </VTooltip>
  );
};
