import { forwardRef, useMemo } from 'react';
import cn from 'classnames';

import { EIconName, iconMap } from '../../icons';
import { Icon } from '../Icon';

import { IButtonProperties } from './types';

import classes from './styles.module.scss';

export const Button = forwardRef<HTMLButtonElement, IButtonProperties>(
  (
    {
      icon,
      iconAfter,
      iconOnly,
      loading,
      size = 'M',
      link,
      variant = 'primary',
      className,
      children,
      type = 'button',
      ...properties
    }: IButtonProperties,
    ref,
  ) => {
    const buttonClasses = useMemo(() => {
      let buttonSize = size;

      if (variant === 'function' && size !== 'XXS') {
        buttonSize = size === 'XS' ? 'XXS' : 'S';
      }
      if (
        variant === 'ellipse' &&
        size !== 'XXS' &&
        size !== 'XS' &&
        size !== 'S'
      ) {
        buttonSize = 'S';
      }

      return {
        base: cn(classes[variant], classes[`size${buttonSize}`], {
          [classes.iconOnly]: iconOnly,
          [classes.blue]: link,
          [classes.disabled]: properties.disabled,
          [classes.loading]: loading,
        }),
      };
    }, [variant, iconOnly, loading, link, size]);

    const iconSize = size === 'XXS' || size === 'XS' ? 20 : 24;

    const hasIcon = !!icon && iconMap[icon as keyof typeof EIconName];
    const hasIconAfter =
      !!iconAfter && iconMap[iconAfter as keyof typeof EIconName];
    const hasChildren = children != null && children !== false;

    const content = (
      <div
        className={cn(classes.content, {
          [classes.contentEllipse]:
            variant === 'ellipse' && (size === 'XS' || size === 'S'),
          [classes.loadingText]: loading,
        })}
      >
        {hasIcon && (
          <Icon
            className={classes.icon}
            width={iconSize}
            height={iconSize}
            name={icon as keyof typeof EIconName}
          />
        )}
        {hasChildren && <div className={classes.children}>{children}</div>}
        {hasIconAfter && (
          <Icon
            className={classes.icon}
            width={iconSize}
            height={iconSize}
            name={iconAfter as keyof typeof EIconName}
          />
        )}
      </div>
    );

    return (
      <button
        ref={ref}
        type={type}
        className={cn(buttonClasses.base, className, {
          [classes.fullWidth]: properties.fullWidth,
        })}
        disabled={properties.disabled}
        {...properties}
      >
        {content}
      </button>
    );
  },
);

Button.displayName = 'Button';
