import { Meta, StoryFn } from '@storybook/react';

import { ScrollBar as ScrollbarComponent, Text } from '..';
import { Container, Item } from './utils';

const meta: Meta<typeof ScrollbarComponent> = {
  args: {},
  component: ScrollbarComponent,
  title: 'components/Scrollbar',
};

export default meta;
export const Scrollbar: StoryFn<typeof ScrollbarComponent> = () => (
  <Container>
    <div>
      <Item label='Vertical'>
        <ScrollbarComponent style={{ maxHeight: 400, width: '100%' }}>
          {[...new Array(100)].map((_, index) => (
            <Text key={index}>
              Lorem ipsum, dolor sit amet consectetur adipisicing elit. Cum
              reiciendis magni quo itaque voluptas quibusdam ab provident odit?
              Temporibus eius nam asperiores voluptatum, assumenda odio
              recusandae ea? Sit, dolores voluptas?
            </Text>
          ))}
        </ScrollbarComponent>
      </Item>
      <Item label='Horizontal'>
        <ScrollbarComponent style={{ maxWidth: 400, width: '100%' }}>
          {[...new Array(30)].map((_, index) => (
            <Text key={index} style={{ whiteSpace: 'nowrap' }}>
              Lorem ipsum, dolor sit amet consectetur adipisicing elit. Cum
              reiciendis magni quo itaque voluptas quibusdam ab provident odit?
              Temporibus eius nam asperiores voluptatum, assumenda odio
              recusandae ea? Sit, dolores voluptas?
            </Text>
          ))}
        </ScrollbarComponent>
      </Item>
    </div>
    <div>
      <Item label='Vertical autoHide=false'>
        <ScrollbarComponent
          style={{ maxHeight: 400, width: '100%' }}
          forceVisible='y'
          autoHide={false}
        >
          {[...new Array(100)].map((_, index) => (
            <Text key={index}>
              Lorem ipsum, dolor sit amet consectetur adipisicing elit. Cum
              reiciendis magni quo itaque voluptas quibusdam ab provident odit?
              Temporibus eius nam asperiores voluptatum, assumenda odio
              recusandae ea? Sit, dolores voluptas?
            </Text>
          ))}
        </ScrollbarComponent>
      </Item>
      <Item label='Horizontal autoHide=false'>
        <ScrollbarComponent
          style={{ maxWidth: 400, width: '100%' }}
          forceVisible='x'
          autoHide={false}
        >
          {[...new Array(30)].map((_, index) => (
            <Text key={index} style={{ whiteSpace: 'nowrap' }}>
              Lorem ipsum, dolor sit amet consectetur adipisicing elit. Cum
              reiciendis magni quo itaque voluptas quibusdam ab provident odit?
              Temporibus eius nam asperiores voluptatum, assumenda odio
              recusandae ea? Sit, dolores voluptas?
            </Text>
          ))}
        </ScrollbarComponent>
      </Item>
    </div>
  </Container>
);
