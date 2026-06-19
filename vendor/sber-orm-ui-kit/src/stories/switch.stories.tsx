import { Meta, StoryFn } from '@storybook/react';

import { Switch as SwitchComponent } from '..';
import { Container, DemoContainer, Item } from './utils';

const meta: Meta<typeof SwitchComponent> = {
  argTypes: {
    label: {
      description: 'Заголовок свича',
    },
    helperText: {
      description: 'Описание свича',
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
  parameters: {
    controls: {
      expanded: true,
    },
  },
  component: SwitchComponent,
  title: 'components/Switch',
};

export default meta;
export const Switch: StoryFn<typeof SwitchComponent> = (arguments_) => (
  <>
    <DemoContainer>
      <Item label='Customizable'>
        <SwitchComponent {...arguments_} />
      </Item>
    </DemoContainer>
    <Container>
      <Item label='Basic Small'>
        <SwitchComponent size='sm' />
      </Item>
      <Item label='Disabled Small'>
        <SwitchComponent disabled size='sm' />
      </Item>
      <Item label='Error Small'>
        <SwitchComponent error size='sm' />
      </Item>
      <Item label='Basic Medium'>
        <SwitchComponent checked />
      </Item>
      <Item label='Disabled Medium'>
        <SwitchComponent disabled checked />
      </Item>
      <Item label='Error Medium'>
        <SwitchComponent error checked />
      </Item>
      <Item label='With label'>
        <SwitchComponent label='Label' />
      </Item>
      <Item label='With helper text'>
        <SwitchComponent helperText='Helper text goes here' />
      </Item>
      <Item label='With label and helper text'>
        <SwitchComponent label='Label' helperText='Helper text goes here' />
      </Item>
      <Item label='With text Basic Required'>
        <SwitchComponent
          label='Label'
          helperText='Helper text goes here'
          required
        />
      </Item>
      <Item label='With text Disabled Required'>
        <SwitchComponent
          label='Label'
          helperText='Helper text goes here'
          disabled
          required
        />
      </Item>
      <Item label='With text Error Required'>
        <SwitchComponent
          label='Label'
          helperText='Helper text goes here'
          error
          required
        />
      </Item>
      <Item label='Label placement left'>
        <SwitchComponent
          label='Label'
          helperText='Helper text goes here'
          error
          required
          labelPlacement='start'
        />
      </Item>
    </Container>
  </>
);
