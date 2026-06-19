import cn from 'classnames';
import React from 'react';

import classes from './styles.module.scss';
import {
  ETextSize,
  TLinkProps as TLinkProperties,
  TTextProps as TTextProperties,
  TTitleProps as TTitleProperties,
} from './types';

export const Title = React.forwardRef<HTMLDivElement, TTitleProperties>(
  (properties, reference) => {
    const {
      className,
      mb = 0,
      size = 'H400',
      thin,
      uppercase,
      nowrap,
      white,
      ...rest
    } = properties;

    const classNames = cn(
      classes.title,
      classes[`size-${size}`],
      classes[`mb-${mb}`],
      {
        [classes.thin]: thin,
        [classes.nowrap]: nowrap,
        [classes.uppercase]: uppercase,
        [classes.white]: white,
      },
      className,
    );

    return (
      <div className={classNames} ref={reference} {...rest}>
        {properties.children}
      </div>
    );
  },
);
Title.displayName = 'Title';

export const Text = React.forwardRef<HTMLDivElement, TTextProperties>(
  (properties, reference) => {
    const {
      bold,
      className,
      code,
      disabled,
      link,
      mb = 0,
      medium,
      nowrap,
      size = ETextSize.md,
      tooltip,
      uppercase,
      wrap,
      white,
      ...rest
    } = properties;

    const classNames = cn(
      classes.text,
      classes[`size-${size}`],
      classes[`mb-${mb}`],
      {
        [classes.bold]: bold,
        [classes.code]: code,
        [classes.disabled]: disabled,
        [classes.link]: link,
        [classes.medium]: medium,
        [classes.nowrap]: nowrap,
        [classes.tooltip]: tooltip,
        [classes.uppercase]: uppercase,
        [classes.wrap]: wrap,
        [classes.white]: white,
      },
      className,
    );

    return (
      <p className={classNames} ref={reference} {...rest}>
        {properties.children}
      </p>
    );
  },
);
Text.displayName = 'Text';

export const Link = React.forwardRef<HTMLAnchorElement, TLinkProperties>(
  (properties, reference) => {
    const {
      bold,
      className,
      mb = 0,
      size = ETextSize.md,
      uppercase,
      ...rest
    } = properties;

    const classNames = cn(
      classes.link,
      classes[`size-${size}`],
      classes[`mb-${mb}`],
      {
        [classes.bold]: bold,
        [classes.uppercase]: uppercase,
      },
      className,
    );

    return (
      <a ref={reference} className={classNames} {...rest}>
        {properties.children}
      </a>
    );
  },
);
Link.displayName = 'Link';
