# Многоязычная система (i18n)

## Обзор

Сайт поддерживает три языка:
- **Азербайджанский (az)** - язык по умолчанию
- **Английский (en)**
- **Русский (ru)**

## URL Структура

### Азербайджанский язык (по умолчанию)
- `tnc.az/` - главная страница
- `tnc.az/news` - список новостей
- `tnc.az/news/slug` - детальная страница новости
- `tnc.az/careers/slug` - детальная страница вакансии
- `tnc.az/az/news/slug` - также работает

### Английский и Русский языки
- `tnc.az/en/news/slug` - новость на английском
- `tnc.az/ru/news/slug` - новость на русском
- `tnc.az/en/careers/slug` - вакансия на английском
- `tnc.az/ru/careers/slug` - вакансия на русском

## Компоненты

### LanguageContext
**Путь:** `src/contexts/LanguageContext.tsx`

React Context для управления языками:
```typescript
type Locale = 'az' | 'en' | 'ru';

interface LanguageContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
}
```

**Использование:**
```typescript
'use client'

import { useLanguage } from '@/contexts/LanguageContext';

export default function MyComponent() {
  const { locale, setLocale, t } = useLanguage();
  
  return (
    <div>
      <p>Current language: {locale}</p>
      <p>{t('welcome')}</p>
      <button onClick={() => setLocale('en')}>English</button>
    </div>
  );
}
```

### LanguageSwitcher
**Путь:** `src/components/layout/LanguageSwitcher.tsx`

Dropdown компонент для переключения языков:
- Показывает текущий язык с флагом
- Dropdown с выбором всех доступных языков
- Автоматически переключает URL при смене языка
- Включен в Header (desktop и mobile)

## Middleware

**Путь:** `src/middleware.ts`

Обрабатывает:
1. Определение текущего языка из URL
2. Установка `x-locale` header для всех запросов
3. Редиректы для корректных URL

**Константы:**
```typescript
const locales = ['az', 'en', 'ru'];
const defaultLocale = 'az';
```

## Детальные страницы

### News
**Путь:** `src/app/news/[lang]/[slug]/page.tsx`

Параметры:
- `lang` - код языка (az, en, ru)
- `slug` - URL-friendly идентификатор новости

API запрос:
```typescript
fetch(`${API_URL}/api/news/${slug}?lang=${lang}`)
```

### Careers
**Путь:** `src/app/careers/[lang]/[slug]/page.tsx`

Параметры:
- `lang` - код языка (az, en, ru)
- `slug` - URL-friendly идентификатор вакансии

API запрос:
```typescript
fetch(`${API_URL}/api/careers/${slug}?lang=${lang}`)
```

## Backend Integration

### API Endpoints

Все API должны поддерживать параметр `lang`:

```typescript
// Получение списка новостей
GET /api/news?lang=az

// Получение новости по slug
GET /api/news/{slug}?lang=en

// Получение списка вакансий
GET /api/careers?lang=ru

// Получение вакансии по slug
GET /api/careers/{slug}?lang=az
```

### Пример ответа
```json
{
  "id": 1,
  "slug": "new-office-opening",
  "title": "Yeni ofis açılışı",
  "content": "...",
  "imageUrl": "/uploads/news_image/office.jpg",
  "date": "2024-01-15",
  "lang": "az"
}
```

## Translations

**Базовые переводы** в `LanguageContext`:
```typescript
const translations = {
  az: {
    welcome: 'Xoş gəlmisiniz',
    services: 'Xidmətlər',
    news: 'Xəbərlər',
    careers: 'Karyera',
    contact: 'Əlaqə'
  },
  en: {
    welcome: 'Welcome',
    services: 'Services',
    news: 'News',
    careers: 'Careers',
    contact: 'Contact'
  },
  ru: {
    welcome: 'Добро пожаловать',
    services: 'Услуги',
    news: 'Новости',
    careers: 'Карьера',
    contact: 'Контакты'
  }
};
```

## Дальнейшая разработка

### TODO:
1. Обновить все страницы для поддержки параметра `[lang]`
2. Создать страницы `[lang]/services/page.tsx`, `[lang]/contact/page.tsx`
3. Обновить все API вызовы для передачи текущего языка
4. Расширить словарь переводов
5. Добавить SEO meta tags с hreflang
6. Добавить переводы для всех статических текстов

### Рекомендации по структуре:
```
src/app/
  layout.tsx (с LanguageProvider)
  page.tsx (главная на az)
  [lang]/
    page.tsx (главная для en/ru)
    news/
      page.tsx (список новостей)
      [slug]/
        page.tsx (детальная страница)
    careers/
      page.tsx (список вакансий)
      [slug]/
        page.tsx (детальная страница)
    services/
      page.tsx
    contact/
      page.tsx
```

## Примеры использования

### Получение текущего языка в компоненте
```typescript
'use client'

import { useLanguage } from '@/contexts/LanguageContext';

export default function NewsList() {
  const { locale } = useLanguage();
  
  const fetchNews = async () => {
    const response = await fetch(`/api/news?lang=${locale}`);
    return response.json();
  };
  
  // ...
}
```

### Создание ссылок с языком
```typescript
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';

export default function NewsCard({ slug }: { slug: string }) {
  const { locale } = useLanguage();
  
  const href = locale === 'az' 
    ? `/news/${slug}`
    : `/${locale}/news/${slug}`;
  
  return <Link href={href}>Read more</Link>;
}
```

## Тестирование

### Проверка URL:
- ✅ `/news/slug` → азербайджанская версия
- ✅ `/az/news/slug` → азербайджанская версия
- ✅ `/en/news/slug` → английская версия
- ✅ `/ru/news/slug` → русская версия

### Проверка переключателя:
- ✅ Клик на флаг открывает dropdown
- ✅ Выбор языка переключает контент
- ✅ URL обновляется корректно
- ✅ Работает на desktop и mobile
