import { Meta, StoryFn } from '@storybook/react';
import { useState } from 'react';

import { FieldSearch as FieldSearchComponent, Row, TSearchValue } from '..';
import { Container, Item } from './utils';

const meta: Meta<typeof FieldSearchComponent> = {
  argTypes: {},
  args: {},
  component: FieldSearchComponent,
  title: 'components/FieldSearch',
};

export default meta;

const options = [
  { key: '4', label: 'Select', value: '4' },
  { key: '5', label: 'amet', value: '5' },
  { key: '6', label: 'Consectetur', value: '6' },
  { key: '7', label: 'adipiscing', value: '7' },
];

export const FieldSearch: StoryFn<typeof FieldSearchComponent> = () => {
  const [value, setValue] = useState<TSearchValue>({});
  const handleChange = (value: string, scope?: unknown) => {
    setValue({ value, scope });
  };
  const valueExample = {
    value: 'QNR-1',
    scope: '4',
  };

  return (
    <Container>
      <Item width={400} label='basic default tooltip'>
        <Row gutter={16}>
          <Row direction='column' gutter={16}>
            <FieldSearchComponent
              search={value}
              handleChange={handleChange}
              size='S'
              tooltip='Подсказка'
              labelInside
            />
            <FieldSearchComponent
              search={value}
              handleChange={handleChange}
              size='M'
              tooltip='Подсказка'
              labelInside
            />
            <FieldSearchComponent
              search={value}
              handleChange={handleChange}
              size='L'
              tooltip='Подсказка'
              labelInside
            />
            <FieldSearchComponent
              search={value}
              handleChange={handleChange}
              size='XL'
              tooltip='Подсказка'
              labelInside
            />
          </Row>
        </Row>
      </Item>
      <Item width={400} label='basic error tooltip'>
        <Row gutter={16}>
          <Row direction='column' gutter={16}>
            <FieldSearchComponent
              search={value}
              handleChange={handleChange}
              size='S'
              tooltip='Подсказка'
              error
              labelInside
            />
            <FieldSearchComponent
              search={value}
              handleChange={handleChange}
              size='M'
              tooltip='Подсказка'
              error
              labelInside
            />
            <FieldSearchComponent
              search={value}
              handleChange={handleChange}
              size='L'
              tooltip='Подсказка'
              error
              labelInside
            />
            <FieldSearchComponent
              search={value}
              handleChange={handleChange}
              size='XL'
              tooltip='Подсказка'
              error
              labelInside
            />
          </Row>
        </Row>
      </Item>
      <Item width={400} label='basic disabled empty tooltip'>
        <Row gutter={16}>
          <Row direction='column' gutter={16}>
            <FieldSearchComponent
              search={value}
              size='S'
              tooltip='Подсказка'
              disabled
              labelInside
            />
            <FieldSearchComponent
              search={value}
              size='M'
              tooltip='Подсказка'
              disabled
              labelInside
            />
            <FieldSearchComponent
              search={value}
              size='L'
              tooltip='Подсказка'
              disabled
              labelInside
            />
            <FieldSearchComponent
              search={value}
              size='XL'
              tooltip='Подсказка'
              disabled
              labelInside
            />
          </Row>
        </Row>
      </Item>
      <Item width={400} label='basic disabled filled tooltip'>
        <Row gutter={16}>
          <Row direction='column' gutter={16}>
            <FieldSearchComponent
              search={valueExample}
              size='S'
              tooltip='Подсказка'
              disabled
              labelInside
            />
            <FieldSearchComponent
              search={valueExample}
              size='M'
              tooltip='Подсказка'
              disabled
              labelInside
            />
            <FieldSearchComponent
              search={valueExample}
              size='L'
              tooltip='Подсказка'
              disabled
              labelInside
            />
            <FieldSearchComponent
              search={valueExample}
              size='XL'
              tooltip='Подсказка'
              disabled
              labelInside
            />
          </Row>
        </Row>
      </Item>
      <Item width={400} label='with select, tooltip required'>
        <Row gutter={16}>
          <Row direction='column' gutter={16}>
            <FieldSearchComponent
              search={value}
              size='S'
              tooltip='Подсказка'
              handleChange={handleChange}
              scopeProps={{
                options,
              }}
              labelInside
              required
            />
            <FieldSearchComponent
              search={value}
              size='M'
              tooltip='Подсказка'
              handleChange={handleChange}
              scopeProps={{
                options,
              }}
              labelInside
              required
            />
            <FieldSearchComponent
              search={value}
              size='L'
              tooltip='Подсказка'
              handleChange={handleChange}
              scopeProps={{
                options,
              }}
              labelInside
              required
            />
            <FieldSearchComponent
              search={value}
              size='XL'
              tooltip='Подсказка'
              handleChange={handleChange}
              scopeProps={{
                options,
              }}
              labelInside
              required
            />
          </Row>
        </Row>
      </Item>
      <Item width={400} label='with select, empty error tooltip required'>
        <Row gutter={16}>
          <Row direction='column' gutter={16}>
            <FieldSearchComponent
              search={value}
              size='S'
              tooltip='Подсказка'
              handleChange={handleChange}
              scopeProps={{
                options,
              }}
              labelInside
              required
              error
            />
            <FieldSearchComponent
              search={value}
              size='M'
              tooltip='Подсказка'
              handleChange={handleChange}
              scopeProps={{
                options,
              }}
              labelInside
              required
              error
            />
            <FieldSearchComponent
              search={value}
              size='L'
              tooltip='Подсказка'
              handleChange={handleChange}
              scopeProps={{
                options,
              }}
              labelInside
              required
              error
            />
            <FieldSearchComponent
              search={value}
              size='XL'
              tooltip='Подсказка'
              handleChange={handleChange}
              scopeProps={{
                options,
              }}
              labelInside
              required
              error
            />
          </Row>
        </Row>
      </Item>
      <Item width={400} label='with select, filled error tooltip required'>
        <Row gutter={16}>
          <Row direction='column' gutter={16}>
            <FieldSearchComponent
              search={valueExample}
              size='S'
              tooltip='Подсказка'
              handleChange={handleChange}
              scopeProps={{
                options,
              }}
              labelInside
              required
              error
            />
            <FieldSearchComponent
              search={valueExample}
              size='M'
              tooltip='Подсказка'
              handleChange={handleChange}
              scopeProps={{
                options,
              }}
              labelInside
              required
              error
            />
            <FieldSearchComponent
              search={valueExample}
              size='L'
              tooltip='Подсказка'
              handleChange={handleChange}
              scopeProps={{
                options,
              }}
              labelInside
              required
              error
            />
            <FieldSearchComponent
              search={valueExample}
              size='XL'
              tooltip='Подсказка'
              handleChange={handleChange}
              scopeProps={{
                options,
              }}
              labelInside
              required
              error
            />
          </Row>
        </Row>
      </Item>
      <Item width={400} label='with select, filled disabled tooltip'>
        <Row gutter={16}>
          <Row direction='column' gutter={16}>
            <FieldSearchComponent
              search={valueExample}
              size='S'
              tooltip='Подсказка'
              handleChange={handleChange}
              scopeProps={{
                options,
              }}
              labelInside
              disabled
            />
            <FieldSearchComponent
              search={valueExample}
              size='M'
              tooltip='Подсказка'
              handleChange={handleChange}
              scopeProps={{
                options,
              }}
              labelInside
              disabled
            />
            <FieldSearchComponent
              search={valueExample}
              size='L'
              tooltip='Подсказка'
              handleChange={handleChange}
              scopeProps={{
                options,
              }}
              labelInside
              disabled
            />
            <FieldSearchComponent
              search={valueExample}
              size='XL'
              tooltip='Подсказка'
              handleChange={handleChange}
              scopeProps={{
                options,
              }}
              labelInside
              disabled
            />
          </Row>
        </Row>
      </Item>
      <Item width={400} label='with select, empty disabled tooltip'>
        <Row gutter={16}>
          <Row direction='column' gutter={16}>
            <FieldSearchComponent
              search={value}
              size='S'
              tooltip='Подсказка'
              handleChange={handleChange}
              scopeProps={{
                options,
              }}
              labelInside
              disabled
            />
            <FieldSearchComponent
              search={value}
              size='M'
              tooltip='Подсказка'
              handleChange={handleChange}
              scopeProps={{
                options,
              }}
              labelInside
              disabled
            />
            <FieldSearchComponent
              search={value}
              size='L'
              tooltip='Подсказка'
              handleChange={handleChange}
              scopeProps={{
                options,
              }}
              labelInside
              disabled
            />
            <FieldSearchComponent
              search={value}
              size='XL'
              tooltip='Подсказка'
              handleChange={handleChange}
              scopeProps={{
                options,
              }}
              labelInside
              disabled
            />
          </Row>
        </Row>
      </Item>
      <Item width={400} label='with label, default required tooltip helper'>
        <Row gutter={16}>
          <Row direction='column' gutter={16}>
            <FieldSearchComponent
              search={value}
              handleChange={handleChange}
              size='S'
              tooltip='Подсказка'
              helperText='Helper text goes here'
              placeholder='Search'
              required
            />
            <FieldSearchComponent
              search={value}
              handleChange={handleChange}
              size='M'
              tooltip='Подсказка'
              helperText='Helper text goes here'
              placeholder='Search'
              required
            />
            <FieldSearchComponent
              search={value}
              handleChange={handleChange}
              size='L'
              tooltip='Подсказка'
              helperText='Helper text goes here'
              placeholder='Search'
              required
            />
            <FieldSearchComponent
              search={value}
              handleChange={handleChange}
              size='XL'
              tooltip='Подсказка'
              helperText='Helper text goes here'
              placeholder='Search'
              required
            />
          </Row>
        </Row>
      </Item>
      <Item width={400} label='with label, error tooltip helper'>
        <Row gutter={16}>
          <Row direction='column' gutter={16}>
            <FieldSearchComponent
              search={value}
              handleChange={handleChange}
              size='S'
              tooltip='Подсказка'
              helperText='Error text goes here'
              placeholder='Search'
              error
            />
            <FieldSearchComponent
              search={value}
              handleChange={handleChange}
              size='M'
              tooltip='Подсказка'
              helperText='Error text goes here'
              placeholder='Search'
              error
            />
            <FieldSearchComponent
              search={value}
              handleChange={handleChange}
              size='L'
              tooltip='Подсказка'
              helperText='Error text goes here'
              placeholder='Search'
              error
            />
            <FieldSearchComponent
              search={value}
              handleChange={handleChange}
              size='XL'
              tooltip='Подсказка'
              helperText='Error text goes here'
              placeholder='Search'
              error
            />
          </Row>
        </Row>
      </Item>
      <Item width={400} label='with label, disabled empty tooltip helper'>
        <Row gutter={16}>
          <Row direction='column' gutter={16}>
            <FieldSearchComponent
              search={value}
              size='S'
              tooltip='Подсказка'
              helperText='Helper text goes here'
              placeholder='Search'
              disabled
            />
            <FieldSearchComponent
              search={value}
              size='M'
              tooltip='Подсказка'
              helperText='Helper text goes here'
              placeholder='Search'
              disabled
            />
            <FieldSearchComponent
              search={value}
              size='L'
              tooltip='Подсказка'
              helperText='Helper text goes here'
              placeholder='Search'
              disabled
            />
            <FieldSearchComponent
              search={value}
              size='XL'
              tooltip='Подсказка'
              helperText='Helper text goes here'
              placeholder='Search'
              disabled
            />
          </Row>
        </Row>
      </Item>
      <Item width={400} label='with label, disabled filled tooltip helper'>
        <Row gutter={16}>
          <Row direction='column' gutter={16}>
            <FieldSearchComponent
              search={valueExample}
              size='S'
              tooltip='Подсказка'
              helperText='Helper text goes here'
              placeholder='Search'
              disabled
            />
            <FieldSearchComponent
              search={valueExample}
              size='M'
              tooltip='Подсказка'
              helperText='Helper text goes here'
              placeholder='Search'
              disabled
            />
            <FieldSearchComponent
              search={valueExample}
              size='L'
              tooltip='Подсказка'
              helperText='Helper text goes here'
              placeholder='Search'
              disabled
            />
            <FieldSearchComponent
              search={valueExample}
              size='XL'
              tooltip='Подсказка'
              helperText='Helper text goes here'
              placeholder='Search'
              disabled
            />
          </Row>
        </Row>
      </Item>
      <Item
        width={400}
        label='with select and label, default required tooltip helper'
      >
        <Row gutter={16}>
          <Row direction='column' gutter={16}>
            <FieldSearchComponent
              search={value}
              size='S'
              tooltip='Подсказка'
              placeholder='Search'
              helperText='Helper text goes here'
              handleChange={handleChange}
              scopeProps={{
                options,
              }}
              required
            />
            <FieldSearchComponent
              search={value}
              size='M'
              tooltip='Подсказка'
              placeholder='Search'
              helperText='Helper text goes here'
              handleChange={handleChange}
              scopeProps={{
                options,
              }}
              required
            />
            <FieldSearchComponent
              search={value}
              size='L'
              tooltip='Подсказка'
              placeholder='Search'
              helperText='Helper text goes here'
              handleChange={handleChange}
              scopeProps={{
                options,
              }}
              required
            />
            <FieldSearchComponent
              search={value}
              size='XL'
              tooltip='Подсказка'
              placeholder='Search'
              helperText='Helper text goes here'
              handleChange={handleChange}
              scopeProps={{
                options,
              }}
              required
            />
          </Row>
        </Row>
      </Item>
      <Item
        width={400}
        label='with select and label, error empty required tooltip helper'
      >
        <Row gutter={16}>
          <Row direction='column' gutter={16}>
            <FieldSearchComponent
              search={value}
              size='S'
              tooltip='Подсказка'
              placeholder='Search'
              helperText='Error text goes here'
              handleChange={handleChange}
              scopeProps={{
                options,
              }}
              error
              required
            />
            <FieldSearchComponent
              search={value}
              size='M'
              tooltip='Подсказка'
              placeholder='Search'
              helperText='Error text goes here'
              handleChange={handleChange}
              scopeProps={{
                options,
              }}
              error
              required
            />
            <FieldSearchComponent
              search={value}
              size='L'
              tooltip='Подсказка'
              placeholder='Search'
              helperText='Error text goes here'
              handleChange={handleChange}
              scopeProps={{
                options,
              }}
              error
              required
            />
            <FieldSearchComponent
              search={value}
              size='XL'
              tooltip='Подсказка'
              placeholder='Search'
              helperText='Error text goes here'
              handleChange={handleChange}
              scopeProps={{
                options,
              }}
              error
              required
            />
          </Row>
        </Row>
      </Item>
      <Item
        width={400}
        label='with select and label, error filled required tooltip helper'
      >
        <Row gutter={16}>
          <Row direction='column' gutter={16}>
            <FieldSearchComponent
              search={valueExample}
              size='S'
              tooltip='Подсказка'
              placeholder='Search'
              helperText='Error text goes here'
              handleChange={handleChange}
              scopeProps={{
                options,
              }}
              error
              required
            />
            <FieldSearchComponent
              search={valueExample}
              size='M'
              tooltip='Подсказка'
              placeholder='Search'
              helperText='Error text goes here'
              handleChange={handleChange}
              scopeProps={{
                options,
              }}
              error
              required
            />
            <FieldSearchComponent
              search={valueExample}
              size='L'
              tooltip='Подсказка'
              placeholder='Search'
              helperText='Error text goes here'
              handleChange={handleChange}
              scopeProps={{
                options,
              }}
              error
              required
            />
            <FieldSearchComponent
              search={valueExample}
              size='XL'
              tooltip='Подсказка'
              placeholder='Search'
              helperText='Error text goes here'
              handleChange={handleChange}
              scopeProps={{
                options,
              }}
              error
              required
            />
          </Row>
        </Row>
      </Item>
      <Item
        width={400}
        label='with select and label, disabled filled required tooltip helper'
      >
        <Row gutter={16}>
          <Row direction='column' gutter={16}>
            <FieldSearchComponent
              search={valueExample}
              size='S'
              tooltip='Подсказка'
              placeholder='Search'
              helperText='Helper text goes here'
              handleChange={handleChange}
              scopeProps={{
                options,
              }}
              disabled
              required
            />
            <FieldSearchComponent
              search={valueExample}
              size='M'
              tooltip='Подсказка'
              placeholder='Search'
              helperText='Helper text goes here'
              handleChange={handleChange}
              scopeProps={{
                options,
              }}
              disabled
              required
            />
            <FieldSearchComponent
              search={valueExample}
              size='L'
              tooltip='Подсказка'
              placeholder='Search'
              helperText='Helper text goes here'
              handleChange={handleChange}
              scopeProps={{
                options,
              }}
              disabled
              required
            />
            <FieldSearchComponent
              search={valueExample}
              size='XL'
              tooltip='Подсказка'
              placeholder='Search'
              helperText='Helper text goes here'
              handleChange={handleChange}
              scopeProps={{
                options,
              }}
              disabled
              required
            />
          </Row>
        </Row>
      </Item>
      <Item
        width={400}
        label='with select and label, disabled empty required tooltip helper'
      >
        <Row gutter={16}>
          <Row direction='column' gutter={16}>
            <FieldSearchComponent
              search={value}
              size='S'
              tooltip='Подсказка'
              placeholder='Search'
              helperText='Helper text goes here'
              handleChange={handleChange}
              scopeProps={{
                options,
              }}
              disabled
              required
            />
            <FieldSearchComponent
              search={value}
              size='M'
              tooltip='Подсказка'
              placeholder='Search'
              helperText='Helper text goes here'
              handleChange={handleChange}
              scopeProps={{
                options,
              }}
              disabled
              required
            />
            <FieldSearchComponent
              search={value}
              size='L'
              tooltip='Подсказка'
              placeholder='Search'
              helperText='Helper text goes here'
              handleChange={handleChange}
              scopeProps={{
                options,
              }}
              disabled
              required
            />
            <FieldSearchComponent
              search={value}
              size='XL'
              tooltip='Подсказка'
              placeholder='Search'
              helperText='Helper text goes here'
              handleChange={handleChange}
              scopeProps={{
                options,
              }}
              disabled
              required
            />
          </Row>
        </Row>
      </Item>
    </Container>
  );
};
