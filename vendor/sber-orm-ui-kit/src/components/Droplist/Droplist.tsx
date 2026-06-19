import { ComboboxEvent, OptionListProps, Options } from '@v-uik/combo-box';
import { useMergedRefs } from '@v-uik/hooks';
import { List, ListItemProps } from '@v-uik/list';
import { TreeProps } from '@v-uik/tree';
import React, { useEffect, useRef, useState } from 'react';

import { Button } from '../Button';
import { FieldSearch } from '../FieldSearch';
import { Row } from '../Grid';
import { ScrollBar } from '../ScrollBar';
import { Text } from '../Typography';
import { Divider, DroplistItem, TOption, TreeOptionList } from './components';

import classes from './styles.module.scss';

export type TDropListProps = Partial<OptionListProps<unknown, 'ul', 'li'>> & {
  showOptionValue?: boolean;
  showOptionSearch?: boolean;
  showDroplistButtons?: boolean;
  useCustomSearch?: boolean;
  optionRenderLimit?: number;
  onSubmit?: (value: Options<unknown>) => void;
  onSearch?: (value: string) => void;
  tree?: boolean;
  treeProps?: Partial<TreeProps>;
  onFirstRender?: () => void;
  testId?: string;
};

export const Droplist = React.forwardRef((props: TDropListProps, ref) => {
  const {
    showOptionValue,
    showOptionSearch,
    showDroplistButtons = false,
    onSubmit,
    onSearch,
    tree = false,
    optionRenderLimit,
    testId,
    options,
    filteredOptions,
    useCustomSearch = false,
    inputValue,
    loading,
    ...properties
  } = props;

  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const mergedWrapperRef = useMergedRefs([ref, wrapperRef]);
  const [searchValue, setSearchValue] = useState<string>('');

  const inputRef = useRef<HTMLInputElement | null>(null);

  const [optionsLocal, setOptionsLocal] = useState(
    filteredOptions ?? options ?? [],
  );

  useEffect(() => {
    setOptionsLocal(filteredOptions ?? options ?? []);
  }, [filteredOptions, options]);

  useEffect(() => {
    properties.onFirstRender?.();
  }, []);

  const handleSearchChange = (value: string) => {
    setSearchValue(value);
    if (onSearch) {
      onSearch(value);
      return;
    }

    if (!value) {
      setOptionsLocal(filteredOptions ?? options ?? []);
      return;
    }

    setOptionsLocal(
      ((filteredOptions ?? options) as TOption[]).filter((option) =>
        option?.label?.toLowerCase()?.includes(value?.toLowerCase()),
      ),
    );
  };

  const handleSubmit = () => {
    onSubmit?.(props.selectedValue || []);
    props.onOpen?.(false);
  };

  const handleClear = (e: React.MouseEvent) => {
    props.handleClear?.(e as ComboboxEvent);
    props.onOpen?.(false);
  };

  const isCustomSearch = useCustomSearch && (!!inputValue || !!searchValue);
  return (
    <div className={classes.dropListWrap} ref={mergedWrapperRef}>
      {showOptionSearch && (
        <div className={classes.sideWrap}>
          <FieldSearch
            handleChange={handleSearchChange}
            size='S'
            placeholder='Поиск'
            label=''
            value={searchValue}
            inputRef={inputRef}
            onClick={(e: React.MouseEvent) => {
              e.stopPropagation();
              e.preventDefault();
              inputRef?.current?.focus();
            }}
            noBorder
            grayIcon
            data-testid={testId ? `${testId}-search` : undefined}
          />
          <Divider />
        </div>
      )}
      {loading && <div className={classes.sideWrap}>{props.loadingLabel}</div>}
      {!loading && tree && !isCustomSearch && optionsLocal.length > 0 && (
        /* @ts-expect-error несовместимость типов дерева и выпадающего списка */
        <TreeOptionList
          {...properties}
          options={optionsLocal as Options<ListItemProps<'li'>>}
          testId={testId}
          showOptionValue={showOptionValue}
        />
      )}
      {!loading && (!tree || isCustomSearch) && !!optionsLocal?.length && (
        <ScrollBar className={classes.scrollbar}>
          <List<'ul'>
            role='list'
            {...properties.listProps}
            className={classes.dropList}
            interactive={false}
          >
            {(
              (optionRenderLimit
                ? optionsLocal.slice(0, optionRenderLimit)
                : optionsLocal) as TOption[]
            ).map((option) => (
              <DroplistItem
                key={`droplist-item-${option.key}`}
                option={option}
                onSelectOption={properties.onSelectOption}
                selectedValue={properties.selectedValue as TOption[]}
                showOptionValue={showOptionValue}
                isMulti={properties.isMulti}
                testId={testId}
                searchValue={isCustomSearch ? inputValue || searchValue : ''}
              />
            ))}
          </List>
        </ScrollBar>
      )}
      {!loading && !optionsLocal?.length && (
        <Text size='lg' className={classes.emptyList}>
          {properties.noOptionsText || 'Ничего не найдено'}
        </Text>
      )}
      {!loading && properties.isMulti && showDroplistButtons && (
        <div className={classes.sideWrap}>
          <Divider />
          <Row justify='between' className={classes.buttonsWrap}>
            <Button variant='function' onClick={handleClear}>
              Очистить
            </Button>
            <Button
              variant='function'
              disabled={!props.hasValue}
              onClick={handleSubmit}
              link={props.hasValue}
            >
              Применить
            </Button>
          </Row>
        </div>
      )}
    </div>
  );
});
