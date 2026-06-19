import { Meta, StoryFn } from '@storybook/react';

import { Icon, InfoDisplay as InfoDisplayComponent } from '..';
import styles from './styles.module.scss';
import { Container, Item } from './utils';

const meta: Meta<typeof InfoDisplayComponent> = {
  args: {},
  component: InfoDisplayComponent,
  title: 'components/InfoDisplay',
};

export default meta;

export const InfoDisplay: StoryFn<typeof InfoDisplayComponent> = () => (
  <Container>
    <Item label='Default'>
      <InfoDisplayComponent
        prefix={
          <div className={styles.iconContainer}>
            <Icon name='incident' />
          </div>
        }
        title='Title'
        description='Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat.'
      />
    </Item>
    <Item label='Inverse'>
      <InfoDisplayComponent
        prefix={
          <div className={styles.iconContainer}>
            <Icon name='incident' />
          </div>
        }
        title='Title'
        description='Description'
        inverse
      />
    </Item>
  </Container>
);
