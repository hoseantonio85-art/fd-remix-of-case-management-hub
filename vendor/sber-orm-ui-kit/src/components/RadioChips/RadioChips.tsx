import cn from 'classnames';
import React, { FormEvent } from 'react';

import { TTagColor, TTagKinds, Tag } from '@v-uik/tag';

import { Badge } from '../Badge';
import { Row } from '../Grid';
import { Text } from '../Typography';
import styles from './styles.module.scss';

export interface IRadioChipsProps {
  value?: string;
  items: {
    title: React.ReactNode;
    id: string;
    count?: number;
  }[];
  kind?: Exclude<TTagKinds, 'color'>;
  onChange?: (id: string, event: FormEvent<HTMLElement>) => void;
  color?: TTagColor;
  wrap?: boolean;
  error?: boolean;
  required?: boolean;
  labelBold?: boolean;
  label?: string;
  helperText?: string;
  readonly?: boolean;
  testId?: string;
  fullWidth?: boolean;
}

const classes = { ...styles };

export const RadioChips = ({
  color,
  error,
  helperText,
  items,
  kind,
  label,
  labelBold,
  onChange,
  readonly,
  required,
  value,
  wrap,
  testId,
  fullWidth = false,
}: IRadioChipsProps) => (
  <div className={cn(styles.wrapper, { [styles.wrapperFullWidth]: fullWidth })}>
    {label && (
      <Text size='sm' bold={labelBold} mb={8} tooltip={!labelBold}>
        {label}
        {!!required && <span className={styles.required}>*</span>}
      </Text>
    )}
    <Row
      gutter={4}
      className={cn({
        [styles.container]: kind === 'primary' && color,
        [styles[`color-${color}`]]: kind === 'primary' && color,
      })}
      wrap={wrap}
    >
      {items?.map((tag) => (
        <Tag
          key={tag.id}
          selected={value === tag.id}
          kind={kind}
          classes={classes}
          data-testid={testId ? `${testId}-${tag.id}` : undefined}
          onClick={readonly ? undefined : (event) => onChange?.(tag.id, event)}
        >
          <Row gutter={4} noFlex>
            <span />
            {tag.title}
            {!!tag.count ? (
              <Badge className={classes.neutral} variant='gray'>
                {tag.count}
              </Badge>
            ) : (
              <span />
            )}
          </Row>
        </Tag>
      ))}
    </Row>
    {helperText && (
      <Text
        className={cn(styles.helperText, { [styles.helperTextError]: error })}
        size='sm'
      >
        {helperText}
      </Text>
    )}
  </div>
);
