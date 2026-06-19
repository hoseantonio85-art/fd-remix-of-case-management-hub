import { LabelControl } from '@v-uik/label-control';
import { Switch as VSwitch, SwitchProps as VSwitchProps } from '@v-uik/switch';
import cn from 'classnames';
import { ReactNode, useMemo } from 'react';

import { Row } from '../Grid';
import { Icon } from '../Icon';
import { Tooltip } from '../Tooltip';
import { Text } from '../Typography';

import styles from './styles.module.scss';

const baseClasses = {
  checked: styles.checked,
  control: styles.control,
  disabled: styles.disabled,
  small: styles.small,
  switch: styles.switch,
  thumb: styles.thumb,
};

const labelClasses = {
  label: styles.label,
  labelContent: styles.labelContent,
};

export interface ISwitchProps extends VSwitchProps {
  label?: string;
  labelPlacement?: 'start' | 'end' | 'top' | 'bottom';
  error?: boolean;
  readonly?: boolean;
  helperText?: string;
  required?: boolean;
  tooltip?: ReactNode | ReactNode[];
}

export const Switch = ({
  error,
  label,
  labelPlacement,
  required,
  readonly,
  helperText,
  tooltip,
  ...rest
}: ISwitchProps) => {
  const classes = useMemo(
    () =>
      Object.assign({}, baseClasses, {
        control: cn(styles.control, {
          [styles.error]: error,
          [styles.readonly]: readonly,
        }),
      }),

    [error, readonly],
  );

  return (
    <>
      {label || helperText ? (
        <LabelControl
          label={
            <Row gutter={8} align='top'>
              <Row gutter={4} direction='column' align='top'>
                {label && (
                  <Text size={helperText ? 'sm' : 'lg'} bold>
                    {label}
                    {!!required && <span className={styles.required}>*</span>}
                  </Text>
                )}
                {helperText && (
                  <Row
                    gutter={4}
                    className={cn(styles.helperText, {
                      [styles.helperTextError]: error,
                    })}
                  >
                    {error && (
                      <Icon width={16} height={16} name='errorRounded' />
                    )}
                    <Text size='sm'>{helperText}</Text>
                  </Row>
                )}
              </Row>
              {tooltip && (
                <Tooltip
                  placement='top-end'
                  content={tooltip}
                  fallbackPlacements={['left-start']}
                >
                  <div className={styles.tooltipIconWrapper}>
                    <Icon width={20} height={20} name='infoOutlined' />
                  </div>
                </Tooltip>
              )}
            </Row>
          }
          control={<VSwitch classes={classes} />}
          labelPlacement={labelPlacement}
          {...rest}
          classes={labelClasses}
        />
      ) : (
        <VSwitch {...rest} classes={classes} />
      )}
    </>
  );
};
