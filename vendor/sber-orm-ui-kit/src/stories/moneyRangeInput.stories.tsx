import { Meta, StoryFn } from '@storybook/react';
import { useState } from 'react';

import { MoneyRangeInput as MoneyRangeInputComponent, Row } from '..';
import { Container, Item } from './utils';

const meta: Meta<typeof MoneyRangeInputComponent> = {
  args: {},
  component: MoneyRangeInputComponent,
  title: 'components/MoneyRangeInput',
};

export default meta;
export const MoneyRangeInput: StoryFn<typeof MoneyRangeInputComponent> = () => {
  const [value, setValue] = useState<
    [number | null | undefined, number | null | undefined]
  >([1_231_231, 1_231_231]);

  return (
    <Container>
      <Item label='Basic'>
        <Row direction='column' gutter={8}>
          <MoneyRangeInputComponent placeholder='Placeholder' size='S' />
          <MoneyRangeInputComponent placeholder='Placeholder' />
          <MoneyRangeInputComponent placeholder='Placeholder' size='L' />
          <MoneyRangeInputComponent placeholder='Placeholder' size='XL' />
        </Row>
      </Item>
      <Item label='canClear'>
        <Row direction='column' gutter={8}>
          <MoneyRangeInputComponent
            canClear
            value={value}
            onChange={setValue}
            size='S'
          />
          <MoneyRangeInputComponent
            canClear
            value={value}
            onChange={setValue}
          />
          <MoneyRangeInputComponent
            canClear
            value={value}
            onChange={setValue}
            size='L'
          />
          <MoneyRangeInputComponent
            canClear
            value={value}
            onChange={setValue}
            size='XL'
          />
        </Row>
      </Item>
      <Item label='Disabled'>
        <Row direction='column' gutter={8}>
          <MoneyRangeInputComponent
            disabled
            value={value}
            onChange={setValue}
            size='S'
          />
          <MoneyRangeInputComponent
            disabled
            value={value}
            onChange={setValue}
          />
          <MoneyRangeInputComponent
            disabled
            value={value}
            onChange={setValue}
            size='L'
          />
          <MoneyRangeInputComponent
            disabled
            value={value}
            onChange={setValue}
            size='XL'
          />
        </Row>
      </Item>
      <Item label='Label'>
        <Row direction='column' gutter={8}>
          <MoneyRangeInputComponent
            label='Label'
            value={value}
            onChange={setValue}
            size='S'
          />
          <MoneyRangeInputComponent
            label='Label'
            value={value}
            onChange={setValue}
          />
          <MoneyRangeInputComponent
            label='Label'
            value={value}
            onChange={setValue}
            size='L'
          />
          <MoneyRangeInputComponent
            label='Label'
            value={value}
            onChange={setValue}
            size='XL'
          />
        </Row>
      </Item>
      <Item label='Error'>
        <Row direction='column' gutter={8}>
          <MoneyRangeInputComponent
            label='Label'
            value={value}
            onChange={setValue}
            size='S'
            helperText='Error text'
            error
          />
          <MoneyRangeInputComponent
            label='Label'
            value={value}
            onChange={setValue}
            helperText='Error text'
            error
          />
          <MoneyRangeInputComponent
            label='Label'
            value={value}
            onChange={setValue}
            size='L'
            helperText='Error text'
            error
          />
          <MoneyRangeInputComponent
            label='Label'
            value={value}
            onChange={setValue}
            size='XL'
            helperText='Error text'
            error
          />
        </Row>
      </Item>
      <Item label='Readonly'>
        <Row direction='column' gutter={8}>
          <MoneyRangeInputComponent
            label='Label'
            readonly
            canClear
            value={value}
            onChange={setValue}
            size='S'
          />
          <MoneyRangeInputComponent
            label='Label'
            readonly
            canClear
            value={value}
            onChange={setValue}
          />
          <MoneyRangeInputComponent
            label='Label'
            readonly
            canClear
            value={value}
            onChange={setValue}
            size='L'
          />
          <MoneyRangeInputComponent
            label='Label'
            readonly
            canClear
            value={value}
            onChange={setValue}
            size='XL'
          />
        </Row>
      </Item>
    </Container>
  );
};
