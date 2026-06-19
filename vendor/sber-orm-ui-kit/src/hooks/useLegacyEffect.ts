import React, { useEffect, useRef } from 'react';

const isDevelopmentRun =
  !process.env.NODE_ENV || process.env.NODE_ENV === 'development';

export const useLegacyEffect = (
  callback: React.EffectCallback,
  deps: React.DependencyList,
) => {
  const isMountedReference = useRef(!isDevelopmentRun);

  useEffect(() => {
    if (!isMountedReference.current) {
      isMountedReference.current = true;

      return undefined;
    }

    return callback();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
};
