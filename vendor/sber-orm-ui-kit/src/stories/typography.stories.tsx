import { Meta, StoryFn } from '@storybook/react';

import { Link, Text, Title } from '..';
import { Container, Item } from './utils';

const meta: Meta<typeof Text> = {
  args: {},
  component: Text,
  title: 'components/Typography',
};

export default meta;

export const Typography: StoryFn<typeof Text> = () => (
  <Container>
    <Item label='Title'>
      <Title size='H600'>Title</Title>
    </Item>
    <Item label='Title thin size=900'>
      <Title size='H900' thin mb={4}>
        Title
      </Title>
    </Item>
    <Item label='Text'>
      <Text>Text</Text>
    </Item>
    <Item label='Text wrap'>
      <Text wrap>{'Text\nText\nText'}</Text>
    </Item>
    <Item label='Text link'>
      <Text link mb={4}>
        Text
      </Text>
    </Item>
    <Item label='Link'>
      <Link>Link</Link>
    </Item>
    <Item label='Link mb=4'>
      <Link mb={4}>Link</Link>
    </Item>
    <Item label='Text disabled size xlg'>
      <Text disabled size='xlg'>
        Text
      </Text>
    </Item>
  </Container>
);
