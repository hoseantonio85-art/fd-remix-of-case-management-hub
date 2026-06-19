import React from 'react';
import { ComboboxEvent } from '@v-uik/combo-box';

import { EIconName, iconMap } from '@/icons';

import { IIndicatorProperties } from '../../types';

import styles from '../../buttons.module.scss';

const ClearIcon = iconMap[EIconName.errorRounded];

export const ClearIndicator = React.forwardRef(
  (properties: IIndicatorProperties, ref: React.Ref<HTMLDivElement>) => {
    const onMouseDown = (event: ComboboxEvent) => {
      event.stopPropagation();
      event.preventDefault();
      properties.canClear &&
        !properties.disabled &&
        properties.clearValue(event);
    };

    return (
      <div
        ref={ref}
        onMouseDown={onMouseDown}
        role='button'
        tabIndex={-1}
        className={styles.indicatorButton}
      >
        <ClearIcon className={styles.clearButton} width={16} height={16} />
      </div>
    );
  },
);
