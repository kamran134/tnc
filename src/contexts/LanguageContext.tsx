'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
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

  const setLocale = (newLocale: Locale) => {
    // Убираем текущий язык из пути
    let newPath = pathname;
    
    // Убираем /az, /en или /ru с начала
    if (pathname.startsWith('/az/') || pathname.startsWith('/en/') || pathname.startsWith('/ru/')) {
      newPath = pathname.substring(3); // убираем /xx
    } else if (pathname === '/az' || pathname === '/en' || pathname === '/ru') {
      newPath = '/';
    }

    // Добавляем новый язык (кроме az - он по умолчанию)
    const finalPath = newLocale === 'az' ? newPath : `/${newLocale}${newPath}`;
    
    setLocaleState(newLocale);
    router.push(finalPath);
  };

  const t = (key: string): string => {
    return translations[locale][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t }}>
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
