import { Meta, StoryFn } from '@storybook/react';
import { useState } from 'react';

import { RadioChips as RadioChipsComponent } from '..';
import { Container, DemoContainer, Item } from './utils';

const items = [
  { id: 'first', title: 'First' },
  { id: 'second', title: 'Second' },
  { id: 'third', title: 'Third' },
];
const meta: Meta<typeof RadioChipsComponent> = {
  argTypes: {
    label: {
      description: 'Заголовок поля',
    },
    helperText: {
      description: 'Описание поля',
    },
    kind: {
      control: { type: 'select' },
      options: ['lite', 'secondary', 'primary'],
      description: 'Тип отображения `TTagKinds`',
    },
    color: {
      control: { type: 'select' },
      options: ['red', 'yellow', 'green', 'azure', 'blue', 'violet', 'gray'],
      description: 'Цвет `TTagColor`',
    },
    readonly: {
      description: 'Доступен только для чтения',
      control: { type: 'boolean' },
    },
    fullWidth: {
      description: 'Растянуть во всю ширину',
      control: { type: 'boolean' },
    },
    error: {
      description: 'Есть ошибка',
      control: { type: 'boolean' },
    },
    onChange: {
      description:
        'Обработчик изменения состояния `(event: ChangeEvent<HTMLInputElement>) => void`',
    },
    items: {
      description:
        'Настройки контента радиокнопок: ```{title: ReactNode; id: string;}```',
    },
  },
  args: {
    readonly: false,
    label: 'Label text goes here',
    helperText: 'Helper text goes here',
    error: false,
    fullWidth: false,
    items,
    kind: 'primary',
    color: 'gray',
  },
  parameters: {
    controls: {
      expanded: true,
    },
  },
  component: RadioChipsComponent,
  title: 'components/RadioChips',
};

export default meta;

export const RadioChips: StoryFn<typeof RadioChipsComponent> = (arguments_) => {
  const [value, setValue] = useState('first');

  return (
    <>
      <DemoContainer>
        <Item label='Customizable'>
          <RadioChipsComponent
            value={value}
            onChange={setValue}
            {...arguments_}
          />
        </Item>
      </DemoContainer>
      <Container>
        <Item label='Default'>
          <RadioChipsComponent
            value={value}
            items={items}
            onChange={setValue}
          />
        </Item>
        <Item label='Kind secondary'>
          <RadioChipsComponent
            value={value}
            items={items}
            kind='secondary'
            onChange={setValue}
          />
        </Item>
        <Item label='Kind primary gray'>
          <RadioChipsComponent
            label='Label'
            value={value}
            items={items}
            kind='primary'
            color='gray'
            onChange={setValue}
          />
        </Item>
        <Item label='Error'>
          <RadioChipsComponent
            value={value}
            items={items}
            kind='primary'
            color='gray'
            onChange={setValue}
            error
            helperText='Error text'
          />
        </Item>
        <Item label='Readonly'>
          <RadioChipsComponent
            value={value}
            items={items}
            onChange={setValue}
            readonly
          />
        </Item>
        <Item label='FullWidth'>
          <RadioChipsComponent
            value={value}
            items={items}
            onChange={setValue}
            fullWidth
          />
        </Item>
        <Item label='FullWidth Kind primary gray'>
          <RadioChipsComponent
            value={value}
            items={items}
            onChange={setValue}
            kind='primary'
            color='gray'
            fullWidth
          />
        </Item>
      </Container>
    </>
  );
};
