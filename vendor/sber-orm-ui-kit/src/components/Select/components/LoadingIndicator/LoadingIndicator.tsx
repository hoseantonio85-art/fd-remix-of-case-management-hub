import { Icon } from '@/components/Icon';

import styles from '../../buttons.module.scss';

export const LoadingIndicator = () => (
  <Icon
    name='track'
    width={16}
    height={16}
    className={styles.loadingIndicator}
  />
);
