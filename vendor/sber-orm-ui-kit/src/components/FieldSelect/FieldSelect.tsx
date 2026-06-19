import React, { useEffect, useState } from 'react';
import cn from 'classnames';

import { EIconName } from '@/icons';

import { IInputProperties, Input } from '../Input';
import { Select, TSelectProperties } from '../Select';

import classes from './styles.module.scss';

export type TSearchValue = {
  value?: string;
  scope?: unknown;
};
export interface IFieldSelectProperties extends IInputProperties {
  scopeProps: TSelectProperties;
  search?: TSearchValue;
  handleChange?: (value: string, scope: unknown) => void;
  grayIcon?: boolean;
  icon?: EIconName;
}

export const FieldSelect = (props: IFieldSelectProperties) => {
  const {
    label,
    search,
    handleChange,
    value,
    scopeProps,
    grayIcon,
    ...inputProps
  } = props;
  const [inputValue, setInputValue] = useState(search?.value ?? '');
  const [scopeValue, setScopeValue] = useState<unknown>(
    search?.scope ?? scopeProps?.options?.[0] ?? null,
  );

  const onInputChange = (value: string) => setInputValue(value);
  const onScopeChange = (_key: React.Key, _event: unknown, nodes: unknown) =>
    setScopeValue(nodes);

  useEffect(() => {
    handleChange?.(inputValue, scopeValue);
  }, [inputValue, scopeValue]);

  return (
    <div
      className={cn(classes.fieldGrid, {
        [classes.complexFieldWithHelper]: !!inputProps.helperText,
      })}
    >
      <Input
        {...inputProps}
        value={value ?? inputValue}
        onChange={onInputChange}
        label={label ?? 'Label'}
        isComplexPart
        grayPrefix={!!grayIcon}
      />
      <Select
        options={scopeProps.options}
        value={scopeValue}
        onChange={onScopeChange}
        size={inputProps.size}
        dropdownProps={{
          placement: 'bottom-end',
        }}
        limitByWidth={false}
        openOnFocus
        isComplexPart
      />
    </div>
  );
};
