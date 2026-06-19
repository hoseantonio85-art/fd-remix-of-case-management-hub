import { Meta, StoryFn } from '@storybook/react';

import { BarChart as BarChartComponent } from '..';
import { Container, DemoContainer, Item } from './utils';

const meta: Meta<typeof BarChartComponent> = {
  argTypes: {
    percents: {
      description: 'Значение в процентах',
      control: 'number',
    },
    withoutAnimation: {
      description: 'Не использовать анимацию',
      control: 'boolean',
    },
    size: {
      description: 'Диаметр диаграммы в пикселях',
      control: 'number',
    },
    withoutLimit: {
      description: 'Без значения (пустая диаграмма)',
      control: 'boolean',
    },
  },
  args: {
    withoutAnimation: true,
    withoutLimit: false,
    percents: 50,
    size: 100,
  },
  component: BarChartComponent,
  title: 'components/BarChart',
  parameters: {
    controls: {
      expanded: true,
    },
  },
};

export default meta;

export const BarChart: StoryFn<typeof BarChartComponent> = (arguments_) => (
  <>
    <DemoContainer>
      <Item label='customizable'>
        <BarChartComponent {...arguments_} />
      </Item>
    </DemoContainer>
    <Container>
      <Item label='0%'>
        <div style={{ height: '100px', width: '200px' }}>
          <BarChartComponent percents={0} />
        </div>
      </Item>
      <Item label='25%'>
        <div style={{ height: '100px', width: '100px' }}>
          <BarChartComponent percents={25} />
        </div>
      </Item>
      <Item label='50%'>
        <div style={{ height: '100px', width: '100px' }}>
          <BarChartComponent percents={50} />
        </div>
      </Item>
      <Item label='85%'>
        <div style={{ height: '100px', width: '100px' }}>
          <BarChartComponent percents={85} />
        </div>
      </Item>
      <Item label='99%'>
        <div style={{ height: '100px', width: '100px' }}>
          <BarChartComponent percents={99} />
        </div>
      </Item>
      <Item label='100%'>
        <div style={{ height: '100px', width: '100px' }}>
          <BarChartComponent percents={100} />
        </div>
      </Item>
      <Item label='101%'>
        <div style={{ height: '100px', width: '100px' }}>
          <BarChartComponent percents={101} />
        </div>
      </Item>
      <Item label='150%'>
        <div style={{ height: '100px', width: '100px' }}>
          <BarChartComponent percents={150} />
        </div>
      </Item>
      <Item label='199%'>
        <div style={{ height: '100px', width: '100px' }}>
          <BarChartComponent percents={199} />
        </div>
      </Item>
      <Item label='200%'>
        <div style={{ height: '100px', width: '100px' }}>
          <BarChartComponent percents={200} />
        </div>
      </Item>
      <Item label='1000%'>
        <div style={{ height: '100px', width: '100px' }}>
          <BarChartComponent percents={1000} />
        </div>
      </Item>
      <Item label='without limit'>
        <div style={{ height: '100px', width: '100px' }}>
          <BarChartComponent percents={25} withoutLimit />
        </div>
      </Item>
    </Container>
  </>
);
