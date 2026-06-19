import { Meta, StoryFn } from '@storybook/react';
import { useState } from 'react';
import { EIconName, InputNumber as InputNumberComponent, Row } from '..';
import { Container, DemoContainer, Item } from './utils';

const meta: Meta<typeof InputNumberComponent> = {
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
  },
  parameters: {
    controls: {
      expanded: true,
    },
  },
  component: InputNumberComponent,
  title: 'components/InputNumber',
};

export default meta;
export const InputNumber: StoryFn<typeof InputNumberComponent> = (
  arguments_,
) => {
  const [val, setVal] = useState<null | number>(123);
  return (
    <>
      <DemoContainer>
        <Item label='Customizable' height={100}>
          <InputNumberComponent {...arguments_} />
        </Item>
      </DemoContainer>
      <Container>
        <Item label='Basic empty labelInside' height={300}>
          <Row gutter={16}>
            <Row direction='column' gutter={8}>
              <InputNumberComponent
                tooltip='Подсказка'
                label='Label'
                size='S'
                labelInside
                helperText='Helper text'
                value={val}
                onChange={setVal}
              />
              <InputNumberComponent
                tooltip='Подсказка'
                label='Label'
                size='M'
                labelInside
                helperText='Helper text'
                value={val}
                onChange={setVal}
              />
              <InputNumberComponent
                tooltip='Подсказка'
                label='Label'
                size='L'
                labelInside
                required
                value={val}
                onChange={setVal}
              />
              <InputNumberComponent
                tooltip='Подсказка'
                label='Label'
                size='XL'
                labelInside
                required
                value={val}
                onChange={setVal}
              />
            </Row>
          </Row>
        </Item>
        <Item label='Basic empty labelInside withIcon' height={300}>
          <Row gutter={16}>
            <Row direction='column' gutter={8}>
              <InputNumberComponent
                icon='errorRounded'
                tooltip='Подсказка'
                label='Label'
                size='S'
                labelInside
              />
              <InputNumberComponent
                icon='errorRounded'
                tooltip='Подсказка'
                label='Label'
                size='M'
                labelInside
              />
              <InputNumberComponent
                icon='errorRounded'
                tooltip='Подсказка'
                label='Label'
                size='L'
                labelInside
                required
              />
              <InputNumberComponent
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
              <InputNumberComponent
                tooltip='Подсказка'
                label='Label'
                size='S'
                labelInside
                disabled
              />
              <InputNumberComponent
                tooltip='Подсказка'
                label='Label'
                size='M'
                labelInside
                disabled
              />
              <InputNumberComponent
                tooltip='Подсказка'
                label='Label'
                size='L'
                labelInside
                disabled
                required
              />
              <InputNumberComponent
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
              <InputNumberComponent
                tooltip='Подсказка'
                label='Label'
                size='S'
                labelInside
                error
              />
              <InputNumberComponent
                tooltip='Подсказка'
                label='Label'
                size='M'
                labelInside
                error
              />
              <InputNumberComponent
                tooltip='Подсказка'
                label='Label'
                size='L'
                labelInside
                error
                required
              />
              <InputNumberComponent
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
              <InputNumberComponent
                icon='errorRounded'
                tooltip='Подсказка'
                label='Label'
                size='S'
                labelInside
                error
              />
              <InputNumberComponent
                icon='errorRounded'
                tooltip='Подсказка'
                label='Label'
                size='M'
                labelInside
                error
              />
              <InputNumberComponent
                icon='errorRounded'
                tooltip='Подсказка'
                label='Label'
                size='L'
                labelInside
                error
                required
              />
              <InputNumberComponent
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
              <InputNumberComponent
                tooltip='Подсказка'
                value={12345}
                label='Label'
                size='S'
                labelInside
              />
              <InputNumberComponent
                tooltip='Подсказка'
                value={12345}
                label='Label'
                size='M'
                labelInside
              />
              <InputNumberComponent
                tooltip='Подсказка'
                value={12345}
                label='Label'
                size='L'
                labelInside
                required
              />
              <InputNumberComponent
                tooltip='Подсказка'
                value={12345}
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
              <InputNumberComponent
                icon='errorRounded'
                tooltip='Подсказка'
                value={12345}
                label='Label'
                size='S'
                labelInside
              />
              <InputNumberComponent
                icon='errorRounded'
                tooltip='Подсказка'
                value={12345}
                label='Label'
                size='M'
                labelInside
              />
              <InputNumberComponent
                icon='errorRounded'
                tooltip='Подсказка'
                value={12345}
                label='Label'
                size='L'
                labelInside
                required
              />
              <InputNumberComponent
                icon='errorRounded'
                tooltip='Подсказка'
                value={12345}
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
              <InputNumberComponent
                icon='errorRounded'
                tooltip='Подсказка'
                value={12345}
                label='Label'
                size='S'
                labelInside
                disabled
                required
              />
              <InputNumberComponent
                icon='errorRounded'
                tooltip='Подсказка'
                value={12345}
                label='Label'
                size='M'
                labelInside
                disabled
                required
              />
              <InputNumberComponent
                icon='errorRounded'
                tooltip='Подсказка'
                value={12345}
                label='Label'
                size='L'
                labelInside
                disabled
                required
              />
              <InputNumberComponent
                icon='errorRounded'
                tooltip='Подсказка'
                value={12345}
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
              <InputNumberComponent
                icon='errorRounded'
                tooltip='Подсказка'
                value={12345}
                label='Label'
                size='S'
                labelInside
                error
              />
              <InputNumberComponent
                icon='errorRounded'
                tooltip='Подсказка'
                value={12345}
                label='Label'
                size='M'
                labelInside
                error
              />
              <InputNumberComponent
                icon='errorRounded'
                tooltip='Подсказка'
                value={12345}
                label='Label'
                size='L'
                labelInside
                error
                required
              />
              <InputNumberComponent
                icon='errorRounded'
                tooltip='Подсказка'
                value={12345}
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
              <InputNumberComponent
                placeholder='Placeholder'
                tooltip='Подсказка'
                label='Label'
                size='S'
              />
              <InputNumberComponent
                placeholder='Placeholder'
                tooltip='Подсказка'
                label='Label'
                size='M'
              />
              <InputNumberComponent
                placeholder='Placeholder'
                tooltip='Подсказка'
                label='Label'
                size='L'
                required
              />
              <InputNumberComponent
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
              <InputNumberComponent
                placeholder='Placeholder'
                icon='errorRounded'
                tooltip='Подсказка'
                label='Label'
                size='S'
              />
              <InputNumberComponent
                placeholder='Placeholder'
                icon='errorRounded'
                tooltip='Подсказка'
                label='Label'
                size='M'
              />
              <InputNumberComponent
                placeholder='Placeholder'
                icon='errorRounded'
                tooltip='Подсказка'
                label='Label'
                size='L'
                required
              />
              <InputNumberComponent
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
              <InputNumberComponent
                placeholder='Placeholder'
                tooltip='Подсказка'
                label='Label'
                size='S'
                disabled
              />
              <InputNumberComponent
                placeholder='Placeholder'
                tooltip='Подсказка'
                label='Label'
                size='M'
                disabled
              />
              <InputNumberComponent
                placeholder='Placeholder'
                tooltip='Подсказка'
                label='Label'
                size='L'
                disabled
                required
              />
              <InputNumberComponent
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
              <InputNumberComponent
                placeholder='Placeholder'
                tooltip='Подсказка'
                label='Label'
                size='S'
                error
              />
              <InputNumberComponent
                placeholder='Placeholder'
                tooltip='Подсказка'
                label='Label'
                size='M'
                error
              />
              <InputNumberComponent
                placeholder='Placeholder'
                tooltip='Подсказка'
                label='Label'
                size='L'
                error
                required
              />
              <InputNumberComponent
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
              <InputNumberComponent
                placeholder='Placeholder'
                icon='errorRounded'
                tooltip='Подсказка'
                label='Label'
                size='S'
                error
              />
              <InputNumberComponent
                placeholder='Placeholder'
                icon='errorRounded'
                tooltip='Подсказка'
                label='Label'
                size='M'
                error
              />
              <InputNumberComponent
                placeholder='Placeholder'
                icon='errorRounded'
                tooltip='Подсказка'
                label='Label'
                size='L'
                error
                required
              />
              <InputNumberComponent
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
          <InputNumberComponent
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
          <InputNumberComponent
            value={12345}
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
};
