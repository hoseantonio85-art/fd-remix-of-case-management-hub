import { Meta, StoryFn } from '@storybook/react';
import dayjs, { Dayjs } from 'dayjs';
import { useState } from 'react';

import { DatePicker as DatePickerComponent, Row } from '..';
import { Container, DemoContainer, Item } from './utils';

const meta: Meta<typeof DatePickerComponent> = {
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
    label: {
      description: 'Заголовок поля',
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
    label: 'Label',
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
  component: DatePickerComponent,
  title: 'components/DatePicker',
};

export default meta;

export const DatePicker: StoryFn<typeof DatePickerComponent> = (arguments_) => {
  const [value, setValue] = useState<Dayjs | null>(
    dayjs('2024-09-13T13:58:05.395Z'),
  );
  const onChange = (value_: Dayjs | null) => {
    setValue(value_);
  };

  return (
    <>
      <DemoContainer>
        <Item label='Customizable' width={430}>
          <DatePickerComponent {...arguments_} />
        </Item>
      </DemoContainer>
      <Container>
        <Item label='Default label outside' width={430}>
          <Row direction='column' gutter={8}>
            <DatePickerComponent
              label='Label Required'
              required
              value={value}
              onChange={onChange}
              size='S'
              labelInside={false}
            />
            <DatePickerComponent
              label='Label Required'
              required
              value={value}
              onChange={onChange}
              size='M'
              labelInside={false}
            />
            <DatePickerComponent
              label='Label Required'
              required
              value={value}
              onChange={onChange}
              size='L'
              labelInside={false}
            />
            <DatePickerComponent
              label='Label Required'
              required
              value={value}
              onChange={onChange}
              labelInside={false}
            />
          </Row>
        </Item>
        <Item label='Default' width={430}>
          <Row direction='column' gutter={8}>
            <DatePickerComponent
              label='Label Required'
              required
              value={value}
              onChange={onChange}
              size='S'
            />
            <DatePickerComponent
              label='Label Required'
              required
              value={value}
              onChange={onChange}
              size='M'
            />
            <DatePickerComponent
              label='Label Required'
              required
              value={value}
              onChange={onChange}
              size='L'
            />
            <DatePickerComponent
              label='Label Required'
              required
              value={value}
              onChange={onChange}
            />
          </Row>
        </Item>
        <Item label='With helper text' width={430}>
          <Row direction='column' gutter={8}>
            <DatePickerComponent
              label='Label Required'
              required
              value={value}
              onChange={onChange}
              size='S'
              helperText='Helper text'
            />
            <DatePickerComponent
              label='Label Required'
              required
              value={value}
              onChange={onChange}
              size='M'
              helperText='Helper text'
            />
            <DatePickerComponent
              label='Label Required'
              required
              value={value}
              onChange={onChange}
              size='L'
              helperText='Helper text'
            />
            <DatePickerComponent
              label='Label Required'
              required
              value={value}
              onChange={onChange}
              helperText='Helper text'
            />
          </Row>
        </Item>
        <Item label='With error' width={430}>
          <Row direction='column' gutter={8}>
            <DatePickerComponent
              label='Label'
              value={value}
              onChange={onChange}
              size='S'
              helperText='Error text'
              error
            />
            <DatePickerComponent
              label='Label'
              value={value}
              onChange={onChange}
              size='M'
              helperText='Error text'
              error
            />
            <DatePickerComponent
              label='Label'
              value={value}
              onChange={onChange}
              size='L'
              helperText='Error text'
              error
            />
            <DatePickerComponent
              label='Label'
              value={value}
              onChange={onChange}
              helperText='Error text'
              error
            />
          </Row>
        </Item>
        <Item label='With disabled' width={430}>
          <DatePickerComponent
            disabled
            label='Label'
            value={value}
            onChange={onChange}
          />
        </Item>
        <Item label='ViewOnly' width={430}>
          <DatePickerComponent
            viewOnly
            label='Label'
            value={value}
            onChange={onChange}
          />
        </Item>
        <Item label='ViewOnly without value' width={430}>
          <DatePickerComponent
            viewOnly
            label='Label'
            value={null}
            onChange={onChange}
          />
        </Item>
      </Container>
    </>
  );
};
