import cn from 'classnames';
import React, { useState } from 'react';

import {
  InputChangeReason,
  Input as VInput,
  InputProps as VInputProperties,
} from '@v-uik/input';

import { Icon } from '../Icon';
import styles from './styles.module.scss';

export interface IOldInputProperties extends VInputProperties {
  label?: string;
  labelInside?: boolean;
  labelBold?: boolean;
  secondary?: boolean;
  /** Упрощенное визуальное представление компонента, без возможности поменять значение */
  viewOnly?: boolean;
  readonly?: boolean;
  testId?: string;
}

// Todo удалить компонент после создания Field Search
export const OldInput = (properties: IOldInputProperties) => {
  const { labelBold = false, testId, viewOnly } = properties;
  const [filled, setFilled] = useState(false);

  const baseClasses = {
    container: cn({
      [styles.containerLabelInside]: properties.labelInside && !viewOnly,
      [styles.containerSecondary]: properties.secondary,
      [styles.filled]: properties.value || filled || properties.placeholder,
    }),
    ...styles,
    inputContainer: cn({
      [styles.inputContainer]: !viewOnly,
      [styles.inputContainerViewOnly]: viewOnly,
    }),
  };
  const labelledClasses = {
    inputLabel: cn(styles.inputLabel, {
      [styles.inputLabelBold]: labelBold,
      [styles.inputLabelError]: properties.error,
    }),
    topLabels: styles.topLabels,
    topLabelsWrapper: styles.topLabelsWrapper,
  };
  const labelClasses = {
    text: cn({ [styles.textViewOnly]: viewOnly }),
    ...properties.labelProps?.classes,
  };
  const helperClasses = {
    error: styles.error,
    helperText: styles.helperText,
  };

  const handleChange = (
    value: string,
    event: React.ChangeEvent<HTMLInputElement>,
    reason?: InputChangeReason,
  ) => {
    if (properties.readonly) {
      return;
    }

    setFilled(!!value);
    properties.onChange?.(value, event, reason);
  };

  return (
    <VInput
      classes={baseClasses}
      showErrorIcon={false}
      helperTextProps={{ classes: helperClasses }}
      labelledClasses={labelledClasses}
      clearIcon={<Icon name='cross' />}
      title={viewOnly ? (properties.value as string) : undefined}
      {...properties}
      value={viewOnly && !properties.value ? 'Не заполнено' : properties.value}
      canClear={properties.canClear && !properties.readonly}
      disabled={properties.disabled || viewOnly}
      labelProps={{
        ...properties.labelProps,
        classes: labelClasses,
      }}
      onChange={handleChange}
      data-testid={testId ? `${testId}-input` : undefined}
    />
  );
};
