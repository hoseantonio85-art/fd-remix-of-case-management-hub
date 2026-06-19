import i18next, { i18n as I18N, InitOptions } from 'i18next';
import { initReactI18next } from 'react-i18next';

import { defaultLanguage, defaultNamespace, resources } from './config';

// let lng = await i18next.getLocale(request);
// eslint-disable-next-line import/no-named-as-default-member
const newInstance = i18next.createInstance();

export default function i18n(
  locale: string,
  namespace?: string,
  resource?: Record<string, string>,
) {
  const namespaces = [defaultNamespace];

  void newInstance.use(initReactI18next).init({
    debug: false,
    defaultNS: defaultNamespace,
    fallbackLng: defaultLanguage,

    interpolation: {
      // React already does escaping
      escapeValue: false,
      skipOnVariables: false,
    },
    // keySeparator: false,

    lng: locale,
    ns: namespaces,

    react: { useSuspense: true },
    resources,
  } as InitOptions);

  if (
    namespace &&
    newInstance.options.ns?.indexOf(namespace as string) === -1
  ) {
    try {
      //translation filePath is relative to this file
      newInstance.addResourceBundle(
        locale,
        namespace as string,
        resource || {},
      );
    } catch {
      // biome-ignore lint/suspicious/noConsole: Console
      console.log(
        `Error loading translation: ./locales/${locale}/${namespace}.json`,
      );
    }
  }

  return newInstance as I18N;
}
