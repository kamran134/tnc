'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { usePathname, useRouter } from 'next/navigation';

type Locale = 'az' | 'en' | 'ru';

interface LanguageContextType {
  locale: Locale;
  setLocale: (locale: Locale) => Promise<void>;
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

  const setLocale = async (newLocale: Locale) => {
    // Проверяем, находимся ли мы на странице детали новости
    const newsIdMatch = pathname.match(/\/(az|en|ru)\/news\/(.+)/);
    
    if (newsIdMatch) {
      // Пытаемся получить ID новости из sessionStorage
      const newsId = sessionStorage.getItem('currentNewsId');
      
      if (newsId) {
        try {
          // Загружаем новость на новом языке по ID
          const response = await fetch(`/api/news/id/${newsId}?lang=${newLocale}`);
          if (response.ok) {
            const newsData = await response.json();
            // Получили новость с новым slug
            const newPath = `/${newLocale}/news/${newsData.slug}`;
            setLocaleState(newLocale);
            router.push(newPath);
            return;
          }
        } catch (error) {
          console.error('Error loading news for language change:', error);
        }
      }
    }

    // Проверяем, находимся ли мы на странице детали вакансии
    const careerIdMatch = pathname.match(/\/(az|en|ru)\/careers\/(.+)/);
    
    if (careerIdMatch) {
      // Пытаемся получить ID вакансии из sessionStorage
      const careerId = sessionStorage.getItem('currentCareerId');
      
      if (careerId) {
        try {
          // Загружаем вакансию на новом языке по ID
          const response = await fetch(`/api/careers/id/${careerId}?lang=${newLocale}`);
          if (response.ok) {
            const careerData = await response.json();
            // Получили вакансию с новым slug
            const newPath = `/${newLocale}/careers/${careerData.slug}`;
            setLocaleState(newLocale);
            router.push(newPath);
            return;
          }
        } catch (error) {
          console.error('Error loading career for language change:', error);
        }
      }
    }

    // Стандартная логика смены языка для остальных страниц
    let newPath = pathname;
    
    // Убираем /az, /en или /ru с начала
    if (pathname.startsWith('/az/')) {
      newPath = pathname.substring(3);
    } else if (pathname.startsWith('/en/')) {
      newPath = pathname.substring(3);
    } else if (pathname.startsWith('/ru/')) {
      newPath = pathname.substring(3);
    } else if (pathname === '/az' || pathname === '/en' || pathname === '/ru') {
      newPath = '/';
    }

    // Всегда добавляем язык в URL
    const finalPath = `/${newLocale}${newPath}`;
    
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
