import { useLanguage } from '@/contexts/LanguageContext';
import azTranslations from '@/locales/az.json';
import enTranslations from '@/locales/en.json';
import ruTranslations from '@/locales/ru.json';

type TranslationKeys = typeof enTranslations;
type NestedKeyOf<T> = T extends object
  ? {
      [K in keyof T]: K extends string
        ? T[K] extends object
          ? `${K}.${NestedKeyOf<T[K]>}`
          : K
        : never;
    }[keyof T]
  : never;

type TranslationKey = NestedKeyOf<TranslationKeys>;

const translations = {
  az: azTranslations,
  en: enTranslations,
  ru: ruTranslations,
};

export function useTranslations() {
  const { locale } = useLanguage();

  const t = (key: TranslationKey): string => {
    const keys = key.split('.');
    let value: any = translations[locale as keyof typeof translations] || translations.en;

    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        console.warn(`Translation key not found: ${key} for locale: ${locale}`);
        return key;
      }
    }

    return typeof value === 'string' ? value : key;
  };

  return { t, locale };
}
