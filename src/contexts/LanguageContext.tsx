'use client';

import { createContext, useContext, useState, useEffect, useMemo, useCallback, ReactNode } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import type { LanguageCode } from '@/types/api';

interface LanguageContextType {
  locale: LanguageCode;
  setLocale: (locale: LanguageCode) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  
  // Определяем текущий язык из URL
  const getLocaleFromPath = (path: string): LanguageCode => {
    if (path.startsWith('/en')) return 'en';
    if (path.startsWith('/ru')) return 'ru';
    return 'az'; // default
  };

  const [locale, setLocaleState] = useState<LanguageCode>(getLocaleFromPath(pathname));

  useEffect(() => {
    const newLocale = getLocaleFromPath(pathname);
    if (newLocale !== locale) {
      setLocaleState(newLocale);
    }
  }, [pathname, locale]);

  // Мемоизированная функция смены языка
  const setLocale = useCallback((newLocale: LanguageCode) => {
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

  const contextValue = useMemo(
    () => ({ locale, setLocale }),
    [locale, setLocale]
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
