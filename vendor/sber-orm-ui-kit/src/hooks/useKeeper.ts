import { useEffect, useRef } from 'react';

/**
 * Хук для хранилища
 * @param {*} arg - состояние, которое будет хранится в хранилище
 * @param {boolean} refresh - параметр, который отвечает за переопределение хранилища
 */
export const useKeeper = <T>(argument: T, refresh = false) => {
  const reference = useRef<T>(argument);

  useEffect(() => {
    if (refresh) {
      reference.current = argument;
    }
  });

  return reference.current;
};
