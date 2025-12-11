'use client';

import { createContext, useContext, useState, useEffect, useMemo, useCallback, ReactNode } from 'react';
import { usePathname, useRouter } from 'next/navigation';

type Locale = 'az' | 'en' | 'ru';

interface LanguageContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Простой словарь переводов (можно расширить)
const translations: Record<Locale, Record<string, string>> = {
  az: {
    home: 'Ana səhifə',
    services: 'Xidmətlər',
    news: 'Xəbərlər',
    careers: 'Karyera',
    contact: 'Əlaqə',
    about: 'Haqqımızda',
  },
  en: {
    home: 'Home',
    services: 'Services',
    news: 'News',
    careers: 'Careers',
    contact: 'Contact',
    about: 'About Us',
  },
  ru: {
    home: 'Главная',
    services: 'Услуги',
    news: 'Новости',
    careers: 'Карьера',
    contact: 'Контакты',
    about: 'О нас',
  },
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  
  // Определяем текущий язык из URL
  const getLocaleFromPath = (path: string): Locale => {
    if (path.startsWith('/en')) return 'en';
    if (path.startsWith('/ru')) return 'ru';
    return 'az'; // default
  };

  const [locale, setLocaleState] = useState<Locale>(getLocaleFromPath(pathname));

  useEffect(() => {
    const newLocale = getLocaleFromPath(pathname);
    if (newLocale !== locale) {
      setLocaleState(newLocale);
    }
  }, [pathname, locale]);

  // Мемоизированная функция смены языка
  const setLocale = useCallback((newLocale: Locale) => {
    // Получаем путь без языка
    // /az/news/article -> /news/article
    // /en -> /
    const pathWithoutLocale = pathname.replace(/^\/(az|en|ru)(\/|$)/, '$2');
    
    // Добавляем новый язык
    // /news/article -> /en/news/article
    // / -> /en
    const finalPath = pathWithoutLocale 
      ? `/${newLocale}${pathWithoutLocale}` 
      : `/${newLocale}`;
    
    setLocaleState(newLocale);
    router.push(finalPath);
  }, [pathname, router]);

  // Мемоизированная функция перевода
  const t = useCallback((key: string): string => {
    return translations[locale][key] || key;
  }, [locale]);

  const contextValue = useMemo(
    () => ({ locale, setLocale, t }),
    [locale, setLocale, t]
  );

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
