import cn from 'classnames';
import React from 'react';

import { Text } from '@/components/Typography';

import { EFileSizeUnit } from '../../types';
import {
  convertBytesToMB,
  KBYTES_PER_BYTE,
  MBYTES_PER_BYTE,
  pluralizeBytes,
} from '../../utils';

import styles from './styles.module.scss';

export const SizeInfo = React.memo<{ size: number; chat?: boolean }>(
  ({ size = 0, chat = false }) => {
    const sizeText = React.useMemo(() => {
      const converted = convertBytesToMB(size);

      let unit = size < KBYTES_PER_BYTE && pluralizeBytes(size);

      if (!unit) {
        unit = size < MBYTES_PER_BYTE ? EFileSizeUnit.KB : EFileSizeUnit.MB;
      }

      return `${converted} ${unit}`;
    }, [size]);

    if (!size) {
      return null;
    }

    return (
      <Text
        size={chat ? 'sm' : 'lg'}
        className={cn(styles.sizeText, { [styles.chat]: chat })}
        code
      >
        {sizeText}
      </Text>
    );
  },
);
