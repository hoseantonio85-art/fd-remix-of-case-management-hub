import cn from 'classnames';

import classes from './styles.module.scss';
import type { TColProps as TColProperties } from './types';

export const Col = ({ children, span, ...properties }: TColProperties) => (
  <div
    {...properties}
    className={cn(
      classes.col,
      { [classes[`col-${span}`]]: span },
      properties.className,
    )}
  >
    {children}
  </div>
);
