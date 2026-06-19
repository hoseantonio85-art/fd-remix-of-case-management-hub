import { Meta, StoryFn } from '@storybook/react';

import { EIconName, Input as InputComponent, Row } from '..';
import { Container, DemoContainer, Item } from './utils';

const meta: Meta<typeof InputComponent> = {
  argTypes: {
    icon: {
      description: 'Иконка в начале инпута `EIconName`',
      control: 'select',
      options: Object.values(EIconName),
    },
    tooltip: {
      description: 'Текст тултипа',
    },
    helperText: {
      description: 'Вспомогательный текст',
    },
    placeholder: {
      description: 'Текст плейсхолдера в инпуте',
    },
    error: {
      description: 'Есть ошибка',
      control: 'boolean',
    },
    required: {
      description: 'Поле обязательно для заполнения',
      control: 'boolean',
    },
    disabled: {
      description: 'Инпут отключен',
      control: 'boolean',
    },
    suffix: {
      description: 'Вспомогательный элемент после поля ввода `React.ReactNode`',
    },
    labelInside: {
      description: 'Отображать лейбл внутри инпута',
      control: 'boolean',
    },
    label: {
      description: 'Заголовок инпута',
    },
    size: {
      control: 'select',
      description: 'Размер инпута `TComponentSizes`',
      options: ['S', 'M', 'L', 'XL'],
    },
  },
  args: {
    disabled: false,
    required: false,
    tooltip: 'Подсказка',
    placeholder: 'Write something',
    size: 'S',
    label: 'Label',
    labelInside: false,
    error: false,
    helperText: 'Helper text goes here',
    suffix: ':)',
  },
  parameters: {
    controls: {
      expanded: true,
    },
  },
  component: InputComponent,
  title: 'components/Input',
};

export default meta;
export const Input: StoryFn<typeof InputComponent> = (arguments_) => (
  <>
    <DemoContainer>
      <Item label='Customizable' height={100}>
        <InputComponent {...arguments_} />
      </Item>
    </DemoContainer>
    <Container>
      <Item label='Basic empty labelInside' height={300}>
        <Row gutter={16}>
          <Row direction='column' gutter={8}>
            <InputComponent
              tooltip='Подсказка'
              label='Label'
              size='S'
              labelInside
              helperText='Helper text'
            />
            <InputComponent
              tooltip='Подсказка'
              label='Label'
              size='M'
              labelInside
              helperText='Helper text'
            />
            <InputComponent
              tooltip='Подсказка'
              label='Label'
              size='L'
              labelInside
              required
            />
            <InputComponent
              tooltip='Подсказка'
              label='Label'
              size='XL'
              labelInside
              required
            />
          </Row>
        </Row>
      </Item>
      <Item label='Basic empty labelInside withIcon' height={300}>
        <Row gutter={16}>
          <Row direction='column' gutter={8}>
            <InputComponent
              icon='errorRounded'
              tooltip='Подсказка'
              label='Label'
              size='S'
              labelInside
            />
            <InputComponent
              icon='errorRounded'
              tooltip='Подсказка'
              label='Label'
              size='M'
              labelInside
            />
            <InputComponent
              icon='errorRounded'
              tooltip='Подсказка'
              label='Label'
              size='L'
              labelInside
              required
            />
            <InputComponent
              icon='errorRounded'
              tooltip='Подсказка'
              label='Label'
              size='XL'
              labelInside
              required
            />
          </Row>
        </Row>
      </Item>
      <Item label='Disabled empty labelInside' height={300}>
        <Row gutter={16}>
          <Row direction='column' gutter={8}>
            <InputComponent
              tooltip='Подсказка'
              label='Label'
              size='S'
              labelInside
              disabled
            />
            <InputComponent
              tooltip='Подсказка'
              label='Label'
              size='M'
              labelInside
              disabled
            />
            <InputComponent
              tooltip='Подсказка'
              label='Label'
              size='L'
              labelInside
              disabled
              required
            />
            <InputComponent
              tooltip='Подсказка'
              label='Label'
              size='XL'
              labelInside
              disabled
              required
            />
          </Row>
        </Row>
      </Item>
      <Item label='Error empty labelInside' height={300}>
        <Row gutter={16}>
          <Row direction='column' gutter={8}>
            <InputComponent
              tooltip='Подсказка'
              label='Label'
              size='S'
              labelInside
              error
            />
            <InputComponent
              tooltip='Подсказка'
              label='Label'
              size='M'
              labelInside
              error
            />
            <InputComponent
              tooltip='Подсказка'
              label='Label'
              size='L'
              labelInside
              error
              required
            />
            <InputComponent
              tooltip='Подсказка'
              label='Label'
              size='XL'
              labelInside
              error
              required
            />
          </Row>
        </Row>
      </Item>
      <Item label='Error empty labelInside with icon' height={300}>
        <Row gutter={16}>
          <Row direction='column' gutter={8}>
            <InputComponent
              icon='errorRounded'
              tooltip='Подсказка'
              label='Label'
              size='S'
              labelInside
              error
            />
            <InputComponent
              icon='errorRounded'
              tooltip='Подсказка'
              label='Label'
              size='M'
              labelInside
              error
            />
            <InputComponent
              icon='errorRounded'
              tooltip='Подсказка'
              label='Label'
              size='L'
              labelInside
              error
              required
            />
            <InputComponent
              icon='errorRounded'
              tooltip='Подсказка'
              label='Label'
              size='XL'
              labelInside
              error
              required
            />
          </Row>
        </Row>
      </Item>
      <Item label='Basic filled labelInside' height={300}>
        <Row gutter={16}>
          <Row direction='column' gutter={8}>
            <InputComponent
              tooltip='Подсказка'
              value='Value'
              label='Label'
              size='S'
              labelInside
            />
            <InputComponent
              tooltip='Подсказка'
              value='Value'
              label='Label'
              size='M'
              labelInside
            />
            <InputComponent
              tooltip='Подсказка'
              value='Value'
              label='Label'
              size='L'
              labelInside
              required
            />
            <InputComponent
              tooltip='Подсказка'
              value='Value'
              label='Label'
              size='XL'
              labelInside
              required
            />
          </Row>
        </Row>
      </Item>
      <Item label='Basic filled labelInside withIcon' height={300}>
        <Row gutter={16}>
          <Row direction='column' gutter={8}>
            <InputComponent
              icon='errorRounded'
              tooltip='Подсказка'
              value='Value'
              label='Label'
              size='S'
              labelInside
            />
            <InputComponent
              icon='errorRounded'
              tooltip='Подсказка'
              value='Value'
              label='Label'
              size='M'
              labelInside
            />
            <InputComponent
              icon='errorRounded'
              tooltip='Подсказка'
              value='Value'
              label='Label'
              size='L'
              labelInside
              required
            />
            <InputComponent
              icon='errorRounded'
              tooltip='Подсказка'
              value='Value'
              label='Label'
              size='XL'
              labelInside
              required
            />
          </Row>
        </Row>
      </Item>
      <Item label='Disabled filled labelInside withIcon' height={300}>
        <Row gutter={16}>
          <Row direction='column' gutter={8}>
            <InputComponent
              icon='errorRounded'
              tooltip='Подсказка'
              value='Value'
              label='Label'
              size='S'
              labelInside
              disabled
              required
            />
            <InputComponent
              icon='errorRounded'
              tooltip='Подсказка'
              value='Value'
              label='Label'
              size='M'
              labelInside
              disabled
              required
            />
            <InputComponent
              icon='errorRounded'
              tooltip='Подсказка'
              value='Value'
              label='Label'
              size='L'
              labelInside
              disabled
              required
            />
            <InputComponent
              icon='errorRounded'
              tooltip='Подсказка'
              value='Value'
              label='Label'
              size='XL'
              labelInside
              disabled
              required
            />
          </Row>
        </Row>
      </Item>
      <Item label='Error filled labelInside withIcon' height={300}>
        <Row gutter={16}>
          <Row direction='column' gutter={8}>
            <InputComponent
              icon='errorRounded'
              tooltip='Подсказка'
              value='Value'
              label='Label'
              size='S'
              labelInside
              error
            />
            <InputComponent
              icon='errorRounded'
              tooltip='Подсказка'
              value='Value'
              label='Label'
              size='M'
              labelInside
              error
            />
            <InputComponent
              icon='errorRounded'
              tooltip='Подсказка'
              value='Value'
              label='Label'
              size='L'
              labelInside
              error
              required
            />
            <InputComponent
              icon='errorRounded'
              tooltip='Подсказка'
              value='Value'
              label='Label'
              size='XL'
              labelInside
              error
              required
            />
          </Row>
        </Row>
      </Item>
      <Item label='Basic empty' height={400}>
        <Row gutter={16}>
          <Row direction='column' gutter={8}>
            <InputComponent
              placeholder='Placeholder'
              tooltip='Подсказка'
              label='Label'
              size='S'
            />
            <InputComponent
              placeholder='Placeholder'
              tooltip='Подсказка'
              label='Label'
              size='M'
            />
            <InputComponent
              placeholder='Placeholder'
              tooltip='Подсказка'
              label='Label'
              size='L'
              required
            />
            <InputComponent
              placeholder='Placeholder'
              tooltip='Подсказка'
              label='Label'
              size='XL'
              required
            />
          </Row>
        </Row>
      </Item>
      <Item label='Basic empty withIcon' height={400}>
        <Row gutter={16}>
          <Row direction='column' gutter={8}>
            <InputComponent
              placeholder='Placeholder'
              icon='errorRounded'
              tooltip='Подсказка'
              label='Label'
              size='S'
            />
            <InputComponent
              placeholder='Placeholder'
              icon='errorRounded'
              tooltip='Подсказка'
              label='Label'
              size='M'
            />
            <InputComponent
              placeholder='Placeholder'
              icon='errorRounded'
              tooltip='Подсказка'
              label='Label'
              size='L'
              required
            />
            <InputComponent
              placeholder='Placeholder'
              icon='errorRounded'
              tooltip='Подсказка'
              label='Label'
              size='XL'
              required
            />
          </Row>
        </Row>
      </Item>
      <Item label='Disabled empty' height={400}>
        <Row gutter={16}>
          <Row direction='column' gutter={8}>
            <InputComponent
              placeholder='Placeholder'
              tooltip='Подсказка'
              label='Label'
              size='S'
              disabled
            />
            <InputComponent
              placeholder='Placeholder'
              tooltip='Подсказка'
              label='Label'
              size='M'
              disabled
            />
            <InputComponent
              placeholder='Placeholder'
              tooltip='Подсказка'
              label='Label'
              size='L'
              disabled
              required
            />
            <InputComponent
              placeholder='Placeholder'
              tooltip='Подсказка'
              label='Label'
              size='XL'
              disabled
              required
            />
          </Row>
        </Row>
      </Item>
      <Item label='Error empty' height={400}>
        <Row gutter={16}>
          <Row direction='column' gutter={8}>
            <InputComponent
              placeholder='Placeholder'
              tooltip='Подсказка'
              label='Label'
              size='S'
              error
            />
            <InputComponent
              placeholder='Placeholder'
              tooltip='Подсказка'
              label='Label'
              size='M'
              error
            />
            <InputComponent
              placeholder='Placeholder'
              tooltip='Подсказка'
              label='Label'
              size='L'
              error
              required
            />
            <InputComponent
              placeholder='Placeholder'
              tooltip='Подсказка'
              label='Label'
              size='XL'
              error
              required
            />
          </Row>
        </Row>
      </Item>
      <Item label='Error empty with icon' height={400}>
        <Row gutter={16}>
          <Row direction='column' gutter={8}>
            <InputComponent
              placeholder='Placeholder'
              icon='errorRounded'
              tooltip='Подсказка'
              label='Label'
              size='S'
              error
            />
            <InputComponent
              placeholder='Placeholder'
              icon='errorRounded'
              tooltip='Подсказка'
              label='Label'
              size='M'
              error
            />
            <InputComponent
              placeholder='Placeholder'
              icon='errorRounded'
              tooltip='Подсказка'
              label='Label'
              size='L'
              error
              required
            />
            <InputComponent
              placeholder='Placeholder'
              icon='errorRounded'
              tooltip='Подсказка'
              label='Label'
              size='XL'
              error
              required
            />
          </Row>
        </Row>
      </Item>
      <Item label='ViewOnly empty with icon'>
        <InputComponent
          placeholder='Placeholder'
          icon='errorRounded'
          tooltip='Подсказка'
          label='Label'
          size='M'
          error
          viewOnly
        />
      </Item>
      <Item label='ViewOnly filled with icon'>
        <InputComponent
          value='Value'
          icon='errorRounded'
          tooltip='Подсказка'
          label='Label'
          size='S'
          error
          viewOnly
        />
      </Item>
    </Container>
  </>
);
