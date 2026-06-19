import React, { ReactNode } from 'react';

import { DropzoneOwnProps, UploaderLabelProps } from '@v-uik/file-uploader';
import { IButtonProperties } from '@/components/Button';
import { EIconName } from '@/icons';

type VUploaderLabelProps = Omit<
  UploaderLabelProps<'div'>,
  'classes' | 'labelProps' | 'descriptionProps' | 'errorTextProps' | 'as'
>;
type VDropzoneProps = Omit<DropzoneOwnProps, 'children' | 'classes'>;

export interface ILabelComponentProps extends VUploaderLabelProps {
  tooltip?: ReactNode | ReactNode[];
  helpText?: string;
  required?: boolean;
  fullHeight?: boolean;
}

export interface IDropzoneComponentProps {
  placeholder?: string;
  linkText?: string;
  previewText?: string;
  suffix?: React.ReactNode;
  fullHeight?: boolean;
  actionBlock?: {
    text: string;
    actionText: string;
    buttonProps: IButtonProperties;
    backgroundIcon?: EIconName;
    onClick: () => void;
  };
}

export type TDropzoneProps = VDropzoneProps &
  Omit<ILabelComponentProps, 'children'> &
  IDropzoneComponentProps;
