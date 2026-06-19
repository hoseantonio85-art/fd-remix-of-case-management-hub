import { useMemo } from 'react';

export const useMoneyFormatter = (
  locale = 'ru-RU',
  formatOptions: Intl.NumberFormatOptions = {},
) =>
  useMemo(
    () =>
      new Intl.NumberFormat(locale, {
        currency: 'RUB',
        maximumFractionDigits: 4,
        minimumFractionDigits: 0,
        style: 'currency',
        ...formatOptions,
      }),
    [locale, formatOptions],
  );
