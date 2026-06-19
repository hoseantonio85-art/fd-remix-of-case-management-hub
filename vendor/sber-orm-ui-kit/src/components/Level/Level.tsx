import cn from 'classnames';

import { EIconName } from '@/icons';
import { EComponentColors } from '../../types';
import { Badge, EBadgeSize } from '../Badge';
import { Icon } from '../Icon';
import { Text } from '../Typography';
import { ELevelState, ILevelProps } from './types';

import classes from './styles.module.scss';

const iconMap: Record<string, EIconName> = {
  [ELevelState.default]: EIconName.rhomb,
  [ELevelState.low]: EIconName.arrowDownTriangle,
  [ELevelState.medium]: EIconName.rhomb,
  [ELevelState.high]: EIconName.arrowUpTriangle,
  [ELevelState.critical]: EIconName.arrowUpDoubleTriangle,
};

const badgeVariantMap: Record<string, EComponentColors> = {
  [ELevelState.default]: EComponentColors.outlined,
  [ELevelState.low]: EComponentColors.gray,
  [ELevelState.medium]: EComponentColors.yellow,
  [ELevelState.high]: EComponentColors.red,
  [ELevelState.critical]: EComponentColors.red,
};

const defaultTranslations: Record<string, string> = {
  [ELevelState.default]: 'Нет оценки',
  [ELevelState.low]: 'Низкий',
  [ELevelState.medium]: 'Средний',
  [ELevelState.high]: 'Высокий',
  [ELevelState.critical]: 'Очень высокий',
};

export const Level = (props: ILevelProps) => {
  const {
    className,
    withBadge,
    state = ELevelState.default,
    t = (s: string) => defaultTranslations[s],
    iconRight,
    size = 'md',
    icon,
    variant,
    text,
  } = props;

  const classNames = cn(
    classes.level,
    classes[`state-${state}`],
    classes[`size-${size}`],
    {
      [classes.withBadge]: withBadge,
      [classes.iconRight]: iconRight,
    },
    className,
  );

  const content = (
    <div className={classNames}>
      <div className={classes.iconWrapper}>
        {(icon ||
          Object.keys(ELevelState)
            .filter((value) => value !== ELevelState.default)
            .includes(state)) && (
          <Icon
            name={(icon || iconMap[state]) ?? EIconName.rhomb}
            className={classes.icon}
          />
        )}
      </div>
      <Text size={size} className={classes.text} nowrap>
        {text || t(state)}
      </Text>
    </div>
  );

  if (!withBadge) {
    return content;
  }

  return (
    <Badge
      size={EBadgeSize.xxs}
      variant={(variant || badgeVariantMap[state]) ?? EComponentColors.outlined}
      className={cn(classes.badge, {
        [classes.badgeCritical]: state === ELevelState.critical,
        [classes.badgeReverse]: iconRight,
      })}
    >
      {content}
    </Badge>
  );
};
