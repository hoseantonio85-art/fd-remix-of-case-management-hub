import { Instance } from '@popperjs/core';
import {
  ComboboxChangeReason,
  ComboboxEvent,
  MultiValue,
  MultiValueProps,
  PlaceholderProps,
  SingleValue,
  SingleValueProps,
  ComboBox as VComboBox,
} from '@v-uik/combo-box';
import cn from 'classnames';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { EIconName, iconMap } from '../../icons';
import { Chips } from '../Chips';
import { Droplist, TDropListProps } from '../Droplist';
import { Row } from '../Grid';
import { Icon } from '../Icon';
import {
  ClearIndicator,
  HelperText,
  HelperTooltip,
  ValueWithTooltip,
} from './components';
import styles from './styles.module.scss';
import { IIndicatorProperties, TSelectProperties } from './types';

const CustomSingleValue = (props: SingleValueProps<unknown>) => {
  const { children, isSearchable } = props;
  const value = children;

  return (
    <ValueWithTooltip
      value={String(value) || ''}
      className={cn(styles.valueContainer, {
        [styles.valueWrapper]: isSearchable,
      })}
    >
      {children}
    </ValueWithTooltip>
  );
};

const CustomMultiValue = (props: MultiValueProps<unknown>) => {
  const { children, isSearchable } = props;

  if (isSearchable) {
    return <div />;
  }

  return (
    <ValueWithTooltip
      value={String(children) || ''}
      className={styles.valueContainer}
    >
      {children}
    </ValueWithTooltip>
  );
};

const DropdownIcon = iconMap[EIconName.down];

export const Placeholder = React.forwardRef(
  <Option,>(
    { children, isDisabled }: PlaceholderProps<Option>,
    ref: React.Ref<HTMLDivElement>,
  ) => {
    const classes = cn(styles.placeholder, {
      [styles.placeholderDisabled]: isDisabled,
    });
    return (
      <div ref={ref} className={classes} aria-disabled={isDisabled}>
        {children}
      </div>
    );
  },
);

type TOption = {
  id?: string;
  key?: string;
  value?: string;
  label?: string;
  title?: string;
};

const getChipId = (val: SingleValue<TOption>) =>
  val?.id || val?.value || String(val);
const getChipTitle = (val: SingleValue<TOption>) =>
  val?.label || val?.title || String(val);

export const Select = ({
  labelInside,
  onChange,
  onInputChange,
  tree,
  tooltip,
  icon,
  helperText,
  size,
  isComplexPart,
  value: externalValue,
  showOptionValue,
  showOptionSearch,
  dropdownProps,
  limitByWidth = true,
  noOptionsText = 'Ничего не найдено',
  showDroplistButtons,
  optionRenderLimit,
  onListSubmit,
  testId,
  iconClassName,
  hideChevron = false,
  showValueTooltip = true,
  loadingLabel,
  useCustomSearch,
  useChips,
  ...properties
}: TSelectProperties) => {
  const labelClasses = {
    text: cn(styles.label),
    suffix: cn({
      [styles.labelSuffix]: !labelInside,
      [styles.labelSuffixRequired]: !labelInside && properties.required,
    }),
  };
  const [selectedValue, setSelectedValue] = useState(externalValue);
  const [focused, setFocused] = useState(false);
  const [filled, setFilled] = useState(false);
  const popperRef = useRef<Instance | null>(null);
  const comboBoxClasses = useMemo(
    () => ({
      root: cn(styles[`size${size}`], styles.container, {
        [styles.filled]: Array.isArray(selectedValue)
          ? selectedValue.length || properties.placeholder
          : selectedValue || filled || properties.placeholder,
        [styles.containerLabelInside]: labelInside,
        [styles.disabled]: !!properties.disabled,
        [styles[`size${size}WithPrefix`]]: !!icon,
        [styles.isSearchable]: properties.isSearchable,
        [styles.rootFocused]: !!focused,
      }),
      text: cn({
        [styles.valueWrapper]: properties.isSearchable,
      }),
      inputPrefix: styles.prefix,
      ...styles,
      inputRoot: cn(styles.inputContainer, {
        [styles.containerComplex]: !!isComplexPart,
      }),
      inputContent: cn({
        [styles.input]: !properties.isSearchable,
        [styles.inputEmpty]: !selectedValue,
      }),
    }),
    [
      selectedValue,
      filled,
      focused,
      labelInside,
      properties.isSearchable,
      properties.disabled,
      properties.placeholder,
    ],
  );

  const onInputChangeRef = useRef(onInputChange);

  useEffect(() => {
    setSelectedValue(externalValue);
  }, [externalValue]);

  useEffect(() => {
    onInputChangeRef.current = onInputChange;
  }, [onInputChange]);

  useEffect(() => {
    setFilled(
      Array.isArray(selectedValue) ? !!selectedValue.length : !!selectedValue,
    );
  }, [selectedValue]);

  const treeProps = useMemo(() => properties.treeProps, [properties.treeProps]);

  const handleFirstRender = useCallback(() => {
    popperRef.current?.forceUpdate();
  }, []);

  const [containerReference, setContainerReference] =
    useState<HTMLDivElement | null>(null);

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
    helperText: styles.helperText,
  };

  const OptionListComponent = useCallback(
    (props: TDropListProps) => (
      <Droplist
        {...props}
        showOptionValue={showOptionValue}
        showOptionSearch={
          (showOptionSearch && !tree) ||
          (showOptionSearch && tree && useCustomSearch)
        }
        noOptionsText={noOptionsText}
        showDroplistButtons={showDroplistButtons}
        onSubmit={onListSubmit}
        onSearch={
          useCustomSearch && onInputChangeRef.current
            ? onInputChangeRef.current
            : undefined
        }
        onFirstRender={handleFirstRender}
        tree={tree}
        treeProps={treeProps}
        optionRenderLimit={optionRenderLimit}
        testId={testId}
        useCustomSearch={useCustomSearch}
      />
    ),
    [
      showOptionValue,
      showOptionSearch,
      noOptionsText,
      showDroplistButtons,
      onListSubmit,
      treeProps,
      tree,
      useCustomSearch,
    ],
  );

  const helperTooltip = useMemo(
    () => <HelperTooltip tooltip={tooltip} labelInside={labelInside} />,
    [tooltip, labelInside],
  );

  const DropdownIndicator = (dropDownProperties: IIndicatorProperties) => (
    <>
      {!properties.loading && !hideChevron && (
        <DropdownIcon
          role='button'
          className={cn(styles.dropdownIcon, {
            [styles.dropdownIconOpened]: dropDownProperties.opened,
          })}
        />
      )}
      {tooltip && labelInside ? helperTooltip : undefined}
    </>
  );

  const handleChange = useCallback(
    (
      value: string[] & string,
      event: ComboboxEvent,
      fullValue?: MultiValue<unknown> & SingleValue<unknown>,
      reason?: ComboboxChangeReason,
    ) => {
      if (properties.readonly) {
        return;
      }

      setSelectedValue(fullValue);

      if (properties.multiple && Array.isArray(value)) {
        setFilled(value.length > 0);
      } else {
        setFilled(!!value);
      }
      onChange?.(value, event, fullValue, reason);
    },
    [properties.readonly, properties.multiple, onChange, setSelectedValue],
  );

  const inputPrefix = icon ? (
    <Icon className={iconClassName} width={24} height={24} name={icon} />
  ) : undefined;

  const selectedValues = useMemo(() => {
    if (!properties.multiple) {
      return selectedValue ? [selectedValue] : [];
    }
    return Array.isArray(selectedValue) ? selectedValue : [];
  }, [selectedValue, properties.multiple]);

  const chipsItems = useMemo(() => {
    if (!useChips || !properties.multiple) {
      return [];
    }

    return selectedValues.map((val) => {
      if ((val && typeof val === 'object') || tree) {
        return {
          id: getChipId(val),
          title: getChipTitle(val),
        };
      }

      const option = properties.options?.find((opt) => {
        const valStr = String(val);
        return (
          (opt as TOption).value === valStr ||
          (opt as TOption).key === valStr ||
          (opt as TOption).id === valStr
        );
      });

      if (option) {
        return {
          id: getChipId(option),
          title: getChipTitle(option),
        };
      }

      return {
        id: String(val),
        title: String(val),
      };
    });
  }, [selectedValues, useChips, properties.multiple]);

  const handleChipRemove = useCallback(
    (id: string) => {
      setSelectedValue((prev: unknown) => {
        if (!Array.isArray(prev)) {
          return prev;
        }

        const newValue = prev.filter((val) => getChipId(val) !== id);
        const stringifiedValue = newValue.map(
          (item) =>
            item.value?.toString() || item.key?.toString() || String(item),
        );
        handleChange(
          stringifiedValue as string & string[],
          { type: 'chip-remove' } as ComboboxEvent,
          newValue,
        );

        return newValue;
      });

      if (id && properties.onChipRemove) {
        properties.onChipRemove(id);
      }
    },
    [selectedValues, properties.onChipRemove],
  );

  if (useChips && properties.multiple) {
    return (
      <Row
        direction='column'
        align='stretch'
        gutter={8}
        className={styles.chipsWrapper}
      >
        {/* @ts-expect-error - VComboBox имеет сложные типы для SingleValue/MultiValue, но нам нужно сохранить функциональность */}
        <VComboBox
          ref={setContainerReference}
          classes={comboBoxClasses}
          loadingLabel={
            <span className={styles.loadingLabel}>
              {loadingLabel || 'Загрузка...'}
            </span>
          }
          placeholder={properties.placeholder ?? ''}
          labelProps={{
            classes: labelClasses,
            suffix: !labelInside && tooltip ? helperTooltip : undefined,
          }}
          labelledClasses={{
            required: styles.required,
            topLabels: styles.topLabels,
            topLabelsWrapper: cn(styles.topLabelsWrapper, {
              [styles.withPrefix]: !!icon,
            }),
          }}
          helperText={
            !helperText ? null : (
              <HelperText error={properties.error} text={helperText} />
            )
          }
          noOptionsText={noOptionsText}
          helperTextProps={{ classes: helperClasses }}
          canClear={properties.canClear && !properties.readonly}
          inputPrefix={inputPrefix}
          onChange={handleChange}
          onInputChange={
            useCustomSearch && !properties.isSearchable
              ? undefined
              : onInputChangeRef.current
          }
          opened={properties.readonly ? false : properties.opened}
          inputInnerProps={
            properties.isSearchable
              ? {
                  onFocus: () => setFocused(true),
                  onBlur: () => setFocused(false),
                }
              : undefined
          }
          value={selectedValue}
          dropdownProps={{
            ...{
              container: containerReference as HTMLDivElement,
              popperOptions: {
                strategy: 'absolute',
              },
            },
            popperRef,
            ...dropdownProps,
          }}
          /** Если указан обработчик изменения инпута - отключаем стандартную фильтрацию */
          filterOption={onInputChangeRef.current ? () => true : undefined}
          disableCloseOnSelect={!!properties.multiple}
          disableClearInputOnChange={!!properties.multiple}
          hideDropdownOnOutsideScroll={false}
          limitByWidth={limitByWidth}
          {...properties}
          data-testid={testId || undefined}
          components={{
            ClearIndicator: properties.readonly ? () => null : ClearIndicator,
            DropdownIndicator: properties.readonly
              ? () => null
              : DropdownIndicator,
            OptionList: OptionListComponent,
            SingleValue: CustomSingleValue,
            MultiValue: CustomMultiValue,
            Placeholder,
            ...(properties.components || {}),
          }}
          disableVisibleSelectedValue={!!properties.isSearchable}
        />
        {chipsItems.length > 0 && (
          <Row justify='start' gutter={4} wrap className={styles.chipsWrapper}>
            {chipsItems.map((chip) => (
              <Chips
                key={chip.id}
                item={chip}
                size='XS'
                variant='fill'
                onRemove={
                  properties.onChipRemove ? handleChipRemove : undefined
                }
                disabled={properties.disabled}
                nowrap
              />
            ))}
          </Row>
        )}
      </Row>
    );
  }

  return (
    // @ts-expect-error Omit для size вызывает более строгую проверку связки генерируемой SingleValue и MultiValue
    <VComboBox
      ref={setContainerReference}
      classes={comboBoxClasses}
      loadingLabel={
        <span className={styles.loadingLabel}>
          {loadingLabel || 'Загрузка...'}
        </span>
      }
      placeholder={properties.placeholder ?? ''}
      labelProps={{
        classes: labelClasses,
        suffix: !labelInside && tooltip ? helperTooltip : undefined,
      }}
      labelledClasses={{
        required: styles.required,
        topLabels: styles.topLabels,
        topLabelsWrapper: cn(styles.topLabelsWrapper, {
          [styles.withPrefix]: !!icon,
        }),
      }}
      helperText={
        !helperText ? null : (
          <HelperText error={properties.error} text={helperText} />
        )
      }
      noOptionsText={noOptionsText}
      helperTextProps={{ classes: helperClasses }}
      canClear={properties.canClear && !properties.readonly}
      inputPrefix={inputPrefix}
      onChange={handleChange}
      onInputChange={
        useCustomSearch && !properties.isSearchable
          ? undefined
          : onInputChangeRef.current
      }
      opened={properties.readonly ? false : properties.opened}
      inputInnerProps={
        properties.isSearchable
          ? {
              onFocus: () => setFocused(true),
              onBlur: () => setFocused(false),
            }
          : undefined
      }
      value={selectedValue}
      dropdownProps={{
        ...{
          container: containerReference as HTMLDivElement,
          popperOptions: {
            strategy: 'absolute',
          },
        },
        popperRef,
        ...dropdownProps,
      }}
      /** Если указан обработчик изменения инпута - отключаем стандартную фильтрацию */
      filterOption={onInputChangeRef.current ? () => true : undefined}
      disableCloseOnSelect={!!properties.multiple}
      disableClearInputOnChange={!!properties.multiple}
      hideDropdownOnOutsideScroll={false}
      limitByWidth={limitByWidth}
      {...properties}
      data-testid={testId || undefined}
      components={{
        ClearIndicator: properties.readonly ? () => null : ClearIndicator,
        DropdownIndicator: properties.readonly ? () => null : DropdownIndicator,
        OptionList: OptionListComponent,
        Placeholder,
        ...(properties.components || {}),
        ...(showValueTooltip
          ? {
              SingleValue: CustomSingleValue,
              MultiValue: CustomMultiValue,
            }
          : {}),
      }}
    />
  );
};
