import { Tag } from '@v-uik/tag';
import cn from 'classnames';
import { FormEvent, useCallback } from 'react';

import { EComponentColors } from '../../types';
import { Row } from '../Grid';
import styles from '../RadioChips/styles.module.scss';
import { Text } from '../Typography';
import classes from './styles.module.scss';
import { ICheckboxChipsProps } from './types';

export const CheckboxChips = ({
  disabled,
  error,
  helperText,
  inline,
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
}: ICheckboxChipsProps) => {
  const isExisting = useCallback((id: string) => value.includes(id), [value]);

  const handleChange = (id: string, event: FormEvent<HTMLElement>) => {
    if (readonly || disabled) {
      return;
    }

    const newValue = isExisting(id)
      ? value.filter((name) => name !== id)
      : [...value, id];

    onChange?.(newValue, event);
  };

  return (
    <div className={cn(classes.wrapper, { [classes.wrapperInline]: inline })}>
      {label && (
        <Text size='sm' bold={labelBold} mb={8} tooltip={!labelBold}>
          {label}
          {!!required && <span className={styles.required}>*</span>}
        </Text>
      )}
      <Row
        gutter={4}
        className={cn(classes.wrapper, { [classes.wrapperInline]: inline })}
        wrap={wrap}
      >
        {items?.map((tag) => (
          <Tag
            key={tag.id}
            selected={isExisting(tag.id)}
            kind={kind}
            className={classes[`color-${tag.color ?? EComponentColors.blue}`]}
            classes={classes}
            onClick={(event) => handleChange(tag.id, event)}
            data-testid={testId ? `${testId}-${tag.id}` : undefined}
          >
            {tag.title}
            {typeof tag?.counter === 'number' && (
              <div className={classes.counter}>{tag.counter}</div>
            )}
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
};
