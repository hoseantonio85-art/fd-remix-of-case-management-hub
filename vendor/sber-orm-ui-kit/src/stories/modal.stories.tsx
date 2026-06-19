import { Meta, StoryFn } from '@storybook/react';

import {
  Button,
  ModalBody,
  Modal as ModalComponent,
  ModalFooter,
  ModalHeader,
} from '..';
import { Container, Item } from './utils';

const meta: Meta<typeof ModalComponent> = {
  args: {},
  component: ModalComponent,
  title: 'components/Modal',
};

export default meta;

export const Modal: StoryFn<typeof ModalComponent> = () => (
  <Container>
    <Item label='Basic'>
      <ModalComponent width={600} open={true}>
        <ModalHeader
          closeButtonProps={{
            'aria-label': 'Close modal',
          }}
        >
          Modal title
        </ModalHeader>
        <ModalBody>
          {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
            <span key={item} style={{ marginBottom: item === 8 ? 0 : 20 }}>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Fuga id
              labore, magnam mollitia nihil perspiciatis repudiandae ut. Aliquam
              aperiam commodi dolore pariatur perferendis repudiandae vel,
              veritatis? Dolor labore maiores mollitia nulla quia sit sunt
              voluptas voluptates. Aut eaque iste repellat sapiente similique
              veritatis. Aliquam consectetur cum error facere illum iusto modi
              natus possimus quae quo?
            </span>
          ))}
        </ModalBody>
        <ModalFooter>
          <Button variant='secondary' fullWidth>
            Cancel
          </Button>
          <Button fullWidth>Submit</Button>
        </ModalFooter>
      </ModalComponent>
    </Item>
  </Container>
);
