import cn from 'classnames';
import { ForwardedRef, forwardRef, useMemo } from 'react';

import { IScrollbarProperties } from '../../types';
import classes from './styles.module.scss';

export const ScrollhostContainer = forwardRef(
  (
    { children, className, contentMaxSize, ...rest }: IScrollbarProperties,
    ref: ForwardedRef<HTMLDivElement>,
  ) => {
    const maxHeight: string | number = useMemo(() => {
      if (contentMaxSize) {
        if (typeof contentMaxSize === 'number') {
          return `${contentMaxSize}px`;
        }
        if (typeof contentMaxSize === 'string') {
          return contentMaxSize;
        }
      }

      return 'auto';
    }, [contentMaxSize]);

    return (
      <div
        className={cn(classes.container, className)}
        ref={ref}
        {...rest}
        style={{ maxHeight }}
      >
        {children}
      </div>
    );
  },
);
ScrollhostContainer.displayName = 'ScrollhostContainer';
