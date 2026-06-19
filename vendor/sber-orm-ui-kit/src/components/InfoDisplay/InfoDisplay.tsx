import cn from 'classnames';
import React from 'react';

import { Text } from '../Typography';
import styles from './styles.module.scss';

export interface IInfoDisplayProperties {
  title: string | React.ReactElement;
  prefix?: React.ReactElement;
  suffix?: React.ReactElement;
  description?: string | React.ReactElement;
  inverse?: boolean;
}

export const InfoDisplay = ({
  className,
  description,
  inverse,
  prefix,
  suffix,
  title,
  ...props
}: IInfoDisplayProperties &
  Omit<React.HTMLAttributes<HTMLDivElement>, 'prefix' | 'title'>) => (
  <div className={cn(styles.root, className)} {...props}>
    {!!prefix && prefix}
    <div className={cn(styles.textContainer, { [styles.inverse]: inverse })}>
      <Text size='lg'>{title}</Text>
      {!!description && (
        <Text tooltip size='sm' className={styles.description}>
          {description}
        </Text>
      )}
    </div>
    {!!suffix && suffix}
  </div>
);
