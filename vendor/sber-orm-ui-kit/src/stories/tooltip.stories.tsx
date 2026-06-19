import { Meta, StoryFn } from '@storybook/react';

import { Icon, Tooltip as TooltipComponent } from '..';
import { Container, Item } from './utils';

const meta: Meta<typeof TooltipComponent> = {
  argTypes: {
    canShow: {
      control: 'boolean',
      description: 'Доступно ли отображение тултипа',
    },
    interactive: {
      control: 'boolean',
      description: 'Открытие по клику',
    },
    placement: {
      control: 'select',
      options: [
        'top-start',
        'top',
        'top-end',
        'right-start',
        'right',
        'right-end',
        'bottom-start',
        'bottom',
        'bottom-end',
        'left-start',
        'left',
        'left-end',
      ],
      description: 'Позиция тултипа',
    },
    content: {
      description: 'Текст',
    },
  },
  args: {
    content: `Опиши конкретные шаги и действия, необходимые для снижения риска. 
Например: «Запуск системы двухфакторной аутентификации через корпоративное приложение ОТР при входе в АС НОРМ из внешней сети.»`,
    placement: 'right-start',
    canShow: true,
    interactive: false,
  },
  component: TooltipComponent,
  title: 'components/Tooltip',
  parameters: {
    controls: {
      expanded: true,
    },
  },
};

export default meta;
export const Tooltip: StoryFn<typeof TooltipComponent> = (arguments_) => (
  <Container>
    <Item label='Customizable' width={2000}>
      <TooltipComponent {...arguments_}>
        <span>
          <Icon width={20} height={20} name='infoOutlined' />
        </span>
      </TooltipComponent>
    </Item>
    <Item label="Can't Show">
      <TooltipComponent {...arguments_} canShow={false}>
        <span>
          <Icon width={20} height={20} name='infoOutlined' />
        </span>
      </TooltipComponent>
    </Item>
    <Item label='Interactive (placement: top)'>
      <TooltipComponent {...arguments_} interactive placement='top'>
        <span>
          <Icon width={20} height={20} name='infoOutlined' />
        </span>
      </TooltipComponent>
    </Item>
    <Item label='Interactive (placement: bottom)'>
      <TooltipComponent {...arguments_} interactive placement='bottom'>
        <span>
          <Icon width={20} height={20} name='infoOutlined' />
        </span>
      </TooltipComponent>
    </Item>
    <Item label='Interactive (placement: right)'>
      <TooltipComponent {...arguments_} interactive placement='right'>
        <span>
          <Icon width={20} height={20} name='infoOutlined' />
        </span>
      </TooltipComponent>
    </Item>
    <Item label='Interactive (placement: left)'>
      <TooltipComponent {...arguments_} interactive placement='left'>
        <span>
          <Icon width={20} height={20} name='infoOutlined' />
        </span>
      </TooltipComponent>
    </Item>
    <Item label='Interactive (placement: right-end)'>
      <TooltipComponent {...arguments_} interactive placement='right-end'>
        <span>
          <Icon width={20} height={20} name='infoOutlined' />
        </span>
      </TooltipComponent>
    </Item>
    <Item label='Interactive (placement: left-end'>
      <TooltipComponent {...arguments_} interactive placement='left-end'>
        <span>
          <Icon width={20} height={20} name='infoOutlined' />
        </span>
      </TooltipComponent>
    </Item>
    <Item label='Interactive (placement: bottom-start)'>
      <TooltipComponent {...arguments_} interactive placement='bottom-start'>
        <span>
          <Icon width={20} height={20} name='infoOutlined' />
        </span>
      </TooltipComponent>
    </Item>
    <Item label='Interactive (placement: bottom-end)'>
      <TooltipComponent {...arguments_} interactive placement='bottom-start'>
        <span>
          <Icon width={20} height={20} name='infoOutlined' />
        </span>
      </TooltipComponent>
    </Item>
    <Item label='Interactive (placement: top-start)'>
      <TooltipComponent {...arguments_} interactive placement='top-start'>
        <span>
          <Icon width={20} height={20} name='infoOutlined' />
        </span>
      </TooltipComponent>
    </Item>
    <Item label='Interactive (placement: top-end)'>
      <TooltipComponent {...arguments_} interactive placement='top-end'>
        <span>
          <Icon width={20} height={20} name='infoOutlined' />
        </span>
      </TooltipComponent>
    </Item>
    <Item label='Interactive (placement: left-start)'>
      <TooltipComponent {...arguments_} interactive placement='left-start'>
        <span>
          <Icon width={20} height={20} name='infoOutlined' />
        </span>
      </TooltipComponent>
    </Item>
    <Item label='Interactive (placement: right-start)'>
      <TooltipComponent {...arguments_} interactive placement='right-start'>
        <span>
          <Icon width={20} height={20} name='infoOutlined' />
        </span>
      </TooltipComponent>
    </Item>
  </Container>
);
