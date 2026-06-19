import { Meta, StoryFn } from '@storybook/react';

import { Accordion as AccordionComponent, AccordionItem } from '..';
import { Container, Item } from './utils';

const meta: Meta<typeof AccordionComponent> = {
  argTypes: {
    variant: {
      control: { type: 'radio' },
      options: ['view', 'edit'],
    },
    fullWidth: {
      control: 'boolean',
    },
  },
  args: {},
  component: AccordionComponent,
  title: 'components/Accordion',
};

export default meta;

export const Accordion: StoryFn<typeof AccordionComponent> = (arguments_) => (
  <Container>
    <Item label='Default fullWidth' width={640} height={400}>
      <AccordionComponent {...arguments_} style={{ maxWidth: 600 }}>
        <AccordionItem header='How do you acquire a dog?' expanded>
          Three common ways for a prospective owner to acquire a dog is from pet
          shops, private owners, or shelters. A pet shop may be the most
          convenient way to buy a dog. Buying a dog from a private owner allows
          you to assess the pedigree and upbringing of your dog before choosing
          to take it home. Lastly, finding your dog from a shelter, helps give a
          good home to a dog who may not find one so readily.
        </AccordionItem>
        <AccordionItem disabled header='What kinds of dogs are there?'>
          There are many breeds of dogs. Each breed varies in size and
          temperament. Owners often select a breed of dog that they find to be
          compatible with their own lifestyle and desires from a companion.
        </AccordionItem>
        <AccordionItem
          header={
            <span>
              What is a <b>dog</b>?
            </span>
          }
        >
          A dog is a type of domesticated animal. Known for its loyalty and
          faithfulness, it can be found as a welcome guest in many households
          across the world.
        </AccordionItem>
      </AccordionComponent>
    </Item>
  </Container>
);
