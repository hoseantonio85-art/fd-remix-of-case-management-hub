import cn from 'classnames';
import React, { KeyboardEvent } from 'react';

import { Button, Text, Title, Icon } from '../..';
import { Row } from '../Grid';
import ai from './icons/Ai-status.svg?react';
import discovery from './icons/discovery-status.svg?react';
import error from './icons/error-status.svg?react';
import info from './icons/info-status.svg?react';
import success from './icons/success-status.svg?react';
import warning from './icons/warning-status.svg?react';
import classes from './styles.module.scss';
import { EAlertStatus, type IAlertProperties } from './types';

const iconMap = {
  [EAlertStatus.danger]: error,
  [EAlertStatus.error]: error,
  [EAlertStatus.info]: info,
  [EAlertStatus.success]: success,
  [EAlertStatus.warning]: warning,
  [EAlertStatus.ai]: ai,
  [EAlertStatus.discovery]: discovery,
};

export const Alert: React.FC<IAlertProperties> = (properties) => {
  const {
    actions,
    mb = 0,
    message,
    onClose,
    status = EAlertStatus.info,
    title,
    customIcon,
  } = properties;

  const IconComponent = iconMap[status];

  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === 'Enter') {
      onClose?.();
    }
  };

  return (
    <div
      className={cn(
        classes.wrapper,
        classes[`mb-${mb}`],
        classes[`status-${status}`],
      )}
    >
      {customIcon ? (
        <Icon name={customIcon} className={classes.icon} />
      ) : (
        <IconComponent className={classes.icon} />
      )}
      <Row
        className={classes.textWrapper}
        direction='column'
        align='top'
        gutter={8}
      >
        {title && <Title size='H400'>{title}</Title>}
        {!!message && <Text code>{message}</Text>}
        {actions && (
          <div className={classes.actions}>
            {actions.map((action, index) => (
              <>
                {!!index && (
                  <Title className={classes.dot} size='H200'>
                    •
                  </Title>
                )}
                <Button
                  size='XXS'
                  variant='function'
                  onClick={action.onClick}
                  link
                >
                  {action.title}
                </Button>
              </>
            ))}
          </div>
        )}
      </Row>

      {onClose && (
        <Button
          className={classes.closeButton}
          size='XXS'
          variant='function'
          icon='cross'
          onClick={onClose}
          iconOnly
          onKeyDown={onKeyDown}
        />
      )}
    </div>
  );
};
