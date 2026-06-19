import React from 'react';

import { Row } from '@/components/Grid';
import { Icon } from '@/components/Icon';

type THelperTextProps = {
  error?: boolean;
  text?: React.ReactNode;
};

export const HelperText = ({ error, text }: THelperTextProps) => {
  if (!text) {
    return null;
  }

  if (!error) {
    return text;
  }

  return (
    <Row gutter={4}>
      <Icon width={16} height={16} name='errorRounded' />
      <div>{text}</div>
    </Row>
  );
};
