import cn from 'classnames';
import React from 'react';

import { Icon } from '../Icon';
import { Text } from '../Typography';
import styles from './styles.module.scss';

interface IDateInputProps {
  label?: React.ReactNode;
  value?: string | number;
}

export const ViewOnlyDate = ({ label, value }: IDateInputProps) => (
  <div className={styles.dateInput}>
    {label && (
      <Text
        className={cn(styles.label, {
          [styles.labelViewOnlyWithoutValue]: !value,
        })}
        tooltip
        size='sm'
        nowrap
      >
        {label}
      </Text>
    )}
    <div className={styles.iconContainer}>
      <Icon name='calendar' width={24} height={24} />
    </div>
    <div className={styles.startDate}>
      <input
        className={styles.inputDate}
        value={value || 'Не заполнено'}
        disabled
      />
    </div>
  </div>
);
ViewOnlyDate.displayName = 'ViewOnlyDate';
