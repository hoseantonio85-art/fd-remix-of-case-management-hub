import { useState } from 'react';
import { usePopper } from '@v-uik/hooks';

import Arrow from '@/icons/unknown/popover-arrow.svg?react';
import { Icon } from '../Icon';
import { Popup } from '../Popup';
import { Text, Title } from '../Typography';
import { IPopoverProps } from './types';

import classes from './styles.module.scss';

export const Popover = (props: IPopoverProps) => {
  const {
    title,
    text,
    anchor,
    children,
    fallbackPlacements,
    offset = 0,
    placement,
    withArrow = true,
    onClose,
    ...rest
  } = props;

  const [popperElement, setPopperElement] = useState<HTMLDivElement | null>(
    null,
  );
  const [arrowElement, setArrowElement] = useState<HTMLDivElement | null>(null);

  const { styles, attributes } = usePopper(
    anchor as HTMLElement | null,
    popperElement as HTMLElement | null,
    {
      placement,
      modifiers: [
        { name: 'arrow', options: { element: arrowElement } },
        { name: 'offset', options: { offset: [offset, withArrow ? 16 : 4] } },
        { name: 'computeStyles', options: { gpuAcceleration: false } },
        { name: 'flip', options: { fallbackPlacements } },
      ],
    },
  );

  return (
    <Popup
      ref={setPopperElement}
      anchor={null}
      {...rest}
      style={styles.popper}
      {...attributes.popper}
    >
      <div className={classes.container}>
        {onClose && (
          <div className={classes.close} onClick={() => onClose()}>
            <Icon name='errorRounded' width={16} height={16} />
          </div>
        )}
        {title && <Title size='H400'>{title}</Title>}
        {text && <Text className={classes.text}>{text}</Text>}
        {children && <div>{children}</div>}
      </div>
      {withArrow && (
        <div
          ref={setArrowElement}
          style={styles.arrow}
          className={classes.arrow}
        >
          <Arrow />
        </div>
      )}
    </Popup>
  );
};
