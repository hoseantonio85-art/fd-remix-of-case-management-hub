import cn from 'classnames';
import dayjs from 'dayjs';
import 'dayjs/locale/ru';

import {
  DateLibAdapterProvider,
  RangePicker as VRangePicker,
  RangePickerProps as VRangePickerProperties,
} from '@v-uik/date-picker';
import { DayjsAdapter } from '@v-uik/date-picker/dist/adapters/dayjs';
import React, { useRef, useState } from 'react';
import { TDatePickerSize } from '@/components/DatePicker';
import { Row } from '@/components/Grid';
import { InputMask } from '@/components/InputMask';
import { Tooltip } from '@/components/Tooltip';

import { Icon } from '../Icon';
import styles from './styles.module.scss';
import { ViewOnlyRangeDate } from './ViewOnlyRangeDate';

export interface IRangePickerProperties
  extends Omit<VRangePickerProperties<dayjs.Dayjs>, 'size'> {
  value: [Date | dayjs.Dayjs | null, Date | dayjs.Dayjs | null];
  disabled?: boolean;
  startLabel?: string;
  endLabel?: string;
  loading?: boolean;
  /** Упрощенное визуальное представление компонента, без возможности поменять значение */
  viewOnly?: boolean;
  readonly?: boolean;
  size?: TDatePickerSize;
  labelInside?: boolean;
  withoutIcon?: boolean;
  tooltip?: React.ReactNode | React.ReactNode[];
  testId?: string;
  endRequired?: boolean;
}

const panelHeaderClasses = {
  chevron: styles.chevron,
  year: styles.year,
  month: styles.month,
  root: styles.calendarBar,
  selected: styles.selected,
};
const calendarViewClasses = { ...styles };
const yearsViewClasses = {
  root: styles.years,
  row: styles.yearsRow,
  yearButton: styles.yearButton,
  selected: styles.yearButtonSelected,
};
const monthsViewClasses = {
  root: styles.months,
  row: styles.monthsRow,
  monthButton: styles.monthButton,
  selected: styles.monthButtonSelected,
};

export const DateRangePicker = ({
  disabled,
  endLabel,
  loading,
  startLabel,
  viewOnly,
  size = 'XL',
  labelInside = true,
  withoutIcon,
  helperText,
  tooltip,
  testId,
  ...properties
}: IRangePickerProperties) => {
  const [opened, setOpened] = useState(!!properties.open);
  const containerReference = useRef<HTMLDivElement>(null);

  const rangePickerClasses = {
    ...styles,
    calendarPickerDropdown: cn(styles.calendarPickerDropdown, {
      [styles.calendarPickerDropdownReadonly]: properties.readonly,
    }),
    root: cn(styles.root, {
      [styles.fullWidth]: properties.fullWidth,
      [styles.opened]: opened,
    }),
  };

  const handleOpen = (value: boolean) => {
    !disabled && !viewOnly && !properties.readonly && setOpened(value);
  };

  const helperTextElement = helperText && (
    <Row gutter={4}>
      {properties.error && helperText && (
        <Icon width={16} height={16} name='errorRounded' />
      )}
      {helperText}
    </Row>
  );

  const label =
    (!startLabel && !endLabel && !tooltip) || labelInside ? null : (
      <Row gutter={4} noFlex mb={4}>
        <span className={styles.singleLabel}>{startLabel || endLabel}</span>
        {properties.required && <span className={styles.asterisk}>*</span>}
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

  return (
    <DateLibAdapterProvider
      dateAdapter={DayjsAdapter}
      options={{ locale: 'RU' }}
    >
      <VRangePicker
        classes={rangePickerClasses}
        suffix={<Icon name='calendar' />}
        renderInput={(startProps, endProps) =>
          viewOnly ? (
            <ViewOnlyRangeDate
              endLabel={endLabel}
              startLabel={startLabel}
              startValue={startProps.value}
              endValue={endProps.value}
            />
          ) : (
            <>
              {label}
              <div
                ref={containerReference}
                className={cn(styles.fieldGrid, styles[`size${size}`], {
                  [styles.error]: !!properties.error,
                  [styles.focused]: opened,
                  [styles.disabled]: disabled,
                })}
              >
                <InputMask
                  maskOptions={{ mask: Date, min: new Date(1900, 0, 1) }}
                  className={styles.inputStart}
                  disabled={disabled}
                  label={labelInside ? startLabel : undefined}
                  size={size}
                  value={startProps.value || ''}
                  labelInside={labelInside}
                  required={properties.required}
                  readonly={properties.readonly}
                  onChange={(value) => startProps.onChange?.(value)}
                  placeholder={properties.placeholder || 'дд.мм.гг'}
                  icon={withoutIcon ? undefined : 'calendar'}
                  error={properties.error}
                  classes={{
                    inputContainer: styles.inputStart,
                  }}
                  isComplexPart
                  data-testid={testId ? `${testId}-first` : undefined}
                />
                <InputMask
                  maskOptions={{ mask: Date, min: new Date(1900, 0, 1) }}
                  className={styles.inputEnd}
                  disabled={disabled}
                  label={labelInside ? endLabel : undefined}
                  size={size}
                  value={endProps.value || ''}
                  labelInside={labelInside}
                  required={properties.endRequired}
                  readonly={properties.readonly}
                  onChange={(value) => endProps.onChange?.(value)}
                  tooltip={tooltip}
                  placeholder={properties.placeholder || 'дд.мм.гг'}
                  error={properties.error}
                  classes={{
                    inputContainer: styles.inputEnd,
                  }}
                  data-testid={testId ? `${testId}-second` : undefined}
                />
              </div>
            </>
          )
        }
        dropdownProps={{
          children: <div />,
          container: containerReference.current as HTMLDivElement,
          onStateChange: handleOpen,
        }}
        panelHeaderClasses={panelHeaderClasses}
        calendarViewClasses={calendarViewClasses}
        yearsViewClasses={yearsViewClasses}
        monthsViewClasses={monthsViewClasses}
        mask='11.11.1111'
        format={'DD.MM.YYYY'}
        disabled={disabled || viewOnly}
        helperText={helperTextElement}
        datePanelStyle='single'
        {...properties}
      />
    </DateLibAdapterProvider>
  );
};
