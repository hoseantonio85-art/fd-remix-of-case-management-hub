import { Meta, StoryFn } from '@storybook/react';

import { LinearProgress as LinearProgressComponent } from '..';
import { Container, Item } from './utils';

const meta: Meta<typeof LinearProgressComponent> = {
  args: {},
  component: LinearProgressComponent,
  title: 'components/LinearProgress',
};

export default meta;

export const LinearProgress: StoryFn<typeof Text> = () => {
  const value = 70;

  return (
    <Container>
      <Item label='Success' width={430}>
        <LinearProgressComponent value={value} />
      </Item>
      <Item label='Warning' width={430}>
        <LinearProgressComponent value={value} variant='warning' />
      </Item>
      <Item label='Danger' width={430}>
        <LinearProgressComponent value={value} variant='danger' />
      </Item>
      <Item label='Violet' width={430}>
        <LinearProgressComponent value={value} variant='violet' />
      </Item>
      <Item label='Filled success' width={430}>
        <LinearProgressComponent value={value} filled />
      </Item>
      <Item label='Filled warning' width={430}>
        <LinearProgressComponent value={value} filled variant='warning' />
      </Item>
      <Item label='Filled danger' width={430}>
        <LinearProgressComponent
          value={value}
          filled
          variant='danger'
          size='md'
        />
      </Item>
      <Item label='Filled violet' width={430}>
        <LinearProgressComponent value={value} filled variant='violet' />
      </Item>
    </Container>
  );
};
