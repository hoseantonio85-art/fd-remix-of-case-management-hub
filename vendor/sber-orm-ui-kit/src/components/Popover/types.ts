import { Placement } from '@popperjs/core';
import { PopupProps } from '../Popup';

export interface IPopoverProps extends PopupProps {
  /**
   * @description
   * Whether to show the arrow or not. Default is true.
   */
  withArrow?: boolean;
  offset?: number;
  fallbackPlacements?: Placement[];
  title?: string;
  text?: string;
  onClose?: () => void;
}
