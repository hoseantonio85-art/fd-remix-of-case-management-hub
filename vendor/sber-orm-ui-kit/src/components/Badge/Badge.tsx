import cn from 'classnames';

import { EComponentColors } from '../../types';
import classes from './styles.module.scss';
import { EBadgeSize, IBadgeProps } from './types';

export const Badge = (props: IBadgeProps) => {
  const {
    className,
    mb = 0,
    size = EBadgeSize.xxxs,
    thin,
    variant = EComponentColors.gray,
    ...rest
  } = props;

  const classNames = cn(
    classes.badge,
    classes[`size-${size}`],
    classes[`mb-${mb}`],
    classes[`variant-${variant}`],
    {
      [classes.thin]: thin,
    },
    className,
  );

  return (
    <div className={classNames} {...rest}>
      {props.children}
    </div>
  );
};
