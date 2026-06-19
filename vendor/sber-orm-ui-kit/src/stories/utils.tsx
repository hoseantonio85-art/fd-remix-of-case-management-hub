import { ReactElement, ReactNode } from 'react';

import '../colors.scss';
import '../variables.scss';
import classes from './styles.module.scss';

interface IContainerProperties {
  children?: ReactElement | ReactElement[] | ReactNode | ReactNode[];
}

export const Container = ({ children }: IContainerProperties) => {
  return <div className={classes.container}>{children}</div>;
};

interface IItemProperties {
  height?: number;
  label?: string;
  children: ReactElement | ReactElement[] | ReactNode | ReactNode[];
  width?: number;
}

export const Item = ({ children, height, label, width }: IItemProperties) => (
  <div
    className={classes.item}
    style={{ height: height ? `${height}px` : 'auto', width: `${width}px` }}
  >
    {children}
    <label className={classes.label}>{label}</label>
  </div>
);

export const DemoContainer = ({ children }: IContainerProperties) => {
  return <div className={classes.demoContainer}>{children}</div>;
};
