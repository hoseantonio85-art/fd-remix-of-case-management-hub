import { useCallback, useRef } from 'react';

import { useEventCallback } from '../../../hooks';

export const useDebounceRaf = (clb: FrameRequestCallback) => {
  const timer = useRef<number | null>(null);
  const callbackEvent = useEventCallback(clb);

  return useCallback(
    (...arguments_: unknown[]) => {
      if (timer.current) {
        cancelAnimationFrame(timer.current!);
        timer.current = null;
      }

      timer.current = requestAnimationFrame(() => {
        callbackEvent(...arguments_);
      });
    },
    [callbackEvent],
  );
};
