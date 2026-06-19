import { useEffect } from 'react';

export interface ISubscribeEventMap
  extends ElementEventMap,
    DocumentEventMap,
    WindowEventMap {}

export const subscribeEvent = <
  T extends Element | Document | Window | undefined | null,
  K extends keyof ISubscribeEventMap,
>(
  element: T,
  type: K,
  clb: EventListenerOrEventListenerObject,
  options?: boolean | AddEventListenerOptions,
) => {
  if (element) {
    element.addEventListener(type, clb, options);

    return () => {
      element.removeEventListener(type, clb, options);
    };
  }

  return null;
};

/** Хук для подписок на события */
export const useEventListener = <
  T extends Element | Document | Window,
  K extends keyof ISubscribeEventMap,
>(
  eventTarget: (T & (() => T)) | T | (() => T) | null,
  event: K,
  listener: EventListenerOrEventListenerObject,
  options: boolean | AddEventListenerOptions = false,
) => {
  useEffect(() => {
    const target =
      typeof eventTarget === 'function'
        ? (eventTarget as () => T)()
        : eventTarget;

    if (!target?.addEventListener) {
      return;
    }
    const unsubscribe = subscribeEvent(target, event, listener, options);

    return () => {
      unsubscribe?.();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventTarget, event, listener, JSON.stringify(options)]);
};
