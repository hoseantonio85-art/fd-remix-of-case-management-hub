import React from 'react';

import { Row } from '@/components/Grid';
import { Icon } from '@/components/Icon';
import { Text } from '@/components/Typography';

import { TFileExtrasProps } from '../../types';
import styles from './styles.module.scss';

export const ExtrasInfo = React.memo<TFileExtrasProps>(
  ({ items = [], error }) => {
    if (error) {
      return (
        <Row align='top' gutter={4} className={styles.errorInfo}>
          <Icon width={16} height={16} name='errorRounded' />
          <Text size='sm' className={styles.errorText}>
            {error}
          </Text>
        </Row>
      );
    }

    if (!items?.length) {
      return null;
    }

    return (
      <Row align='top' wrap className={styles.flexSpace}>
        {items.map((item, index) =>
          typeof item === 'string' ? (
            <Text key={item + index} className={styles.extras} size='sm'>
              {item}
              {index < items.length - 1 && (
                <span className={styles.dot}>•</span>
              )}
            </Text>
          ) : (
            item
          ),
        )}
      </Row>
    );
  },
);
