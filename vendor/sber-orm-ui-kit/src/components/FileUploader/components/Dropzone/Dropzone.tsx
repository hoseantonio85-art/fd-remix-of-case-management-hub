import React, { useMemo } from 'react';
import { Button as VButton } from '@v-uik/button';
import {
  Dropzone as VDropzone,
  UploaderLabel as VUploaderLabel,
} from '@v-uik/file-uploader';
import cn from 'classnames';

import { Button } from '@/components/Button';
import { Row } from '@/components/Grid';
import { Icon } from '@/components/Icon';
import { Tooltip } from '@/components/Tooltip';
import { Text } from '@/components/Typography';
import {
  IDropzoneComponentProps,
  ILabelComponentProps,
  TDropzoneProps,
} from './types';

import styles from './styles.module.scss';

const DropzoneContent = React.memo<IDropzoneComponentProps>((props) => {
  const {
    placeholder,
    previewText = 'Перетащите файлы сюда или',
    linkText = 'выберите вручную',
  } = props;

  return (
    <Row direction='column' justify='center' gutter={8}>
      <Icon name='uploadFile' width={32} height={32} />

      <Row align='middle' justify='center' gutter={4} noFlex wrap>
        <span>{previewText}</span>
        <VButton
          classes={{
            button: styles.uploadButton,
            text: styles.uploadButtonText,
          }}
          kind='ghost'
          color='secondary'
          tabIndex={-1}
        >
          {linkText}
        </VButton>
      </Row>

      {!!placeholder && (
        <div className={styles.placeholder}>
          <Text size='sm' className={styles.placeholderText}>
            {placeholder}
          </Text>
        </div>
      )}
    </Row>
  );
});

export const LabelComponent = React.forwardRef<
  HTMLDivElement,
  ILabelComponentProps
>(({ children, fullHeight, ...props }, ref) => {
  const properties = useMemo(() => {
    const labelProps = {} as Partial<ILabelComponentProps>;

    if (props.label) {
      labelProps.label = (
        <Text size='sm' bold>
          {props.label}
          {!!props.required && <span className={styles.required}>*</span>}
        </Text>
      );

      if (props.tooltip) {
        labelProps.label = (
          <>
            {labelProps.label}
            <Tooltip placement='top' content={props.tooltip}>
              <div className={styles.tooltip}>
                <Icon name='infoOutlined' width={16} height={16} />
              </div>
            </Tooltip>
          </>
        );
      }
    }

    if (props.errorText) {
      labelProps.errorText = (
        <Row gutter={4}>
          <Icon name='errorRounded' width={16} height={16} />
          <Text size='sm' className={styles.errorText}>
            {props.errorText}
          </Text>
        </Row>
      );
    } else if (props.helpText) {
      labelProps.errorText = (
        <Text size='sm' className={styles.helpText}>
          {props.helpText}
        </Text>
      );
    }

    return labelProps;
  }, [props]);

  const labelClasses = {
    label: styles.uploaderLabel,
    error: styles.uploaderLabelError,
  };

  return (
    <VUploaderLabel
      ref={ref}
      className={cn(styles.dropzoneLabel, {
        [styles.dropzoneLabelFullHeight]: fullHeight,
      })}
      classes={labelClasses}
      {...properties}
    >
      {children}
    </VUploaderLabel>
  );
});

export const Dropzone = React.forwardRef<HTMLDivElement, TDropzoneProps>(
  (props, ref) => {
    const {
      placeholder,
      helpText,
      previewText,
      linkText,
      tooltip,
      disabled = false,
      required = false,
      label,
      description,
      errorText,
      suffix,
      fullHeight,
      actionBlock,
      ...rest
    } = props;

    const dropzoneClasses = {
      dropzone: cn(styles.dropzone, {
        [styles.dropzoneFullHeight]: fullHeight,
      }),
      dragEnter: styles.dropzoneActive,
      disabled: styles.dropzoneDisabled,
      error: styles.dropzoneError,
    };

    return (
      <>
        <LabelComponent
          ref={ref}
          label={label}
          description={description}
          disabled={disabled}
          required={required}
          tooltip={tooltip}
          errorText={errorText}
          helpText={helpText}
          fullHeight={fullHeight}
        >
          <VDropzone classes={dropzoneClasses} disabled={disabled} {...rest}>
            <DropzoneContent
              placeholder={placeholder}
              previewText={previewText}
              linkText={linkText}
            />
            {actionBlock && (
              <div className={styles.suffix}>
                <div
                  className={cn(styles.actionWrapper, {
                    [styles.actionWrapperDisabled]: disabled,
                  })}
                  onClick={actionBlock.onClick}
                >
                  <Row gutter={16} justify='between'>
                    {actionBlock.backgroundIcon && (
                      <div className={styles.actionIconWrapper}>
                        <Icon
                          name={actionBlock.backgroundIcon}
                          width={84}
                          height={84}
                        />
                      </div>
                    )}
                    <Text>{actionBlock.text}</Text>
                    <Button {...actionBlock.buttonProps} disabled={disabled}>
                      {actionBlock.actionText}
                    </Button>
                  </Row>
                </div>
              </div>
            )}
            {suffix && !actionBlock && (
              <div className={styles.suffix}>{suffix}</div>
            )}
          </VDropzone>
        </LabelComponent>
      </>
    );
  },
);
