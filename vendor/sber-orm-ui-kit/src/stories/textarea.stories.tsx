import { Meta, StoryFn } from '@storybook/react';

import { Textarea as TextareaComponent } from '..';
import { Container, DemoContainer, Item } from './utils';

const meta: Meta<typeof TextareaComponent> = {
  argTypes: {
    label: {
      description: 'Заголовок поля',
    },
    tooltip: {
      description: 'Подсказка',
    },
    helperText: {
      description: 'Вспомогательный текст',
    },
    labelInside: {
      description: 'Отображать лейбл внутри области',
      control: 'boolean',
    },
    required: {
      description: 'Обязательное поле',
      control: 'boolean',
    },
    canClear: {
      description: 'Возможность очищать поле',
      control: 'boolean',
    },
    error: {
      description: 'Наличие ошибки',
      control: 'boolean',
    },
    maxLength: {
      description: 'Максимальная длина поля',
      control: 'number',
    },
    rows: {
      description: 'Количество рядов для отображения',
      control: 'number',
    },
    resize: {
      descrption: 'Тип ресайза',
      options: ['none', 'horizontal', 'vertical'],
      control: 'select',
    },
    size: {
      descrption: 'Размер поля',
      options: ['S', 'M', 'L', 'XL'],
      control: 'select',
    },
    onChange: {
      description:
        'Обработчик изменения: `(value: string, event: ChangeEvent<HTMLTextAreaElement>) => void`',
    },
  },
  args: {
    required: false,
    label: 'Label',
    labelInside: false,
    canClear: true,
    error: false,
    helperText: 'Helper text goes here',
    tooltip: 'Подсказка',
    maxLength: 2000,
    rows: 5,
    resize: 'vertical',
    size: 'S',
  },
  parameters: {
    controls: {
      expanded: true,
    },
  },
  component: TextareaComponent,
  title: 'components/Textarea',
};

const text =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.';

export default meta;

export const Textarea: StoryFn<typeof TextareaComponent> = (arguments_) => (
  <>
    <DemoContainer>
      <Item label='Customizable' height={200} width={400}>
        <TextareaComponent {...arguments_} />
      </Item>
    </DemoContainer>
    <Container>
      <Item label='Default Empty Size S' height={200} width={400}>
        <TextareaComponent
          label='Label'
          labelInside
          required
          tooltip='Подсказка'
          helperText='Helper text goes here'
          rows={5}
          maxLength={2000}
          resize='vertical'
          canClear
          size='S'
        />
      </Item>
      <Item label='Default Filled Size S' height={200} width={400}>
        <TextareaComponent
          label='Label'
          value={text}
          labelInside
          required
          tooltip='Подсказка'
          helperText='Helper text goes here'
          rows={5}
          maxLength={2000}
          resize='vertical'
          canClear
          size='S'
        />
      </Item>
      <Item label='Disabled Fullwidth Empty Size M' height={200} width={400}>
        <TextareaComponent
          label='Label'
          labelInside
          tooltip='Подсказка'
          helperText='Helper text goes here'
          rows={5}
          maxLength={2000}
          fullWidth
          disabled
          resize='vertical'
        />
      </Item>
      <Item label='Disabled Fullwidth Filled Size M' height={200} width={400}>
        <TextareaComponent
          label='Label'
          value={text}
          labelInside
          tooltip='Подсказка'
          helperText='Helper text goes here'
          rows={5}
          maxLength={2000}
          fullWidth
          disabled
        />
      </Item>
      <Item label='Error Empty Size L' height={200} width={400}>
        <TextareaComponent
          label='Label'
          labelInside
          tooltip='Подсказка'
          helperText='Error text messages goes here'
          rows={5}
          size='L'
          maxLength={2000}
          error
          resize='vertical'
        />
      </Item>
      <Item label='Error Filled Size XL' height={200} width={400}>
        <TextareaComponent
          label='Label'
          value={text}
          labelInside
          canClear
          helperText='Error text messages goes here'
          rows={5}
          size='XL'
          maxLength={2000}
          error
          resize='vertical'
        />
      </Item>
      <Item label='Default Empty Size S' height={200} width={400}>
        <TextareaComponent
          label='Label'
          required
          tooltip='Подсказка'
          helperText='Helper text goes here'
          rows={5}
          maxLength={2000}
          resize='vertical'
          canClear
          size='S'
          placeholder='Placeholder'
        />
      </Item>
      <Item label='Default Filled Size S' height={200} width={400}>
        <TextareaComponent
          label='Label'
          value={text}
          required
          tooltip='Подсказка'
          helperText='Helper text goes here'
          rows={5}
          maxLength={2000}
          resize='vertical'
          canClear
          size='S'
          placeholder='Placeholder'
        />
      </Item>
      <Item label='Disabled Fullwidth Empty Size M' height={200} width={400}>
        <TextareaComponent
          label='Label'
          tooltip='Подсказка'
          helperText='Helper text goes here'
          rows={5}
          maxLength={2000}
          fullWidth
          disabled
          resize='vertical'
          placeholder='Placeholder'
        />
      </Item>
      <Item label='Disabled Fullwidth Filled Size M' height={200} width={400}>
        <TextareaComponent
          label='Label'
          value={text}
          tooltip='Подсказка'
          helperText='Helper text goes here'
          rows={5}
          maxLength={2000}
          fullWidth
          disabled
          placeholder='Placeholder'
        />
      </Item>
      <Item label='Error Empty Size L' height={200} width={400}>
        <TextareaComponent
          label='Label'
          helperText='Error text messages goes here'
          rows={5}
          size='L'
          maxLength={2000}
          error
          placeholder='Placeholder'
          resize='vertical'
        />
      </Item>
      <Item label='Error Filled Size XL' height={200} width={400}>
        <TextareaComponent
          label='Label'
          value={text}
          canClear
          helperText='Error text messages goes here'
          rows={5}
          size='XL'
          maxLength={2000}
          error
          placeholder='Placeholder'
          resize='vertical'
        />
      </Item>
      <Item label='Readonly' height={200} width={400}>
        <TextareaComponent
          value={text}
          label='Label'
          required
          rows={6}
          fullWidth
          readonly
        />
      </Item>
      <Item label='ViewOnly' height={200} width={400}>
        <TextareaComponent
          value={text}
          label='Label'
          required
          rows={6}
          fullWidth
          viewOnly
        />
      </Item>
      <Item label='ViewOnly without value' height={200} width={400}>
        <TextareaComponent
          value={undefined}
          label='Label'
          required
          rows={6}
          fullWidth
          viewOnly
        />
      </Item>
    </Container>
  </>
);
