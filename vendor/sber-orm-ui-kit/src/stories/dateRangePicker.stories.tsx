import { Meta, StoryFn } from '@storybook/react';
import dayjs from 'dayjs';
import { useState } from 'react';

import { DateRangePicker as DateRangePickerComponent, Row } from '..';
import { Container, DemoContainer, Item } from './utils';

const meta: Meta<typeof DateRangePickerComponent> = {
  argTypes: {
    disabled: {
      control: 'boolean',
      description: 'Деактивированное состояние',
    },
    required: {
      control: 'boolean',
      description: 'Обязательно для заполнения',
    },
    error: {
      control: 'boolean',
      description: 'Есть ошибка',
    },
    startLabel: {
      description: 'Заголовок поля начала',
    },
    endLabel: {
      description: 'Заголовок поля окончания',
    },
    helperText: {
      description: 'Вспомогательный текст или текст ошибки',
    },
    fullWidth: {
      control: 'boolean',
      description: 'Растянуть на всю ширину родителя',
    },
    labelInside: {
      control: 'boolean',
      description: 'Отображать заголовок внутри поля',
    },
    withoutIcon: {
      control: 'boolean',
      description: 'Без иконки',
    },
    tooltip: {
      control: 'text',
      description:
        'Текст подсказки в тултипе `React.ReactNode | React.ReactNode[]`',
    },
    size: {
      control: 'select',
      description: 'Размер инпута `TDatePickerSize`',
      options: ['S', 'M', 'L', 'XL'],
    },
    onChange: {
      description:
        'Обработчик изменения значения `(value: dayjs.Dayjs | null) => void`',
      type: 'function',
    },
  },
  args: {
    disabled: false,
    fullWidth: false,
    required: false,
    startLabel: 'Start label',
    endLabel: 'End label',
    labelInside: false,
    withoutIcon: false,
    error: false,
    tooltip: '',
    helperText: 'Helper text goes here',
    size: 'S',
  },
  parameters: {
    controls: {
      expanded: true,
    },
  },
  component: DateRangePickerComponent,
  title: 'components/DateRangePicker',
};

export default meta;

export const DateRangePicker: StoryFn<typeof DateRangePickerComponent> = (
  arguments_,
) => {
  const [value, setValue] = useState<[dayjs.Dayjs | null, dayjs.Dayjs | null]>([
    dayjs(new Date('2024-11-30T21:00:00.000Z')),
    dayjs('2024-12-08T20:59:59.999Z')
      .hour(23)
      .minute(59)
      .second(59)
      .millisecond(999),
  ]);
  const [emptyValue] = useState<[dayjs.Dayjs | null, dayjs.Dayjs | null]>([
    null,
    null,
  ]);
  const onChange = (value_: unknown) => {
    setValue(value_ as [dayjs.Dayjs | null, dayjs.Dayjs | null]);
  };

  return (
    <>
      <DemoContainer>
        <Item label='Customizable' width={430}>
          <DateRangePickerComponent
            {...arguments_}
            value={value}
            onChange={onChange}
          />
        </Item>
      </DemoContainer>
      <Container>
        <Item label='Default label outside' width={430}>
          <Row direction='column' gutter={8}>
            <DateRangePickerComponent
              startLabel='Label'
              value={value}
              required
              onChange={onChange}
              size='S'
              labelInside={false}
            />
            <DateRangePickerComponent
              startLabel='Label'
              value={value}
              required
              onChange={onChange}
              size='M'
              labelInside={false}
            />
            <DateRangePickerComponent
              startLabel='Label'
              value={value}
              required
              onChange={onChange}
              size='L'
              labelInside={false}
            />
            <DateRangePickerComponent
              required
              startLabel='Label'
              value={value}
              onChange={onChange}
              labelInside={false}
            />
          </Row>
        </Item>
        <Item label='Default' width={430}>
          <Row direction='column' gutter={8}>
            <DateRangePickerComponent
              startLabel='Start Label'
              endLabel='End Label'
              required
              endRequired
              value={value}
              onChange={onChange}
              size='S'
            />
            <DateRangePickerComponent
              startLabel='Start Label'
              endLabel='End Label'
              required
              endRequired
              value={value}
              onChange={onChange}
              size='M'
            />
            <DateRangePickerComponent
              startLabel='Start Label'
              endLabel='End Label'
              required
              endRequired
              value={value}
              onChange={onChange}
              size='L'
            />
            <DateRangePickerComponent
              startLabel='Start Label'
              endLabel='End Label'
              required
              endRequired
              value={value}
              onChange={onChange}
            />
          </Row>
        </Item>
        <Item label='With helper text' width={430}>
          <Row direction='column' gutter={8}>
            <DateRangePickerComponent
              startLabel='Start Label'
              endLabel='End Label'
              required
              endRequired
              value={value}
              onChange={onChange}
              size='S'
              helperText='Helper text'
            />
            <DateRangePickerComponent
              startLabel='Start Label'
              endLabel='End Label'
              required
              endRequired
              value={value}
              onChange={onChange}
              size='M'
              helperText='Helper text'
            />
            <DateRangePickerComponent
              startLabel='Start Label'
              endLabel='End Label'
              required
              endRequired
              value={value}
              onChange={onChange}
              size='L'
              helperText='Helper text'
            />
            <DateRangePickerComponent
              startLabel='Start Label'
              endLabel='End Label'
              required
              endRequired
              value={value}
              onChange={onChange}
              helperText='Helper text'
            />
          </Row>
        </Item>
        <Item label='With error' width={430}>
          <Row direction='column' gutter={8}>
            <DateRangePickerComponent
              startLabel='Start Label'
              endLabel='End Label'
              value={value}
              onChange={onChange}
              size='S'
              helperText='Error text'
              error
            />
            <DateRangePickerComponent
              startLabel='Start Label'
              endLabel='End Label'
              value={value}
              onChange={onChange}
              size='M'
              helperText='Error text'
              error
            />
            <DateRangePickerComponent
              startLabel='Start Label'
              endLabel='End Label'
              value={value}
              onChange={onChange}
              size='L'
              helperText='Error text'
              error
            />
            <DateRangePickerComponent
              startLabel='Start Label'
              endLabel='End Label'
              value={value}
              onChange={onChange}
              helperText='Error text'
              error
            />
          </Row>
        </Item>
        <Item label='Without value' width={500}>
          <DateRangePickerComponent
            startLabel='Start Label'
            endLabel='End Label'
            value={emptyValue}
          />
        </Item>
        <Item label='Disabled' width={500}>
          <DateRangePickerComponent
            disabled
            startLabel='Start Label'
            endLabel='End Label'
            value={value}
            onChange={onChange}
          />
        </Item>
        <Item label='ViewOnly' width={500}>
          <DateRangePickerComponent
            viewOnly
            startLabel='Начало события'
            endLabel='Конец события'
            value={value}
            onChange={onChange}
          />
        </Item>
        <Item label='ViewOnly without value' width={500}>
          <DateRangePickerComponent
            viewOnly
            startLabel='Начало события'
            endLabel='Конец события'
            value={[null, null]}
            onChange={onChange}
          />
        </Item>
      </Container>
    </>
  );
};
