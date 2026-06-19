import React, { useCallback, useState } from 'react';
import cn from 'classnames';
import { InputChangeReason } from '@v-uik/input';
import { InputNumber as VInputNumber } from '@v-uik/input-number';

import { Row } from '../Grid';
import { Icon } from '../Icon';
import { Tooltip } from '../Tooltip';
import { ArrowControl } from './components/ArrowControl';
import { IInputNumberProperties } from './types';

import styles from './styles.module.scss';

export const InputNumber = (properties: IInputNumberProperties) => {
  const {
    icon,
    label,
    labelInside,
    placeholder,
    required,
    size = 'M',
    tooltip,
    noArrows,
    viewOnly,
    value,
    ...rest
  } = properties;
  const [filled, setFilled] = useState(false);

  const baseClasses = {
    container: cn(styles[`size${size}`], {
      [styles.containerLabelInside]: labelInside && !viewOnly,
      [styles.noArrows]: noArrows,
      [styles.filled]: typeof value === 'number' || filled,
      [styles[`size${size}WithPrefix`]]: !!icon,
      [styles[`size${size}PaddingRight`]]:
        (!!tooltip && labelInside) || !labelInside,
      [styles.viewOnly]: viewOnly,
    }),
    ...styles,
    inputContainer: cn({
      [styles.inputContainer]: !viewOnly,
      [styles.inputContainerViewOnly]: viewOnly,
    }),
  };
  const labelledClasses = {
    inputLabel: cn({
      [styles.labelError]: properties.error,
      [styles.labelRequired]: required,
    }),
    topLabels: styles.topLabels,
    topLabelsWrapper: styles.topLabelsWrapper,
  };
  const labelClasses = {
    text: cn({ [styles.textViewOnly]: viewOnly }),
  };
  const helperClasses = {
    error: styles.error,
    helperText: styles.helperText,
  };

  const handleChange = useCallback(
    (
      value_: number | null,
      event: React.ChangeEvent<HTMLInputElement>,
      reason?: InputChangeReason,
    ) => {
      if (properties.readonly) {
        return;
      }

      setFilled(typeof value_ === 'number');
      properties.onChange?.(value_, event, reason);
    },
    [properties.onChange, properties.readonly],
  );

  const onArrowClick = useCallback(
    (increment?: boolean) => () => {
      const newValue = (value ?? 0) + (increment ? 1 : -1);

      handleChange(
        newValue as number,
        {} as React.ChangeEvent<HTMLInputElement>,
        'input',
      );
    },
    [value, handleChange],
  );

  const labels = (
    <Row gutter={4} noFlex>
      <span className={styles.label}>{label}</span>
      {tooltip && !labelInside && (
        <Tooltip
          placement='top-end'
          content={tooltip}
          fallbackPlacements={['left-start']}
        >
          <span className={styles.tooltipIcon}>
            <Icon width={16} height={16} name='infoOutlined' />
          </span>
        </Tooltip>
      )}
    </Row>
  );

  const helperText = properties.helperText && (
    <Row gutter={4}>
      {properties.error && properties.helperText && (
        <Icon width={16} height={16} name='errorRounded' />
      )}
      {properties.helperText}
    </Row>
  );

  return (
    <VInputNumber
      classes={baseClasses}
      showErrorIcon={false}
      valueType='number'
      helperTextProps={{ classes: helperClasses }}
      labelledClasses={labelledClasses}
      clearIcon={<Icon width={16} height={16} name='errorRounded' />}
      decimalSeparator='.'
      {...rest}
      helperText={helperText}
      label={labels}
      placeholder={labelInside ? undefined : placeholder}
      value={value}
      prefix={icon ? <Icon width={24} height={24} name={icon} /> : undefined}
      suffix={
        <Row gutter={8} className={styles.suffix}>
          {tooltip && labelInside ? (
            <Tooltip
              placement='top-end'
              content={tooltip}
              fallbackPlacements={['left-start']}
            >
              <div className={styles.tooltipIconWrapper}>
                <Icon width={20} height={20} name='infoOutlined' />
              </div>
            </Tooltip>
          ) : undefined}
          {!(viewOnly || noArrows) && (
            <ArrowControl
              size={size}
              onUp={onArrowClick(true)}
              onDown={onArrowClick()}
              disabled={properties.disabled}
            />
          )}
        </Row>
      }
      canClear={!properties.readonly}
      disabled={properties.disabled || viewOnly}
      labelProps={{ classes: labelClasses }}
      onChange={handleChange}
    />
  );
};
