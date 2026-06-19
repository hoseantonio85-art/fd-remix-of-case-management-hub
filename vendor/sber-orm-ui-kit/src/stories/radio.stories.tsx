import { Meta, StoryFn } from '@storybook/react';

import { Radio as RadioComponent } from '..';
import { Container, DemoContainer, Item } from './utils';

const meta: Meta<typeof RadioComponent> = {
  argTypes: {
    label: {
      description: 'Заголовок радиобаттона',
    },
    helperText: {
      description: 'Описание радиобаттона',
    },
    error: {
      description: 'Наличие ошибки',
      control: { type: 'boolean' },
    },
    checked: {
      description: 'Отмечен ли',
      control: { type: 'boolean' },
    },
    disabled: {
      description: 'Отключен ли',
      control: { type: 'boolean' },
    },
    onChange: {
      description:
        'Обработчик изменения состояния `(event: ChangeEvent<HTMLInputElement>) => void`',
    },
  },
  args: {
    error: false,
    checked: false,
    disabled: false,
    label: 'Label text goes here',
    helperText: 'Helper text goes here',
  },
  component: RadioComponent,
  title: 'components/Radio',
  parameters: {
    controls: {
      expanded: true,
    },
  },
};

export default meta;

export const Radio: StoryFn<typeof RadioComponent> = (arguments_) => (
  <>
    <DemoContainer>
      <Item label='Customizable'>
        <RadioComponent {...arguments_} />
      </Item>
    </DemoContainer>
    <Container>
      <Item label='Basic'>
        <RadioComponent />
      </Item>
      <Item label='Disabled'>
        <RadioComponent disabled />
      </Item>
      <Item label='Error'>
        <RadioComponent error />
      </Item>
      <Item label='Basic'>
        <RadioComponent checked />
      </Item>
      <Item label='Disabled'>
        <RadioComponent disabled checked />
      </Item>
      <Item label='Error'>
        <RadioComponent error checked />
      </Item>
      <Item label='With label'>
        <RadioComponent label='Text' />
      </Item>
      <Item label='With helper text'>
        <RadioComponent helperText='Helper text goes here' />
      </Item>
      <Item label='With label and helper text'>
        <RadioComponent label='Text' helperText='Helper text goes here' />
      </Item>
      <Item label='With text Disabled'>
        <RadioComponent
          label='Text'
          helperText='Helper text goes here'
          disabled
        />
      </Item>
      <Item label='With text Error'>
        <RadioComponent label='Text' helperText='Helper text goes here' error />
      </Item>
    </Container>
  </>
);
