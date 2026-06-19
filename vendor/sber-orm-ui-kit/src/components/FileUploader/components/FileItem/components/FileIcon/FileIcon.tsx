import React from 'react';
import cn from 'classnames';

import { Icon } from '@/components/Icon';
import {
  EFileType,
  fileIconFilledMap,
  fileIconMap,
  type IFileIconProps,
} from '../../types';
import { checkFileType } from '../../utils';

import classes from './styles.module.scss';

export const FileIcon = React.forwardRef<HTMLDivElement, IFileIconProps>(
  (props, ref) => {
    const { error = true, extension, stroke = false } = props;

    const fileIcon = React.useMemo(() => {
      if (error) {
        return EFileType.default;
      }

      const iconExtension = checkFileType(extension || '');

      if (stroke) {
        return fileIconMap[iconExtension];
      }

      return fileIconFilledMap[iconExtension];
    }, [error, extension, stroke]);

    return (
      <div ref={ref} className={cn(classes.icon, classes[fileIcon])}>
        <>
          {!fileIcon && <Icon name={EFileType.default} />}
          {fileIcon && <Icon name={fileIcon} />}
        </>
      </div>
    );
  },
);
