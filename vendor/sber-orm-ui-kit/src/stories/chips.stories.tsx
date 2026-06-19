import { Meta, StoryFn } from '@storybook/react';
import { useState } from 'react';

import { Chips as ChipsComponent, Row } from '..';
import { Container, DemoContainer, Item } from './utils';

const meta: Meta<typeof ChipsComponent> = {
  argTypes: {
    disabled: {
      description: 'Отключен ли чекбокс',
      control: { type: 'boolean' },
    },
    fullWidth: {
      description: 'Растягивать ли элемент во всю ширину',
      control: { type: 'boolean' },
    },
    onChange: {
      description:
        'Обработчик изменения состояния `(event: ChangeEvent<HTMLInputElement>) => void`',
    },
    size: {
      description: 'Размер чекбокса `TChipsSize`',
      control: 'select',
      options: ['XXS', 'XS', 'S'],
    },
    item: {
      description:
        'Объект с данными чекбокса: ```{title: React.ReactNode;id: string;count?: number;}```',
    },
    variant: {
      description: 'Вариант отображения: `TChipsVariant`',
      control: { type: 'select' },
      options: ['fill', 'outline'],
    },
    onRemove: {
      description:
        'Обработчик отключения: `(id: string, event: React.FormEvent<HTMLElement>) => void`',
    },
  },
  args: {
    fullWidth: false,
    disabled: false,
    size: 'XS',
    variant: 'fill',
    item: { id: 'example', title: 'Example', count: 10 },
  },
  parameters: {
    controls: {
      expanded: true,
    },
  },
  component: ChipsComponent,
  title: 'components/Chips',
};

export default meta;

const item = { id: 'first', title: 'Title', count: 99 };

export const Chips: StoryFn<typeof ChipsComponent> = (arguments_) => {
  const [value, setValue] = useState<string | null>(null);

  return (
    <>
      <DemoContainer>
        <Item label='Customizable'>
          <ChipsComponent
            {...arguments_}
            onChange={setValue}
            selected={value === arguments_.item.id}
          />
        </Item>
      </DemoContainer>
      <Container>
        <Item label='Fill with count'>
          <Row direction='column' gutter={16}>
            <ChipsComponent
              item={item}
              onChange={setValue}
              selected={value === item.id}
            />
            <ChipsComponent item={item} onChange={setValue} selected />
          </Row>
          <Row direction='column' gutter={16}>
            <ChipsComponent
              size='XS'
              item={item}
              onChange={setValue}
              selected={value === item.id}
            />
            <ChipsComponent
              size='XS'
              item={item}
              onChange={setValue}
              selected
            />
          </Row>
          <Row direction='column' gutter={16}>
            <ChipsComponent
              size='S'
              item={item}
              onChange={setValue}
              selected={value === item.id}
            />
            <ChipsComponent size='S' item={item} onChange={setValue} selected />
          </Row>
        </Item>
        <Item label='Fill with remove'>
          <Row direction='column' gutter={16}>
            <ChipsComponent
              item={item}
              onChange={setValue}
              onRemove={() => {}}
              selected={value === item.id}
            />
            <ChipsComponent
              item={item}
              onChange={setValue}
              onRemove={() => {}}
              selected
            />
          </Row>
          <Row direction='column' gutter={16}>
            <ChipsComponent
              size='XS'
              item={item}
              onChange={setValue}
              onRemove={() => {}}
              selected={value === item.id}
            />
            <ChipsComponent
              size='XS'
              item={item}
              onChange={setValue}
              onRemove={() => {}}
              selected
            />
          </Row>
          <Row direction='column' gutter={16}>
            <ChipsComponent
              size='S'
              item={item}
              onChange={setValue}
              onRemove={() => {}}
              selected={value === item.id}
            />
            <ChipsComponent
              size='S'
              item={item}
              onChange={setValue}
              onRemove={() => {}}
              selected
            />
          </Row>
        </Item>
        <Item label='Outline with count'>
          <Row direction='column' gutter={16}>
            <ChipsComponent
              variant='outline'
              item={item}
              onChange={setValue}
              selected={value === item.id}
            />
            <ChipsComponent
              variant='outline'
              item={item}
              onChange={setValue}
              selected
            />
          </Row>
          <Row direction='column' gutter={16}>
            <ChipsComponent
              variant='outline'
              size='XS'
              item={item}
              onChange={setValue}
              selected={value === item.id}
            />
            <ChipsComponent
              variant='outline'
              size='XS'
              item={item}
              onChange={setValue}
              selected
            />
          </Row>
          <Row direction='column' gutter={16}>
            <ChipsComponent
              variant='outline'
              size='S'
              item={item}
              onChange={setValue}
              selected={value === item.id}
            />
            <ChipsComponent
              variant='outline'
              size='S'
              item={item}
              onChange={setValue}
              selected
            />
          </Row>
        </Item>
        <Item label='Outline with remove'>
          <Row direction='column' gutter={16}>
            <ChipsComponent
              variant='outline'
              item={item}
              onChange={setValue}
              onRemove={() => {}}
              selected={value === item.id}
            />
            <ChipsComponent
              variant='outline'
              item={item}
              onChange={setValue}
              onRemove={() => {}}
              selected
            />
          </Row>
          <Row direction='column' gutter={16}>
            <ChipsComponent
              variant='outline'
              size='XS'
              item={item}
              onChange={setValue}
              onRemove={() => {}}
              selected={value === item.id}
            />
            <ChipsComponent
              variant='outline'
              size='XS'
              item={item}
              onChange={setValue}
              onRemove={() => {}}
              selected
            />
          </Row>
          <Row direction='column' gutter={16}>
            <ChipsComponent
              variant='outline'
              size='S'
              item={item}
              onChange={setValue}
              onRemove={() => {}}
              selected={value === item.id}
            />
            <ChipsComponent
              variant='outline'
              size='S'
              item={item}
              onChange={setValue}
              onRemove={() => {}}
              selected
            />
          </Row>
        </Item>
        <Item label='Fill with fullWidth'>
          <Row direction='column' gutter={16}>
            <ChipsComponent item={item} onChange={setValue} fullWidth />
            <ChipsComponent
              size='XS'
              item={item}
              onChange={setValue}
              fullWidth
            />
            <ChipsComponent
              size='S'
              item={item}
              onChange={setValue}
              fullWidth
            />
          </Row>
        </Item>
        <Item label='Fill selected with fullWidth'>
          <Row direction='column' gutter={16}>
            <ChipsComponent
              item={item}
              onChange={setValue}
              selected
              fullWidth
            />
            <ChipsComponent
              size='XS'
              item={item}
              onChange={setValue}
              selected
              fullWidth
            />
            <ChipsComponent
              size='S'
              item={item}
              onChange={setValue}
              selected
              fullWidth
            />
          </Row>
        </Item>
        <Item label='Outline with fullWidth'>
          <Row direction='column' gutter={16}>
            <ChipsComponent
              variant='outline'
              item={item}
              onChange={setValue}
              fullWidth
            />
            <ChipsComponent
              variant='outline'
              size='XS'
              item={item}
              onChange={setValue}
              fullWidth
            />
            <ChipsComponent
              variant='outline'
              size='S'
              item={item}
              onChange={setValue}
              fullWidth
            />
          </Row>
        </Item>
        <Item label='Outline selected with fullWidth'>
          <Row direction='column' gutter={16}>
            <ChipsComponent
              variant='outline'
              item={item}
              onChange={setValue}
              selected
              fullWidth
            />
            <ChipsComponent
              variant='outline'
              size='XS'
              item={item}
              onChange={setValue}
              selected
              fullWidth
            />
            <ChipsComponent
              variant='outline'
              size='S'
              item={item}
              onChange={setValue}
              selected
              fullWidth
            />
          </Row>
        </Item>
      </Container>
    </>
  );
};
