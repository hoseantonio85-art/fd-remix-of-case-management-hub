import { useMergedRefs } from '@v-uik/hooks';
import {
  InputChangeReason,
  Input as VInput,
  InputProps as VInputProperties,
} from '@v-uik/input';
import cn from 'classnames';
import React, { ReactNode, useRef, useState } from 'react';
import { EIconName } from '../../icons';
import { TComponentSizes } from '../../types';
import { Row } from '../Grid';
import { Icon } from '../Icon';
import { Tooltip } from '../Tooltip';
import styles from './styles.module.scss';

export interface IInputProperties
  extends Omit<
    VInputProperties,
    'size' | 'prefix' | 'labelProps' | 'canClear'
  > {
  label?: string;
  labelInside?: boolean;
  /** Упрощенное визуальное представление компонента, без возможности поменять значение */
  viewOnly?: boolean;
  readonly?: boolean;
  size?: TComponentSizes;
  icon?: keyof typeof EIconName;
  tooltip?: ReactNode | ReactNode[];
  isComplexPart?: boolean;
  noBorder?: boolean;
  grayPrefix?: boolean;
}

export const Input = React.forwardRef(
  (properties: IInputProperties, ref: React.Ref<HTMLInputElement>) => {
    const {
      icon,
      label,
      labelInside,
      placeholder,
      required,
      size = 'M',
      tooltip,
      viewOnly,
      readonly,
      isComplexPart,
      noBorder,
      grayPrefix,
      suffix,
      classes,
      ...rest
    } = properties;
    const [filled, setFilled] = useState(false);
    const [focused, setFocused] = useState(false);

    const inputRef = useRef<HTMLInputElement | null>(null);
    const mergedInputRef = useMergedRefs([ref, inputRef]);

    const baseClasses = {
      container: cn(
        styles[`size${size}`],
        styles[`size${size}PaddingRight`],
        {
          [styles.containerLabelInside]: labelInside && !viewOnly,
          [styles.filled]: properties.value || filled,
          [styles[`size${size}WithPrefix`]]: !!icon,
          [styles.viewOnly]: viewOnly,
          [styles.containerComplex]: isComplexPart,
        },
        classes?.container,
      ),
      ...styles,
      prefix: cn(styles.prefix, {
        [styles.grayColor]: grayPrefix,
      }),
      inputContainer: cn(
        {
          [styles.inputContainer]: !viewOnly,
          [styles.inputContainerViewOnly]: viewOnly,
          [styles.noBorder]: noBorder,
        },
        classes?.inputContainer,
      ),
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

    const handleChange = (
      value: string,
      event: React.ChangeEvent<HTMLInputElement>,
      reason?: InputChangeReason,
    ) => {
      event.stopPropagation();
      event.preventDefault();
      if (readonly) {
        return;
      }

      setFilled(!!value);
      properties.onChange?.(value, event, reason);
    };

    const labels =
      !label && !tooltip ? null : (
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

    // Запрет всплытия событий для использования внутри других компонентов либы
    const keyDownHandler = (e: React.KeyboardEvent) => {
      e.stopPropagation();
    };

    return (
      <VInput
        inputRef={mergedInputRef}
        classes={baseClasses}
        showErrorIcon={false}
        helperTextProps={{ classes: helperClasses }}
        labelledClasses={labelledClasses}
        clearIcon={<Icon width={16} height={16} name='errorRounded' />}
        title={viewOnly ? (properties.value as string) : undefined}
        {...rest}
        helperText={helperText}
        label={labels}
        placeholder={labelInside && !focused ? undefined : placeholder}
        value={
          viewOnly && !properties.value ? 'Не заполнено' : properties.value
        }
        prefix={icon ? <Icon width={24} height={24} name={icon} /> : undefined}
        suffix={
          (tooltip && labelInside) || !!suffix ? (
            <>
              {tooltip && labelInside && (
                <Tooltip
                  placement='top-end'
                  content={tooltip}
                  fallbackPlacements={['left-start']}
                >
                  <span>
                    <Icon width={20} height={20} name='infoOutlined' />
                  </span>
                </Tooltip>
              )}
              {suffix}
            </>
          ) : undefined
        }
        canClear={!readonly && !properties.disabled}
        disabled={properties.disabled || viewOnly}
        labelProps={{ classes: labelClasses }}
        onChange={handleChange}
        onKeyDown={keyDownHandler}
        onFocusCapture={() => setFocused(true)}
        onBlurCapture={() => setFocused(false)}
      />
    );
  },
);
