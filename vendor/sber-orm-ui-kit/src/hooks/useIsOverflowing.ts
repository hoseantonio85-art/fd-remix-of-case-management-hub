import { RefObject, useCallback, useState } from 'react';
import { useLegacyEffect } from '..';

type TDependencyList = readonly unknown[];

export function useIsOverflowing<T extends HTMLElement>(
  ref: RefObject<T>,
  dependencies: TDependencyList = [],
): boolean {
  const [isOverflowing, setIsOverflowing] = useState(false);

  const checkOverflow = useCallback(() => {
    if (!ref.current) {
      return false;
    }

    const element = ref.current;
    const isOverflowing = element.scrollWidth > element.clientWidth;
    return isOverflowing;
  }, [ref.current]);

  useLegacyEffect(() => {
    const updateOverflow = () => {
      setIsOverflowing(checkOverflow());
    };

    updateOverflow();

    const resizeObserver = new ResizeObserver(updateOverflow);
    const element = ref.current;

    if (element) {
      resizeObserver.observe(element);
    }

    return () => {
      if (element) {
        resizeObserver.unobserve(element);
      }
    };
  }, [checkOverflow, ...dependencies]);

  return isOverflowing;
}
