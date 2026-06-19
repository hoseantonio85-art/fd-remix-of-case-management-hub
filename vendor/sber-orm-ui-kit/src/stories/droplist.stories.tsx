import { useState } from 'react';

import { Meta, StoryFn } from '@storybook/react';

import { Droplist as DroplistComponent } from '..';

import { DemoContainer, Container, Item } from './utils';

const meta: Meta<typeof DroplistComponent> = {
  argTypes: {
    tree: {
      control: 'boolean',
      description: 'Отображать дерево в списке',
    },
    optionRenderLimit: {
      control: 'number',
      description: 'Максимальное количество опций для отображения',
    },
    showOptionValue: {
      control: 'boolean',
      description: 'Отображать значение опции (id)',
    },
    showOptionSearch: {
      control: 'boolean',
      description: 'Отображать поле поиска по опциям',
    },
    showDroplistButtons: {
      control: 'boolean',
      description:
        'Отображать кнопки принять/очистить под выпадающим списком (только при `isMulti` = `true`)',
    },
    isMulti: {
      control: 'boolean',
      description: 'Позволять множественный выбор',
    },
    onSelectOption: {
      desciption:
        'Обработчик выбора опции `(option: unknown, event: ComboboxEvent) => void`',
    },
  },
  args: {
    tree: false,
    optionRenderLimit: 5,
    showOptionValue: false,
    showOptionSearch: false,
    showDroplistButtons: false,
    isMulti: false,
    onSelectOption: () => {},
  },
  parameters: {
    controls: {
      expanded: true,
    },
  },
  component: DroplistComponent,
  title: 'components/Droplist',
};

export default meta;

const options = [
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
const optionsMulti = [...options];

export const Droplist: StoryFn<typeof DroplistComponent> = (arguments_) => {
  const [value, setValue] = useState<any[]>([]);
  const [valueMulti, setValueMulti] = useState<any[]>([]);
  const handleChangeSingle = (option: any) => {
    let selectedOtionsClone = [...value];

    const index = selectedOtionsClone.findIndex(
      (x) => x.value === option.value,
    );
    if (index !== -1) {
      setValue([]);
    } else {
      setValue([option]);
    }
  };

  const handleChangeMulti = (option: any) => {
    let selectedOtionsClone = [...valueMulti];

    const index = selectedOtionsClone.findIndex(
      (x) => x.value === option.value,
    );
    if (index !== -1) {
      selectedOtionsClone.splice(index, 1);
      setValueMulti(selectedOtionsClone);
    } else {
      setValueMulti([option, ...selectedOtionsClone]);
    }
  };

  return (
    <>
      <DemoContainer>
        <Item label='Customizable'>
          <DroplistComponent
            {...arguments_}
            selectedValue={arguments_.isMulti ? valueMulti : value}
            filteredOptions={arguments_.isMulti ? optionsMulti : options}
            onSelectOption={
              arguments_.isMulti ? handleChangeMulti : handleChangeSingle
            }
            onSubmit={() => false}
            handleClear={() => false}
          />
        </Item>
      </DemoContainer>
      <Container>
        <Item label='basic'>
          <DroplistComponent
            selectedValue={value}
            filteredOptions={options}
            onSelectOption={handleChangeSingle}
          />
        </Item>
        <Item label='isMulti'>
          <DroplistComponent
            selectedValue={valueMulti}
            filteredOptions={optionsMulti}
            onSelectOption={handleChangeMulti}
            isMulti
          />
        </Item>
        <Item label='tree'>
          <DroplistComponent
            selectedValue={value}
            options={options}
            onSelectOption={handleChangeSingle}
            tree
          />
        </Item>
        <Item label='tree isMulti'>
          <DroplistComponent
            selectedValue={valueMulti}
            options={optionsMulti}
            onSelectOption={handleChangeMulti}
            isMulti
            tree
          />
        </Item>
        <Item label='tree showOptionValue'>
          <DroplistComponent
            selectedValue={value}
            options={options}
            onSelectOption={handleChangeSingle}
            showOptionValue
            tree
          />
        </Item>
        <Item label='tree isMulti showOptionValue'>
          <DroplistComponent
            selectedValue={valueMulti}
            options={optionsMulti}
            onSelectOption={handleChangeMulti}
            showOptionValue
            isMulti
            tree
          />
        </Item>
        <Item label='showOptionValue showOptionSearch'>
          <DroplistComponent
            selectedValue={value}
            filteredOptions={options}
            onSelectOption={handleChangeSingle}
            showOptionValue
            showOptionSearch
          />
        </Item>
        <Item label='isMulti showOptionValue showOptionSearch'>
          <DroplistComponent
            selectedValue={valueMulti}
            filteredOptions={optionsMulti}
            onSelectOption={handleChangeMulti}
            showOptionValue
            showOptionSearch
            isMulti
          />
        </Item>
        <Item label='isMulti showOptionValue showOptionSearch showDroplistButtons'>
          <DroplistComponent
            selectedValue={valueMulti}
            filteredOptions={optionsMulti}
            onSelectOption={handleChangeMulti}
            onSubmit={(value) => console.log(value)}
            handleClear={() => setValueMulti([])}
            hasValue={valueMulti.length > 0}
            showDroplistButtons
            showOptionValue
            showOptionSearch
            isMulti
          />
        </Item>
      </Container>
    </>
  );
};
