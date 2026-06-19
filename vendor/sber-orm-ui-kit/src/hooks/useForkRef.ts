import React, { useMemo } from 'react';

export type TRef<T> =
  | React.MutableRefObject<T | null>
  | ((instance: T | null) => void)
  | null
  | undefined;

export function setRef<T>(reference: TRef<T>, value: T | null) {
  if (typeof reference === 'function') {
    reference(value);
  } else if (reference) {
    reference.current = value;
  }
}

export const useForkRef = <T, V extends T = T>(
  referenceA: TRef<T>,
  referenceB: TRef<V>,
) =>
  useMemo(() => {
    if (referenceA === null && referenceB === null) {
      return null;
    }

    return (referenceValue: T & V) => {
      setRef<T>(referenceA, referenceValue);
      setRef<V>(referenceB, referenceValue);
    };
  }, [referenceA, referenceB]);
