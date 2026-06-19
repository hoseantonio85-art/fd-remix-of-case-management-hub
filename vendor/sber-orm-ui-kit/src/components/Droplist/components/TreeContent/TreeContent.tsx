import { TreeNodeContentProps } from '@v-uik/tree';
import { ComboboxEvent } from '@v-uik/combo-box';
import { ListItemProps } from '@v-uik/list';
import cn from 'classnames';
import { Checkbox } from '@/components/Checkbox';

import { Icon } from '@/components/Icon';
import styles from '../../styles.module.scss';
import { TOption } from '../DroplistItem';

type TTreeContentProps = TreeNodeContentProps & {
  showOptionValue?: boolean;
  isMulti?: boolean;
  onSelectOption?: (option: ListItemProps<'li'>, event: ComboboxEvent) => void;
};

export const TreeContent = ({
  data,
  onSelectOption,
  selected,
  isMulti,
  children,
  showOptionValue,
}: TTreeContentProps) => {
  const option = data as TOption;

  const clickHandler = () => {
    if (!isMulti || data.selectDisabled || data.disabled) {
      return;
    }

    onSelectOption?.(data as ListItemProps<'li'>, {} as ComboboxEvent);
  };

  return (
    <div
      className={styles.treeContent}
      role='option'
      tabIndex={0}
      onClick={clickHandler}
    >
      <div
        className={cn(styles.treeContentWrap, {
          [styles.treeContentWrapSelected]: selected,
        })}
      >
        {isMulti && (
          <Checkbox checked={selected} disabled={option.selectDisabled} />
        )}
        {showOptionValue && (
          <div className={styles.treeContentValue}>{option?.value}</div>
        )}
        <div className={styles.treeContentText}>{children}</div>
      </div>
      {selected && !isMulti && (
        <Icon name='check' className={styles.treeContentChecked} />
      )}
    </div>
  );
};
