import cn from 'classnames';
import React, { useCallback, useMemo, useState } from 'react';

import {
  ComboboxChangeReason,
  ComboboxEvent,
  MultiValue,
  OptionListProps,
  Options,
  SingleValue,
  ComboBox as VComboBox,
  ComboboxProps as VComboboxProperties,
} from '@v-uik/combo-box';
import { ListItemProps } from '@v-uik/list';
import {
  Tree,
  TreeItem,
  TreeNodeContentProps,
  TreeNodeExpandButtonProps,
  TreeNodeItem,
  TreeProps,
} from '@v-uik/tree';

import { EIconName, iconMap } from '../../icons';
import { Checkbox } from '../Checkbox';
import { Row } from '../Grid';
import { Icon } from '../Icon';
import { OldScrollbar as Scrollbar } from '../OldScrollBar';
import { Text } from '../Typography';
import styles from './styles.module.scss';

export type { ComboboxEvent } from '@v-uik/combo-box';
export type { TreeItem } from '@v-uik/tree';

const ClearIcon = iconMap[EIconName.cross];
const DropdownIcon = iconMap[EIconName.down];

const emptyValue = { label: 'Не заполнено', value: 'undefined' };

export interface IIndicatorProperties {
  canClear?: boolean;
  opened: boolean;
  disabled?: boolean;
  clearValue(event: ComboboxEvent): void;
}

const DropdownIndicator = (properties: IIndicatorProperties) => (
  <DropdownIcon
    className={cn(styles.dropdownIcon, {
      [styles.dropdownIconOpened]: properties.opened,
    })}
  />
);

const LoadingIndicator = () => (
  <Icon
    name='track'
    width={16}
    height={16}
    className={styles.loadingIndicator}
  />
);

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

export type TSelectProperties = VComboboxProperties<unknown> & {
  labelInside?: boolean;
  tree?: boolean;
  treeProps?: Partial<TreeProps>;
  /** Упрощенное визуальное представление компонента, без возможности поменять значение */
  viewOnly?: boolean;
  readonly?: boolean;
};

const treeClasses = {
  item: styles.item,
  itemDisabled: styles.itemDisabled,
  itemFocused: styles.itemFocused,
  itemSelected: styles.itemSelected,
  node: styles.node,
  nodeContent: styles.nodeContent,
  nodeContentContainer: styles.nodeContentContainer,
  root: styles.tree,
  selectedIndicator: styles.selectedIndicator,
  treeContent: styles.treeContent,
};

const ExpandButton = (props: TreeNodeExpandButtonProps<unknown>) => (
  <button
    {...props}
    className={cn(styles.expandButton, {
      [styles.expandButtonExpanded]: props.expanded,
    })}
  >
    <Icon name='down' />
  </button>
);

const findNodeKeysToExpand = (
  selectedNodes: Options<ListItemProps<'li'>>,
  nodes: Options<ListItemProps<'li'>>,
  path: React.Key[] = [],
): React.Key[] => {
  const keysSet = new Set<React.Key>();

  for (const node of nodes) {
    if (selectedNodes.some((selectedNode) => node.key === selectedNode.key)) {
      for (const item of path) {
        keysSet.add(item);
      }
    }
    if (node.children) {
      const childKeys = findNodeKeysToExpand(
        selectedNodes,
        node.children as Options<ListItemProps<'li'>>,
        [...path, node.key as React.Key],
      );

      for (const item of childKeys) {
        keysSet.add(item);
      }
    }
  }

  return [...keysSet];
};

const TreeContent = (props: TreeNodeContentProps) => (
  <div className={styles.treeContent}>
    {props.children}
    {props.selected && (
      <Icon name='check' className={styles.treeContentChecked} />
    )}
  </div>
);

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

const TreeOptionList = ({
  loading,
  treeProps,
  ...props
}: OptionListProps<
  ListItemProps<'li'>,
  React.ElementType,
  React.ElementType
> & { treeProps?: Partial<TreeProps> }) => {
  const selectedKeys = useMemo(
    () => props.selectedValue.map<string>((item) => String(item.key)),
    [props.selectedValue],
  );
  const onNodeSelect = useCallback(
    (_keys: React.Key[], node: TreeNodeItem<TreeItem>) => {
      if (
        treeProps?.selectMode === 'strict' &&
        (node.children?.length || node.loadable)
      ) {
        return;
      }
      props.onSelectOption(node as ListItemProps<'li'>, {} as ComboboxEvent);
    },
    [props],
  );

  return (
    <div className={styles.treeList}>
      {loading && (
        <div className={styles.treeLoading}>{props.loadingLabel}</div>
      )}
      {!loading && (
        <Scrollbar contentMaxSize={400}>
          <Tree
            classes={treeClasses}
            components={{
              Content: TreeContent,
              ExpandButton,
              LoadingIndicator,
            }}
            selectable
            onNodeSelect={onNodeSelect}
            selectedKeys={selectedKeys}
            multipleSelect={props.isMulti}
            defaultExpandedKeys={findNodeKeysToExpand(
              props.selectedValue,
              props.options,
            )}
            {...treeProps}
            dataSource={props.options as TreeItem[]}
          />
        </Scrollbar>
      )}
    </div>
  );
};

export const OldSelect = ({
  labelInside,
  onChange,
  tree,
  viewOnly,
  ...properties
}: TSelectProperties) => {
  const labelClasses = {
    text: cn(styles.label, { [styles.labelViewOnly]: viewOnly }),
  };
  const [filled, setFilled] = useState(false);
  const comboBoxClasses = useMemo(
    () => ({
      root: cn(styles.root, {
        [styles.filled]: Array.isArray(properties.value)
          ? properties.value.length
          : properties.value || filled || properties.placeholder,
        [styles.labelInside]: labelInside && !viewOnly,
      }),
      ...styles,
      inputRoot: cn({
        [styles.inputRoot]: !viewOnly,
        [styles.inputRootViewOnly]: viewOnly,
      }),
    }),
    [properties.value, filled, labelInside, viewOnly],
  );
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
  };

  const TreeOptionListComponent = useCallback(
    (p: OptionListProps<unknown, 'ul', 'li'>) => (
      // @ts-expect-error несовместимость типов дерева и выпадающего списка
      <TreeOptionList {...p} treeProps={properties.treeProps} />
    ),
    [properties.treeProps],
  );

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

  if (tree) {
    return (
      <VComboBox
        ref={setContainerReference}
        classes={comboBoxClasses}
        hideDropdownOnOutsideScroll={false}
        loadingLabel={<span className={styles.loadingLabel}>Загрузка...</span>}
        placeholder=''
        dropdownProps={{
          container: containerReference as HTMLDivElement,
          popperOptions: {
            strategy: 'absolute',
          },
        }}
        labelProps={{ classes: labelClasses }}
        labelledClasses={{
          required: styles.required,
          topLabels: styles.topLabels,
          topLabelsWrapper: cn(styles.topLabelsWrapper, {
            [styles.withPrefix]: properties.inputPrefix,
          }),
        }}
        components={{
          ClearIndicator: properties.readonly ? () => null : ClearIndicator,
          DropdownIndicator: properties.readonly
            ? () => null
            : DropdownIndicator,
          Input: () => null,
          MultiCheckbox: Checkbox,
          OptionList: TreeOptionListComponent,
        }}
        limitByWidth
        helperTextProps={{ classes: helperClasses }}
        {...properties}
        value={
          (viewOnly && !properties.value
            ? properties.multiple
              ? [emptyValue]
              : emptyValue
            : properties.value) as
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
      />
    );
  }

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
      components={{
        ClearIndicator: properties.readonly ? () => null : ClearIndicator,
        DropdownIndicator: properties.readonly ? () => null : DropdownIndicator,
        MultiCheckbox: Checkbox,
        OptionItem: OptionItemComponent,
      }}
      helperTextProps={{ classes: helperClasses }}
      {...properties}
      value={
        (viewOnly && !properties.value
          ? properties.multiple
            ? [emptyValue]
            : emptyValue
          : properties.value) as string[] | Options<unknown> | null | undefined
      }
      canClear={properties.canClear && !properties.readonly}
      opened={properties.readonly ? false : properties.opened}
      disabled={properties.disabled || viewOnly}
      required={properties.required && !viewOnly}
      inputPrefix={viewOnly ? undefined : properties.inputPrefix}
      onChange={handleChange}
    />
  );
};
