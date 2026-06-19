import cn from 'classnames';
import React from 'react';
import SimpleBarCore from 'simplebar-core';
import SimpleBar, { Props as SimpleBarProps } from 'simplebar-react';

import styles from './styles.module.scss';

import 'simplebar-react/dist/simplebar.min.css';

export type TScrollBarProps = SimpleBarProps;
export type TScrollBarRef = SimpleBarCore;

export const ScrollBar = React.forwardRef<TScrollBarRef, SimpleBarProps>(
  ({ children, autoHide = true, className, ...rest }, ref) => {
    const defaultClassNames = { ...SimpleBarCore.defaultOptions.classNames };

    const classes = {
      scrollbar: cn(defaultClassNames.scrollbar, styles.scrollbarContainer),
      visible: cn(defaultClassNames.visible, styles.scrollbarVisible),
      hover: cn(defaultClassNames.hover, styles.scrollbarHover),
      track: cn(defaultClassNames.track, {
        [styles.trackContainer]: !autoHide,
      }),
      horizontal: cn(defaultClassNames.horizontal, {
        [styles.trackHorizontal]: !autoHide,
      }),
      vertical: cn(defaultClassNames.vertical, {
        [styles.trackVertical]: !autoHide,
      }),
      contentWrapper: cn(defaultClassNames.contentWrapper, {
        [styles.contentWrapperContainer]: !autoHide,
      }),
    };

    return (
      <SimpleBar
        ref={ref}
        autoHide={autoHide}
        classNames={classes}
        className={cn(styles.dataSimplebarInit, className)}
        {...rest}
      >
        {children}
      </SimpleBar>
    );
  },
);

ScrollBar.displayName = 'ScrollBar';
