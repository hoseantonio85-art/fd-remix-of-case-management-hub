import { Meta, StoryFn } from '@storybook/react';

import { EIconName, ELevelState, Level as LevelComponent } from '..';
import { Container, DemoContainer, Item } from './utils';

const meta: Meta<typeof LevelComponent> = {
  argTypes: {
    withBadge: {
      description: 'Отображение с бейджем',
      control: { type: 'boolean' },
    },
    iconRight: {
      description: 'Расположить иконку справа',
      control: { type: 'boolean' },
    },
    size: {
      description: 'Размер элемента `TLevelSize`',
      control: 'select',
      options: ['sm', 'md'],
    },
    state: {
      description: 'Уровень `ELevelState`',
      control: 'select',
      options: Object.values(ELevelState),
    },
    icon: {
      description: 'Кастомная иконка `EIconName`',
      control: 'select',
      options: [undefined, ...Object.values(EIconName)],
    },
    text: {
      description: 'Свой текст для уровня',
    },
  },
  args: {
    withBadge: false,
    iconRight: false,
    size: 'sm',
    state: 'default',
    text: '',
  },
  parameters: {
    controls: {
      expanded: true,
    },
  },
  component: LevelComponent,
  title: 'components/Level',
};

const states = Object.entries(ELevelState);
const customValue = { id: 'na', value: 'Не применимо' };

export default meta;

export const Level: StoryFn<typeof LevelComponent> = (arguments_) => (
  <>
    <DemoContainer>
      <Item label='Customizable'>
        <LevelComponent {...arguments_} />
      </Item>
    </DemoContainer>
    <Container>
      {states.map(([key, value]) => (
        <Item label={key} key={key}>
          <LevelComponent state={value} />
        </Item>
      ))}
      {states.map(([key, value]) => (
        <Item label={`${key} (badge)`} key={key}>
          <LevelComponent withBadge state={value} />
        </Item>
      ))}
      {states.map(([key, value]) => (
        <Item label={`${key} (iconRight)`} key={key}>
          <LevelComponent iconRight state={value} />
        </Item>
      ))}
      {states.map(([key, value]) => (
        <Item label={`${key} (iconRight, badge)`} key={key}>
          <LevelComponent withBadge iconRight state={value} />
        </Item>
      ))}
      <Item label='Custom value'>
        <LevelComponent
          withBadge
          iconRight
          state={customValue.id}
          text='Не применимо'
          variant='gray'
          icon='cross'
        />
      </Item>
    </Container>
  </>
);
