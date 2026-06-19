import { Meta, StoryFn } from '@storybook/react';

import { Badge as BadgeComponent, EBadgeSize, EComponentColors } from '..';
import { Container, DemoContainer, Item } from './utils';

const meta: Meta<typeof BadgeComponent> = {
  argTypes: {
    variant: {
      description: 'Цвет: `EComponentColors`',
      control: 'select',
      options: Object.values(EComponentColors),
    },
    size: {
      description: 'Размер: `EBadgeSize`',
      control: 'select',
      options: Object.values(EBadgeSize),
    },
  },
  args: {
    variant: EComponentColors.blue,
    size: EBadgeSize.xxs,
  },
  component: BadgeComponent,
  title: 'components/Badge',
  parameters: {
    controls: {
      expanded: true,
    },
  },
};

const variants = Object.entries(EComponentColors);

export default meta;

export const Badge: StoryFn<typeof BadgeComponent> = (arguments_) => (
  <>
    <DemoContainer>
      <Item label='Customizable'>
        <BadgeComponent {...arguments_}>sample</BadgeComponent>
      </Item>
    </DemoContainer>
    <Container>
      {variants.map(([key, value]) => (
        <Item label={`${key} (size='xxs')`} key={key}>
          <BadgeComponent variant={value} size={EBadgeSize.xxs}>
            sample
          </BadgeComponent>
        </Item>
      ))}
      {variants.map(([key, value]) => (
        <Item label={`${key} (size='xxxs')`} key={key}>
          <BadgeComponent variant={value} size={EBadgeSize.xxxs}>
            sample
          </BadgeComponent>
        </Item>
      ))}
    </Container>
  </>
);
