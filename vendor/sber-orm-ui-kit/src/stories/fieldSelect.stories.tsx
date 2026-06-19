import { Meta, StoryFn } from '@storybook/react';
import { useState } from 'react';

import { FieldSelect as FieldSelectComponent, Row, TSearchValue } from '..';
import { EIconName } from '../icons';
import { Container, Item } from './utils';

const meta: Meta<typeof FieldSelectComponent> = {
  argTypes: {},
  args: {},
  component: FieldSelectComponent,
  title: 'components/FieldSelect',
};

export default meta;

const options = [
  { key: '4', label: 'Select', value: '4' },
  { key: '5', label: 'amet', value: '5' },
  { key: '6', label: 'Consectetur', value: '6' },
  { key: '7', label: 'adipiscing', value: '7' },
];

export const FieldSelect: StoryFn<typeof FieldSelectComponent> = () => {
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
      <Item width={400} label='with icon, tooltip required'>
        <Row gutter={16}>
          <Row direction='column' gutter={16}>
            <FieldSelectComponent
              search={value}
              size='S'
              tooltip='Подсказка'
              icon={'orm' as EIconName}
              handleChange={handleChange}
              scopeProps={{
                options,
              }}
              labelInside
              required
            />
            <FieldSelectComponent
              search={value}
              size='M'
              tooltip='Подсказка'
              icon={'orm' as EIconName}
              handleChange={handleChange}
              scopeProps={{
                options,
              }}
              labelInside
              required
            />
            <FieldSelectComponent
              search={value}
              size='L'
              tooltip='Подсказка'
              icon={'orm' as EIconName}
              handleChange={handleChange}
              scopeProps={{
                options,
              }}
              labelInside
              required
            />
            <FieldSelectComponent
              search={value}
              size='XL'
              tooltip='Подсказка'
              icon={'orm' as EIconName}
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
      <Item width={400} label='with icon, empty error tooltip required'>
        <Row gutter={16}>
          <Row direction='column' gutter={16}>
            <FieldSelectComponent
              search={value}
              size='S'
              tooltip='Подсказка'
              icon={'orm' as EIconName}
              handleChange={handleChange}
              scopeProps={{
                options,
              }}
              labelInside
              required
              error
            />
            <FieldSelectComponent
              search={value}
              size='M'
              tooltip='Подсказка'
              icon={'orm' as EIconName}
              handleChange={handleChange}
              scopeProps={{
                options,
              }}
              labelInside
              required
              error
            />
            <FieldSelectComponent
              search={value}
              size='L'
              tooltip='Подсказка'
              icon={'orm' as EIconName}
              handleChange={handleChange}
              scopeProps={{
                options,
              }}
              labelInside
              required
              error
            />
            <FieldSelectComponent
              search={value}
              size='XL'
              tooltip='Подсказка'
              icon={'orm' as EIconName}
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
      <Item width={400} label='with icon, filled error tooltip required'>
        <Row gutter={16}>
          <Row direction='column' gutter={16}>
            <FieldSelectComponent
              search={valueExample}
              size='S'
              tooltip='Подсказка'
              icon={'orm' as EIconName}
              handleChange={handleChange}
              scopeProps={{
                options,
              }}
              labelInside
              required
              error
            />
            <FieldSelectComponent
              search={valueExample}
              size='M'
              tooltip='Подсказка'
              icon={'orm' as EIconName}
              handleChange={handleChange}
              scopeProps={{
                options,
              }}
              labelInside
              required
              error
            />
            <FieldSelectComponent
              search={valueExample}
              size='L'
              tooltip='Подсказка'
              icon={'orm' as EIconName}
              handleChange={handleChange}
              scopeProps={{
                options,
              }}
              labelInside
              required
              error
            />
            <FieldSelectComponent
              search={valueExample}
              size='XL'
              tooltip='Подсказка'
              icon={'orm' as EIconName}
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
      <Item width={400} label='with icon, filled disabled tooltip'>
        <Row gutter={16}>
          <Row direction='column' gutter={16}>
            <FieldSelectComponent
              search={valueExample}
              size='S'
              tooltip='Подсказка'
              icon={'orm' as EIconName}
              handleChange={handleChange}
              scopeProps={{
                options,
              }}
              labelInside
              disabled
            />
            <FieldSelectComponent
              search={valueExample}
              size='M'
              tooltip='Подсказка'
              icon={'orm' as EIconName}
              handleChange={handleChange}
              scopeProps={{
                options,
              }}
              labelInside
              disabled
            />
            <FieldSelectComponent
              search={valueExample}
              size='L'
              tooltip='Подсказка'
              icon={'orm' as EIconName}
              handleChange={handleChange}
              scopeProps={{
                options,
              }}
              labelInside
              disabled
            />
            <FieldSelectComponent
              search={valueExample}
              size='XL'
              tooltip='Подсказка'
              icon={'orm' as EIconName}
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
      <Item width={400} label='with icon, empty disabled tooltip'>
        <Row gutter={16}>
          <Row direction='column' gutter={16}>
            <FieldSelectComponent
              search={value}
              size='S'
              tooltip='Подсказка'
              icon={'orm' as EIconName}
              handleChange={handleChange}
              scopeProps={{
                options,
              }}
              labelInside
              disabled
            />
            <FieldSelectComponent
              search={value}
              size='M'
              tooltip='Подсказка'
              icon={'orm' as EIconName}
              handleChange={handleChange}
              scopeProps={{
                options,
              }}
              labelInside
              disabled
            />
            <FieldSelectComponent
              search={value}
              size='L'
              tooltip='Подсказка'
              icon={'orm' as EIconName}
              handleChange={handleChange}
              scopeProps={{
                options,
              }}
              labelInside
              disabled
            />
            <FieldSelectComponent
              search={value}
              size='XL'
              tooltip='Подсказка'
              icon={'orm' as EIconName}
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
            <FieldSelectComponent
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
            <FieldSelectComponent
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
            <FieldSelectComponent
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
            <FieldSelectComponent
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
      <Item width={400} label='with label, error empty required tooltip helper'>
        <Row gutter={16}>
          <Row direction='column' gutter={16}>
            <FieldSelectComponent
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
            <FieldSelectComponent
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
            <FieldSelectComponent
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
            <FieldSelectComponent
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
        label='with label, error filled required tooltip helper'
      >
        <Row gutter={16}>
          <Row direction='column' gutter={16}>
            <FieldSelectComponent
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
            <FieldSelectComponent
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
            <FieldSelectComponent
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
            <FieldSelectComponent
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
        label='with label, disabled filled required tooltip helper'
      >
        <Row gutter={16}>
          <Row direction='column' gutter={16}>
            <FieldSelectComponent
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
            <FieldSelectComponent
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
            <FieldSelectComponent
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
            <FieldSelectComponent
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
        label='with label, disabled empty required tooltip helper'
      >
        <Row gutter={16}>
          <Row direction='column' gutter={16}>
            <FieldSelectComponent
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
            <FieldSelectComponent
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
            <FieldSelectComponent
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
            <FieldSelectComponent
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
