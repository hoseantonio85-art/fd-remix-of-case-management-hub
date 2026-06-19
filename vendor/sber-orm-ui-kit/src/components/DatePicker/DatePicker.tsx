import React, { useRef, useState } from 'react';
import cn from 'classnames';
import dayjs from 'dayjs';
import en from 'dayjs/locale/en';
import ru from 'dayjs/locale/ru';

import {
  DateLibAdapterProvider,
  DatePicker as VDatePicker,
  DatePickerProps as VDatePickerProperties,
} from '@v-uik/date-picker';
import { DayjsAdapter } from '@v-uik/date-picker/dist/adapters/dayjs';

import { Row } from '@/components/Grid';
import { Icon } from '@/components/Icon';
import { InputMask } from '@/components/InputMask';
import { ViewOnlyDate } from './ViewOnlyDate';

import styles from './styles.module.scss';

dayjs.locale({
  ...ru,
  weekStart: 1,
  weekdaysShort: ['вс', 'пн', 'вт', 'ср', 'чт', 'пт', 'сб'],
  monthsShort: [
    'Янв',
    'Фев',
    'Мар',
    'Апр',
    'Май',
    'Июн',
    'Июл',
    'Авг',
    'Сен',
    'Окт',
    'Ноя',
    'Дек',
  ],
});
dayjs.locale({
  ...en,
  weekStart: 1,
});

export type TDatePickerSize = 'S' | 'M' | 'L' | 'XL';

export interface IDatePickerProperties
  extends Omit<VDatePickerProperties<dayjs.Dayjs, string>, 'size'> {
  value: dayjs.Dayjs | null;
  disabled?: boolean;
  /** Упрощенное визуальное представление компонента, без возможности поменять значение */
  viewOnly?: boolean;
  label?: string;
  fullWidth?: boolean;
  readonly?: boolean;
  labelInside?: boolean;
  withoutIcon?: boolean;
  tooltip?: React.ReactNode | React.ReactNode[];
  size?: TDatePickerSize;
  showErrorIcon?: boolean;
  testId?: string;
}

const calendarViewClasses = { ...styles };

export const DatePicker = ({
  label,
  viewOnly,
  labelInside = true,
  size = 'XL',
  withoutIcon,
  tooltip,
  showErrorIcon,
  helperText,
  testId,
  ...properties
}: IDatePickerProperties) => {
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
      [styles.viewOnly]: viewOnly,
    }),
  };
  const labelledClasses = { ...styles };

  const helperTextElement = helperText && (
    <Row gutter={4}>
      {properties.error && helperText && (
        <Icon width={16} height={16} name='errorRounded' />
      )}
      {helperText}
    </Row>
  );

  return (
    <DateLibAdapterProvider
      dateAdapter={DayjsAdapter}
      options={{ locale: 'RU' }}
    >
      <VDatePicker
        classes={rangePickerClasses}
        labelledClasses={labelledClasses}
        renderInput={(parameters) =>
          viewOnly ? (
            <ViewOnlyDate label={label} value={parameters.value || ''} />
          ) : (
            <div ref={containerReference}>
              <InputMask
                maskOptions={{ mask: Date, min: new Date(1900, 0, 1) }}
                className={styles.input}
                disabled={properties.disabled}
                label={label}
                size={size}
                value={parameters.value || ''}
                labelInside={labelInside}
                required={properties.required}
                readonly={properties.readonly}
                onChange={(value) => parameters.onChange?.(value)}
                tooltip={tooltip}
                placeholder={properties?.placeholder || 'дд.мм.гг'}
                icon={withoutIcon ? undefined : 'calendar'}
                error={properties.error}
                data-testid={testId || undefined}
              />
            </div>
          )
        }
        dropdownProps={{
          children: <div />,
          container: containerReference.current as HTMLDivElement,
          onStateChange: setOpened,
        }}
        calendarViewExternalProps={{
          dayViewProps: {
            classes: calendarViewClasses,
          },
          monthViewProps: {
            classes: {
              monthButton: styles.monthButton,
              monthText: styles.monthText,
              selected: styles.selected,
            },
          },
          yearViewProps: {
            classes: {
              selected: styles.selected,
              yearText: styles.yearText,
              yearButton: styles.yearButton,
            },
          },
        }}
        calendarPickerClasses={calendarViewClasses}
        format='DD.MM.YYYY'
        mask='11.11.1111'
        disabled={properties.disabled || viewOnly}
        helperText={helperTextElement}
        {...properties}
      />
    </DateLibAdapterProvider>
  );
};
