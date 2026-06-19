import { ChangeEvent, ReactNode, useMemo, useState } from 'react';
import cn from 'classnames';
import {
  Textarea as VTextarea,
  TextareaProps as VTextareaProperties,
} from '@v-uik/textarea';

import { Row } from '../Grid';
import { Icon } from '../Icon';
import { Tooltip } from '../Tooltip';

import styles from './styles.module.scss';

export interface ITextareaProperties
  extends Omit<
    VTextareaProperties,
    'textareaProps' | 'helperTextProps' | 'showCount' | 'size' | 'resize'
  > {
  canClear?: boolean;
  labelInside?: boolean;
  maxLength?: number;
  readonly?: boolean;
  tooltip?: ReactNode | ReactNode[];
  size?: 'S' | 'M' | 'L' | 'XL';
  resize?: 'none' | 'horizontal' | 'vertical';
  /** Упрощенное визуальное представление компонента, без возможности поменять значение */
  viewOnly?: boolean;
}

export const Textarea = ({
  labelInside,
  maxLength,
  helperText,
  fullWidth,
  tooltip,
  size = 'M',
  ...properties
}: ITextareaProperties) => {
  const [filled, setFilled] = useState(false);
  const [counter, setCounter] = useState(
    properties.defaultValue?.toString()?.length ||
      properties.value?.toString()?.length ||
      0,
  );

  const classes = useMemo(
    () => ({
      container: cn(styles.container, styles[`size${size}`], {
        [styles.containerLabelInside]: labelInside && !properties.viewOnly,
        [styles.filled]: properties.value || filled || properties.placeholder,
        [styles.fullWidth]: fullWidth,
      }),
      disabled: styles.disabled,
      error: styles.error,
      focused: styles.focused,
      textarea: styles.textarea,
      textareaContainer: cn({
        [styles.fullWidth]: fullWidth,
        [styles.textareaContainer]: !properties.viewOnly,
        [styles.textareaContainerViewOnly]: properties.viewOnly,
        [styles[`rows-${properties.rows}`]]: properties.viewOnly,
      }),
    }),
    [filled, properties.value],
  );

  const labelProperties = useMemo(
    () => ({
      description: styles.description,
      inputLabel: cn(styles.inputLabel, styles[`size${size}`], {
        [styles.inputLabelError]: properties.error,
      }),
      required: styles.required,
      text: styles.text,
      topLabels: cn(styles.topLabels, {
        [styles.topLabelsViewOnly]: properties.viewOnly,
      }),
      topLabelsWrapper: cn(styles.topLabelsWrapper, styles[`size${size}`]),
    }),
    [properties.error],
  );
  const labelClasses = {
    text: cn({ [styles.textViewOnly]: properties.viewOnly }),
    ...properties.labelProps?.classes,
  };

  const handleChange = (
    value: string,
    event: ChangeEvent<HTMLTextAreaElement>,
  ) => {
    if (properties.readonly) {
      return;
    }

    setFilled(!!value);
    setCounter(value.length);
    properties.onChange?.(value, event);
  };

  return (
    <div style={{ width: fullWidth ? '100%' : 'auto' }}>
      <div className={classes.container}>
        <VTextarea
          classes={classes}
          labelledClasses={labelProperties}
          title={properties.viewOnly ? (properties.value as string) : undefined}
          {...properties}
          rows={properties.viewOnly && !properties.value ? 1 : properties.rows}
          value={
            properties.viewOnly && !properties.value
              ? 'Не заполнено'
              : properties.value
          }
          label={
            properties.required && !properties.viewOnly ? (
              <>
                {properties.label}
                <span className={styles.asterisk}>*</span>
              </>
            ) : (
              properties.label
            )
          }
          disabled={properties.disabled || properties.viewOnly}
          required={properties.required && !properties.viewOnly}
          labelProps={{
            ...properties.labelProps,
            classes: labelClasses,
          }}
          description={
            tooltip && !labelInside ? (
              <Tooltip
                placement='top-end'
                content={tooltip}
                fallbackPlacements={['left-start']}
              >
                <div className={styles.description}>
                  <Icon width={16} height={16} name='infoOutlined' />
                </div>
              </Tooltip>
            ) : undefined
          }
          onChange={handleChange}
          textareaProps={{ maxLength }}
        />
        <Row
          className={styles.suffix}
          align='middle'
          justify='center'
          gutter={4}
        >
          {(properties.canClear ?? false) &&
          !(properties.readonly || properties.viewOnly) &&
          properties.value &&
          !properties.disabled ? (
            <div className={styles.clear}>
              <Icon
                name='errorRounded'
                width={16}
                height={16}
                onClick={() =>
                  handleChange('', {} as ChangeEvent<HTMLTextAreaElement>)
                }
              />
            </div>
          ) : null}
          {tooltip && labelInside ? (
            <Tooltip
              placement='top-end'
              content={tooltip}
              fallbackPlacements={['left-start']}
            >
              <div className={styles.description}>
                <Icon width={20} height={20} name='infoOutlined' />
              </div>
            </Tooltip>
          ) : null}
        </Row>
        {maxLength ? (
          <div className={styles.counter}>{`${counter}/${maxLength}`}</div>
        ) : null}
      </div>
      {helperText ? (
        <div
          className={cn(styles.helperText, {
            [styles.error]: properties.error,
          })}
        >
          {properties.error && helperText && (
            <Icon width={16} height={16} name='errorRounded' />
          )}
          {helperText}
        </div>
      ) : null}
    </div>
  );
};
