import React, { useState } from 'react';

import { Meta, StoryFn } from '@storybook/react';
import { Options } from '@v-uik/combo-box';

import { ComboBox as ComboBoxComponent, EIconName } from '..';
import { Row } from '..';
import { DemoContainer, Container, Item } from './utils';

const treeSearchOptions = [
  {
    key: 'test3',
    value: 'test3',
    label:
      'ПАО Сбербанк | ПАО Сбербанк (ЦА) | Блок "Управление благосостоянием" | Руководство блока "Управление благосостоянием"',
  },
  {
    key: 'test4',
    value: 'test4',
    label:
      'ПАО Сбербанк | ПАО Сбербанк (ЦА) | Блок "Управление благосостоянием" | Штаб блока "Управление благосостоянием"',
  },
];
const defaultOptions = [
  {
    key: 'test',
    value: 'test',
    label: 'ПАО Сбербанк',
    checked: true,
    selectDisabled: true,
    children: [
      {
        key: 'test1',
        value: 'test1',
        label: 'ПАО Сбербанк (ЦА)',
        selectDisabled: true,
        children: [
          {
            key: 'test2',
            value: 'test2',
            label: 'Блок "Управление благосостоянием"',
            selectDisabled: false,
            children: [
              {
                key: 'test3',
                value: 'test3',
                label: 'Руководство блока "Управление благосостоянием"',
                selectDisabled: false,
              },
              {
                key: 'test4',
                value: 'test4',
                label: 'Штаб блока "Управление благосостоянием"',
                selectDisabled: false,
              },
            ],
          },
        ],
      },
    ],
  },
  {
    children: [
      {
        children: [{ key: '3', label: 'dolor', value: '3' }],
        key: '2',
        label: 'ipsum',
        value: '2',
      },
    ],
    key: '1',
    label: 'Lorem',
    value: '1',
  },
  { key: '4', label: 'Lorem ipsum sit amet consectetur', value: '4' },
  { key: '5', label: 'amet', value: '5' },
  { key: '6', label: 'consectetur', value: '6' },
];

const meta: Meta<typeof ComboBoxComponent> = {
  argTypes: {
    size: {
      description: 'Размер компонента: `TComponentSizes`',
      control: 'select',
      options: ['S', 'M', 'L', 'XL'],
    },
    icon: {
      description: 'Иконка в начале поля `EIconName`',
      control: 'select',
      options: Object.values(EIconName),
    },
    label: {
      description: 'Заголовок поля',
    },
    placeholder: {
      description: 'Плейсхолдер поля',
    },
    labelInside: {
      control: 'boolean',
      description: 'Отображать лейбл внутри поля',
    },
    tree: {
      control: 'boolean',
      description: 'Отображать дерево в выпадающем списке',
    },
    canClear: {
      control: 'boolean',
      description: 'Позволять ли очищать значение',
    },
    options: {
      description: 'Набор опций компонента: `Options<unknown>`',
    },
    showOptionValue: {
      control: 'boolean',
      description: 'Отображать ли значения опций',
    },
    noOptionsText: {
      description: 'Текст в случае если не найдено опций',
    },
    helperText: {
      description: 'Заметка с помощью',
    },
    tooltip: {
      description: 'Текст во всплывающей подсказке',
    },
    hideChevron: {
      control: 'boolean',
      description: 'Скрывать ли стрелку выпадающего списка',
    },
    loading: {
      control: 'boolean',
      description: 'Индикатор загрузки',
    },
    showValueTooltip: {
      control: 'boolean',
      description: 'Отображать ли тултип для длинных значений',
    },
    loadingLabel: {
      description: 'Текст в дропдауне при загрузке ()',
    },
    onListSubmit: {
      description:
        'Обработчик клика на сабмит в выпадающем списке `(value: Options<unknown>) => void`',
      type: 'function',
    },
    onChange: {
      description:
        'Обработчик смены значения `(_key: React.Key, _event: unknown, nodes: unknown) => void`',
      type: 'function',
    },
    multiple: {
      control: 'boolean',
      description: 'Позволить множественный выбор',
    },
    useCustomSearch: {
      control: 'boolean',
      description: 'Использовать кастомный поиск элементов',
    },
    useChips: {
      control: 'boolean',
      description:
        'Отображать выбранные значения как чипсы (Множественный выбор)',
    },
  },
  args: {
    options: defaultOptions,
    size: 'S',
    label: 'Label',
    labelInside: true,
    canClear: true,
    showOptionValue: false,
    tree: false,
    placeholder: 'Выберите значение',
    noOptionsText: 'Поищи получше',
    helperText: 'Вспомогательный текст',
    tooltip: 'Example',
    hideChevron: false,
    loading: false,
    showValueTooltip: true,
    loadingLabel: 'Загружаем данные...',
    multiple: false,
    useCustomSearch: false,
    useChips: false,
  },
  parameters: {
    controls: {
      expanded: true,
    },
  },
  component: ComboBoxComponent,
  title: 'components/ComboBox',
};

export default meta;

export const ComboBox: StoryFn<typeof ComboBoxComponent> = ({
  options,
  ...arguments_
}) => {
  const [value, setValue] = useState<unknown>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [localOptions, setLocalOptions] = useState(options as Options<unknown>);

  const onChange = (_key: React.Key, _event: unknown, nodes: unknown) => {
    setValue(nodes);
  };

  // custom tree api search example
  const onInputChange = (value: string) => {
    if (!value) {
      setLocalOptions(options as Options<unknown>);
      return;
    }

    setLoading(true);

    // request
    setTimeout(() => {
      setLocalOptions(treeSearchOptions);
      setLoading(false);
    }, 500);
  };

  const onChipRemove = (removedValue: string) => {
    setValue([
      ...(value as Options<unknown>)?.filter?.(
        (currentItem: any) => currentItem.value !== removedValue,
      ),
    ]);
  };

  return (
    <>
      <DemoContainer>
        <Item label='Customizable' width={500}>
          <ComboBoxComponent
            {...arguments_}
            value={value}
            options={localOptions}
            loading={loading}
            onInputChange={
              arguments_.useCustomSearch ? onInputChange : undefined
            }
            onChange={onChange}
            onChipRemove={
              arguments_.multiple && arguments_.useChips
                ? onChipRemove
                : undefined
            }
          />
        </Item>
      </DemoContainer>
      <Container>
        <Item label='labelInside tooltip canClear helper optionRenderLimit'>
          <Row gutter={16}>
            <Row direction='column' gutter={16}>
              <ComboBoxComponent
                openOnFocus
                value={value}
                label='Label'
                tooltip='Подсказка'
                helperText='Helper text goes here'
                options={defaultOptions}
                onChange={onChange}
                size='S'
                optionRenderLimit={3}
                labelInside
                canClear
                showOptionValue
              />
              <ComboBoxComponent
                openOnFocus
                value={value}
                label='Label'
                tooltip='Подсказка'
                helperText='Helper text goes here'
                options={defaultOptions}
                onChange={onChange}
                size='M'
                optionRenderLimit={3}
                labelInside
                canClear
              />
              <ComboBoxComponent
                openOnFocus
                value={value}
                label='Label'
                tooltip='Подсказка'
                helperText='Helper text goes here'
                options={defaultOptions}
                onChange={onChange}
                size='L'
                optionRenderLimit={3}
                labelInside
                canClear
              />
              <ComboBoxComponent
                openOnFocus
                value={value}
                label='Label'
                tooltip='Подсказка'
                helperText='Helper text goes here'
                options={defaultOptions}
                onChange={onChange}
                size='XL'
                optionRenderLimit={3}
                labelInside
                canClear
              />
            </Row>
          </Row>
        </Item>
        <Item label='labelInside tooltip canClear required helper'>
          <Row gutter={16}>
            <Row direction='column' gutter={16}>
              <ComboBoxComponent
                openOnFocus
                value={value}
                label='Label'
                tooltip='Подсказка'
                helperText='Helper text goes here'
                options={defaultOptions}
                onChange={onChange}
                size='S'
                required
                labelInside
                canClear
              />
              <ComboBoxComponent
                openOnFocus
                value={value}
                label='Label'
                tooltip='Подсказка'
                helperText='Helper text goes here'
                options={defaultOptions}
                onChange={onChange}
                size='M'
                required
                labelInside
                canClear
              />
              <ComboBoxComponent
                openOnFocus
                value={value}
                label='Label'
                tooltip='Подсказка'
                helperText='Helper text goes here'
                options={defaultOptions}
                onChange={onChange}
                size='L'
                required
                labelInside
                canClear
              />
              <ComboBoxComponent
                openOnFocus
                value={value}
                label='Label'
                tooltip='Подсказка'
                helperText='Helper text goes here'
                options={defaultOptions}
                onChange={onChange}
                size='XL'
                required
                labelInside
                canClear
              />
            </Row>
          </Row>
        </Item>
        <Item label='labelInside tooltip canClear loading'>
          <Row gutter={16}>
            <Row direction='column' gutter={16}>
              <ComboBoxComponent
                openOnFocus
                value={value}
                label='Label'
                tooltip='Подсказка'
                options={defaultOptions}
                onChange={onChange}
                size='S'
                labelInside
                canClear
                loading
              />
              <ComboBoxComponent
                openOnFocus
                value={value}
                label='Label'
                tooltip='Подсказка'
                options={defaultOptions}
                onChange={onChange}
                size='M'
                labelInside
                canClear
                loading
              />
              <ComboBoxComponent
                openOnFocus
                value={value}
                label='Label'
                tooltip='Подсказка'
                options={defaultOptions}
                onChange={onChange}
                size='L'
                labelInside
                canClear
                loading
              />
              <ComboBoxComponent
                openOnFocus
                value={value}
                label='Label'
                tooltip='Подсказка'
                options={defaultOptions}
                onChange={onChange}
                size='XL'
                labelInside
                canClear
                loading
              />
            </Row>
          </Row>
        </Item>
        <Item label='labelInside tooltip error empty'>
          <Row gutter={16}>
            <Row direction='column' gutter={16}>
              <ComboBoxComponent
                openOnFocus
                value={null}
                label='Label'
                tooltip='Подсказка'
                options={defaultOptions}
                size='S'
                labelInside
                canClear
                error
              />
              <ComboBoxComponent
                openOnFocus
                value={null}
                label='Label'
                tooltip='Подсказка'
                options={defaultOptions}
                size='M'
                labelInside
                canClear
                error
              />
              <ComboBoxComponent
                openOnFocus
                value={null}
                label='Label'
                tooltip='Подсказка'
                options={defaultOptions}
                size='L'
                labelInside
                canClear
                error
              />
              <ComboBoxComponent
                openOnFocus
                value={null}
                label='Label'
                tooltip='Подсказка'
                options={defaultOptions}
                size='XL'
                labelInside
                canClear
                error
              />
            </Row>
          </Row>
        </Item>
        <Item label='labelInside tooltip error filled'>
          <Row gutter={16}>
            <Row direction='column' gutter={16}>
              <ComboBoxComponent
                openOnFocus
                value={value ?? options?.[0]}
                label='Label'
                tooltip='Подсказка'
                options={defaultOptions}
                onChange={onChange}
                size='S'
                labelInside
                error
              />
              <ComboBoxComponent
                openOnFocus
                value={value ?? options?.[0]}
                label='Label'
                tooltip='Подсказка'
                options={defaultOptions}
                onChange={onChange}
                size='M'
                labelInside
                error
              />
              <ComboBoxComponent
                openOnFocus
                value={value ?? options?.[0]}
                label='Label'
                tooltip='Подсказка'
                options={defaultOptions}
                onChange={onChange}
                size='L'
                labelInside
                error
              />
              <ComboBoxComponent
                openOnFocus
                value={value ?? options?.[0]}
                label='Label'
                tooltip='Подсказка'
                options={defaultOptions}
                onChange={onChange}
                size='XL'
                labelInside
                error
              />
            </Row>
          </Row>
        </Item>
        <Item label='labelInside tooltip disabled filled'>
          <Row gutter={16}>
            <Row direction='column' gutter={16}>
              <ComboBoxComponent
                openOnFocus
                value={value ?? options?.[0]}
                label='Label'
                tooltip='Подсказка'
                options={defaultOptions}
                onChange={onChange}
                size='S'
                labelInside
                disabled
              />
              <ComboBoxComponent
                openOnFocus
                value={value ?? options?.[0]}
                label='Label'
                tooltip='Подсказка'
                options={defaultOptions}
                onChange={onChange}
                size='M'
                labelInside
                disabled
              />
              <ComboBoxComponent
                openOnFocus
                value={value ?? options?.[0]}
                label='Label'
                tooltip='Подсказка'
                options={defaultOptions}
                onChange={onChange}
                size='L'
                labelInside
                disabled
              />
              <ComboBoxComponent
                openOnFocus
                value={value ?? options?.[0]}
                label='Label'
                tooltip='Подсказка'
                options={defaultOptions}
                onChange={onChange}
                size='XL'
                labelInside
                disabled
              />
            </Row>
          </Row>
        </Item>
        <Item label='labelInside tooltip disabled empty'>
          <Row gutter={16}>
            <Row direction='column' gutter={16}>
              <ComboBoxComponent
                openOnFocus
                value={null}
                label='Label'
                tooltip='Подсказка'
                options={defaultOptions}
                size='S'
                labelInside
                disabled
              />
              <ComboBoxComponent
                openOnFocus
                value={null}
                label='Label'
                tooltip='Подсказка'
                options={defaultOptions}
                size='M'
                labelInside
                disabled
              />
              <ComboBoxComponent
                openOnFocus
                value={null}
                label='Label'
                tooltip='Подсказка'
                options={defaultOptions}
                size='L'
                labelInside
                disabled
              />
              <ComboBoxComponent
                openOnFocus
                value={null}
                label='Label'
                tooltip='Подсказка'
                options={defaultOptions}
                size='XL'
                labelInside
                disabled
              />
            </Row>
          </Row>
        </Item>
        <Item label='withPrefix labelInside tooltip canClear'>
          <Row gutter={16}>
            <Row direction='column' gutter={16}>
              <ComboBoxComponent
                openOnFocus
                value={value}
                label='Label'
                tooltip='Подсказка'
                options={defaultOptions}
                onChange={onChange}
                size='S'
                icon='orm'
                labelInside
                canClear
              />
              <ComboBoxComponent
                openOnFocus
                value={value}
                label='Label'
                tooltip='Подсказка'
                options={defaultOptions}
                onChange={onChange}
                size='M'
                icon='orm'
                labelInside
                canClear
              />
              <ComboBoxComponent
                openOnFocus
                value={value}
                label='Label'
                tooltip='Подсказка'
                options={defaultOptions}
                onChange={onChange}
                size='L'
                icon='orm'
                labelInside
                canClear
              />
              <ComboBoxComponent
                openOnFocus
                value={value}
                label='Label'
                tooltip='Подсказка'
                options={defaultOptions}
                onChange={onChange}
                size='XL'
                icon='orm'
                labelInside
                canClear
              />
            </Row>
          </Row>
        </Item>
        <Item label='withPrefix labelInside tooltip canClear required'>
          <Row gutter={16}>
            <Row direction='column' gutter={16}>
              <ComboBoxComponent
                openOnFocus
                value={value}
                label='Label'
                tooltip='Подсказка'
                options={defaultOptions}
                onChange={onChange}
                size='S'
                icon='orm'
                required
                labelInside
                canClear
              />
              <ComboBoxComponent
                openOnFocus
                value={value}
                label='Label'
                tooltip='Подсказка'
                options={defaultOptions}
                onChange={onChange}
                size='M'
                icon='orm'
                required
                labelInside
                canClear
              />
              <ComboBoxComponent
                openOnFocus
                value={value}
                label='Label'
                tooltip='Подсказка'
                options={defaultOptions}
                onChange={onChange}
                size='L'
                icon='orm'
                required
                labelInside
                canClear
              />
              <ComboBoxComponent
                openOnFocus
                value={value}
                label='Label'
                tooltip='Подсказка'
                options={defaultOptions}
                onChange={onChange}
                size='XL'
                icon='orm'
                required
                labelInside
                canClear
              />
            </Row>
          </Row>
        </Item>
        <Item label='withPrefix labelInside tooltip canClear loading'>
          <Row gutter={16}>
            <Row direction='column' gutter={16}>
              <ComboBoxComponent
                openOnFocus
                value={value}
                label='Label'
                tooltip='Подсказка'
                options={defaultOptions}
                onChange={onChange}
                size='S'
                icon='orm'
                labelInside
                canClear
                loading
              />
              <ComboBoxComponent
                openOnFocus
                value={value}
                label='Label'
                tooltip='Подсказка'
                options={defaultOptions}
                onChange={onChange}
                size='M'
                icon='orm'
                labelInside
                canClear
                loading
              />
              <ComboBoxComponent
                openOnFocus
                value={value}
                label='Label'
                tooltip='Подсказка'
                options={defaultOptions}
                onChange={onChange}
                size='L'
                icon='orm'
                labelInside
                canClear
                loading
              />
              <ComboBoxComponent
                openOnFocus
                value={value}
                label='Label'
                tooltip='Подсказка'
                options={defaultOptions}
                onChange={onChange}
                size='XL'
                icon='orm'
                labelInside
                canClear
                loading
              />
            </Row>
          </Row>
        </Item>
        <Item label='withPrefix labelInside tooltip error empty'>
          <Row gutter={16}>
            <Row direction='column' gutter={16}>
              <ComboBoxComponent
                openOnFocus
                value={null}
                label='Label'
                tooltip='Подсказка'
                options={defaultOptions}
                size='S'
                icon='orm'
                labelInside
                canClear
                error
              />
              <ComboBoxComponent
                openOnFocus
                value={null}
                label='Label'
                tooltip='Подсказка'
                options={defaultOptions}
                size='M'
                icon='orm'
                labelInside
                canClear
                error
              />
              <ComboBoxComponent
                openOnFocus
                value={null}
                label='Label'
                tooltip='Подсказка'
                options={defaultOptions}
                size='L'
                icon='orm'
                labelInside
                canClear
                error
              />
              <ComboBoxComponent
                openOnFocus
                value={null}
                label='Label'
                tooltip='Подсказка'
                options={defaultOptions}
                size='XL'
                icon='orm'
                labelInside
                canClear
                error
              />
            </Row>
          </Row>
        </Item>
        <Item label='withPrefix labelInside tooltip error filled'>
          <Row gutter={16}>
            <Row direction='column' gutter={16}>
              <ComboBoxComponent
                openOnFocus
                value={value ?? options?.[0]}
                label='Label'
                tooltip='Подсказка'
                options={defaultOptions}
                onChange={onChange}
                size='S'
                icon='orm'
                labelInside
                error
              />
              <ComboBoxComponent
                openOnFocus
                value={value ?? options?.[0]}
                label='Label'
                tooltip='Подсказка'
                options={defaultOptions}
                onChange={onChange}
                size='M'
                icon='orm'
                labelInside
                error
              />
              <ComboBoxComponent
                openOnFocus
                value={value ?? options?.[0]}
                label='Label'
                tooltip='Подсказка'
                options={defaultOptions}
                onChange={onChange}
                size='L'
                icon='orm'
                labelInside
                error
              />
              <ComboBoxComponent
                openOnFocus
                value={value ?? options?.[0]}
                label='Label'
                tooltip='Подсказка'
                options={defaultOptions}
                onChange={onChange}
                size='XL'
                icon='orm'
                labelInside
                error
              />
            </Row>
          </Row>
        </Item>
        <Item label='withPrefix labelInside tooltip disabled filled'>
          <Row gutter={16}>
            <Row direction='column' gutter={16}>
              <ComboBoxComponent
                openOnFocus
                value={value ?? options?.[0]}
                label='Label'
                tooltip='Подсказка'
                options={defaultOptions}
                onChange={onChange}
                size='S'
                icon='orm'
                labelInside
                disabled
              />
              <ComboBoxComponent
                openOnFocus
                value={value ?? options?.[0]}
                label='Label'
                tooltip='Подсказка'
                options={defaultOptions}
                onChange={onChange}
                size='M'
                icon='orm'
                labelInside
                disabled
              />
              <ComboBoxComponent
                openOnFocus
                value={value ?? options?.[0]}
                label='Label'
                tooltip='Подсказка'
                options={defaultOptions}
                onChange={onChange}
                size='L'
                icon='orm'
                labelInside
                disabled
              />
              <ComboBoxComponent
                openOnFocus
                value={value ?? options?.[0]}
                label='Label'
                tooltip='Подсказка'
                options={defaultOptions}
                onChange={onChange}
                size='XL'
                icon='orm'
                labelInside
                disabled
              />
            </Row>
          </Row>
        </Item>
        <Item label='withPrefix labelInside tooltip disabled empty'>
          <Row gutter={16}>
            <Row direction='column' gutter={16}>
              <ComboBoxComponent
                openOnFocus
                value={null}
                label='Label'
                tooltip='Подсказка'
                options={defaultOptions}
                size='S'
                icon='orm'
                labelInside
                disabled
              />
              <ComboBoxComponent
                openOnFocus
                value={null}
                label='Label'
                tooltip='Подсказка'
                options={defaultOptions}
                size='M'
                icon='orm'
                labelInside
                disabled
              />
              <ComboBoxComponent
                openOnFocus
                value={null}
                label='Label'
                tooltip='Подсказка'
                options={defaultOptions}
                size='L'
                icon='orm'
                labelInside
                disabled
              />
              <ComboBoxComponent
                openOnFocus
                value={null}
                label='Label'
                tooltip='Подсказка'
                options={defaultOptions}
                size='XL'
                icon='orm'
                labelInside
                disabled
              />
            </Row>
          </Row>
        </Item>
        <Item label='With label, tooltip canClear helper'>
          <Row gutter={16}>
            <Row direction='column' gutter={16}>
              <ComboBoxComponent
                openOnFocus
                value={value}
                placeholder='Placeholder'
                label='Label'
                size='S'
                options={defaultOptions}
                onChange={onChange}
                canClear
                helperText='Helper text goes here'
              />
              <ComboBoxComponent
                openOnFocus
                value={value}
                placeholder='Placeholder'
                label='Label'
                size='M'
                options={defaultOptions}
                onChange={onChange}
                canClear
                helperText='Helper text goes here'
              />
              <ComboBoxComponent
                openOnFocus
                value={value}
                placeholder='Placeholder'
                label='Label'
                size='L'
                options={defaultOptions}
                onChange={onChange}
                canClear
                helperText='Helper text goes here'
              />
              <ComboBoxComponent
                openOnFocus
                value={value}
                placeholder='Placeholder'
                label='Label'
                size='XL'
                options={defaultOptions}
                onChange={onChange}
                canClear
                helperText='Helper text goes here'
              />
            </Row>
          </Row>
        </Item>
        <Item label='With label, tooltip canClear required helper'>
          <Row gutter={16}>
            <Row direction='column' gutter={16}>
              <ComboBoxComponent
                openOnFocus
                value={value}
                placeholder='Placeholder'
                label='Label'
                size='S'
                tooltip='Подсказка'
                helperText='Helper text goes here'
                options={defaultOptions}
                onChange={onChange}
                canClear
                required
              />
              <ComboBoxComponent
                openOnFocus
                value={value}
                placeholder='Placeholder'
                label='Label'
                size='M'
                tooltip='Подсказка'
                helperText='Helper text goes here'
                options={defaultOptions}
                onChange={onChange}
                canClear
                required
              />
              <ComboBoxComponent
                openOnFocus
                value={value}
                placeholder='Placeholder'
                label='Label'
                size='L'
                tooltip='Подсказка'
                helperText='Helper text goes here'
                options={defaultOptions}
                onChange={onChange}
                canClear
                required
              />
              <ComboBoxComponent
                openOnFocus
                value={value}
                placeholder='Placeholder'
                label='Label'
                size='XL'
                tooltip='Подсказка'
                helperText='Helper text goes here'
                options={defaultOptions}
                onChange={onChange}
                canClear
                required
              />
            </Row>
          </Row>
        </Item>
        <Item label='With label, tooltip canClear loading helper'>
          <Row gutter={16}>
            <Row direction='column' gutter={16}>
              <ComboBoxComponent
                openOnFocus
                value={value}
                placeholder='Placeholder'
                label='Label'
                size='S'
                helperText='Helper text goes here'
                options={defaultOptions}
                onChange={onChange}
                canClear
                loading
              />
              <ComboBoxComponent
                openOnFocus
                value={value}
                placeholder='Placeholder'
                label='Label'
                size='M'
                helperText='Helper text goes here'
                options={defaultOptions}
                onChange={onChange}
                canClear
                loading
              />
              <ComboBoxComponent
                openOnFocus
                value={value}
                placeholder='Placeholder'
                label='Label'
                size='L'
                helperText='Helper text goes here'
                options={defaultOptions}
                onChange={onChange}
                canClear
                loading
              />
              <ComboBoxComponent
                openOnFocus
                value={value}
                placeholder='Placeholder'
                label='Label'
                size='XL'
                helperText='Helper text goes here'
                options={defaultOptions}
                onChange={onChange}
                canClear
                loading
              />
            </Row>
          </Row>
        </Item>
        <Item label='With label, tooltip error empty'>
          <Row gutter={16}>
            <Row direction='column' gutter={16}>
              <ComboBoxComponent
                openOnFocus
                value={value}
                placeholder='Placeholder'
                label='Label'
                size='S'
                helperText='Error messages text goes here'
                options={defaultOptions}
                onChange={onChange}
                canClear
                error
              />
              <ComboBoxComponent
                openOnFocus
                value={value}
                placeholder='Placeholder'
                label='Label'
                size='M'
                helperText='Error messages text goes here'
                options={defaultOptions}
                onChange={onChange}
                canClear
                error
              />
              <ComboBoxComponent
                openOnFocus
                value={value}
                placeholder='Placeholder'
                label='Label'
                size='L'
                helperText='Error messages text goes here'
                options={defaultOptions}
                onChange={onChange}
                canClear
                error
              />
              <ComboBoxComponent
                openOnFocus
                value={value}
                placeholder='Placeholder'
                label='Label'
                size='XL'
                helperText='Error messages text goes here'
                options={defaultOptions}
                onChange={onChange}
                canClear
                error
              />
            </Row>
          </Row>
        </Item>
        <Item label='With label, tooltip error filled'>
          <Row gutter={16}>
            <Row direction='column' gutter={16}>
              <ComboBoxComponent
                openOnFocus
                value={value ?? options?.[0]}
                label='Label'
                tooltip='Подсказка'
                options={defaultOptions}
                onChange={onChange}
                size='S'
                helperText='Error messages text goes here'
                error
              />
              <ComboBoxComponent
                openOnFocus
                value={value ?? options?.[0]}
                label='Label'
                tooltip='Подсказка'
                options={defaultOptions}
                onChange={onChange}
                size='M'
                helperText='Error messages text goes here'
                error
              />
              <ComboBoxComponent
                openOnFocus
                value={value ?? options?.[0]}
                label='Label'
                tooltip='Подсказка'
                options={defaultOptions}
                onChange={onChange}
                size='L'
                helperText='Error messages text goes here'
                error
              />
              <ComboBoxComponent
                openOnFocus
                value={value ?? options?.[0]}
                label='Label'
                tooltip='Подсказка'
                options={defaultOptions}
                onChange={onChange}
                size='XL'
                helperText='Error messages text goes here'
                error
              />
            </Row>
          </Row>
        </Item>
        <Item label='With label, tooltip disabled filled helper'>
          <Row gutter={16}>
            <Row direction='column' gutter={16}>
              <ComboBoxComponent
                openOnFocus
                value={value ?? options?.[0]}
                label='Label'
                tooltip='Подсказка'
                placeholder='Placeholder'
                helperText='Helper text goes here'
                options={defaultOptions}
                onChange={onChange}
                size='S'
                disabled
              />
              <ComboBoxComponent
                openOnFocus
                value={value ?? options?.[0]}
                label='Label'
                tooltip='Подсказка'
                placeholder='Placeholder'
                helperText='Helper text goes here'
                options={defaultOptions}
                onChange={onChange}
                size='M'
                disabled
              />
              <ComboBoxComponent
                openOnFocus
                value={value ?? options?.[0]}
                label='Label'
                tooltip='Подсказка'
                placeholder='Placeholder'
                helperText='Helper text goes here'
                options={defaultOptions}
                onChange={onChange}
                size='L'
                disabled
              />
              <ComboBoxComponent
                openOnFocus
                value={value ?? options?.[0]}
                label='Label'
                tooltip='Подсказка'
                placeholder='Placeholder'
                helperText='Helper text goes here'
                options={defaultOptions}
                onChange={onChange}
                size='XL'
                disabled
              />
            </Row>
          </Row>
        </Item>
        <Item label='With label, tooltip disabled empty helper'>
          <Row gutter={16}>
            <Row direction='column' gutter={16}>
              <ComboBoxComponent
                openOnFocus
                value={null}
                label='Label'
                tooltip='Подсказка'
                helperText='Helper text goes here'
                placeholder='Placeholder'
                options={defaultOptions}
                size='S'
                disabled
              />
              <ComboBoxComponent
                openOnFocus
                value={null}
                label='Label'
                tooltip='Подсказка'
                helperText='Helper text goes here'
                placeholder='Placeholder'
                options={defaultOptions}
                size='M'
                disabled
              />
              <ComboBoxComponent
                openOnFocus
                value={null}
                label='Label'
                tooltip='Подсказка'
                helperText='Helper text goes here'
                placeholder='Placeholder'
                options={defaultOptions}
                size='L'
                disabled
              />
              <ComboBoxComponent
                openOnFocus
                value={null}
                label='Label'
                tooltip='Подсказка'
                helperText='Helper text goes here'
                placeholder='Placeholder'
                options={defaultOptions}
                size='XL'
                disabled
              />
            </Row>
          </Row>
        </Item>
        <Item label='With label, icon tooltip canClear helper'>
          <Row gutter={16}>
            <Row direction='column' gutter={16}>
              <ComboBoxComponent
                openOnFocus
                value={value}
                placeholder='Placeholder'
                label='Label'
                size='S'
                icon='orm'
                options={defaultOptions}
                onChange={onChange}
                canClear
                helperText='Helper text goes here'
              />
              <ComboBoxComponent
                openOnFocus
                value={value}
                placeholder='Placeholder'
                label='Label'
                size='M'
                icon='orm'
                options={defaultOptions}
                onChange={onChange}
                canClear
                helperText='Helper text goes here'
              />
              <ComboBoxComponent
                openOnFocus
                value={value}
                placeholder='Placeholder'
                label='Label'
                size='L'
                icon='orm'
                options={defaultOptions}
                onChange={onChange}
                canClear
                helperText='Helper text goes here'
              />
              <ComboBoxComponent
                openOnFocus
                value={value}
                placeholder='Placeholder'
                label='Label'
                size='XL'
                icon='orm'
                options={defaultOptions}
                onChange={onChange}
                canClear
                helperText='Helper text goes here'
              />
            </Row>
          </Row>
        </Item>
        <Item label='With label, icon tooltip canClear required helper'>
          <Row gutter={16}>
            <Row direction='column' gutter={16}>
              <ComboBoxComponent
                openOnFocus
                value={value}
                placeholder='Placeholder'
                label='Label'
                size='S'
                icon='orm'
                tooltip='Подсказка'
                helperText='Helper text goes here'
                options={defaultOptions}
                onChange={onChange}
                canClear
                required
              />
              <ComboBoxComponent
                openOnFocus
                value={value}
                placeholder='Placeholder'
                label='Label'
                size='M'
                icon='orm'
                tooltip='Подсказка'
                helperText='Helper text goes here'
                options={defaultOptions}
                onChange={onChange}
                canClear
                required
              />
              <ComboBoxComponent
                openOnFocus
                value={value}
                placeholder='Placeholder'
                label='Label'
                size='L'
                icon='orm'
                tooltip='Подсказка'
                helperText='Helper text goes here'
                options={defaultOptions}
                onChange={onChange}
                canClear
                required
              />
              <ComboBoxComponent
                openOnFocus
                value={value}
                placeholder='Placeholder'
                label='Label'
                size='XL'
                icon='orm'
                tooltip='Подсказка'
                helperText='Helper text goes here'
                options={defaultOptions}
                onChange={onChange}
                canClear
                required
              />
            </Row>
          </Row>
        </Item>
        <Item label='With label, icon tooltip canClear loading helper'>
          <Row gutter={16}>
            <Row direction='column' gutter={16}>
              <ComboBoxComponent
                openOnFocus
                value={value}
                placeholder='Placeholder'
                label='Label'
                size='S'
                icon='orm'
                helperText='Helper text goes here'
                options={defaultOptions}
                onChange={onChange}
                canClear
                loading
              />
              <ComboBoxComponent
                openOnFocus
                value={value}
                placeholder='Placeholder'
                label='Label'
                size='M'
                icon='orm'
                helperText='Helper text goes here'
                options={defaultOptions}
                onChange={onChange}
                canClear
                loading
              />
              <ComboBoxComponent
                openOnFocus
                value={value}
                placeholder='Placeholder'
                label='Label'
                size='L'
                icon='orm'
                helperText='Helper text goes here'
                options={defaultOptions}
                onChange={onChange}
                canClear
                loading
              />
              <ComboBoxComponent
                openOnFocus
                value={value}
                placeholder='Placeholder'
                label='Label'
                size='XL'
                icon='orm'
                helperText='Helper text goes here'
                options={defaultOptions}
                onChange={onChange}
                canClear
                loading
              />
            </Row>
          </Row>
        </Item>
        <Item label='With label, icon tooltip error empty'>
          <Row gutter={16}>
            <Row direction='column' gutter={16}>
              <ComboBoxComponent
                openOnFocus
                value={value}
                placeholder='Placeholder'
                label='Label'
                size='S'
                icon='orm'
                helperText='Error messages text goes here'
                options={defaultOptions}
                onChange={onChange}
                canClear
                error
              />
              <ComboBoxComponent
                openOnFocus
                value={value}
                placeholder='Placeholder'
                label='Label'
                size='M'
                icon='orm'
                helperText='Error messages text goes here'
                options={defaultOptions}
                onChange={onChange}
                canClear
                error
              />
              <ComboBoxComponent
                openOnFocus
                value={value}
                placeholder='Placeholder'
                label='Label'
                size='L'
                icon='orm'
                helperText='Error messages text goes here'
                options={defaultOptions}
                onChange={onChange}
                canClear
                error
              />
              <ComboBoxComponent
                openOnFocus
                value={value}
                placeholder='Placeholder'
                label='Label'
                size='XL'
                icon='orm'
                helperText='Error messages text goes here'
                options={defaultOptions}
                onChange={onChange}
                canClear
                error
              />
            </Row>
          </Row>
        </Item>
        <Item label='With label, icon tooltip error filled'>
          <Row gutter={16}>
            <Row direction='column' gutter={16}>
              <ComboBoxComponent
                openOnFocus
                value={value ?? options?.[0]}
                label='Label'
                tooltip='Подсказка'
                options={defaultOptions}
                onChange={onChange}
                size='S'
                icon='orm'
                helperText='Error messages text goes here'
                error
              />
              <ComboBoxComponent
                openOnFocus
                value={value ?? options?.[0]}
                label='Label'
                tooltip='Подсказка'
                options={defaultOptions}
                onChange={onChange}
                size='M'
                icon='orm'
                helperText='Error messages text goes here'
                error
              />
              <ComboBoxComponent
                openOnFocus
                value={value ?? options?.[0]}
                label='Label'
                tooltip='Подсказка'
                options={defaultOptions}
                onChange={onChange}
                size='L'
                icon='orm'
                helperText='Error messages text goes here'
                error
              />
              <ComboBoxComponent
                openOnFocus
                value={value ?? options?.[0]}
                label='Label'
                tooltip='Подсказка'
                options={defaultOptions}
                onChange={onChange}
                size='XL'
                icon='orm'
                helperText='Error messages text goes here'
                error
              />
            </Row>
          </Row>
        </Item>
        <Item label='With label, icon tooltip disabled filled helper'>
          <Row gutter={16}>
            <Row direction='column' gutter={16}>
              <ComboBoxComponent
                openOnFocus
                value={value ?? options?.[0]}
                label='Label'
                tooltip='Подсказка'
                placeholder='Placeholder'
                helperText='Helper text goes here'
                options={defaultOptions}
                onChange={onChange}
                size='S'
                icon='orm'
                disabled
              />
              <ComboBoxComponent
                openOnFocus
                value={value ?? options?.[0]}
                label='Label'
                tooltip='Подсказка'
                placeholder='Placeholder'
                helperText='Helper text goes here'
                options={defaultOptions}
                onChange={onChange}
                size='M'
                icon='orm'
                disabled
              />
              <ComboBoxComponent
                openOnFocus
                value={value ?? options?.[0]}
                label='Label'
                tooltip='Подсказка'
                placeholder='Placeholder'
                helperText='Helper text goes here'
                options={defaultOptions}
                onChange={onChange}
                size='L'
                icon='orm'
                disabled
              />
              <ComboBoxComponent
                openOnFocus
                value={value ?? options?.[0]}
                label='Label'
                tooltip='Подсказка'
                placeholder='Placeholder'
                helperText='Helper text goes here'
                options={defaultOptions}
                onChange={onChange}
                size='XL'
                icon='orm'
                disabled
              />
            </Row>
          </Row>
        </Item>
        <Item label='With label, icon tooltip disabled empty helper'>
          <Row gutter={16}>
            <Row direction='column' gutter={16}>
              <ComboBoxComponent
                openOnFocus
                value={null}
                label='Label'
                tooltip='Подсказка'
                helperText='Helper text goes here'
                placeholder='Placeholder'
                options={defaultOptions}
                size='S'
                icon='orm'
                disabled
              />
              <ComboBoxComponent
                openOnFocus
                value={null}
                label='Label'
                tooltip='Подсказка'
                helperText='Helper text goes here'
                placeholder='Placeholder'
                options={defaultOptions}
                size='M'
                icon='orm'
                disabled
              />
              <ComboBoxComponent
                openOnFocus
                value={null}
                label='Label'
                tooltip='Подсказка'
                helperText='Helper text goes here'
                placeholder='Placeholder'
                options={defaultOptions}
                size='L'
                icon='orm'
                disabled
              />
              <ComboBoxComponent
                openOnFocus
                value={null}
                label='Label'
                tooltip='Подсказка'
                helperText='Helper text goes here'
                placeholder='Placeholder'
                options={defaultOptions}
                size='XL'
                icon='orm'
                disabled
              />
            </Row>
          </Row>
        </Item>
      </Container>
    </>
  );
};
