import type { LanguageCode } from '@/types/api';

export const LANGUAGES: LanguageCode[] = ['az', 'en', 'ru'] as const;
export const DEFAULT_LANGUAGE: LanguageCode = 'az';
export const LANGUAGE_ORDER: Record<LanguageCode, number> = { az: 0, en: 1, ru: 2 };

/**
 * Извлекает перевод по languageCode из массива. Фоллбэк — первый элемент.
 */
export function getTranslation<T extends { languageCode: string }>(
  translations: T[] | undefined | null,
  lang: LanguageCode = DEFAULT_LANGUAGE
): T | undefined {
  return translations?.find(t => t.languageCode === lang) ?? translations?.[0];
}

/**
 * Проверяет, является ли язык основным (az).
 */
export function isDefaultLanguage(lang: string): boolean {
  return lang === DEFAULT_LANGUAGE;
}
