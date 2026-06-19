import { TreeNodeExpandButtonProps } from '@v-uik/tree';
import cn from 'classnames';

import { Icon } from '@/components/Icon';

import styles from './styles.module.scss';

export const ExpandButton = (props: TreeNodeExpandButtonProps<unknown>) => (
  <button
    {...props}
    className={cn(styles.expandButton, {
      [styles.expandButtonExpanded]: props.expanded,
    })}
  >
    <Icon width={20} height={20} name='down' />
  </button>
);
