import { ReactNode } from 'react';
import cn from 'classnames';
import {
  NotificationContainer,
  notification as notificationFunction,
} from '@v-uik/notification';

import { EIconName } from '../../icons';
import { Icon } from '../Icon';
import { MarkdownViewer } from '../MarkdownViewer';
import { Text } from '../Typography';
import { INotificationOptions, TNotificationProps } from './types';

import styles from './styles.module.scss';

interface INotificationContentProps {
  options?: INotificationOptions;
  content?: string;
}

const СontentComponent = ({ options, content }: INotificationContentProps) => {
  const text = content?.trim() ? (
    <MarkdownViewer markdown={content} />
  ) : options?.title ? (
    options.title
  ) : (
    ''
  );

  if (!options?.title && !content?.trim()) {
    return null;
  }

  return (
    <Text
      wrap
      {...(!options?.title || (options?.title && !content?.trim())
        ? { size: 'lg', bold: true }
        : {})}
    >
      {text}
    </Text>
  );
};

export const notification = (
  content?: string,
  options?: INotificationOptions,
) => {
  const type = options?.type ?? 'info';
  const nextNotification = !!options?.title || !!options?.actions;

  const iconNameMap = {
    assistant: EIconName.assistantGradient,
    error: EIconName.errorRounded,
    info: EIconName.infoRounded,
    success: EIconName.success,
    warning: EIconName.warningRounded,
    discovery: EIconName.questionFill,
  };

  const classes = {
    ...styles,
    content: cn(styles.content, {
      [styles.onlyContent]: !options?.title && !options?.actions,
    }),
    root: cn(styles.root, styles.rootGradient, styles[type]),
  };

  notificationFunction(
    <СontentComponent options={options} content={content} />,
    {
      actions: options?.actions as ReactNode,
      classes,
      icon: <Icon className={styles[type]} name={iconNameMap[type]} />,
      id: options?.id as string | undefined,
      nextNotification,
      title:
        content?.trim() && options?.title ? (
          <Text size='lg' bold wrap>
            {options?.title}
          </Text>
        ) : null,
    },
  );
};

export const Notification = (props: TNotificationProps) => (
  <NotificationContainer showIndicator={false} {...props} />
);
