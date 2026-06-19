import cn from 'classnames';
import React, { useCallback, useEffect, useMemo, useState } from 'react';

import {
  ComboBoxInputEvent,
  ComboboxChangeReason,
  ComboboxEvent,
  MultiValue,
  Options,
  SingleValue,
  ComboBox as VComboBox,
  ComboboxProps as VComboboxProperties,
} from '@v-uik/combo-box';

import { EIconName, iconMap } from '../../icons';
import { Checkbox } from '../Checkbox';
import { Row } from '../Grid';
import { Icon } from '../Icon';
import { Text } from '../Typography';
import styles from './styles.module.scss';

export type { OptionListProps } from '@v-uik/combo-box';

const ClearIcon = iconMap[EIconName.cross];
const DropdownIcon = iconMap[EIconName.down];

const emptyValue = { label: 'Не заполнено', value: 'undefined' };

interface IIndicatorProperties {
  canClear?: boolean;
  opened: boolean;
  disabled?: boolean;
  onOpen: (value: boolean) => void;
  clearValue(event: ComboboxEvent): void;
}

const DropdownIndicator = (properties: IIndicatorProperties) => {
  const { onOpen, opened } = properties;

  const handleClick = (event: React.MouseEvent) => {
    event.preventDefault();
    onOpen(!opened);
  };

  return (
    <DropdownIcon
      onMouseDown={handleClick}
      className={cn(styles.dropdownIcon, {
        [styles.dropdownIconOpened]: opened,
      })}
    />
  );
};

const ClearIndicator = (properties: IIndicatorProperties) => {
  const onMouseDown = (event: ComboboxEvent) => {
    event.stopPropagation();
    event.preventDefault();
    properties.canClear && !properties.disabled && properties.clearValue(event);
  };

  return (
    <div onMouseDown={onMouseDown} role='button' tabIndex={-1}>
      <ClearIcon className={styles.clearIcon} />
    </div>
  );
};

export type TComboBoxProperties = VComboboxProperties<unknown> & {
  labelInside?: boolean;
  /** Упрощенное визуальное представление компонента, без возможности поменять значение */
  viewOnly?: boolean;
  readonly?: boolean;
};

// biome-ignore lint/suspicious/noExplicitAny: reason
const OptionItemComponent = (props: any) => {
  const isSelected = useMemo(
    () => props.selectedValue?.includes(props.option),
    [props.selectedValue, props.option],
  );

  const onMouseDown = useCallback((event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
  }, []);
  const onClick = useCallback(
    (event: React.MouseEvent) => {
      event.preventDefault();
      event.stopPropagation();
      props.onSelectOption(props.option, event);
    },
    [props],
  );

  if (props?.isInfoOption) {
    return <Row className={styles.optionItem}>{props.children}</Row>;
  }

  return (
    <Row
      gutter={8}
      className={cn(styles.optionItem, {
        [styles.optionItemDisabled]: props.option?.disabled,
        [styles.optionItemSelected]: isSelected,
      })}
      justify='between'
      onClick={onClick}
      onMouseDown={onMouseDown}
    >
      <Text
        size='lg'
        nowrap
        className={styles.optionItemText}
        title={props.option?.label}
      >
        {props.option?.label}
      </Text>
      {isSelected && (
        <Icon
          width={20}
          height={20}
          className={styles.iconSelected}
          name='check'
        />
      )}
    </Row>
  );
};

export const OldComboBox = ({
  components,
  labelInside,
  onChange,
  onInputChange,
  viewOnly,
  ...properties
}: TComboBoxProperties) => {
  const labelClasses = {
    text: cn(styles.label, { [styles.labelViewOnly]: viewOnly }),
  };
  const [filled, setFilled] = useState(
    Array.isArray(properties.value)
      ? properties.value.length
      : properties.value || properties.inputValue,
  );
  const [focused, setFocused] = useState(false);
  const comboBoxClasses = useMemo(
    () => ({
      root: cn(styles.root, {
        [styles.filled]: Array.isArray(properties.value)
          ? properties.value.length
          : properties.value || properties.inputValue || filled,
        [styles.isSearchable]: properties.isSearchable,
        [styles.labelInside]: labelInside && !viewOnly,
        [styles.rootFocused]: focused,
      }),
      ...styles,
      inputRoot: cn({
        [styles.inputRoot]: !viewOnly,
        [styles.inputRootViewOnly]: viewOnly,
      }),
    }),
    [
      filled,
      focused,
      labelInside,
      properties.inputValue,
      properties.isSearchable,
      properties.value,
    ],
  );
  const [containerReference, setContainerReference] =
    useState<HTMLDivElement | null>(null);

  useEffect(() => {
    setFilled(
      Array.isArray(properties.value)
        ? properties.value.length
        : properties.value || properties.inputValue,
    );
  }, [properties.value]);

  if (properties.labelProps) {
    Object.assign(properties.labelProps, { classes: labelClasses });
  }
  if (properties.loading) {
    Object.assign(comboBoxClasses, {
      inputArrowIcon: styles.inputArrowIconHidden,
    });
  }
  const helperClasses = {
    error: styles.helperTextError,
  };

  const handleChange = (
    value: string[] & string,
    event: ComboboxEvent,
    fullValue?: MultiValue<unknown> & SingleValue<unknown>,
    reason?: ComboboxChangeReason,
  ) => {
    if (properties.readonly) {
      return;
    }

    if (properties.multiple && Array.isArray(value)) {
      setFilled(value.length > 0);
    } else {
      setFilled(!!value);
    }
    onChange?.(value, event, fullValue, reason);
  };

  const handleInputChange = (value: string, event?: ComboBoxInputEvent) => {
    if (properties.readonly) {
      return;
    }

    setFilled(!!value);
    onInputChange?.(value, event);
  };

  return (
    <VComboBox
      ref={setContainerReference}
      classes={comboBoxClasses}
      loadingLabel={<span className={styles.loadingLabel}>Загрузка...</span>}
      dropdownProps={{
        container: containerReference as HTMLDivElement,
        popperOptions: {
          strategy: 'absolute',
        },
      }}
      placeholder=''
      limitByWidth
      hideDropdownOnOutsideScroll={false}
      labelProps={{ classes: labelClasses }}
      labelledClasses={{
        required: styles.required,
        topLabels: styles.topLabels,
        topLabelsWrapper: cn(styles.topLabelsWrapper, {
          [styles.withPrefix]: properties.inputPrefix,
        }),
      }}
      inputInnerProps={{
        onFocus: () => setFocused(true),
        onBlur: () => setFocused(false),
      }}
      components={{
        ClearIndicator: properties.readonly ? () => null : ClearIndicator,
        DropdownIndicator: properties.readonly ? () => null : DropdownIndicator,
        MultiCheckbox: Checkbox,
        OptionItem: OptionItemComponent,
        ...components,
      }}
      helperTextProps={{ classes: helperClasses }}
      isSearchable
      {...properties}
      options={properties.options}
      value={
        (viewOnly && !properties.value
          ? properties.multiple
            ? [emptyValue]
            : emptyValue
          : properties.value || null) as
          | string[]
          | Options<unknown>
          | null
          | undefined
      }
      canClear={properties.canClear && !properties.readonly}
      opened={properties.readonly ? false : properties.opened}
      disabled={properties.disabled || viewOnly}
      required={properties.required && !viewOnly}
      inputPrefix={viewOnly ? undefined : properties.inputPrefix}
      onChange={handleChange}
      onInputChange={handleInputChange}
    />
  );
};
