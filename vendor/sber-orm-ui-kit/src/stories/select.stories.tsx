import { Meta, StoryFn } from '@storybook/react';
import { Options } from '@v-uik/combo-box';
import React, { useCallback, useState } from 'react';

import { EIconName, Row, Select as SelectComponent } from '..';

import { Container, DemoContainer, Item } from './utils';

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
const options = [
  {
    key: 'test',
    value: 'test',
    label: 'ПАО Сбербанк',
    children: [
      {
        key: 'test1',
        value: 'test1',
        label: 'ПАО Сбербанк (ЦА)',
        children: [
          {
            key: 'test2',
            value: 'test2',
            label: 'Блок "Управление благосостоянием"',
            children: [
              {
                key: 'test3',
                value: 'test3',
                label: 'Руководство блока "Управление благосостоянием"',
              },
              {
                key: 'test4',
                value: 'test4',
                label: 'Штаб блока "Управление благосостоянием"',
              },
            ],
          },
        ],
      },
    ],
  },
  { key: '14', label: 'Value', disabled: true, value: '14' },
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
    label: 'Value',
    value: '1',
  },
  {
    key: '44',
    label: 'sit',
    value: '44',
    children: [
      {
        children: [{ key: '33', label: 'dolor', value: '33' }],
        key: '22',
        label: 'ipsum',
        value: '22',
      },
    ],
  },
  {
    key: '5',
    label:
      'Очень длинное значение опции, не помещается целиком по ширине дроплиста',
    value: '5',
  },
  { key: '6', label: 'consectetur', value: '6' },
  { key: '7', label: 'adipiscing', value: '7' },
  { key: '8', label: 'elit', value: '8' },
  { key: '9', label: 'sed', value: '9' },
  { key: '10', label: 'do', value: '10' },
  { key: '11', label: 'eiusmod', value: '11' },
  { disabled: true, key: '12', label: 'tempor incididunt', value: '12' },
  { key: '13', label: 'ut labore et', value: '13' },
];

const meta: Meta<typeof SelectComponent> = {
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
    showOptionSearch: {
      control: 'boolean',
      description: 'Использовать поиск в дропдауне',
    },
    useChips: {
      control: 'boolean',
      description:
        'Отображать выбранные значения как чипсы (Множественный выбор)',
    },
  },
  args: {
    options,
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
    showOptionSearch: false,
    useChips: false,
  },
  parameters: {
    controls: {
      expanded: true,
    },
  },
  component: SelectComponent,
  title: 'components/Select',
};

export default meta;

export const Select: StoryFn<typeof SelectComponent> = (arguments_) => {
  const [value, setValue] = useState<unknown>(null);
  const [multiValue, setMultiValue] = useState<unknown[]>([]);
  const [localOptions, setLocalOptions] = useState(options as Options<unknown>);
  const [loading, setLoading] = useState<boolean>(false);
  const onMultiChange = (
    _key: React.Key[],
    _event: unknown,
    nodes: unknown[],
  ) => {
    setMultiValue(nodes);
  };
  const onChange = (_key: React.Key, _event: unknown, nodes: unknown) => {
    setValue(nodes);
  };

  const handleSubmit = (value: Options<unknown>) => {
    console.log(value);
  };

  // custom tree api search example
  const onInputChange = useCallback((value: string) => {
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
  }, []);

  const onChipRemove = (removedValue: string) => {
    setMultiValue([
      ...(multiValue as Options<unknown>)?.filter?.(
        (currentItem: any) => currentItem.value !== removedValue,
      ),
    ]);
  };

  return (
    <>
      <DemoContainer>
        <Item label='Customizable' width={500}>
          <SelectComponent
            {...arguments_}
            options={localOptions}
            loading={loading}
            onInputChange={
              arguments_.useCustomSearch ? onInputChange : undefined
            }
            value={multiValue}
            onChange={arguments_.multiple ? onMultiChange : onChange}
            onChipRemove={
              arguments_.multiple && arguments_.useChips
                ? onChipRemove
                : undefined
            }
          />
        </Item>
      </DemoContainer>
      <Container>
        <Item label='labelInside tooltip canClear helper multiple showOptionSearch showOptionValue showDroplistButtons'>
          <Row gutter={16} style={{ maxWidth: '100%' }}>
            <Row direction='column' gutter={16} style={{ maxWidth: '100%' }}>
              <SelectComponent
                openOnFocus
                value={value}
                label='Label'
                tooltip='Подсказка'
                helperText='Helper text goes here'
                options={options}
                onChange={onChange}
                size='S'
                labelInside
                canClear
                showOptionValue
                showOptionSearch
                showDroplistButtons
                multiple
                onListSubmit={handleSubmit}
              />
              <SelectComponent
                openOnFocus
                value={value}
                label='Label'
                tooltip='Подсказка'
                helperText='Helper text goes here'
                options={options}
                onChange={onChange}
                size='M'
                labelInside
                canClear
                showOptionValue
                showOptionSearch
                showDroplistButtons
                multiple
                onListSubmit={handleSubmit}
              />
              <SelectComponent
                openOnFocus
                value={value}
                label='Label'
                tooltip='Подсказка'
                helperText='Helper text goes here'
                options={options}
                onChange={onChange}
                size='L'
                labelInside
                canClear
                showOptionValue
                showOptionSearch
                showDroplistButtons
                multiple
                onListSubmit={handleSubmit}
              />
              <SelectComponent
                openOnFocus
                value={value}
                label='Label'
                tooltip='Подсказка'
                helperText='Helper text goes here'
                options={options}
                onChange={onChange}
                size='XL'
                labelInside
                canClear
                showOptionValue
                showOptionSearch
                showDroplistButtons
                multiple
                onListSubmit={handleSubmit}
              />
            </Row>
          </Row>
        </Item>
        <Item label='labelInside tooltip canClear required helper tree showDroplistButtons showOptionValue'>
          <Row gutter={16} style={{ maxWidth: '100%' }}>
            <Row direction='column' gutter={16} style={{ maxWidth: '100%' }}>
              <SelectComponent
                openOnFocus
                value={multiValue}
                label='Label'
                tooltip='Подсказка'
                helperText='Helper text goes here'
                options={options}
                onChange={onMultiChange}
                size='S'
                showOptionValue
                showDroplistButtons
                required
                labelInside
                canClear
                multiple
                tree
              />
              <SelectComponent
                openOnFocus
                value={multiValue}
                label='Label'
                tooltip='Подсказка'
                helperText='Helper text goes here'
                options={options}
                onChange={onMultiChange}
                size='M'
                showOptionValue
                showDroplistButtons
                required
                labelInside
                canClear
                multiple
                tree
              />
              <SelectComponent
                openOnFocus
                value={multiValue}
                label='Label'
                tooltip='Подсказка'
                helperText='Helper text goes here'
                options={options}
                onChange={onMultiChange}
                size='L'
                showOptionValue
                showDroplistButtons
                required
                labelInside
                canClear
                multiple
                tree
              />
              <SelectComponent
                openOnFocus
                value={multiValue}
                label='Label'
                tooltip='Подсказка'
                helperText='Helper text goes here'
                options={options}
                onChange={onMultiChange}
                size='XL'
                showOptionValue
                showDroplistButtons
                required
                labelInside
                canClear
                multiple
                tree
              />
            </Row>
          </Row>
        </Item>
        <Item label='labelInside tooltip canClear loading'>
          <Row gutter={16}>
            <Row direction='column' gutter={16}>
              <SelectComponent
                openOnFocus
                value={value}
                label='Label'
                tooltip='Подсказка'
                options={options}
                onChange={onChange}
                size='S'
                labelInside
                canClear
                loading
              />
              <SelectComponent
                openOnFocus
                value={value}
                label='Label'
                tooltip='Подсказка'
                options={options}
                onChange={onChange}
                size='M'
                labelInside
                canClear
                loading
              />
              <SelectComponent
                openOnFocus
                value={value}
                label='Label'
                tooltip='Подсказка'
                options={options}
                onChange={onChange}
                size='L'
                labelInside
                canClear
                loading
              />
              <SelectComponent
                openOnFocus
                value={value}
                label='Label'
                tooltip='Подсказка'
                options={options}
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
              <SelectComponent
                openOnFocus
                value={null}
                label='Label'
                tooltip='Подсказка'
                options={options}
                size='S'
                labelInside
                canClear
                error
              />
              <SelectComponent
                openOnFocus
                value={null}
                label='Label'
                tooltip='Подсказка'
                options={options}
                size='M'
                labelInside
                canClear
                error
              />
              <SelectComponent
                openOnFocus
                value={null}
                label='Label'
                tooltip='Подсказка'
                options={options}
                size='L'
                labelInside
                canClear
                error
              />
              <SelectComponent
                openOnFocus
                value={null}
                label='Label'
                tooltip='Подсказка'
                options={options}
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
              <SelectComponent
                openOnFocus
                value={value ?? options?.[0]}
                label='Label'
                tooltip='Подсказка'
                options={options}
                onChange={onChange}
                size='S'
                labelInside
                error
              />
              <SelectComponent
                openOnFocus
                value={value ?? options?.[0]}
                label='Label'
                tooltip='Подсказка'
                options={options}
                onChange={onChange}
                size='M'
                labelInside
                error
              />
              <SelectComponent
                openOnFocus
                value={value ?? options?.[0]}
                label='Label'
                tooltip='Подсказка'
                options={options}
                onChange={onChange}
                size='L'
                labelInside
                error
              />
              <SelectComponent
                openOnFocus
                value={value ?? options?.[0]}
                label='Label'
                tooltip='Подсказка'
                options={options}
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
              <SelectComponent
                openOnFocus
                value={value ?? options?.[0]}
                label='Label'
                tooltip='Подсказка'
                options={options}
                onChange={onChange}
                size='S'
                labelInside
                disabled
              />
              <SelectComponent
                openOnFocus
                value={value ?? options?.[0]}
                label='Label'
                tooltip='Подсказка'
                options={options}
                onChange={onChange}
                size='M'
                labelInside
                disabled
              />
              <SelectComponent
                openOnFocus
                value={value ?? options?.[0]}
                label='Label'
                tooltip='Подсказка'
                options={options}
                onChange={onChange}
                size='L'
                labelInside
                disabled
              />
              <SelectComponent
                openOnFocus
                value={value ?? options?.[0]}
                label='Label'
                tooltip='Подсказка'
                options={options}
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
              <SelectComponent
                openOnFocus
                value={null}
                label='Label'
                tooltip='Подсказка'
                options={options}
                size='S'
                labelInside
                disabled
              />
              <SelectComponent
                openOnFocus
                value={null}
                label='Label'
                tooltip='Подсказка'
                options={options}
                size='M'
                labelInside
                disabled
              />
              <SelectComponent
                openOnFocus
                value={null}
                label='Label'
                tooltip='Подсказка'
                options={options}
                size='L'
                labelInside
                disabled
              />
              <SelectComponent
                openOnFocus
                value={null}
                label='Label'
                tooltip='Подсказка'
                options={options}
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
              <SelectComponent
                openOnFocus
                value={value}
                label='Label'
                tooltip='Подсказка'
                options={options}
                onChange={onChange}
                size='S'
                icon='orm'
                labelInside
                canClear
              />
              <SelectComponent
                openOnFocus
                value={value}
                label='Label'
                tooltip='Подсказка'
                options={options}
                onChange={onChange}
                size='M'
                icon='orm'
                labelInside
                canClear
              />
              <SelectComponent
                openOnFocus
                value={value}
                label='Label'
                tooltip='Подсказка'
                options={options}
                onChange={onChange}
                size='L'
                icon='orm'
                labelInside
                canClear
              />
              <SelectComponent
                openOnFocus
                value={value}
                label='Label'
                tooltip='Подсказка'
                options={options}
                onChange={onChange}
                size='XL'
                icon='orm'
                labelInside
                canClear
              />
            </Row>
          </Row>
        </Item>
        <Item label='withPrefix labelInside tooltip canClear required renderLimit'>
          <Row gutter={16}>
            <Row direction='column' gutter={16}>
              <SelectComponent
                openOnFocus
                value={value}
                label='Label'
                tooltip='Подсказка'
                options={options}
                onChange={onChange}
                size='S'
                icon='orm'
                optionRenderLimit={3}
                required
                labelInside
                canClear
              />
              <SelectComponent
                openOnFocus
                value={value}
                label='Label'
                tooltip='Подсказка'
                options={options}
                onChange={onChange}
                size='M'
                icon='orm'
                optionRenderLimit={3}
                required
                labelInside
                canClear
              />
              <SelectComponent
                openOnFocus
                value={value}
                label='Label'
                tooltip='Подсказка'
                options={options}
                onChange={onChange}
                size='L'
                icon='orm'
                optionRenderLimit={3}
                required
                labelInside
                canClear
              />
              <SelectComponent
                openOnFocus
                value={value}
                label='Label'
                tooltip='Подсказка'
                options={options}
                onChange={onChange}
                size='XL'
                icon='orm'
                optionRenderLimit={3}
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
              <SelectComponent
                openOnFocus
                value={value}
                label='Label'
                tooltip='Подсказка'
                options={options}
                onChange={onChange}
                size='S'
                icon='orm'
                labelInside
                canClear
                loading
              />
              <SelectComponent
                openOnFocus
                value={value}
                label='Label'
                tooltip='Подсказка'
                options={options}
                onChange={onChange}
                size='M'
                icon='orm'
                labelInside
                canClear
                loading
              />
              <SelectComponent
                openOnFocus
                value={value}
                label='Label'
                tooltip='Подсказка'
                options={options}
                onChange={onChange}
                size='L'
                icon='orm'
                labelInside
                canClear
                loading
              />
              <SelectComponent
                openOnFocus
                value={value}
                label='Label'
                tooltip='Подсказка'
                options={options}
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
              <SelectComponent
                openOnFocus
                value={null}
                label='Label'
                tooltip='Подсказка'
                options={options}
                size='S'
                icon='orm'
                labelInside
                canClear
                error
              />
              <SelectComponent
                openOnFocus
                value={null}
                label='Label'
                tooltip='Подсказка'
                options={options}
                size='M'
                icon='orm'
                labelInside
                canClear
                error
              />
              <SelectComponent
                openOnFocus
                value={null}
                label='Label'
                tooltip='Подсказка'
                options={options}
                size='L'
                icon='orm'
                labelInside
                canClear
                error
              />
              <SelectComponent
                openOnFocus
                value={null}
                label='Label'
                tooltip='Подсказка'
                options={options}
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
              <SelectComponent
                openOnFocus
                value={value ?? options?.[0]}
                label='Label'
                tooltip='Подсказка'
                options={options}
                onChange={onChange}
                size='S'
                icon='orm'
                labelInside
                error
              />
              <SelectComponent
                openOnFocus
                value={value ?? options?.[0]}
                label='Label'
                tooltip='Подсказка'
                options={options}
                onChange={onChange}
                size='M'
                icon='orm'
                labelInside
                error
              />
              <SelectComponent
                openOnFocus
                value={value ?? options?.[0]}
                label='Label'
                tooltip='Подсказка'
                options={options}
                onChange={onChange}
                size='L'
                icon='orm'
                labelInside
                error
              />
              <SelectComponent
                openOnFocus
                value={value ?? options?.[0]}
                label='Label'
                tooltip='Подсказка'
                options={options}
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
              <SelectComponent
                openOnFocus
                value={value ?? options?.[0]}
                label='Label'
                tooltip='Подсказка'
                options={options}
                onChange={onChange}
                size='S'
                icon='orm'
                labelInside
                disabled
              />
              <SelectComponent
                openOnFocus
                value={value ?? options?.[0]}
                label='Label'
                tooltip='Подсказка'
                options={options}
                onChange={onChange}
                size='M'
                icon='orm'
                labelInside
                disabled
              />
              <SelectComponent
                openOnFocus
                value={value ?? options?.[0]}
                label='Label'
                tooltip='Подсказка'
                options={options}
                onChange={onChange}
                size='L'
                icon='orm'
                labelInside
                disabled
              />
              <SelectComponent
                openOnFocus
                value={value ?? options?.[0]}
                label='Label'
                tooltip='Подсказка'
                options={options}
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
              <SelectComponent
                openOnFocus
                value={null}
                label='Label'
                tooltip='Подсказка'
                options={options}
                size='S'
                icon='orm'
                labelInside
                disabled
              />
              <SelectComponent
                openOnFocus
                value={null}
                label='Label'
                tooltip='Подсказка'
                options={options}
                size='M'
                icon='orm'
                labelInside
                disabled
              />
              <SelectComponent
                openOnFocus
                value={null}
                label='Label'
                tooltip='Подсказка'
                options={options}
                size='L'
                icon='orm'
                labelInside
                disabled
              />
              <SelectComponent
                openOnFocus
                value={null}
                label='Label'
                tooltip='Подсказка'
                options={options}
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
              <SelectComponent
                openOnFocus
                value={value}
                placeholder='Placeholder'
                label='Label'
                size='S'
                options={options}
                onChange={onChange}
                canClear
                helperText='Helper text goes here'
              />
              <SelectComponent
                openOnFocus
                value={value}
                placeholder='Placeholder'
                label='Label'
                size='M'
                options={options}
                onChange={onChange}
                canClear
                helperText='Helper text goes here'
              />
              <SelectComponent
                openOnFocus
                value={value}
                placeholder='Placeholder'
                label='Label'
                size='L'
                options={options}
                onChange={onChange}
                canClear
                helperText='Helper text goes here'
              />
              <SelectComponent
                openOnFocus
                value={value}
                placeholder='Placeholder'
                label='Label'
                size='XL'
                options={options}
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
              <SelectComponent
                openOnFocus
                value={value}
                placeholder='Placeholder'
                label='Label'
                size='S'
                tooltip='Подсказка'
                helperText='Helper text goes here'
                options={options}
                onChange={onChange}
                canClear
                required
              />
              <SelectComponent
                openOnFocus
                value={value}
                placeholder='Placeholder'
                label='Label'
                size='M'
                tooltip='Подсказка'
                helperText='Helper text goes here'
                options={options}
                onChange={onChange}
                canClear
                required
              />
              <SelectComponent
                openOnFocus
                value={value}
                placeholder='Placeholder'
                label='Label'
                size='L'
                tooltip='Подсказка'
                helperText='Helper text goes here'
                options={options}
                onChange={onChange}
                canClear
                required
              />
              <SelectComponent
                openOnFocus
                value={value}
                placeholder='Placeholder'
                label='Label'
                size='XL'
                tooltip='Подсказка'
                helperText='Helper text goes here'
                options={options}
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
              <SelectComponent
                openOnFocus
                value={value}
                placeholder='Placeholder'
                label='Label'
                size='S'
                helperText='Helper text goes here'
                options={options}
                onChange={onChange}
                canClear
                loading
              />
              <SelectComponent
                openOnFocus
                value={value}
                placeholder='Placeholder'
                label='Label'
                size='M'
                helperText='Helper text goes here'
                options={options}
                onChange={onChange}
                canClear
                loading
              />
              <SelectComponent
                openOnFocus
                value={value}
                placeholder='Placeholder'
                label='Label'
                size='L'
                helperText='Helper text goes here'
                options={options}
                onChange={onChange}
                canClear
                loading
              />
              <SelectComponent
                openOnFocus
                value={value}
                placeholder='Placeholder'
                label='Label'
                size='XL'
                helperText='Helper text goes here'
                options={options}
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
              <SelectComponent
                openOnFocus
                value={value}
                placeholder='Placeholder'
                label='Label'
                size='S'
                helperText='Error messages text goes here'
                options={options}
                onChange={onChange}
                canClear
                error
              />
              <SelectComponent
                openOnFocus
                value={value}
                placeholder='Placeholder'
                label='Label'
                size='M'
                helperText='Error messages text goes here'
                options={options}
                onChange={onChange}
                canClear
                error
              />
              <SelectComponent
                openOnFocus
                value={value}
                placeholder='Placeholder'
                label='Label'
                size='L'
                helperText='Error messages text goes here'
                options={options}
                onChange={onChange}
                canClear
                error
              />
              <SelectComponent
                openOnFocus
                value={value}
                placeholder='Placeholder'
                label='Label'
                size='XL'
                helperText='Error messages text goes here'
                options={options}
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
              <SelectComponent
                openOnFocus
                value={value ?? options?.[0]}
                label='Label'
                tooltip='Подсказка'
                options={options}
                onChange={onChange}
                size='S'
                helperText='Error messages text goes here'
                error
              />
              <SelectComponent
                openOnFocus
                value={value ?? options?.[0]}
                label='Label'
                tooltip='Подсказка'
                options={options}
                onChange={onChange}
                size='M'
                helperText='Error messages text goes here'
                error
              />
              <SelectComponent
                openOnFocus
                value={value ?? options?.[0]}
                label='Label'
                tooltip='Подсказка'
                options={options}
                onChange={onChange}
                size='L'
                helperText='Error messages text goes here'
                error
              />
              <SelectComponent
                openOnFocus
                value={value ?? options?.[0]}
                label='Label'
                tooltip='Подсказка'
                options={options}
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
              <SelectComponent
                openOnFocus
                value={value ?? options?.[0]}
                label='Label'
                tooltip='Подсказка'
                placeholder='Placeholder'
                helperText='Helper text goes here'
                options={options}
                onChange={onChange}
                size='S'
                disabled
              />
              <SelectComponent
                openOnFocus
                value={value ?? options?.[0]}
                label='Label'
                tooltip='Подсказка'
                placeholder='Placeholder'
                helperText='Helper text goes here'
                options={options}
                onChange={onChange}
                size='M'
                disabled
              />
              <SelectComponent
                openOnFocus
                value={value ?? options?.[0]}
                label='Label'
                tooltip='Подсказка'
                placeholder='Placeholder'
                helperText='Helper text goes here'
                options={options}
                onChange={onChange}
                size='L'
                disabled
              />
              <SelectComponent
                openOnFocus
                value={value ?? options?.[0]}
                label='Label'
                tooltip='Подсказка'
                placeholder='Placeholder'
                helperText='Helper text goes here'
                options={options}
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
              <SelectComponent
                openOnFocus
                value={null}
                label='Label'
                tooltip='Подсказка'
                helperText='Helper text goes here'
                placeholder='Placeholder'
                options={options}
                size='S'
                disabled
              />
              <SelectComponent
                openOnFocus
                value={null}
                label='Label'
                tooltip='Подсказка'
                helperText='Helper text goes here'
                placeholder='Placeholder'
                options={options}
                size='M'
                disabled
              />
              <SelectComponent
                openOnFocus
                value={null}
                label='Label'
                tooltip='Подсказка'
                helperText='Helper text goes here'
                placeholder='Placeholder'
                options={options}
                size='L'
                disabled
              />
              <SelectComponent
                openOnFocus
                value={null}
                label='Label'
                tooltip='Подсказка'
                helperText='Helper text goes here'
                placeholder='Placeholder'
                options={options}
                size='XL'
                disabled
              />
            </Row>
          </Row>
        </Item>
        <Item label='With label, icon tooltip canClear helper'>
          <Row gutter={16}>
            <Row direction='column' gutter={16}>
              <SelectComponent
                openOnFocus
                value={value}
                placeholder='Placeholder'
                label='Label'
                size='S'
                icon='orm'
                options={options}
                onChange={onChange}
                canClear
                helperText='Helper text goes here'
              />
              <SelectComponent
                openOnFocus
                value={value}
                placeholder='Placeholder'
                label='Label'
                size='M'
                icon='orm'
                options={options}
                onChange={onChange}
                canClear
                helperText='Helper text goes here'
              />
              <SelectComponent
                openOnFocus
                value={value}
                placeholder='Placeholder'
                label='Label'
                size='L'
                icon='orm'
                options={options}
                onChange={onChange}
                canClear
                helperText='Helper text goes here'
              />
              <SelectComponent
                openOnFocus
                value={value}
                placeholder='Placeholder'
                label='Label'
                size='XL'
                icon='orm'
                options={options}
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
              <SelectComponent
                openOnFocus
                value={value}
                placeholder='Placeholder'
                label='Label'
                size='S'
                icon='orm'
                tooltip='Подсказка'
                helperText='Helper text goes here'
                options={options}
                onChange={onChange}
                canClear
                required
              />
              <SelectComponent
                openOnFocus
                value={value}
                placeholder='Placeholder'
                label='Label'
                size='M'
                icon='orm'
                tooltip='Подсказка'
                helperText='Helper text goes here'
                options={options}
                onChange={onChange}
                canClear
                required
              />
              <SelectComponent
                openOnFocus
                value={value}
                placeholder='Placeholder'
                label='Label'
                size='L'
                icon='orm'
                tooltip='Подсказка'
                helperText='Helper text goes here'
                options={options}
                onChange={onChange}
                canClear
                required
              />
              <SelectComponent
                openOnFocus
                value={value}
                placeholder='Placeholder'
                label='Label'
                size='XL'
                icon='orm'
                tooltip='Подсказка'
                helperText='Helper text goes here'
                options={options}
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
              <SelectComponent
                openOnFocus
                value={value}
                placeholder='Placeholder'
                label='Label'
                size='S'
                icon='orm'
                helperText='Helper text goes here'
                options={options}
                onChange={onChange}
                canClear
                loading
              />
              <SelectComponent
                openOnFocus
                value={value}
                placeholder='Placeholder'
                label='Label'
                size='M'
                icon='orm'
                helperText='Helper text goes here'
                options={options}
                onChange={onChange}
                canClear
                loading
              />
              <SelectComponent
                openOnFocus
                value={value}
                placeholder='Placeholder'
                label='Label'
                size='L'
                icon='orm'
                helperText='Helper text goes here'
                options={options}
                onChange={onChange}
                canClear
                loading
              />
              <SelectComponent
                openOnFocus
                value={value}
                placeholder='Placeholder'
                label='Label'
                size='XL'
                icon='orm'
                helperText='Helper text goes here'
                options={options}
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
              <SelectComponent
                openOnFocus
                value={value}
                placeholder='Placeholder'
                label='Label'
                size='S'
                icon='orm'
                helperText='Error messages text goes here'
                options={options}
                onChange={onChange}
                canClear
                error
              />
              <SelectComponent
                openOnFocus
                value={value}
                placeholder='Placeholder'
                label='Label'
                size='M'
                icon='orm'
                helperText='Error messages text goes here'
                options={options}
                onChange={onChange}
                canClear
                error
              />
              <SelectComponent
                openOnFocus
                value={value}
                placeholder='Placeholder'
                label='Label'
                size='L'
                icon='orm'
                helperText='Error messages text goes here'
                options={options}
                onChange={onChange}
                canClear
                error
              />
              <SelectComponent
                openOnFocus
                value={value}
                placeholder='Placeholder'
                label='Label'
                size='XL'
                icon='orm'
                helperText='Error messages text goes here'
                options={options}
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
              <SelectComponent
                openOnFocus
                value={value ?? options?.[0]}
                label='Label'
                tooltip='Подсказка'
                options={options}
                onChange={onChange}
                size='S'
                icon='orm'
                helperText='Error messages text goes here'
                error
              />
              <SelectComponent
                openOnFocus
                value={value ?? options?.[0]}
                label='Label'
                tooltip='Подсказка'
                options={options}
                onChange={onChange}
                size='M'
                icon='orm'
                helperText='Error messages text goes here'
                error
              />
              <SelectComponent
                openOnFocus
                value={value ?? options?.[0]}
                label='Label'
                tooltip='Подсказка'
                options={options}
                onChange={onChange}
                size='L'
                icon='orm'
                helperText='Error messages text goes here'
                error
              />
              <SelectComponent
                openOnFocus
                value={value ?? options?.[0]}
                label='Label'
                tooltip='Подсказка'
                options={options}
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
              <SelectComponent
                openOnFocus
                value={value ?? options?.[0]}
                label='Label'
                tooltip='Подсказка'
                placeholder='Placeholder'
                helperText='Helper text goes here'
                options={options}
                onChange={onChange}
                size='S'
                icon='orm'
                disabled
              />
              <SelectComponent
                openOnFocus
                value={value ?? options?.[0]}
                label='Label'
                tooltip='Подсказка'
                placeholder='Placeholder'
                helperText='Helper text goes here'
                options={options}
                onChange={onChange}
                size='M'
                icon='orm'
                disabled
              />
              <SelectComponent
                openOnFocus
                value={value ?? options?.[0]}
                label='Label'
                tooltip='Подсказка'
                placeholder='Placeholder'
                helperText='Helper text goes here'
                options={options}
                onChange={onChange}
                size='L'
                icon='orm'
                disabled
              />
              <SelectComponent
                openOnFocus
                value={value ?? options?.[0]}
                label='Label'
                tooltip='Подсказка'
                placeholder='Placeholder'
                helperText='Helper text goes here'
                options={options}
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
              <SelectComponent
                openOnFocus
                value={null}
                label='Label'
                tooltip='Подсказка'
                helperText='Helper text goes here'
                placeholder='Placeholder'
                options={options}
                size='S'
                icon='orm'
                disabled
              />
              <SelectComponent
                openOnFocus
                value={null}
                label='Label'
                tooltip='Подсказка'
                helperText='Helper text goes here'
                placeholder='Placeholder'
                options={options}
                size='M'
                icon='orm'
                disabled
              />
              <SelectComponent
                openOnFocus
                value={null}
                label='Label'
                tooltip='Подсказка'
                helperText='Helper text goes here'
                placeholder='Placeholder'
                options={options}
                size='L'
                icon='orm'
                disabled
              />
              <SelectComponent
                openOnFocus
                value={null}
                label='Label'
                tooltip='Подсказка'
                helperText='Helper text goes here'
                placeholder='Placeholder'
                options={options}
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
