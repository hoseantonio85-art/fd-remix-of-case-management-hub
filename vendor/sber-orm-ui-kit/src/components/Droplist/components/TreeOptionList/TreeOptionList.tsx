import React, { useCallback, useMemo } from 'react';

import { ComboboxEvent, OptionListProps } from '@v-uik/combo-box';
import { ListItemProps } from '@v-uik/list';
import {
  Tree,
  TreeItem,
  TreeNodeContentProps,
  TreeNodeItem,
  TreeProps,
} from '@v-uik/tree';

import { ScrollBar } from '@/components/ScrollBar';
import { LoadingIndicator } from '@/components/Select/components';
import { ExpandButton } from '../ExpandButton';
import { TreeContent } from '../TreeContent';
import { findNodeKeysToExpand } from './utils';

import styles from '../../styles.module.scss';

type TOptionListProps = OptionListProps<
  ListItemProps<'li'>,
  React.ElementType,
  React.ElementType
> & {
  treeProps?: Partial<TreeProps>;
  showOptionValue?: boolean;
  testId?: string;
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
  nodeExpandButton: styles.expandButtonWrap,
};

export const TreeOptionList = ({
  loading,
  treeProps,
  showOptionValue,
  testId,
  ...props
}: TOptionListProps) => {
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
    <div ref={props.listProps?.ref || null}>
      {!loading && (
        <ScrollBar className={styles.scrollbar}>
          <Tree
            data-testid={testId ? `${testId}-tree` : undefined}
            classes={treeClasses}
            components={{
              Content: (contentProps: TreeNodeContentProps) => (
                <TreeContent
                  showOptionValue={showOptionValue}
                  isMulti={props.isMulti}
                  onSelectOption={props.onSelectOption}
                  {...contentProps}
                />
              ),
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
            disableExpandOnClick={!!props.isMulti}
            {...treeProps}
            dataSource={props.options as TreeItem[]}
            withHalfLevelSpacer
          />
        </ScrollBar>
      )}
    </div>
  );
};
