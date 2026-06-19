import { Meta, StoryFn } from '@storybook/react';

import { Alert as AlertComponent, EIconName } from '..';
import { Container, DemoContainer, Item } from './utils';

const meta: Meta<typeof AlertComponent> = {
  argTypes: {
    status: {
      description: 'Тип: EAlertStatus',
      control: 'select',
      options: ['success', 'info', 'warning', 'danger', 'discovery', 'ai'],
    },
    actions: {
      description:
        'Действия в алерте: `TAlertAction[]`, где ```type TAlertAction = Omit<IButtonProperties, "variant"> & { title?: string;}```',
    },
    title: {
      description: 'Заголовок',
    },
    message: {
      description: 'Текст',
    },
    onClose: {
      description: 'Коллбэк закрытия: `(event?: React.MouseEvent): void;`',
    },
    customIcon: {
      description: 'Кастомная иконка для алерта: `EIconName`',
      control: { type: 'select' },
      options: ['', ...Object.values(EIconName)],
    },
  },
  args: {
    status: 'success',
    actions: [
      {
        onClick: (a) => {
          a;
        },
        title: 'Action link',
      },
      {
        onClick: (a) => {
          a;
        },
        title: 'Action link',
      },
    ],
    title: 'Message title',
    message:
      'This is place holder text. The basic dialog for modals should contain only valuable and relevant information.',
    onClose: (a: React.MouseEvent) => {
      a;
    },
  },
  component: AlertComponent,
  title: 'components/Alert',
  parameters: {
    controls: {
      expanded: true,
    },
  },
};

export default meta;

const defaultProps = {
  title: 'Message title',
  message:
    'This is place holder text. The basic dialog for modals should contain only valuable and relevant information.',
  onClose: (a: React.MouseEvent) => {
    a;
  },
  actions: [
    {
      onClick: (a: React.MouseEvent) => {
        a;
      },
      title: 'Action link',
    },
    {
      onClick: (a: React.MouseEvent) => {
        a;
      },
      title: 'Action link',
    },
  ],
};

export const Alert: StoryFn<typeof Text> = (args) => (
  <>
    <DemoContainer>
      <Item label='Customizable' width={500}>
        <AlertComponent status='success' {...args} />
      </Item>
    </DemoContainer>
    <Container>
      <Item label='Success' width={500}>
        <AlertComponent status='success' {...defaultProps} />
      </Item>
      <Item label='Information' width={500}>
        <AlertComponent status='info' {...defaultProps} />
      </Item>
      <Item label='Warning' width={500}>
        <AlertComponent status='warning' {...defaultProps} />
      </Item>
      <Item label='Danger' width={500}>
        <AlertComponent status='danger' {...defaultProps} />
      </Item>
      <Item label='Discovery' width={500}>
        <AlertComponent status='discovery' {...defaultProps} />
      </Item>
      <Item label='Ai' width={500}>
        <AlertComponent status='ai' {...defaultProps} />
      </Item>
    </Container>
  </>
);
