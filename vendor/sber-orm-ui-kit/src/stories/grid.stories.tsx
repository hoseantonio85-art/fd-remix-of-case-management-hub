import { Meta, StoryFn } from '@storybook/react';

import { Col, Row } from '..';
import classes from './styles.module.scss';
import { Container, Item } from './utils';

const meta: Meta<typeof Col> = {
  args: {},
  component: Col,
  title: 'components/Grid',
};

export default meta;

export const Grid: StoryFn<typeof Text> = () => (
  <Container>
    <Item label='Gutter 8px'>
      <Row gutter={8}>
        <Col>
          <div className={classes.skeleton} />
        </Col>
        <Col>
          <div className={classes.skeleton} />
        </Col>
      </Row>
    </Item>
    <Item label='Space between'>
      <Row gutter={8} justify='between'>
        <Col>
          <div className={classes.skeleton} />
        </Col>
        <Col>
          <div className={classes.skeleton} />
        </Col>
      </Row>
    </Item>
    <Item label='Direction column'>
      <Row gutter={8} direction='column'>
        <Col>
          <div className={classes.skeleton} />
        </Col>
        <Col>
          <div className={classes.skeleton} />
        </Col>
      </Row>
    </Item>
    <Item label='Span 6 4 2'>
      <Row gutter={8}>
        <Col span={6}>
          <div className={classes.skeleton} />
        </Col>
        <Col span={4}>
          <div className={classes.skeleton} />
        </Col>
        <Col span={2}>
          <div className={classes.skeleton} />
        </Col>
      </Row>
    </Item>
  </Container>
);
