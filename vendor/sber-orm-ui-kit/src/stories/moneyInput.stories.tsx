import { Meta, StoryFn } from '@storybook/react';
import { useState } from 'react';

import { MoneyInput as MoneyInputComponent } from '..';
import { Container, Item } from './utils';

const meta: Meta<typeof MoneyInputComponent> = {
  args: {},
  component: MoneyInputComponent,
  title: 'components/MoneyInput',
};

export default meta;
export const MoneyInput: StoryFn<typeof MoneyInputComponent> = () => {
  const [value, setValue] = useState<number | null>(1_231_231);

  return (
    <Container>
      <Item label='Basic'>
        <MoneyInputComponent placeholder='Placeholder' />
      </Item>
      <Item label='canClear'>
        <MoneyInputComponent canClear value={value} onChange={setValue} />
      </Item>
      <Item label='labelInside'>
        <MoneyInputComponent
          label='label'
          placeholder='0.00'
          canClear
          labelInside
          size='L'
          tooltip='Подсказка'
          value={value}
          onChange={setValue}
        />
      </Item>
      <Item label='Disabled'>
        <MoneyInputComponent disabled value={value} onChange={setValue} />
      </Item>
      <Item label='Label'>
        <MoneyInputComponent
          label='Label Label Label Label Label Label Label Label Label Label '
          value={value}
          onChange={setValue}
        />
      </Item>
      <Item label='Error'>
        <MoneyInputComponent
          label='Label'
          size='L'
          value={value}
          onChange={setValue}
          labelInside
          error
          helperText='Error text'
        />
      </Item>
      <Item label='Error'>
        <MoneyInputComponent
          label='Label'
          size='L'
          onChange={setValue}
          labelInside
        />
      </Item>
      <Item label='ViewOnly'>
        <MoneyInputComponent
          label='Label'
          size='L'
          value={value}
          onChange={setValue}
          labelInside
          viewOnly
        />
      </Item>
      <Item label='Readonly'>
        <MoneyInputComponent
          label='Label'
          size='L'
          value={value}
          onChange={setValue}
          labelInside
          readonly
        />
      </Item>
    </Container>
  );
};
