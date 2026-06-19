import { ComboboxEvent } from '@v-uik/combo-box';
import cn from 'classnames';
import { useCallback, useMemo } from 'react';
import { Checkbox } from '@/components/Checkbox';
import { Row } from '@/components/Grid';
import { Icon } from '@/components/Icon';
import { Text } from '@/components/Typography';

import { CompoundName } from './components/CompoundName';

import classes from './styles.module.scss';

export type TOption = {
  key?: string;
  label?: string;
  value?: string;
  loadable?: boolean;
  disabled?: boolean;
  active?: boolean;
  isInfoOption?: boolean;
  selectDisabled?: boolean;
};
export type TDroplistItemProps = {
  option: TOption;
  onSelectOption?: (option: unknown, event: ComboboxEvent) => void;
  selectedValue?: TOption[];
  showOptionValue?: boolean;
  isMulti?: boolean;
  testId?: string;
  searchValue?: string;
};

export const DroplistItem = (props: TDroplistItemProps) => {
  const {
    option,
    selectedValue,
    onSelectOption,
    showOptionValue,
    isMulti,
    testId,
    searchValue,
  } = props;
  const isSelected = useMemo(() => {
    const selectedValueKeys = (selectedValue ?? []).map(({ key }) => key);
    return selectedValueKeys.some((key) => key === option.key);
  }, [selectedValue, option]);
  const onMouseDown = useCallback((event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
  }, []);

  const onClick = useCallback(
    (event: React.MouseEvent) => {
      event.preventDefault();
      event.stopPropagation();
      if (option.disabled || option.loadable) {
        return;
      }

      onSelectOption?.(option, event as ComboboxEvent);
    },
    [onSelectOption, option.disabled, option.loadable],
  );

  return (
    <li
      role='option'
      className={cn(classes.itemWrap, {
        [classes.disabled]: option.disabled || option.loadable,
      })}
      title={option.label}
      onClick={onClick}
      onMouseDown={onMouseDown}
      data-testid={testId ? `${testId}-item` : undefined}
    >
      <Row justify='between'>
        <div className={classes.itemTextWrap}>
          {isMulti && (
            <Checkbox checked={isSelected} disabled={option.selectDisabled} />
          )}
          <Row className={classes.optionValueWrap}>
            {showOptionValue && (
              <Text size='lg' nowrap className={classes.optionValueText}>
                {option.value}
              </Text>
            )}
            <Text
              size='lg'
              nowrap={!searchValue}
              className={classes.optionItemText}
            >
              <CompoundName
                name={option.label || ''}
                search={searchValue || ''}
              />
            </Text>
          </Row>
        </div>
        <div className={classes.iconWrap}>
          {isSelected && !isMulti && (
            <Icon
              width={24}
              height={24}
              className={classes.iconSelected}
              name='check'
            />
          )}
        </div>
      </Row>
    </li>
  );
};
