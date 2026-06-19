import { Meta, StoryFn } from '@storybook/react';
import { useState } from 'react';

import {
  Button,
  Loader as LoaderComponent,
  Modal,
  ModalBody,
  ModalHeader,
} from '..';

import { Container, Item } from './utils';

const size = 56;

const meta: Meta<typeof LoaderComponent> = {
  argTypes: {
    color: {
      description: 'Цвет',
    },
    size: {
      description: 'Диаметр в пикселях',
    },
  },
  args: { color: '', size },
  parameters: {
    controls: {
      expanded: true,
    },
  },
  component: LoaderComponent,
  title: 'components/Loader',
};

export default meta;

export const Loader: StoryFn<typeof LoaderComponent> = (arguments_) => {
  const [opened, setOpened] = useState(false);

  return (
    <Container>
      <Item label='Default'>
        <LoaderComponent {...arguments_} />
      </Item>
      <Item label='Absolute'>
        <Button onClick={() => setOpened(true)}>Open</Button>
      </Item>
      <Modal width={600} open={opened} onClose={() => setOpened(false)}>
        <ModalHeader
          closeButtonProps={{
            'aria-label': 'Close modal',
          }}
        >
          Test content
        </ModalHeader>
        <ModalBody>
          <div style={{ height: 200 + Number(arguments_.size ?? 0) }}>
            <LoaderComponent {...arguments_} absolute />
          </div>
        </ModalBody>
      </Modal>
    </Container>
  );
};
