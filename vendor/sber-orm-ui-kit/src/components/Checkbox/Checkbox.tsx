import { useMemo } from 'react';

import {
  Checkbox as VCheckbox,
  CheckboxProps as VCheckboxProperties,
} from '@v-uik/checkbox';
import { LabelControl } from '@v-uik/label-control';
import { Row } from '../Grid';
import { Icon } from '../Icon';

import styles from './styles.module.scss';

const baseClasses = {
  checkboxIcon: styles.checkboxIcon,
  checkbox: styles.checkbox,
  checked: styles.checked,
  control: styles.control,
  disabled: styles.disabled,
  indeterminate: styles.indeterminate,
};

export interface ICheckboxProperties extends VCheckboxProperties {
  error?: boolean;
  errorText?: string;
  readonly?: boolean;
  helperText?: string;
  label?: string;
}

export const Checkbox = (properties: ICheckboxProperties) => {
  const { className, errorText, helperText, label, ...props } = properties;
  const classes = useMemo(() => {
    if (props.error) {
      return Object.assign({}, baseClasses, {
        control: `${styles.control} ${styles.error}`,
      });
    }
    if (props.readonly) {
      return Object.assign({}, baseClasses, {
        disabled: styles.disabledReadonly,
      });
    }

    return baseClasses;
  }, [props]);

  const labels = useMemo(() => {
    if (errorText) {
      return (
        <Row direction='column' align='top' gutter={4}>
          {label}
          <Row gutter={4} className={styles.errorText}>
            <Icon name='errorRounded' width={16} height={16} />
            {errorText}
          </Row>
        </Row>
      );
    }

    if (helperText) {
      return (
        <Row direction='column' align='top' gutter={4}>
          {label}
          <Row gutter={4} className={styles.helperText}>
            {helperText}
          </Row>
        </Row>
      );
    }

    return <>{label}</>;
  }, [label, errorText, helperText]);

  return (
    <LabelControl
      label={labels}
      classes={{
        label: styles.label,
        labelContent: styles.labelContent,
      }}
      className={className}
      control={
        <VCheckbox
          classes={classes}
          {...props}
          onChange={properties.readonly ? undefined : properties.onChange}
          disabled={properties.disabled || properties.readonly}
        />
      }
      {...props}
      checked={properties.checked}
      onChange={properties.readonly ? undefined : properties.onChange}
    />
  );
};
