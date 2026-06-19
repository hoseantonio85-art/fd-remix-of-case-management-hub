import { Placement } from '@popperjs/core';
import { Meta, StoryFn } from '@storybook/react';
import { useEffect, useRef, useState } from 'react';

import { Button, Popover as PopoverComponent } from '..';
import { Container, Item } from './utils';

const meta: Meta<typeof PopoverComponent> = {
  argTypes: {
    title: {
      name: 'Заголовок',
      description: 'title',
    },
    text: {
      name: 'Текст',
      description: 'text',
    },
    children: {
      name: 'Контент в плейсхолдер',
      description: 'children',
    },
  },
  args: {
    title: 'Заголовок',
    text: 'This is place holder text. The basic dialog for modals should contain only valuable and relevant information. ',
    children: 'Контент в плейсхолдер под текстом',
  },
  component: PopoverComponent,
  title: 'components/Popover',
  parameters: {
    controls: {
      expanded: true,
    },
  },
};

export default meta;
export const Popover: StoryFn<typeof PopoverComponent> = (arguments_) => {
  const [open, setOpen] = useState(true);
  const [_, setState] = useState({});

  const anchorRef1 = useRef(null);
  const anchorRef2 = useRef(null);

  useEffect(() => {
    setState({});
  }, []);

  return (
    <Container>
      <Item label='Customizable' width={2000} height={300}>
        <Button ref={anchorRef1} onClick={() => setOpen(!open)}>
          Button
        </Button>

        {(
          ['top-end', 'right-end', 'bottom-start', 'left-start'] as Placement[]
        ).map((placement: Placement) => (
          <PopoverComponent
            {...arguments_}
            key={placement}
            anchor={anchorRef1.current}
            open={open}
            placement={placement}
            onClose={() => setOpen(false)}
          />
        ))}
      </Item>

      <Item label='Basic 2' width={800} height={300}>
        <Button ref={anchorRef2} onClick={() => setOpen(!open)}>
          Button
        </Button>

        {(
          ['top-start', 'right-start', 'bottom-end', 'left-end'] as Placement[]
        ).map((placement: Placement) => (
          <PopoverComponent
            key={placement}
            anchor={anchorRef2.current}
            open={open}
            placement={placement}
          >
            <div>
              Popper Content for Toggleable Example
              <br />
              Popper Content for Toggleable Example
              <br />
              Popper Content for Toggleable Example
              <br />
            </div>
          </PopoverComponent>
        ))}
      </Item>
    </Container>
  );
};
