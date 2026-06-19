import { Meta, StoryFn } from '@storybook/react';

import { Notice as NoticeComponent, Row, Text } from '..';
import { Container, Item } from './utils';

const meta: Meta<typeof NoticeComponent> = {
  args: {
    title: (
      <Row align='middle' justify='start' gutter={4} noFlex>
        <Text size='lg' bold>
          Норм
        </Text>
        <Text size='lg'>выполнил(а) действие</Text>
        <Text size='lg' bold>
          В работу
        </Text>
      </Row>
    ),
  },
  component: NoticeComponent,
  title: 'components/Notice',
};

export default meta;

export const Notice: StoryFn<typeof NoticeComponent> = (args) => (
  <Container>
    <Item label='Closed with description' width={800}>
      <NoticeComponent
        description='Ранее сегодня было отправлено 5 предупреждений о том, что SQS службы расчета заработной платы превысил пороговое значение. Быстрое расследование показало, что события о выплатах сотрудникам не срабатывают, а пользователи не могут войти в систему. Я определил приоритет как критический, потому что это день выплаты зарплаты.'
        {...args}
      />
    </Item>
    <Item label='Opened with description' width={800}>
      <NoticeComponent
        opened
        description='Ранее сегодня было отправлено 5 предупреждений о том, что SQS службы расчета заработной платы превысил пороговое значение. Быстрое расследование показало, что события о выплатах сотрудникам не срабатывают, а пользователи не могут войти в систему. Я определил приоритет как критический, потому что это день выплаты зарплаты.'
        {...args}
      />
    </Item>
    <Item label='Without description' width={800}>
      <NoticeComponent {...args} />
    </Item>
  </Container>
);
