import { useEffect, useRef } from 'react';

interface Cancel {
  cancel: () => void;
}

type NoReturn<T extends (...args: Parameters<T>) => ReturnType<T>> = (
  ...args: Parameters<T>
) => void;

export const useThrottle = <
  T extends (...args: Parameters<T>) => ReturnType<T>,
>(
  clb: T,
  delay = 64,
): NoReturn<T> & Cancel => {
  const timeoutId = useRef<NodeJS.Timeout | null>(null);
  const lastRan = useRef<number>(0);

  // Обновляем ссылку на функцию при изменении func
  const throttledFunction = useRef(clb);
  useEffect(() => {
    throttledFunction.current = clb;
  }, [clb]);

  const throttled = ((...args: Parameters<T>): ReturnType<T> | undefined => {
    const now = Date.now();

    if (now - lastRan.current >= delay) {
      lastRan.current = now;
      return throttledFunction.current(...args);
    }

    if (!timeoutId.current) {
      timeoutId.current = setTimeout(() => {
        lastRan.current = Date.now();
        timeoutId.current = null;
        throttledFunction.current(...args);
      }, delay);
    }

    return undefined as ReturnType<T>;
  }) as T & { cancel: () => void };

  throttled.cancel = (): void => {
    if (timeoutId.current) {
      clearTimeout(timeoutId.current);
      timeoutId.current = null;
    }
  };

  useEffect(() => {
    return () => {
      if (timeoutId.current) {
        clearTimeout(timeoutId.current);
      }
    };
  }, []);

  return throttled;
};

export default useThrottle;
