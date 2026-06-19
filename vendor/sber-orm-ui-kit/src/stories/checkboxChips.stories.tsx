import { Meta, StoryFn } from '@storybook/react';
import { useState } from 'react';

import { CheckboxChips as CheckboxChipsComponent, EComponentColors } from '..';
import { Container, DemoContainer, Item } from './utils';

const meta: Meta<typeof CheckboxChipsComponent> = {
  argTypes: {
    label: {
      description: 'Заголовок чекбокса',
    },
    helperText: {
      description: 'Описание чекбокса',
    },
    readonly: {
      description: 'Доступен только для чтения',
      control: { type: 'boolean' },
    },
    disabled: {
      description: 'Отключен ли чекбокс',
      control: { type: 'boolean' },
    },
    onChange: {
      description:
        'Обработчик изменения состояния `(event: ChangeEvent<HTMLInputElement>) => void`',
    },
    items: {
      description:
        'Настройки контента чебокса: ```{title: ReactNode; \ncounter?: number; \ncolor?: EComponentColors;id: string;}```',
    },
  },
  args: {
    readonly: false,
    disabled: false,
    label: 'Label text goes here',
    helperText: 'Helper text goes here',
    items: [
      { color: EComponentColors.gray, counter: 24, id: 'foo', title: 'Foo' },
      { color: EComponentColors.gray, counter: 24, id: 'bar', title: 'Bar' },
    ],
  },
  parameters: {
    controls: {
      expanded: true,
    },
  },
  component: CheckboxChipsComponent,
  title: 'components/CheckboxChips',
};

export default meta;

const itemsGray = [
  { color: EComponentColors.gray, counter: 24, id: 'first', title: 'First' },
];
const itemsBlue = [
  { color: EComponentColors.blue, counter: 24, id: 'first', title: 'First' },
];
const itemsRed = [
  { color: EComponentColors.red, counter: 24, id: 'first', title: 'First' },
];
const itemsYellow = [
  { color: EComponentColors.yellow, counter: 24, id: 'first', title: 'First' },
];
const itemsGreen = [
  { color: EComponentColors.green, counter: 24, id: 'first', title: 'First' },
];
const itemsBrand = [
  { color: EComponentColors.brand, counter: 24, id: 'first', title: 'First' },
];
const itemsViolet = [
  { color: EComponentColors.violet, counter: 24, id: 'first', title: 'First' },
];
const itemsWrap = [
  { color: EComponentColors.outlined, id: '1', title: '111' },
  { color: EComponentColors.outlined, id: '2', title: '222' },
  { color: EComponentColors.outlined, id: '3', title: '333' },
  { color: EComponentColors.outlined, id: '4', title: '444' },
  { color: EComponentColors.outlined, id: '5', title: '555' },
  { color: EComponentColors.outlined, id: '6', title: '666' },
  { color: EComponentColors.outlined, id: '7', title: '777' },
  { color: EComponentColors.outlined, id: '8', title: '888' },
  { color: EComponentColors.outlined, id: '9', title: '999' },
  { color: EComponentColors.outlined, id: '0', title: '000' },
];

export const CheckboxChips: StoryFn<typeof CheckboxChipsComponent> = (
  arguments_,
) => {
  const [value, setValue] = useState<string[]>([]);

  return (
    <>
      <DemoContainer>
        <Item label='Customizable'>
          <CheckboxChipsComponent
            {...arguments_}
            value={value}
            onChange={setValue}
            kind='primary'
          />
        </Item>
      </DemoContainer>
      <Container>
        <Item label='Gray'>
          <CheckboxChipsComponent
            value={value}
            items={itemsGray}
            kind='primary'
            onChange={setValue}
          />
        </Item>
        <Item label='Blue'>
          <CheckboxChipsComponent
            value={value}
            items={itemsBlue}
            kind='primary'
            onChange={setValue}
          />
        </Item>
        <Item label='Red'>
          <CheckboxChipsComponent
            value={value}
            items={itemsRed}
            kind='primary'
            onChange={setValue}
          />
        </Item>
        <Item label='Yellow'>
          <CheckboxChipsComponent
            value={value}
            items={itemsYellow}
            kind='primary'
            onChange={setValue}
          />
        </Item>
        <Item label='Green'>
          <CheckboxChipsComponent
            value={value}
            items={itemsGreen}
            kind='primary'
            onChange={setValue}
          />
        </Item>
        <Item label='Brand'>
          <CheckboxChipsComponent
            value={value}
            items={itemsBrand}
            kind='primary'
            onChange={setValue}
          />
        </Item>
        <Item label='Violet'>
          <CheckboxChipsComponent
            value={value}
            items={itemsViolet}
            kind='primary'
            onChange={setValue}
          />
        </Item>
        <Item label='Label'>
          <CheckboxChipsComponent
            label='Label'
            value={value}
            items={itemsGray}
            kind='primary'
            onChange={setValue}
          />
        </Item>
        <Item label='Error'>
          <CheckboxChipsComponent
            value={value}
            items={itemsGray}
            kind='primary'
            onChange={setValue}
            error
            helperText='Error text'
          />
        </Item>
        <Item label='Wrap'>
          <CheckboxChipsComponent
            wrap
            value={value}
            items={itemsWrap}
            kind='primary'
            onChange={setValue}
          />
        </Item>
        <Item label='Readonly'>
          <CheckboxChipsComponent
            wrap
            value={value}
            items={itemsWrap}
            kind='primary'
            onChange={setValue}
            readonly
          />
        </Item>
      </Container>
    </>
  );
};
