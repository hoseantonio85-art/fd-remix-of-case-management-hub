import { Meta, StoryFn } from '@storybook/react';

import { Shimmer as ShimmerComponent } from '..';
import { Container, DemoContainer, Item } from './utils';

const defaultParams = {
  animation: true,
  borderRadius: 8,
  size: undefined,
};

const meta: Meta<typeof ShimmerComponent> = {
  argTypes: {
    width: {
      control: 'number',
      type: 'number',
      description: 'Ширина полосы в пикселях, если не указана - во всю ширину',
    },
    height: {
      control: 'number',
      type: 'number',
      description: 'Высота полосы в пикселях',
    },
    borderRadius: {
      control: 'number',
      description: 'Радиус скругления',
    },
    animation: {
      control: 'boolean',
      description: 'Вкл/Выкл анимацию',
    },
    size: {
      control: 'select',
      description: 'Размер',
      options: ['14', '16', '20', '24', '28', '32', '40'],
    },
  },
  args: defaultParams,
  parameters: {
    controls: {
      expanded: true,
    },
  },
  component: ShimmerComponent,
  title: 'components/Shimmer',
};

export default meta;

export const Shimmer: StoryFn<typeof ShimmerComponent> = (arguments_) => (
  <>
    <DemoContainer>
      <Item label='Customizable'>
        <ShimmerComponent {...arguments_} />
      </Item>
    </DemoContainer>
    <Container>
      <Item label='Size 14'>
        <ShimmerComponent {...defaultParams} size={14} />
      </Item>
      <Item label='Size 16'>
        <ShimmerComponent {...defaultParams} size={16} />
      </Item>
      <Item label='Size 20'>
        <ShimmerComponent {...defaultParams} size={20} />
      </Item>
      <Item label='Size 24'>
        <ShimmerComponent {...defaultParams} size={24} />
      </Item>
      <Item label='Size 28'>
        <ShimmerComponent {...defaultParams} size={28} />
      </Item>
      <Item label='Size 32'>
        <ShimmerComponent {...defaultParams} size={32} />
      </Item>
      <Item label='Size 40'>
        <ShimmerComponent {...defaultParams} size={40} />
      </Item>
    </Container>
  </>
);
