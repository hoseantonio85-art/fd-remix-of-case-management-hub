import { Meta, StoryFn } from '@storybook/react';

import { EIconName, InputMask as InputMaskComponent, Row } from '..';
import { Container, DemoContainer, Item } from './utils';

const meta: Meta<typeof InputMaskComponent> = {
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
    maskOptions: {
      description:
        'Параметры маски [`IMask FactoryOpts`](https://imask.js.org/api/functions/react_imask.useIMask.html#useIMask.MaskElement) ',
    },
  },
  args: {
    disabled: false,
    required: false,
    tooltip: 'Подсказка',
    placeholder: '+7 000 000-00-00',
    size: 'S',
    label: 'Label',
    labelInside: false,
    error: false,
    helperText: 'Helper text goes here',
    maskOptions: { mask: '+7 000 000-00-00' },
  },
  parameters: {
    controls: {
      expanded: true,
    },
  },
  component: InputMaskComponent,
  title: 'components/InputMasked',
};

export default meta;
export const InputMasked: StoryFn<typeof InputMaskComponent> = (arguments_) => (
  <>
    <DemoContainer>
      <Item label='Customizable' height={100}>
        <InputMaskComponent {...arguments_} />
      </Item>
    </DemoContainer>
    <Container>
      <Item label='Basic empty labelInside' height={300}>
        <Row gutter={16}>
          <Row direction='column' gutter={8}>
            <InputMaskComponent
              maskOptions={{ mask: '+7 000 000-00-00', lazy: false }}
              tooltip='Подсказка'
              placeholder='+7 000 000-00-00'
              label='Label'
              size='S'
              labelInside
              helperText='Helper text'
              onChange={console.log}
              clearIncomplete
            />
            <InputMaskComponent
              maskOptions={{ mask: '+7 000 000-00-00' }}
              placeholder='+7 000 000-00-00'
              tooltip='Подсказка'
              label='Label'
              size='M'
              labelInside
              helperText='Helper text'
              onChange={console.log}
            />
            <InputMaskComponent
              maskOptions={{ mask: '+7 000 000-00-00' }}
              placeholder='+7 000 000-00-00'
              tooltip='Подсказка'
              label='Label'
              size='L'
              labelInside
              required
            />
            <InputMaskComponent
              maskOptions={{ mask: '+7 000 000-00-00' }}
              placeholder='+7 000 000-00-00'
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
            <InputMaskComponent
              maskOptions={{ mask: '+7 000 000-00-00' }}
              placeholder='+7 000 000-00-00'
              icon='errorRounded'
              tooltip='Подсказка'
              label='Label'
              size='S'
              labelInside
            />
            <InputMaskComponent
              maskOptions={{ mask: '+7 000 000-00-00' }}
              placeholder='+7 000 000-00-00'
              icon='errorRounded'
              tooltip='Подсказка'
              label='Label'
              size='M'
              labelInside
            />
            <InputMaskComponent
              maskOptions={{ mask: '+7 000 000-00-00' }}
              placeholder='+7 000 000-00-00'
              icon='errorRounded'
              tooltip='Подсказка'
              label='Label'
              size='L'
              labelInside
              required
            />
            <InputMaskComponent
              maskOptions={{ mask: '+7 000 000-00-00' }}
              placeholder='+7 000 000-00-00'
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
            <InputMaskComponent
              maskOptions={{ mask: '+7 000 000-00-00' }}
              placeholder='+7 000 000-00-00'
              tooltip='Подсказка'
              label='Label'
              size='S'
              labelInside
              disabled
            />
            <InputMaskComponent
              maskOptions={{ mask: '+7 000 000-00-00' }}
              placeholder='+7 000 000-00-00'
              tooltip='Подсказка'
              label='Label'
              size='M'
              labelInside
              disabled
            />
            <InputMaskComponent
              maskOptions={{ mask: '+7 000 000-00-00' }}
              placeholder='+7 000 000-00-00'
              tooltip='Подсказка'
              label='Label'
              size='L'
              labelInside
              disabled
              required
            />
            <InputMaskComponent
              maskOptions={{ mask: '+7 000 000-00-00' }}
              placeholder='+7 000 000-00-00'
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
            <InputMaskComponent
              maskOptions={{ mask: '+7 000 000-00-00' }}
              placeholder='+7 000 000-00-00'
              tooltip='Подсказка'
              label='Label'
              size='S'
              labelInside
              error
            />
            <InputMaskComponent
              maskOptions={{ mask: '+7 000 000-00-00' }}
              placeholder='+7 000 000-00-00'
              tooltip='Подсказка'
              label='Label'
              size='M'
              labelInside
              error
            />
            <InputMaskComponent
              maskOptions={{ mask: '+7 000 000-00-00' }}
              placeholder='+7 000 000-00-00'
              tooltip='Подсказка'
              label='Label'
              size='L'
              labelInside
              error
              required
            />
            <InputMaskComponent
              maskOptions={{ mask: '+7 000 000-00-00' }}
              placeholder='+7 000 000-00-00'
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
            <InputMaskComponent
              maskOptions={{ mask: '+7 000 000-00-00' }}
              placeholder='+7 000 000-00-00'
              icon='errorRounded'
              tooltip='Подсказка'
              label='Label'
              size='S'
              labelInside
              error
            />
            <InputMaskComponent
              maskOptions={{ mask: '+7 000 000-00-00' }}
              placeholder='+7 000 000-00-00'
              icon='errorRounded'
              tooltip='Подсказка'
              label='Label'
              size='M'
              labelInside
              error
            />
            <InputMaskComponent
              maskOptions={{ mask: '+7 000 000-00-00' }}
              placeholder='+7 000 000-00-00'
              icon='errorRounded'
              tooltip='Подсказка'
              label='Label'
              size='L'
              labelInside
              error
              required
            />
            <InputMaskComponent
              maskOptions={{ mask: '+7 000 000-00-00' }}
              placeholder='+7 000 000-00-00'
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
            <InputMaskComponent
              maskOptions={{ mask: '+7 000 000-00-00' }}
              tooltip='Подсказка'
              value='123'
              label='Label'
              size='S'
              labelInside
            />
            <InputMaskComponent
              maskOptions={{ mask: '+7 000 000-00-00' }}
              tooltip='Подсказка'
              value='123'
              label='Label'
              size='M'
              labelInside
            />
            <InputMaskComponent
              maskOptions={{ mask: '+7 000 000-00-00' }}
              tooltip='Подсказка'
              value='123'
              label='Label'
              size='L'
              labelInside
              required
            />
            <InputMaskComponent
              maskOptions={{ mask: '+7 000 000-00-00' }}
              tooltip='Подсказка'
              value='123'
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
            <InputMaskComponent
              maskOptions={{ mask: '+7 000 000-00-00' }}
              icon='errorRounded'
              tooltip='Подсказка'
              value='123'
              label='Label'
              size='S'
              labelInside
            />
            <InputMaskComponent
              maskOptions={{ mask: '+7 000 000-00-00' }}
              icon='errorRounded'
              tooltip='Подсказка'
              value='123'
              label='Label'
              size='M'
              labelInside
            />
            <InputMaskComponent
              maskOptions={{ mask: '+7 000 000-00-00' }}
              icon='errorRounded'
              tooltip='Подсказка'
              value='123'
              label='Label'
              size='L'
              labelInside
              required
            />
            <InputMaskComponent
              maskOptions={{ mask: '+7 000 000-00-00' }}
              icon='errorRounded'
              tooltip='Подсказка'
              value='123'
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
            <InputMaskComponent
              maskOptions={{ mask: '+7 000 000-00-00' }}
              icon='errorRounded'
              tooltip='Подсказка'
              value='123'
              label='Label'
              size='S'
              labelInside
              disabled
              required
            />
            <InputMaskComponent
              maskOptions={{ mask: '+7 000 000-00-00' }}
              icon='errorRounded'
              tooltip='Подсказка'
              value='123'
              label='Label'
              size='M'
              labelInside
              disabled
              required
            />
            <InputMaskComponent
              maskOptions={{ mask: '+7 000 000-00-00' }}
              icon='errorRounded'
              tooltip='Подсказка'
              value='123'
              label='Label'
              size='L'
              labelInside
              disabled
              required
            />
            <InputMaskComponent
              maskOptions={{ mask: '+7 000 000-00-00' }}
              icon='errorRounded'
              tooltip='Подсказка'
              value='123'
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
            <InputMaskComponent
              maskOptions={{ mask: '+7 000 000-00-00' }}
              icon='errorRounded'
              tooltip='Подсказка'
              value='123'
              label='Label'
              size='S'
              labelInside
              error
            />
            <InputMaskComponent
              maskOptions={{ mask: '+7 000 000-00-00' }}
              icon='errorRounded'
              tooltip='Подсказка'
              value='123'
              label='Label'
              size='M'
              labelInside
              error
            />
            <InputMaskComponent
              maskOptions={{ mask: '+7 000 000-00-00' }}
              icon='errorRounded'
              tooltip='Подсказка'
              value='123'
              label='Label'
              size='L'
              labelInside
              error
              required
            />
            <InputMaskComponent
              maskOptions={{ mask: '+7 000 000-00-00' }}
              icon='errorRounded'
              tooltip='Подсказка'
              value='123'
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
            <InputMaskComponent
              maskOptions={{ mask: '+7 000 000-00-00' }}
              placeholder='Placeholder'
              tooltip='Подсказка'
              label='Label'
              size='S'
            />
            <InputMaskComponent
              maskOptions={{ mask: '+7 000 000-00-00' }}
              placeholder='Placeholder'
              tooltip='Подсказка'
              label='Label'
              size='M'
            />
            <InputMaskComponent
              maskOptions={{ mask: '+7 000 000-00-00' }}
              placeholder='Placeholder'
              tooltip='Подсказка'
              label='Label'
              size='L'
              required
            />
            <InputMaskComponent
              maskOptions={{ mask: '+7 000 000-00-00' }}
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
            <InputMaskComponent
              maskOptions={{ mask: '+7 000 000-00-00' }}
              placeholder='Placeholder'
              icon='errorRounded'
              tooltip='Подсказка'
              label='Label'
              size='S'
            />
            <InputMaskComponent
              maskOptions={{ mask: '+7 000 000-00-00' }}
              placeholder='Placeholder'
              icon='errorRounded'
              tooltip='Подсказка'
              label='Label'
              size='M'
            />
            <InputMaskComponent
              maskOptions={{ mask: '+7 000 000-00-00' }}
              placeholder='Placeholder'
              icon='errorRounded'
              tooltip='Подсказка'
              label='Label'
              size='L'
              required
            />
            <InputMaskComponent
              maskOptions={{ mask: '+7 000 000-00-00' }}
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
            <InputMaskComponent
              maskOptions={{ mask: '+7 000 000-00-00' }}
              placeholder='Placeholder'
              tooltip='Подсказка'
              label='Label'
              size='S'
              disabled
            />
            <InputMaskComponent
              maskOptions={{ mask: '+7 000 000-00-00' }}
              placeholder='Placeholder'
              tooltip='Подсказка'
              label='Label'
              size='M'
              disabled
            />
            <InputMaskComponent
              maskOptions={{ mask: '+7 000 000-00-00' }}
              placeholder='Placeholder'
              tooltip='Подсказка'
              label='Label'
              size='L'
              disabled
              required
            />
            <InputMaskComponent
              maskOptions={{ mask: '+7 000 000-00-00' }}
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
            <InputMaskComponent
              maskOptions={{ mask: '+7 000 000-00-00' }}
              placeholder='Placeholder'
              tooltip='Подсказка'
              label='Label'
              size='S'
              error
            />
            <InputMaskComponent
              maskOptions={{ mask: '+7 000 000-00-00' }}
              placeholder='Placeholder'
              tooltip='Подсказка'
              label='Label'
              size='M'
              error
            />
            <InputMaskComponent
              maskOptions={{ mask: '+7 000 000-00-00' }}
              placeholder='Placeholder'
              tooltip='Подсказка'
              label='Label'
              size='L'
              error
              required
            />
            <InputMaskComponent
              maskOptions={{ mask: '+7 000 000-00-00' }}
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
            <InputMaskComponent
              maskOptions={{ mask: '+7 000 000-00-00' }}
              placeholder='Placeholder'
              icon='errorRounded'
              tooltip='Подсказка'
              label='Label'
              size='S'
              error
            />
            <InputMaskComponent
              maskOptions={{ mask: '+7 000 000-00-00' }}
              placeholder='Placeholder'
              icon='errorRounded'
              tooltip='Подсказка'
              label='Label'
              size='M'
              error
            />
            <InputMaskComponent
              maskOptions={{ mask: '+7 000 000-00-00' }}
              placeholder='Placeholder'
              icon='errorRounded'
              tooltip='Подсказка'
              label='Label'
              size='L'
              error
              required
            />
            <InputMaskComponent
              maskOptions={{ mask: '+7 000 000-00-00' }}
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
        <InputMaskComponent
          maskOptions={{ mask: '+7 000 000-00-00' }}
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
        <InputMaskComponent
          maskOptions={{ mask: '+7 000 000-00-00' }}
          value='123'
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
