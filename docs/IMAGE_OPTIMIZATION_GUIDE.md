# Next.js Image Optimization Guide

## Проблема
Next.js Image компонент не работает должным образом с изображениями, загружаемыми на бэкенд.

## Почему не работает сейчас

1. **Next.js Image требует оптимизации на сервере** - он создает разные версии изображений (webp, разные размеры)
2. **Нужен правильный домен** - изображения должны быть на разрешенном домене в `next.config.js`
3. **Проблемы с CORS** - если бэкенд не отдает правильные заголовки, Next.js не может оптимизировать

## Решение: Настройка CDN и оптимизации

### 1. Настройка на бэкенде

**Вариант А: CDN (Рекомендуется)**
- Использовать Cloudflare R2 (бесплатный, быстрый)
- Или AWS S3 / Azure Blob Storage
- Бэкенд загружает файлы на CDN и возвращает URL

**Вариант Б: Статические файлы на бэкенде**
```java
// В Spring Boot настроить CORS для статических файлов
@Configuration
public class WebConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/files/**")
            .allowedOrigins("https://tnc.az", "https://www.tnc.az")
            .allowedMethods("GET")
            .allowedHeaders("*")
            .maxAge(3600);
    }
}
```

### 2. Настройка next.config.js

```javascript
images: {
  remotePatterns: [
    // Если файлы на основном домене
    {
      protocol: 'https',
      hostname: 'tnc.az',
      pathname: '/api/files/**',
    },
    // Если используете CDN
    {
      protocol: 'https',
      hostname: 'cdn.tnc.az',
      pathname: '/**',
    },
    // Cloudflare R2 пример
    {
      protocol: 'https',
      hostname: '*.r2.cloudflarestorage.com',
      pathname: '/**',
    }
  ],
  // Размеры устройств для оптимизации
  deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
  imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  // Форматы
  formats: ['image/webp'],
  // Качество по умолчанию
  quality: 75,
}
```

### 3. Использование в компонентах

```tsx
import Image from 'next/image';

// Для фиксированных размеров
<Image
  src={member.imageUrl}
  alt={member.fullName}
  width={320}
  height={400}
  className="object-cover"
  quality={85}
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
/>

// Для заполнения контейнера
<div className="relative h-80 w-full">
  <Image
    src={member.imageUrl}
    alt={member.fullName}
    fill
    className="object-cover"
    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
  />
</div>
```

### 4. Настройка на сервере

**Для Vercel/Netlify:**
- Оптимизация работает автоматически

**Для своего сервера (VPS, Docker):**
```bash
# Установить sharp для оптимизации изображений
npm install sharp

# В Dockerfile добавить
RUN npm install sharp
```

## Рекомендуемая архитектура для продакшна

### Этап 1: Cloudflare R2 (CDN)
1. Создать Cloudflare R2 bucket
2. Настроить публичный доступ
3. Получить URL для bucket (например: `https://cdn.tnc.az`)

### Этап 2: Бэкенд
1. Интегрировать Cloudflare R2 SDK или AWS S3 SDK
2. При загрузке файла:
   - Сохранить на R2
   - Вернуть URL: `https://cdn.tnc.az/team/member-123.jpg`
3. Сохранить только URL в базе данных

### Этап 3: Фронтенд
1. Добавить домен CDN в `next.config.js`
2. Использовать Next.js Image компонент
3. Указать правильные `sizes` для каждого использования

## Преимущества использования Next.js Image

✅ Автоматическое создание WebP версий
✅ Ленивая загрузка (lazy loading)
✅ Адаптивные размеры для разных устройств
✅ Автоматическое blur placeholder
✅ Предотвращение CLS (Cumulative Layout Shift)
✅ Кеширование оптимизированных изображений

## Текущее решение (обычный `<img>`)

**Плюсы:**
- Работает везде без дополнительной настройки
- Простая отладка
- Нет зависимости от сервера оптимизации

**Минусы:**
- Нет автоматической оптимизации
- Всегда загружается полный размер
- Нет WebP для старых браузеров
- Медленнее загрузка на мобильных

## Когда переходить на Next.js Image

- Когда настроен CDN
- Когда важна производительность
- Когда много изображений на странице
- Когда нужна поддержка разных устройств

## Пример миграции

**До (текущий код):**
```tsx
<img
  src={member.imageUrl}
  alt={member.fullName}
  className="w-full h-full object-cover"
/>
```

**После:**
```tsx
<Image
  src={member.imageUrl}
  alt={member.fullName}
  fill
  className="object-cover"
  sizes="(max-width: 768px) 100vw, 33vw"
  quality={85}
  priority={index < 4} // для первых 4 карточек
/>
```

## Полезные ссылки

- [Next.js Image Documentation](https://nextjs.org/docs/app/api-reference/components/image)
- [Cloudflare R2 Documentation](https://developers.cloudflare.com/r2/)
- [Image Optimization Best Practices](https://web.dev/fast/#optimize-your-images)

---

**Статус:** Сохранено для будущей реализации
**Дата:** 17 декабря 2025
