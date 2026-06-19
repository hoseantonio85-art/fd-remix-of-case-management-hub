import React, { useState } from 'react';
import { I18nextProvider, useTranslation } from 'react-i18next';

import { EIconName } from '@/icons';

import i18next from '../../i18n';
import { Button } from '../Button';
import { Row } from '../Grid';
import { Icon } from '../Icon';
import { Text } from '../Typography';

import classes from './styles.module.scss';
import { INoticeProps } from './types';

const i18nResource = i18next('ru', 'common');

export const NoticeInner = ({
  description,
  iconName = 'assistantGradient' as EIconName,
  opened = false,
  title,
}: INoticeProps) => {
  const { t } = useTranslation();

  const [isOpen, setOpen] = useState(opened);

  const handleClick = (event: React.MouseEvent) => {
    event.stopPropagation();

    setOpen(!isOpen);
  };

  return (
    <Row
      role='presentation'
      className={classes.notice}
      onClick={handleClick}
      align='top'
      gutter={8}
    >
      <Icon name={iconName} />

      <Row
        className={classes.content}
        direction='column'
        align='top'
        justify='start'
        gutter={8}
      >
        {title}
        {description && isOpen && <Text code>{description}</Text>}
      </Row>

      {description && (
        <Button
          iconAfter={isOpen ? 'arrowUpSmall' : 'arrowDownSmall'}
          variant='function'
          size='XXS'
        >
          {isOpen ? t('hide') : t('show')}
        </Button>
      )}
    </Row>
  );
};

export const Notice = (props: INoticeProps) => (
  <I18nextProvider i18n={i18nResource}>
    <NoticeInner {...props} />
  </I18nextProvider>
);
