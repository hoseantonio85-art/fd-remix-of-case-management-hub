import cn from 'classnames';
import { ReactNode } from 'react';
import { Icon } from '../../../Icon';
import { Tooltip } from '../../../Tooltip';

import styles from '../../buttons.module.scss';

type THelperTooltipProps = {
  labelInside?: boolean;
  tooltip?: ReactNode | ReactNode[];
};

export const HelperTooltip = ({
  labelInside,
  tooltip,
}: THelperTooltipProps) => {
  return (
    <Tooltip
      placement='top-end'
      content={tooltip}
      fallbackPlacements={['left-start']}
    >
      <span
        className={cn(styles.tooltipIcon, {
          [styles.indicatorButton]: labelInside,
        })}
      >
        <Icon
          width={labelInside ? 20 : 16}
          height={labelInside ? 20 : 16}
          name='infoOutlined'
        />
      </span>
    </Tooltip>
  );
};
