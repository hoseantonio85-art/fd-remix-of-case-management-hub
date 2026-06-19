import {
  LinearProgress as VLinearProgress,
  LinearProgressProps as VLinearProgressProps,
} from '@v-uik/progress';
import cn from 'classnames';

import styles from './styles.module.scss';

export enum EProgressVariant {
  success = 'success',
  warning = 'warning',
  danger = 'danger',
  violet = 'violet',
}

export interface ILinearProgressProps extends VLinearProgressProps {
  variant?: keyof typeof EProgressVariant;
  filled?: boolean;
}

export const LinearProgress = (props: ILinearProgressProps) => {
  const baseClasses = {
    ...styles,
    root: cn(styles.root, styles[props.variant || EProgressVariant.success], {
      [styles.filled]: props.filled,
    }),
  };

  return <VLinearProgress classes={baseClasses} {...props} />;
};
