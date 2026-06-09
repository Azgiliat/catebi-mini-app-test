import { createI18n } from "vue-i18n";

import en from "./locales/en.json";
import ka from "./locales/ka.json";
import ru from "./locales/ru.json";

export const SUPPORTED_LOCALES = ["en", "ru", "ka"] as const;
export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number];

const DEFAULT_LOCALE: SupportedLocale = "en";

const messages = {
  en,
  ru,
  ka,
};

const isSupportedLocale = (locale: string): locale is SupportedLocale => {
  return SUPPORTED_LOCALES.includes(locale as SupportedLocale);
};

const normalizeLocale = (languageCode?: string): SupportedLocale => {
  const locale = languageCode?.split("-")[0].toLowerCase();

  if (locale && isSupportedLocale(locale)) {
    return locale;
  }

  return DEFAULT_LOCALE;
};

export const createAppI18n = () =>
  createI18n({
    legacy: false,
    locale: normalizeLocale(
      window.Telegram.WebApp.initDataUnsafe.user.language_code,
    ),
    fallbackLocale: DEFAULT_LOCALE,
    messages,
  });
