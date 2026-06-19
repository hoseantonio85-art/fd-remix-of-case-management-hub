import cn from 'classnames';
import React from 'react';

import { EIconName } from '../../icons';
import { Icon } from '../Icon';
import { Text } from '../Typography';
import styles from './styles.module.scss';

interface IRangeInputProperties {
  startValue?: React.ReactText | null;
  endValue?: React.ReactText | null;
  startLabel?: React.ReactNode;
  endLabel?: React.ReactNode;
}

export const ViewOnlyRangeDate = ({
  endLabel,
  endValue,
  startLabel,
  startValue,
}: IRangeInputProperties) => (
  <div className={cn(styles.rangeInput, styles.rangeInputViewOnly)}>
    <div className={styles.dateContainer}>
      <div className={styles.iconContainer}>
        <Icon name='calendar' width={24} height={24} />
      </div>
      <div className={styles.startDate}>
        {startLabel && (
          <Text
            title={String(startLabel ?? '')}
            className={cn(styles.label, styles.labelViewOnly, {
              [styles.labelViewOnlyWithoutValue]: !startValue,
              [styles.labelWithoutValue]: !startValue,
            })}
            tooltip
            size='sm'
            nowrap
          >
            {startLabel}
          </Text>
        )}
        <input className={styles.inputDate} value={startValue || ''} disabled />
      </div>
    </div>
    <Icon name={EIconName.arrowAction} className={styles.arrow} />
    <div className={styles.dateContainer}>
      <div className={styles.endDate}>
        {endLabel && (
          <Text
            title={String(endLabel ?? '')}
            className={cn(styles.label, styles.labelViewOnly, {
              [styles.labelViewOnlyWithoutValue]: !endValue,
              [styles.labelWithoutValue]: !endValue,
            })}
            tooltip
            size='sm'
            nowrap
          >
            {endLabel}
          </Text>
        )}
        <input className={styles.inputDate} value={endValue || ''} disabled />
      </div>
    </div>
  </div>
);
ViewOnlyRangeDate.displayName = 'ViewOnlyRangeDate';
