import cn from 'classnames';
import { Row } from '@/components/Grid';
import { TInputNumberSizes } from '../types';

import classes from '../styles.module.scss';

interface IArrowControlProps {
  disabled?: boolean;
  size: TInputNumberSizes;
  onUp: () => void;
  onDown: () => void;
}
interface IArrowProps {
  flip?: boolean;
  onClick?: () => void;
}

const Arrow = ({ flip, onClick }: IArrowProps) => (
  <button className={cn(classes.arrowButton)} onClick={onClick}>
    <svg
      width='12.000000'
      height='12.000000'
      viewBox='0 0 12 12'
      fill='none'
      transform={flip ? 'rotate(180)' : ''}
      xmlns='http://www.w3.org/2000/svg'
    >
      <path
        id='vector'
        d='M5.52 8.78L3.12 5.87C2.92 5.63 2.97 5.28 3.24 5.1C3.34 5.03 3.47 5 3.6 5L8.4 5C8.73 5 9 5.24 9 5.54C9 5.66 8.95 5.77 8.88 5.87L6.48 8.78C6.28 9.02 5.9 9.07 5.64 8.89C5.59 8.85 5.55 8.82 5.52 8.78Z'
        fill='#24292E'
        fill-opacity='1.000000'
        fill-rule='evenodd'
      />
      <path
        id='vector'
        d='M3.12 5.87C2.92 5.63 2.97 5.28 3.24 5.1C3.34 5.03 3.47 5 3.6 5L8.4 5C8.73 5 9 5.24 9 5.54C9 5.66 8.95 5.77 8.88 5.87L6.48 8.78C6.28 9.02 5.9 9.07 5.64 8.89C5.59 8.85 5.55 8.82 5.52 8.78L3.12 5.87Z'
        stroke='#979797'
        stroke-opacity='0'
        stroke-width='0.000000'
      />
    </svg>
  </button>
);

export const ArrowControl = ({
  disabled,
  size,
  onUp,
  onDown,
}: IArrowControlProps) => {
  return (
    <Row
      direction='column'
      className={cn(classes.arrowControl, classes[`size${size}`], {
        [classes.arrowControlDisabled]: disabled,
      })}
    >
      <Arrow flip onClick={(!disabled && onUp) || undefined} />
      <Arrow onClick={(!disabled && onDown) || undefined} />
    </Row>
  );
};
