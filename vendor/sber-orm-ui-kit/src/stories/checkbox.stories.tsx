import { Meta, StoryFn } from '@storybook/react';

import { Checkbox as CheckboxComponent } from '..';
import { Container, DemoContainer, Item } from './utils';

const meta: Meta<typeof CheckboxComponent> = {
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
    checked: {
      description: 'Отмечен ли чекбокс',
      control: { type: 'boolean' },
    },
    disabled: {
      description: 'Отключен ли чекбокс',
      control: { type: 'boolean' },
    },
    indeterminate: {
      description: 'Квадратный вид выбранного чекбокса',
      control: { type: 'boolean' },
    },
    onChange: {
      description:
        'Обработчик изменения состояния `(event: ChangeEvent<HTMLInputElement>) => void`',
    },
  },
  args: {
    readonly: false,
    checked: false,
    disabled: false,
    indeterminate: false,
    label: 'Label text goes here',
    helperText: 'Helper text goes here',
  },
  parameters: {
    controls: {
      expanded: true,
    },
  },
  component: CheckboxComponent,
  title: 'components/Checkbox',
};

const defaultProps = {
  label: 'Label text goes here',
  helperText: 'Helper text goes here',
};

export default meta;
export const Checkbox: StoryFn<typeof CheckboxComponent> = (arguments_) => (
  <>
    <DemoContainer>
      <Item label='Customizable'>
        <CheckboxComponent {...arguments_} />
      </Item>
    </DemoContainer>
    <Container>
      <Item label='Basic'>
        <CheckboxComponent {...defaultProps} />
      </Item>
      <Item label='Checked'>
        <CheckboxComponent {...defaultProps} checked />
      </Item>
      <Item label='Indeterminate'>
        <CheckboxComponent {...defaultProps} indeterminate />
      </Item>
      <Item label='Not checked disabled'>
        <CheckboxComponent {...defaultProps} disabled />
      </Item>
      <Item label='Checked disabled'>
        <CheckboxComponent {...defaultProps} disabled checked />
      </Item>
      <Item label='Indeterminate disabled'>
        <CheckboxComponent {...defaultProps} disabled indeterminate />
      </Item>
      <Item label='Error'>
        <CheckboxComponent
          {...arguments_}
          error
          errorText='Error text goes here'
        />
      </Item>
      <Item label='Error checked'>
        <CheckboxComponent {...defaultProps} error checked />
      </Item>
      <Item label='Error indeterminate'>
        <CheckboxComponent {...defaultProps} error indeterminate />
      </Item>
      <Item label='Readonly Basic'>
        <CheckboxComponent {...defaultProps} readonly />
      </Item>
      <Item label='Readonly checked'>
        <CheckboxComponent {...defaultProps} readonly checked />
      </Item>
      <Item label='Readonly indeterminate'>
        <CheckboxComponent {...defaultProps} readonly indeterminate />
      </Item>
    </Container>
  </>
);
