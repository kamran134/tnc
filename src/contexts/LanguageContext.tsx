'use client';

import { createContext, useContext, useState, useEffect, useMemo, useCallback, useRef, ReactNode } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import type { LanguageCode } from '@/types/api';

// Slug resolver: registered by detail pages so language switching navigates to the correct slug
type SlugResolverFn = (newLocale: LanguageCode) => Promise<string | null>;

interface LanguageContextType {
  locale: LanguageCode;
  setLocale: (locale: LanguageCode) => void;
  setSlugResolver: (resolver: SlugResolverFn | null) => void;
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

  // Ref holding the slug resolver registered by the current detail page
  const slugResolverRef = useRef<SlugResolverFn | null>(null);

  const setSlugResolver = useCallback((resolver: SlugResolverFn | null) => {
    slugResolverRef.current = resolver;
  }, []);

  useEffect(() => {
    const newLocale = getLocaleFromPath(pathname);
    if (newLocale !== locale) {
      setLocaleState(newLocale);
    }
  }, [pathname, locale]);

  // Мемоизированная функция смены языка
  const setLocale = useCallback(async (newLocale: LanguageCode) => {
    // If a detail page has registered a slug resolver, use it to translate the slug
    if (slugResolverRef.current) {
      try {
        const newPath = await slugResolverRef.current(newLocale);
        if (newPath) {
          setLocaleState(newLocale);
          router.push(newPath);
          return;
        }
      } catch {
        // fall through to default behaviour
      }
    }

    // Default: replace the language prefix, keep the rest of the path
    const pathWithoutLocale = pathname.replace(/^\/(az|en|ru)(\/|$)/, '$2');
    const finalPath = pathWithoutLocale 
      ? `/${newLocale}${pathWithoutLocale}` 
      : `/${newLocale}`;
    
    setLocaleState(newLocale);
    router.push(finalPath);
  }, [pathname, router]);

  const contextValue = useMemo(
    () => ({ locale, setLocale, setSlugResolver }),
    [locale, setLocale, setSlugResolver]
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
