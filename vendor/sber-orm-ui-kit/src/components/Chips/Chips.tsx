import { Tag } from '@v-uik/tag';
import cn from 'classnames';
import React, { FormEvent } from 'react';

import { Badge } from '../Badge';
import { Icon } from '../Icon';
import { Text } from '../Typography';
import classes from './styles.module.scss';

export type TChipsVariant = 'fill' | 'outline';
export type TChipsSize = 'XXS' | 'XS' | 'S';

export interface IChipsItem {
  title: React.ReactNode;
  id: string;
  count?: number;
}

export interface IChipsProps {
  disabled?: boolean;
  item: IChipsItem;
  selected?: boolean;
  onChange?: (id: string, event: FormEvent<HTMLElement>) => void;
  onRemove?: (id: string, event: FormEvent<HTMLElement>) => void;
  variant?: TChipsVariant;
  size?: TChipsSize;
  fullWidth?: boolean;
  testId?: string;
  nowrap?: boolean;
}

export const Chips = ({
  disabled,
  fullWidth,
  item,
  onChange,
  onRemove,
  selected,
  size = 'XXS',
  variant = 'fill',
  testId,
  nowrap = false,
}: IChipsProps) => {
  const handleChange = (event: FormEvent<HTMLElement>) => {
    event.stopPropagation();
    if (disabled) {
      return;
    }

    onChange?.(item.id, event);
  };

  const handleRemove = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();

    onRemove?.(item.id, event);
  };

  return (
    <Tag
      selected={selected}
      classes={{
        ...classes,
        tag: cn(classes.tag, classes[variant], classes[size], {
          [classes.fullWidth]: fullWidth,
        }),
      }}
      disabled={disabled}
      onClick={handleChange}
      data-testid={testId ? `${testId}-${item.id}` : undefined}
    >
      <Text
        className={cn(classes.title, {
          [classes.titleNoWrap]: nowrap,
          [classes.titleWithRemove]: onRemove && !disabled,
        })}
        size={size === 'XXS' ? 'sm' : size === 'XS' ? 'md' : 'lg'}
        code
      >
        {item.title}
      </Text>
      {!!item.count && !onRemove && (
        <Badge variant='yellow'>{item.count}</Badge>
      )}
      {onRemove && !disabled && (
        <Icon
          onClick={handleRemove}
          width={size === 'S' ? 20 : 16}
          height={size === 'S' ? 20 : 16}
          className={classes.icon}
          name='cross'
        />
      )}
    </Tag>
  );
};
