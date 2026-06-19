import cn from 'classnames';

import { iconMap } from '../../icons';
import classes from './styles.module.scss';
import { EVariant, TIconProperties } from './types';

/** Реализовать через контекст */
export const Icon = (properties: TIconProperties) => {
  const {
    height = 24,
    iconStyles,
    name,
    title,
    variant = EVariant.Fill,
    width = 24,
    className,
    ...other
  } = properties;

  const SvgForRender = iconMap[name];

  if (!SvgForRender) {
    console.warn(`Не удалось найти иконку с именем "${name}"`);
    return null;
  }

  return (
    <div className={cn(classes.wrapper, className)} {...other}>
      <SvgForRender
        className={cn(classes.svg, classes[variant])}
        width={width}
        height={height}
        style={{ ...iconStyles }}
      >
        {!!title && <title>{title}</title>}
      </SvgForRender>
    </div>
  );
};
