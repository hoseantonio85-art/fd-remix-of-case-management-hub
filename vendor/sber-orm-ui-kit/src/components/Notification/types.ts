import {
  NotificationContainerProps,
  NotificationOptions,
} from '@v-uik/notification';

export type TNotificationProps = NotificationContainerProps;

export type TNotificationType =
  | 'error'
  | 'success'
  | 'warning'
  | 'info'
  | 'discovery'
  | 'assistant';

export interface INotificationOptions
  extends Omit<NotificationOptions, 'title'> {
  type: TNotificationType;
  title?: string;
}
