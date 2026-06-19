import { MutableRefObject, useEffect } from 'react';

export const subscribeMutation = <T extends HTMLElement>(
  element: T,
  clb: (records?: MutationRecord[]) => void,
  options: MutationObserverInit,
) => {
  const mObs = new MutationObserver((records) => {
    clb(records);
  });

  mObs.observe(element, options);

  return () => {
    mObs.disconnect();
  };
};

// TODO привести к ввиду useEventListener?
/** Хук для подписок на изменение элемента через MutationObserver */
export const useMutation = (
  reference: MutableRefObject<HTMLElement | null>,
  callback: (records?: MutationRecord[]) => void,
  options: MutationObserverInit,
) => {
  useEffect(() => {
    const element = reference.current;

    if (!element) {
      return;
    }

    const unsubscribe = subscribeMutation(element, callback, options);

    return () => {
      unsubscribe();
    };
  }, [reference, callback, JSON.stringify(options)]);
};
