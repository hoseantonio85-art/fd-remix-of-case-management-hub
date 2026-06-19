import { useCallback, useEffect, useState } from 'react';

function getData<T>(key: string, delay?: number): T | null {
  if (!key) {
    return null;
  }
  const item = (localStorage.getItem(key) as string) || '';
  const itemDeadline =
    (localStorage.getItem(`${key}_deadLine`) as string) || '';

  if (!item) {
    return null;
  }

  if (delay && itemDeadline && Number(JSON.parse(itemDeadline)) < Date.now()) {
    localStorage.removeItem(key);
    localStorage.removeItem(`${key}_deadLine`);

    return null;
  }

  try {
    return JSON.parse(item) || null;
  } catch {
    localStorage.removeItem(key);

    return null;
  }
}

export const useStorageData = <T>(key: string, delay?: number) => {
  const [storage, setStorage] = useState<T | null>(getData<T>(key, delay));

  useEffect(() => {
    function handleChangeStorage() {
      setStorage(getData(key));
    }

    window.addEventListener(`storage${key}`, handleChangeStorage);

    return function cleanup() {
      window.removeEventListener(`storage${key}`, handleChangeStorage);
    };
  }, [key]);

  const setStorageData = useCallback(
    (data: T) => {
      localStorage.setItem(key, JSON.stringify(data));
      delay &&
        localStorage.setItem(
          `${key}_deadLine`,
          JSON.stringify(Date.now() + delay),
        );
      window.dispatchEvent(new CustomEvent(`storage${key}`));
    },
    [key, delay],
  );

  const removeStorageData = useCallback(() => {
    localStorage.removeItem(key);
  }, [key]);

  return { removeStorageData, setStorageData, storage };
};
