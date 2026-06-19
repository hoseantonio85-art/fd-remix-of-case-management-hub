import { useCallback, useEffect, useRef } from 'react';

export const useEventCallback = <
  // biome-ignore lint/suspicious/noExplicitAny: reason
  TCallback extends (...arguments_: any[]) => any,
>(
  function_?: TCallback,
) => {
  const reference = useRef<TCallback | undefined>(function_);

  useEffect(() => {
    reference.current = function_;
  }, [function_]);

  // biome-ignore lint/suspicious/noExplicitAny: reason
  return useCallback((...arguments_: any[]) => {
    const callbackFunction = reference.current;

    callbackFunction?.(...arguments_);
  }, []);
};
