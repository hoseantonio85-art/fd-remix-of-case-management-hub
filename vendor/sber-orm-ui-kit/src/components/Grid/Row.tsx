import cn from 'classnames';
import React from 'react';

import classes from './styles.module.scss';
import {
  EAlign,
  EDirection,
  EJustifyContent,
  TRowProps as TRowProperties,
} from './types';

export const Row = React.forwardRef<HTMLDivElement, TRowProperties>(
  (
    {
      align = EAlign.middle,
      className,
      direction = EDirection.row,
      gutter = 0,
      justify = EJustifyContent.start,
      mb = 0,
      noFlex,
      wrap,
      ...properties
    },
    reference,
  ) => {
    const classNames = cn(
      classes.row,
      classes[`mb-${mb}`],
      classes[`gap-${gutter}`],
      classes[`row-align-${align}`],
      classes[`row-justify-${justify}`],
      {
        [classes.rowColumn]: direction === EDirection.column,
        [classes.rowNoFlex]: noFlex,
        [classes.rowWrap]: wrap,
      },
      className,
    );

    return (
      <div {...properties} className={classNames} ref={reference}>
        {properties.children}
      </div>
    );
  },
);
Row.displayName = 'Row';
