import React from 'react';
import cn from 'classnames';

import {
  type FileStatus,
  type ProgressType,
  FileItem as VFileItem,
} from '@v-uik/file-uploader';

import { Button } from '@/components/Button';
import { Text } from '@/components/Typography';

import { ExtrasInfo } from './components/ExtrasInfo';
import { FileIcon } from './components/FileIcon';
import { SizeInfo } from './components/SizeInfo';

import { type TFileItemProps } from './types';

import styles from './styles.module.scss';

export const FileItem = React.forwardRef<HTMLDivElement, TFileItemProps>(
  (props, ref) => {
    const {
      children,
      extra,
      file,
      title,
      error,
      onDownload,
      onRemove,
      onCancel,
      progress,
      infoPrefix,
      iconProps,
      removeButtonProps,
      canDownload = false,
      canRemove = false,
      chat = false,
      testId,
      ...rest
    } = props;

    const hasError = React.useMemo(() => !!error, [error]);
    const hasProgress = React.useMemo(
      () => !!progress && progress < 100,
      [progress],
    );

    const fileItemClasses = {
      root: cn(styles.fileItem, {
        [styles.fileItemError]: hasError,
        [styles.fileItemChat]: chat,
      }),
      container: styles.itemСontainer,
      content: styles.itemContent,
      info: styles.sizeInfo,
      linearProgress: styles.progressСontainer,
      lg: styles['size-lg'],
      md: styles['size-md'],
      sm: styles['size-sm'],
    };

    const progressProps = {
      status: 'progress' as FileStatus,
      progressType: 'linear' as ProgressType,
    };

    return (
      <VFileItem
        ref={ref}
        classes={fileItemClasses}
        info={
          <>
            {infoPrefix && (
              <div className={styles.infoPrefix}>{infoPrefix}</div>
            )}
            {!chat && <SizeInfo size={file?.size as number} />}
          </>
        }
        renderIconButtons={({ size = 'md' }) => (
          <>
            {!!onDownload && !hasProgress && (
              <Button
                variant='ellipse'
                icon='downloadArrow'
                size='XS'
                iconOnly
                className={cn(styles.fileButtonAction, styles[`size-${size}`])}
                onClick={(e) => onDownload?.(e)}
                data-testid={testId ? `${testId}-downloadButton` : undefined}
              />
            )}
            {canDownload && !onDownload && !hasProgress && (
              <div className={styles.fileButtonStub} />
            )}
            {!!onRemove && !hasProgress && (
              <Button
                variant='ellipse'
                icon='trash'
                size='XS'
                iconOnly
                className={cn(styles.fileButtonAction, styles[`size-${size}`])}
                onClick={(e) => onRemove?.(e)}
                data-testid={testId ? `${testId}-removeButton` : undefined}
                {...removeButtonProps}
              />
            )}
            {canRemove && !onRemove && !hasProgress && (
              <div className={styles.fileButtonStub} />
            )}
            {!!onCancel && (
              <Button
                variant='ellipse'
                icon='cross'
                size='XS'
                iconOnly
                className={cn(styles.fileButtonAction, styles[`size-${size}`])}
                onClick={(e) => onCancel?.(e)}
                data-testid={testId ? `${testId}-cancelButton` : undefined}
              />
            )}
          </>
        )}
        progress={progress}
        {...(hasProgress ? progressProps : {})}
        {...rest}
      >
        <FileIcon
          extension={file?.extension as string}
          error={hasError}
          {...iconProps}
        />
        <div className={styles.content}>
          <Text size='lg' className={styles.fileName} title={title}>
            {children}
          </Text>
          {!chat || error ? (
            <ExtrasInfo items={extra} error={error} />
          ) : (
            <SizeInfo size={file?.size as number} chat />
          )}
        </div>
      </VFileItem>
    );
  },
);
