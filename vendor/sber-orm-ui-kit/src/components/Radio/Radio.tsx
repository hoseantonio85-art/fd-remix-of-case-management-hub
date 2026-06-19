import { useMemo } from 'react';
import cn from 'classnames';

import { LabelControl } from '@v-uik/label-control';
import { Radio as VRadio, RadioProps as VRadioProps } from '@v-uik/radio';
import {
  RadioGroup as VRadioGroup,
  RadioGroupProps as VRadioGroupProps,
} from '@v-uik/radio-group';

import { Row } from '../Grid';
import { Icon } from '../Icon';
import { Text } from '../Typography';

import styles from './styles.module.scss';

const baseClasses = {
  control: styles.control,
  input: styles.input,
  radio: styles.radio,
  disabled: styles.disabled,
  checked: styles.checked,
  radioMark: styles.radioMark,
};

const labelClasses = {
  label: styles.label,
  disabled: styles.disabled,
  labelContent: styles.labelContent,
};

export interface IRadioProps extends VRadioProps {
  label?: string;
  helperText?: string;
  error?: boolean;
}

export const Radio = ({
  label,
  helperText,
  error = false,
  ...rest
}: IRadioProps) => {
  const classes = useMemo(() => {
    if (error) {
      return Object.assign({}, baseClasses, {
        control: `${styles.control} ${styles.error}`,
      });
    }
    return baseClasses;
  }, [error]);

  return (
    <>
      {label || helperText ? (
        <LabelControl
          label={
            <Row gutter={4} direction='column' align='top'>
              {label && <Text disabled={rest.disabled}>{label}</Text>}
              {helperText && (
                <Row
                  gutter={4}
                  className={cn(styles.helperText, {
                    [styles.helperTextError]: error,
                  })}
                >
                  {error && <Icon width={16} height={16} name='errorRounded' />}
                  <Text size='sm'>{helperText}</Text>
                </Row>
              )}
            </Row>
          }
          control={<VRadio classes={classes} />}
          {...rest}
          onChange={(e) => rest.onChange?.(rest.value ?? '', e)}
          classes={labelClasses}
        />
      ) : (
        <VRadio classes={classes} {...rest} />
      )}
    </>
  );
};

export type { VRadioGroupProps as RadioGroupProps };
export { VRadioGroup as RadioGroup };
