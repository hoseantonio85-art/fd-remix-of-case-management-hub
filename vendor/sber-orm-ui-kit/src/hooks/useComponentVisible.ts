import { useCallback, useEffect, useRef, useState } from 'react';

export function useComponentVisible<T extends HTMLElement = HTMLElement>(
  initialIsVisible: boolean,
  handler?: (event: Event) => void,
  isModal?: boolean,
) {
  const [isComponentVisible, setIsComponentVisible] =
    useState<boolean>(initialIsVisible);
  const visibleReference = useRef<T | null>(null);

  const handleClickOutside = useCallback(
    (event: Event) => {
      if (
        visibleReference.current &&
        !visibleReference.current?.contains(event.target as Node) &&
        (!isModal || visibleReference.current?.parentNode === event.target)
      ) {
        setIsComponentVisible(false);

        if (handler) {
          handler(event);
        }
      }
    },
    [handler, isModal],
  );

  useEffect(() => {
    const root = document.querySelector('#root');
    const documentRoot =
      !isModal && root?.contains(visibleReference?.current) ? root : document;

    documentRoot?.addEventListener('mousedown', handleClickOutside);
    documentRoot?.addEventListener('touchstart', handleClickOutside);

    return () => {
      documentRoot?.removeEventListener('mousedown', handleClickOutside);
      documentRoot?.removeEventListener('touchstart', handleClickOutside);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    isComponentVisible,
    setIsComponentVisible,
    visibleRef: visibleReference,
  };
}
