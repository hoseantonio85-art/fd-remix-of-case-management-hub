import React, { useCallback, useImperativeHandle, useRef } from 'react';
import {
  ButtonUploader as VButtonUploader,
  type ButtonUploaderProps as VButtonUploaderProps,
  type UploaderBaseProps as VUploaderBaseProps,
} from '@v-uik/file-uploader';

import { Button, type IButtonProperties } from '../../../Button';

export type TButtonUploaderProps = IButtonProperties &
  VUploaderBaseProps &
  Pick<VButtonUploaderProps, 'onUpload'>;

export const ButtonUploader = React.forwardRef<
  HTMLButtonElement,
  TButtonUploaderProps
>((props, ref) => {
  const { size, color, ...rest } = props;

  const ButtonComponent = useCallback(
    (props: IButtonProperties) => {
      const innerRef = useRef<HTMLButtonElement>(null);
      useImperativeHandle(ref, () => innerRef.current!, []);

      return <Button ref={innerRef} size={size} {...props} />;
    },
    [size, ref],
  );

  return (
    <VButtonUploader
      color={color as 'primary' | 'secondary' | 'error' | undefined}
      {...rest}
      components={
        { Button: ButtonComponent } as VButtonUploaderProps['components']
      }
    />
  );
});
