import React, { useRef } from 'react';

import { Tooltip } from '@/components/Tooltip';
import { useIsOverflowing } from '@/hooks';

interface IValueWithTooltipProps extends React.PropsWithChildren {
  value?: string;
  className?: string;
}

export const ValueWithTooltip: React.FC<IValueWithTooltipProps> = ({
  children,
  value,
  className,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isOverflowing = useIsOverflowing(containerRef, [value, children]);

  return (
    <Tooltip
      content={isOverflowing ? value : ''}
      dropdownProps={{
        popperOptions: {
          strategy: 'fixed',
        },
      }}
    >
      <div ref={containerRef} className={className}>
        {children}
      </div>
    </Tooltip>
  );
};
