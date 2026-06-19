import { Meta, StoryFn } from '@storybook/react';

import { EVariant, Icon as IconComponent } from '..';
import { EIconName } from '../icons';
import { Container, Item } from './utils';

const meta: Meta<typeof IconComponent> = {
  args: {},
  component: IconComponent,
  title: 'components/Icon',
};

export default meta;

export const Icon: StoryFn<typeof Text> = () => (
  <Container>
    <Item label='Variant fill'>
      <IconComponent name='home' variant={EVariant.Fill} />
    </Item>
    <Item label='Variant stroke'>
      <IconComponent name='home' variant={EVariant.Stroke} />
    </Item>
    <Item label='Size 64px'>
      <IconComponent name='home' width={64} height={64} />
    </Item>
    <Item label='Size 20px'>
      <IconComponent name='check' width={20} height={20} />
    </Item>
    <Item label='Brand color from container'>
      <div style={{ color: 'var(--iconBrandDefault)' }}>
        <IconComponent name='check' width={64} height={64} />
      </div>
    </Item>
    <Item label='Brand color from container'>
      <div style={{ color: 'var(--iconTechDanger)' }}>
        <IconComponent name='error' width={64} height={64} />
      </div>
    </Item>
    <Container>
      {Object.values(EIconName)
        .sort()
        .map((name: EIconName) => (
          <Item label={name} width={128} height={64} key={name}>
            <IconComponent name={name} />
          </Item>
        ))}
    </Container>
  </Container>
);
