import common from './locales/ru/common.json';

export const defaultLanguage = 'ru';
export const defaultNamespace = 'common';

export const resources = {
  ru: {
    [defaultNamespace]: common,
  },
} as const;
