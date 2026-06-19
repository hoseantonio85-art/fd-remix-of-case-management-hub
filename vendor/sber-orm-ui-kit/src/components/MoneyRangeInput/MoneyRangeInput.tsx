import cn from 'classnames';
import { useMemo, useState } from 'react';

import {
  InputNumber as VInputNumber,
  InputNumberProps as VInputNumberProperties,
} from '@v-uik/input-number';

import { TComponentSizes } from '../../types';
import { Icon } from '../Icon';
import styles from './styles.module.scss';

export type TMoneyRangeInputProperties = Omit<
  VInputNumberProperties,
  'value' | 'onChange' | 'size'
> & {
  label?: string;
  labelBold?: boolean;
  value?: [number | null | undefined, number | null | undefined];
  onChange?: (
    value: [number | null | undefined, number | null | undefined],
  ) => void;
  readonly?: boolean;
  size?: TComponentSizes;
};

export const MoneyRangeInput = ({
  canClear,
  onChange,
  value,
  size = 'M',
  ...properties
}: TMoneyRangeInputProperties) => {
  const { labelBold = false } = properties;
  const [focused, setFocused] = useState(false);
  const baseClasses = useMemo(
    () => ({
      ...styles,
      container: cn(styles[`size${size}`], styles[`size${size}WithPrefix`], {
        [styles.focused]: focused,
      }),
    }),
    [focused],
  );
  const handleFocus = () => setFocused(true);
  const handleBlur = () => setFocused(false);

  const handleChange = (value_: number | null, isStart: boolean) => {
    if (properties.readonly) {
      return;
    }

    if (isStart) {
      onChange?.([value_, value?.[1]]);
    } else {
      onChange?.([value?.[0], value_]);
    }
  };

  const labelledClasses = {
    inputLabel: cn(styles.inputLabel, {
      [styles.inputLabelBold]: labelBold,
      [styles.inputLabelError]: properties.error,
    }),
    topLabels: cn(styles.topLabels),
  };
  const helperClasses = {
    error: styles.error,
    helperText: styles.helperText,
  };

  return (
    <div className={styles.root}>
      <VInputNumber
        classes={baseClasses}
        showErrorIcon={false}
        helperTextProps={{ classes: helperClasses }}
        labelledClasses={labelledClasses}
        clearIcon={<Icon name='cross' />}
        groupSeparator=' '
        precision={0}
        {...properties}
        valueType='number'
        value={value?.[0]}
        onChange={(value_: number | null) => handleChange(value_, true)}
        prefix={<Icon name='ruble' />}
        onFocus={handleFocus}
        onBlur={handleBlur}
        suffix={
          <VInputNumber
            classes={{
              disabled: styles.disabledSecond,
              input: styles.inputSecond,
              inputClear: styles.inputClear,
              inputContainer: styles.inputContainerSecond,
              large: styles.large,
            }}
            showErrorIcon={false}
            helperTextProps={{ classes: helperClasses }}
            labelledClasses={labelledClasses}
            clearIcon={<Icon name='cross' />}
            groupSeparator=' '
            precision={0}
            {...properties}
            valueType='number'
            value={value?.[1]}
            onChange={(value_: number | null) => handleChange(value_, false)}
            placeholder='до'
            label={null}
            helperText={null}
            canClear={canClear && !properties.readonly && !properties.disabled}
            onBlur={handleBlur}
            onFocus={handleFocus}
          />
        }
        placeholder='от'
        canClear={canClear && !properties.readonly && !properties.disabled}
      />
    </div>
  );
};
