import { MutableRefObject, useLayoutEffect } from 'react';

export const subscribeResize = (element: HTMLElement, clb: () => void) => {
  const rObs = new ResizeObserver(() => {
    clb();
  });

  rObs.observe(element);

  return () => {
    rObs.disconnect();
  };
};

/** Хук для подписок на изменение элемента через ResizeObserver */
export const useResizeHook = (
  reference: MutableRefObject<HTMLElement | null>,
  callback: () => void,
) => {
  useLayoutEffect(() => {
    const element = reference.current;

    if (!element) {
      return;
    }

    const unsubscribe = subscribeResize(element, callback);

    return () => {
      unsubscribe();
    };
  }, [callback, reference]);
};
