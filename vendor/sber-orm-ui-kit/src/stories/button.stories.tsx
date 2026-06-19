import { Meta, StoryFn } from '@storybook/react';

import { Button as ButtonComponent, EIconName, Row } from '..';
import { Container, DemoContainer, Item } from './utils';

const meta: Meta<typeof ButtonComponent> = {
  argTypes: {
    loading: {
      description: 'Индиактор загрузки',
      control: { type: 'boolean' },
    },
    iconOnly: {
      description: 'Стили для отображения только иконки',
      control: { type: 'boolean' },
    },
    children: {
      description: 'Текст кнопки',
    },
    size: {
      description: 'Размер: `TButtonSizes`',
      control: { type: 'select' },
      options: ['XXS', 'XS', 'S', 'M', 'L', 'XL'],
    },
    variant: {
      description: 'Размер: `TButtonVariants`',
      control: { type: 'select' },
      options: [
        'primary',
        'secondary',
        'tertiary',
        'warning',
        'danger',
        'ghost',
        'ellipse',
        'function',
        'ai',
      ],
    },
    icon: {
      description: 'Иконка перед контентом: `EIconName`',
      control: { type: 'select' },
      options: ['', ...Object.values(EIconName)],
    },
    iconAfter: {
      description: 'Иконка после контента: `EIconName`',
      control: { type: 'select' },
      options: ['', ...Object.values(EIconName)],
    },
    disabled: {
      description: 'Недоступность кнопки',
      control: { type: 'boolean' },
    },
  },
  args: {
    loading: false,
    disabled: false,
    iconOnly: false,
    size: 'XXS',
    variant: 'primary',
    icon: EIconName.cross,
    iconAfter: EIconName.cross,
    children: 'Button',
  },
  component: ButtonComponent,
  title: 'components/Button',
  parameters: {
    controls: {
      expanded: true,
    },
  },
};

export default meta;

export const Button: StoryFn<typeof ButtonComponent> = (arguments_) => (
  <>
    <DemoContainer>
      <Item label='Customizable' height={200} width={400}>
        <ButtonComponent {...arguments_} />
      </Item>
    </DemoContainer>
    <Container>
      <Item label='Primary' height={350} width={400}>
        <Row noFlex gutter={8}>
          <Row direction='column' align='top' noFlex gutter={8}>
            <ButtonComponent icon='cross' iconAfter='cross' size='XXS'>
              Button
            </ButtonComponent>
            <ButtonComponent icon='cross' iconAfter='cross' size='XS'>
              Button
            </ButtonComponent>
            <ButtonComponent icon='cross' iconAfter='cross' size='S'>
              Button
            </ButtonComponent>
            <ButtonComponent icon='cross' iconAfter='cross' size='M'>
              Button
            </ButtonComponent>
            <ButtonComponent icon='cross' iconAfter='cross' size='L'>
              Button
            </ButtonComponent>
            <ButtonComponent icon='cross' iconAfter='cross' size='XL'>
              Button
            </ButtonComponent>
          </Row>
          <Row direction='column' align='top' noFlex gutter={8}>
            <ButtonComponent icon='cross' iconAfter='cross' size='XXS' loading>
              Button
            </ButtonComponent>
            <ButtonComponent icon='cross' iconAfter='cross' size='XS' loading>
              Button
            </ButtonComponent>
            <ButtonComponent icon='cross' iconAfter='cross' size='S' loading>
              Button
            </ButtonComponent>
            <ButtonComponent icon='cross' iconAfter='cross' size='M' loading>
              Button
            </ButtonComponent>
            <ButtonComponent icon='cross' iconAfter='cross' size='L' loading>
              Button
            </ButtonComponent>
            <ButtonComponent icon='cross' iconAfter='cross' size='XL' loading>
              Button
            </ButtonComponent>
          </Row>
          <Row direction='column' align='top' noFlex gutter={8}>
            <ButtonComponent icon='cross' size='XXS' iconOnly />
            <ButtonComponent icon='cross' size='XS' iconOnly />
            <ButtonComponent icon='cross' size='S' iconOnly />
            <ButtonComponent icon='cross' size='M' iconOnly />
            <ButtonComponent icon='cross' size='L' iconOnly />
            <ButtonComponent icon='cross' size='XL' iconOnly />
          </Row>
        </Row>
      </Item>
      <Item label='Secondary' height={350} width={400}>
        <Row noFlex gutter={8}>
          <Row direction='column' align='top' noFlex gutter={8}>
            <ButtonComponent
              variant='secondary'
              icon='cross'
              iconAfter='cross'
              size='XXS'
            >
              Button
            </ButtonComponent>
            <ButtonComponent
              variant='secondary'
              icon='cross'
              iconAfter='cross'
              size='XS'
            >
              Button
            </ButtonComponent>
            <ButtonComponent
              variant='secondary'
              icon='cross'
              iconAfter='cross'
              size='S'
            >
              Button
            </ButtonComponent>
            <ButtonComponent
              variant='secondary'
              icon='cross'
              iconAfter='cross'
              size='M'
            >
              Button
            </ButtonComponent>
            <ButtonComponent
              variant='secondary'
              icon='cross'
              iconAfter='cross'
              size='L'
            >
              Button
            </ButtonComponent>
            <ButtonComponent
              variant='secondary'
              icon='cross'
              iconAfter='cross'
              size='XL'
            >
              Button
            </ButtonComponent>
          </Row>
          <Row direction='column' align='top' noFlex gutter={8}>
            <ButtonComponent
              variant='secondary'
              icon='cross'
              iconAfter='cross'
              size='XXS'
              loading
            >
              Button
            </ButtonComponent>
            <ButtonComponent
              variant='secondary'
              icon='cross'
              iconAfter='cross'
              size='XS'
              loading
            >
              Button
            </ButtonComponent>
            <ButtonComponent
              variant='secondary'
              icon='cross'
              iconAfter='cross'
              size='S'
              loading
            >
              Button
            </ButtonComponent>
            <ButtonComponent
              variant='secondary'
              icon='cross'
              iconAfter='cross'
              size='M'
              loading
            >
              Button
            </ButtonComponent>
            <ButtonComponent
              variant='secondary'
              icon='cross'
              iconAfter='cross'
              size='L'
              loading
            >
              Button
            </ButtonComponent>
            <ButtonComponent
              variant='secondary'
              icon='cross'
              iconAfter='cross'
              size='XL'
              loading
            >
              Button
            </ButtonComponent>
          </Row>
          <Row direction='column' align='top' noFlex gutter={8}>
            <ButtonComponent
              variant='secondary'
              icon='cross'
              size='XXS'
              iconOnly
            />
            <ButtonComponent
              variant='secondary'
              icon='cross'
              size='XS'
              iconOnly
            />
            <ButtonComponent
              variant='secondary'
              icon='cross'
              size='S'
              iconOnly
            />
            <ButtonComponent
              variant='secondary'
              icon='cross'
              size='M'
              iconOnly
            />
            <ButtonComponent
              variant='secondary'
              icon='cross'
              size='L'
              iconOnly
            />
            <ButtonComponent
              variant='secondary'
              icon='cross'
              size='XL'
              iconOnly
            />
          </Row>
        </Row>
      </Item>
      <Item label='Tertiary' height={350} width={400}>
        <Row noFlex gutter={8}>
          <Row direction='column' align='top' noFlex gutter={8}>
            <ButtonComponent
              variant='tertiary'
              icon='cross'
              iconAfter='cross'
              size='XXS'
            >
              Button
            </ButtonComponent>
            <ButtonComponent
              variant='tertiary'
              icon='cross'
              iconAfter='cross'
              size='XS'
            >
              Button
            </ButtonComponent>
            <ButtonComponent
              variant='tertiary'
              icon='cross'
              iconAfter='cross'
              size='S'
            >
              Button
            </ButtonComponent>
            <ButtonComponent
              variant='tertiary'
              icon='cross'
              iconAfter='cross'
              size='M'
            >
              Button
            </ButtonComponent>
            <ButtonComponent
              variant='tertiary'
              icon='cross'
              iconAfter='cross'
              size='L'
            >
              Button
            </ButtonComponent>
            <ButtonComponent
              variant='tertiary'
              icon='cross'
              iconAfter='cross'
              size='XL'
            >
              Button
            </ButtonComponent>
          </Row>
          <Row direction='column' align='top' noFlex gutter={8}>
            <ButtonComponent
              variant='tertiary'
              icon='cross'
              iconAfter='cross'
              size='XXS'
              loading
            >
              Button
            </ButtonComponent>
            <ButtonComponent
              variant='tertiary'
              icon='cross'
              iconAfter='cross'
              size='XS'
              loading
            >
              Button
            </ButtonComponent>
            <ButtonComponent
              variant='tertiary'
              icon='cross'
              iconAfter='cross'
              size='S'
              loading
            >
              Button
            </ButtonComponent>
            <ButtonComponent
              variant='tertiary'
              icon='cross'
              iconAfter='cross'
              size='M'
              loading
            >
              Button
            </ButtonComponent>
            <ButtonComponent
              variant='tertiary'
              icon='cross'
              iconAfter='cross'
              size='L'
              loading
            >
              Button
            </ButtonComponent>
            <ButtonComponent
              variant='tertiary'
              icon='cross'
              iconAfter='cross'
              size='XL'
              loading
            >
              Button
            </ButtonComponent>
          </Row>
          <Row direction='column' align='top' noFlex gutter={8}>
            <ButtonComponent
              variant='tertiary'
              icon='cross'
              size='XXS'
              iconOnly
            />
            <ButtonComponent
              variant='tertiary'
              icon='cross'
              size='XS'
              iconOnly
            />
            <ButtonComponent
              variant='tertiary'
              icon='cross'
              size='S'
              iconOnly
            />
            <ButtonComponent
              variant='tertiary'
              icon='cross'
              size='M'
              iconOnly
            />
            <ButtonComponent
              variant='tertiary'
              icon='cross'
              size='L'
              iconOnly
            />
            <ButtonComponent
              variant='tertiary'
              icon='cross'
              size='XL'
              iconOnly
            />
          </Row>
        </Row>
      </Item>
      <Item label='Ghost' height={350} width={400}>
        <Row noFlex gutter={8}>
          <Row direction='column' align='top' noFlex gutter={8}>
            <ButtonComponent
              variant='ghost'
              icon='cross'
              iconAfter='cross'
              size='XXS'
            >
              Button
            </ButtonComponent>
            <ButtonComponent
              variant='ghost'
              icon='cross'
              iconAfter='cross'
              size='XS'
            >
              Button
            </ButtonComponent>
            <ButtonComponent
              variant='ghost'
              icon='cross'
              iconAfter='cross'
              size='S'
            >
              Button
            </ButtonComponent>
            <ButtonComponent
              variant='ghost'
              icon='cross'
              iconAfter='cross'
              size='M'
            >
              Button
            </ButtonComponent>
            <ButtonComponent
              variant='ghost'
              icon='cross'
              iconAfter='cross'
              size='L'
            >
              Button
            </ButtonComponent>
            <ButtonComponent
              variant='ghost'
              icon='cross'
              iconAfter='cross'
              size='XL'
            >
              Button
            </ButtonComponent>
          </Row>
          <Row direction='column' align='top' noFlex gutter={8}>
            <ButtonComponent
              variant='ghost'
              icon='cross'
              iconAfter='cross'
              size='XXS'
              loading
            >
              Button
            </ButtonComponent>
            <ButtonComponent
              variant='ghost'
              icon='cross'
              iconAfter='cross'
              size='XS'
              loading
            >
              Button
            </ButtonComponent>
            <ButtonComponent
              variant='ghost'
              icon='cross'
              iconAfter='cross'
              size='S'
              loading
            >
              Button
            </ButtonComponent>
            <ButtonComponent
              variant='ghost'
              icon='cross'
              iconAfter='cross'
              size='M'
              loading
            >
              Button
            </ButtonComponent>
            <ButtonComponent
              variant='ghost'
              icon='cross'
              iconAfter='cross'
              size='L'
              loading
            >
              Button
            </ButtonComponent>
            <ButtonComponent
              variant='ghost'
              icon='cross'
              iconAfter='cross'
              size='XL'
              loading
            >
              Button
            </ButtonComponent>
          </Row>
          <Row direction='column' align='top' noFlex gutter={8}>
            <ButtonComponent variant='ghost' icon='cross' size='XXS' iconOnly />
            <ButtonComponent variant='ghost' icon='cross' size='XS' iconOnly />
            <ButtonComponent variant='ghost' icon='cross' size='S' iconOnly />
            <ButtonComponent variant='ghost' icon='cross' size='M' iconOnly />
            <ButtonComponent variant='ghost' icon='cross' size='L' iconOnly />
            <ButtonComponent variant='ghost' icon='cross' size='XL' iconOnly />
          </Row>
        </Row>
      </Item>
      <Item label='Warning' height={350} width={400}>
        <Row noFlex gutter={8}>
          <Row direction='column' align='top' noFlex gutter={8}>
            <ButtonComponent
              variant='warning'
              icon='cross'
              iconAfter='cross'
              size='XXS'
            >
              Button
            </ButtonComponent>
            <ButtonComponent
              variant='warning'
              icon='cross'
              iconAfter='cross'
              size='XS'
            >
              Button
            </ButtonComponent>
            <ButtonComponent
              variant='warning'
              icon='cross'
              iconAfter='cross'
              size='S'
            >
              Button
            </ButtonComponent>
            <ButtonComponent
              variant='warning'
              icon='cross'
              iconAfter='cross'
              size='M'
            >
              Button
            </ButtonComponent>
            <ButtonComponent
              variant='warning'
              icon='cross'
              iconAfter='cross'
              size='L'
            >
              Button
            </ButtonComponent>
            <ButtonComponent
              variant='warning'
              icon='cross'
              iconAfter='cross'
              size='XL'
            >
              Button
            </ButtonComponent>
          </Row>
          <Row direction='column' align='top' noFlex gutter={8}>
            <ButtonComponent
              variant='warning'
              icon='cross'
              iconAfter='cross'
              size='XXS'
              loading
            >
              Button
            </ButtonComponent>
            <ButtonComponent
              variant='warning'
              icon='cross'
              iconAfter='cross'
              size='XS'
              loading
            >
              Button
            </ButtonComponent>
            <ButtonComponent
              variant='warning'
              icon='cross'
              iconAfter='cross'
              size='S'
              loading
            >
              Button
            </ButtonComponent>
            <ButtonComponent
              variant='warning'
              icon='cross'
              iconAfter='cross'
              size='M'
              loading
            >
              Button
            </ButtonComponent>
            <ButtonComponent
              variant='warning'
              icon='cross'
              iconAfter='cross'
              size='L'
              loading
            >
              Button
            </ButtonComponent>
            <ButtonComponent
              variant='warning'
              icon='cross'
              iconAfter='cross'
              size='XL'
              loading
            >
              Button
            </ButtonComponent>
          </Row>
          <Row direction='column' align='top' noFlex gutter={8}>
            <ButtonComponent
              variant='warning'
              icon='cross'
              size='XXS'
              iconOnly
            />
            <ButtonComponent
              variant='warning'
              icon='cross'
              size='XS'
              iconOnly
            />
            <ButtonComponent variant='warning' icon='cross' size='S' iconOnly />
            <ButtonComponent variant='warning' icon='cross' size='M' iconOnly />
            <ButtonComponent variant='warning' icon='cross' size='L' iconOnly />
            <ButtonComponent
              variant='warning'
              icon='cross'
              size='XL'
              iconOnly
            />
          </Row>
        </Row>
      </Item>
      <Item label='Danger' height={350} width={400}>
        <Row noFlex gutter={8}>
          <Row direction='column' align='top' noFlex gutter={8}>
            <ButtonComponent
              variant='danger'
              icon='cross'
              iconAfter='cross'
              size='XXS'
            >
              Button
            </ButtonComponent>
            <ButtonComponent
              variant='danger'
              icon='cross'
              iconAfter='cross'
              size='XS'
            >
              Button
            </ButtonComponent>
            <ButtonComponent
              variant='danger'
              icon='cross'
              iconAfter='cross'
              size='S'
            >
              Button
            </ButtonComponent>
            <ButtonComponent
              variant='danger'
              icon='cross'
              iconAfter='cross'
              size='M'
            >
              Button
            </ButtonComponent>
            <ButtonComponent
              variant='danger'
              icon='cross'
              iconAfter='cross'
              size='L'
            >
              Button
            </ButtonComponent>
            <ButtonComponent
              variant='danger'
              icon='cross'
              iconAfter='cross'
              size='XL'
            >
              Button
            </ButtonComponent>
          </Row>
          <Row direction='column' align='top' noFlex gutter={8}>
            <ButtonComponent
              variant='danger'
              icon='cross'
              iconAfter='cross'
              size='XXS'
              loading
            >
              Button
            </ButtonComponent>
            <ButtonComponent
              variant='danger'
              icon='cross'
              iconAfter='cross'
              size='XS'
              loading
            >
              Button
            </ButtonComponent>
            <ButtonComponent
              variant='danger'
              icon='cross'
              iconAfter='cross'
              size='S'
              loading
            >
              Button
            </ButtonComponent>
            <ButtonComponent
              variant='danger'
              icon='cross'
              iconAfter='cross'
              size='M'
              loading
            >
              Button
            </ButtonComponent>
            <ButtonComponent
              variant='danger'
              icon='cross'
              iconAfter='cross'
              size='L'
              loading
            >
              Button
            </ButtonComponent>
            <ButtonComponent
              variant='danger'
              icon='cross'
              iconAfter='cross'
              size='XL'
              loading
            >
              Button
            </ButtonComponent>
          </Row>
          <Row direction='column' align='top' noFlex gutter={8}>
            <ButtonComponent
              variant='danger'
              icon='cross'
              size='XXS'
              iconOnly
            />
            <ButtonComponent variant='danger' icon='cross' size='XS' iconOnly />
            <ButtonComponent variant='danger' icon='cross' size='S' iconOnly />
            <ButtonComponent variant='danger' icon='cross' size='M' iconOnly />
            <ButtonComponent variant='danger' icon='cross' size='L' iconOnly />
            <ButtonComponent variant='danger' icon='cross' size='XL' iconOnly />
          </Row>
        </Row>
      </Item>
      <Item label='Ellipse' height={150} width={420}>
        <Row noFlex gutter={8}>
          <Row direction='column' align='top' noFlex gutter={8}>
            <ButtonComponent
              variant='ellipse'
              icon='cross'
              iconAfter='cross'
              size='XXS'
            >
              Button
            </ButtonComponent>
            <ButtonComponent
              variant='ellipse'
              icon='cross'
              iconAfter='cross'
              size='XS'
            >
              Button
            </ButtonComponent>
            <ButtonComponent
              variant='ellipse'
              icon='cross'
              iconAfter='cross'
              size='S'
            >
              Button
            </ButtonComponent>
          </Row>
          <Row direction='column' align='top' noFlex gutter={8}>
            <ButtonComponent
              variant='ellipse'
              icon='cross'
              iconAfter='cross'
              size='XXS'
              loading
            >
              Button
            </ButtonComponent>
            <ButtonComponent
              variant='ellipse'
              icon='cross'
              iconAfter='cross'
              size='XS'
              loading
            >
              Button
            </ButtonComponent>
            <ButtonComponent
              variant='ellipse'
              icon='cross'
              iconAfter='cross'
              size='S'
              loading
            >
              Button
            </ButtonComponent>
          </Row>
          <Row direction='column' align='top' noFlex gutter={8}>
            <ButtonComponent
              variant='ellipse'
              icon='cross'
              size='XXS'
              iconOnly
            />
            <ButtonComponent
              variant='ellipse'
              icon='cross'
              size='XS'
              iconOnly
            />
            <ButtonComponent variant='ellipse' icon='cross' size='S' iconOnly />
          </Row>
          <Row direction='column' align='top' noFlex gutter={8}>
            <ButtonComponent
              variant='ellipse'
              icon='cross'
              size='XXS'
              iconOnly
              loading
            />
            <ButtonComponent
              variant='ellipse'
              icon='cross'
              size='XS'
              iconOnly
              loading
            />
            <ButtonComponent
              variant='ellipse'
              icon='cross'
              size='S'
              iconOnly
              loading
            />
          </Row>
        </Row>
      </Item>
      <Item label='Function' height={200} width={400}>
        <Row noFlex gutter={8}>
          <Row direction='column' align='top' noFlex gutter={8}>
            <ButtonComponent
              variant='function'
              icon='cross'
              iconAfter='cross'
              size='XXS'
            >
              Button
            </ButtonComponent>
            <ButtonComponent
              variant='function'
              icon='cross'
              iconAfter='cross'
              size='S'
            >
              Button
            </ButtonComponent>
            <ButtonComponent
              variant='function'
              icon='cross'
              iconAfter='cross'
              size='XXS'
              link
            >
              Button
            </ButtonComponent>
            <ButtonComponent
              variant='function'
              icon='cross'
              iconAfter='cross'
              size='S'
              link
            >
              Button
            </ButtonComponent>
          </Row>
          <Row direction='column' align='top' noFlex gutter={8}>
            <ButtonComponent
              variant='function'
              icon='cross'
              iconAfter='cross'
              size='XXS'
              loading
            >
              Button
            </ButtonComponent>
            <ButtonComponent
              variant='function'
              icon='cross'
              iconAfter='cross'
              size='S'
              loading
            >
              Button
            </ButtonComponent>
            <ButtonComponent
              variant='function'
              icon='cross'
              iconAfter='cross'
              size='XXS'
              loading
            >
              Button
            </ButtonComponent>
            <ButtonComponent
              variant='function'
              icon='cross'
              iconAfter='cross'
              size='S'
              loading
            >
              Button
            </ButtonComponent>
          </Row>
          <Row direction='column' align='top' noFlex gutter={8}>
            <ButtonComponent
              variant='function'
              icon='cross'
              size='XXS'
              iconOnly
            />
            <ButtonComponent
              variant='function'
              icon='cross'
              size='S'
              iconOnly
            />
            <ButtonComponent
              variant='function'
              icon='cross'
              size='XXS'
              link
              iconOnly
            />
            <ButtonComponent
              variant='function'
              icon='cross'
              size='S'
              link
              iconOnly
            />
          </Row>
        </Row>
      </Item>
      <Item label='Ai' height={200} width={400}>
        <Row noFlex gutter={8}>
          <Row direction='column' align='top' noFlex gutter={8}>
            <ButtonComponent
              variant='ai'
              icon='generate'
              iconAfter='cross'
              size='XXS'
            >
              Button
            </ButtonComponent>
            <ButtonComponent
              variant='ai'
              icon='generate'
              iconAfter='cross'
              size='S'
            >
              Button
            </ButtonComponent>
          </Row>
          <Row direction='column' align='top' noFlex gutter={8}>
            <ButtonComponent
              variant='ai'
              icon='generate'
              iconAfter='cross'
              size='XXS'
              loading
            >
              Button
            </ButtonComponent>
            <ButtonComponent
              variant='ai'
              icon='generate'
              iconAfter='cross'
              size='S'
              loading
            >
              Button
            </ButtonComponent>
          </Row>
          <Row direction='column' align='top' noFlex gutter={8}>
            <ButtonComponent variant='ai' icon='cross' size='XXS' iconOnly />
            <ButtonComponent variant='ai' icon='cross' size='S' iconOnly />
          </Row>
        </Row>
      </Item>
      <Item label='Disabled size S' height={420} width={220}>
        <Row direction='column' align='top' noFlex gutter={8}>
          <ButtonComponent
            variant='primary'
            icon='cross'
            iconAfter='cross'
            size='S'
            disabled
          >
            Primary
          </ButtonComponent>
          <ButtonComponent
            variant='secondary'
            icon='cross'
            iconAfter='cross'
            size='S'
            disabled
          >
            Secondary
          </ButtonComponent>
          <ButtonComponent
            variant='tertiary'
            icon='cross'
            iconAfter='cross'
            size='S'
            disabled
          >
            Tertiary
          </ButtonComponent>
          <ButtonComponent
            variant='ghost'
            icon='cross'
            iconAfter='cross'
            size='S'
            disabled
          >
            Ghost
          </ButtonComponent>
          <ButtonComponent
            variant='function'
            icon='cross'
            iconAfter='cross'
            size='S'
            disabled
          >
            Function
          </ButtonComponent>
          <ButtonComponent
            variant='ellipse'
            icon='cross'
            iconAfter='cross'
            size='S'
            disabled
          >
            Ellipse
          </ButtonComponent>
          <ButtonComponent
            variant='warning'
            icon='cross'
            iconAfter='cross'
            size='S'
            disabled
          >
            Warning
          </ButtonComponent>
          <ButtonComponent
            variant='danger'
            icon='cross'
            iconAfter='cross'
            size='S'
            disabled
          >
            Danger
          </ButtonComponent>
        </Row>
      </Item>
    </Container>
  </>
);
