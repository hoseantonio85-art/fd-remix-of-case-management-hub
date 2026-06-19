import { Meta, StoryFn } from '@storybook/react';

import {
  Button,
  Notification as NotificationComponent,
  notification,
  Row,
  Text,
} from '..';
import { Container, Item } from './utils';

const meta: Meta<typeof NotificationComponent> = {
  args: {},
  component: NotificationComponent,
  title: 'components/Notification',
};

const actions = (
  <Text medium link>
    action
  </Text>
);
const multipleActions = (
  <Row gutter={16}>
    <Text medium link>
      action 1
    </Text>
    <Text medium link>
      action 2
    </Text>
  </Row>
);

const showNotification = () => {
  notification('Content');
  notification(
    'This is place holder text. The basic dialog for modals should contain only valuable and relevant information. ',
    { actions: multipleActions, title: 'Title', type: 'error' },
  );
  notification('Content', {
    actions,
    title: 'Message title',
    type: 'discovery',
  });
  notification('Content', { actions, type: 'assistant' });
  notification('Content', { type: 'warning' });
  notification('Content', { type: 'success' });
  notification(
    'Text to [Hello, world!](http://example.com/) Message title [Link](http://example.com/)',
    { type: 'success' },
  );
};

export default meta;
export const Notification: StoryFn<typeof NotificationComponent> = () => (
  <Container>
    <Item label='Notifications bottom-right'>
      <Button onClick={showNotification}>Показать сообщения</Button>
    </Item>
    <NotificationComponent position='bottom-right' autoClose={false} />
  </Container>
);
