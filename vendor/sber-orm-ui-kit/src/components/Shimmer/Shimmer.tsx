import cn from 'classnames';
import styles from './styles.module.scss';

export interface IShimmerProps {
  width?: number;
  height?: number;
  borderRadius?: number;
  size?: 14 | 16 | 20 | 24 | 28 | 32 | 40;
  animation?: boolean;
}

export const Shimmer = ({
  width,
  height,
  size = 20,
  borderRadius = 8,
  animation = true,
}: IShimmerProps) => {
  return (
    <span
      className={cn(styles.shimmer, {
        [styles.animation]: animation,
        [styles[`size-${size}`]]: !height,
      })}
      style={{ width: width ?? '100%', height, borderRadius }}
    />
  );
};
