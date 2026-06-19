import cn from 'classnames';

import styles from './styles.module.scss';

export interface ILoaderProps {
  color?: string;
  size?: number;
  absolute?: boolean;
  classes?: {
    container?: string;
    spinner?: string;
  };
}

export const Loader = ({
  color,
  size = 56,
  classes,
  absolute = false,
}: ILoaderProps) => {
  const SpinnerComponent = (
    <div
      className={cn(styles.spinner, classes?.spinner)}
      style={{
        width: size,
        height: size,
        borderColor: color,
        borderWidth: size / 10,
      }}
    />
  );

  return (
    <div className={cn(classes?.container, { [styles.absolute]: absolute })}>
      {SpinnerComponent}
    </div>
  );
};
