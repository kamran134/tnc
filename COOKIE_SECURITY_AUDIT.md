# Cookie Security Audit Report

## 🔍 Анализ безопасности cookies в проекте

### 📋 Найденные места установки cookies:

#### 1. `/api/auth/login/route.ts` (строки 53-90)
```typescript
const isSecure = process.env.NODE_ENV === 'production';
const useHttpOnly = process.env.NODE_ENV === 'production';

nextResponse.cookies.set('access_token', data.accessToken, {
  httpOnly: useHttpOnly,    // ✅ true на проде, false в dev
  secure: isSecure,         // ✅ true на проде, false в dev
  sameSite: 'lax',          // ✅ Защита от CSRF
  maxAge: accessTokenMaxAge,
  path: '/',
});

nextResponse.cookies.set('refresh_token', data.refreshToken, {
  httpOnly: useHttpOnly,    // ✅ true на проде, false в dev
  secure: isSecure,         // ✅ true на проде, false в dev
  sameSite: 'lax',          // ✅ Защита от CSRF
  maxAge: refreshTokenMaxAge,
  path: '/',
});
```

**Статус:** ✅ **ПРАВИЛЬНО**
- `secure: true` на проде (требует HTTPS)
- `httpOnly: true` на проде (защита от XSS)
- `sameSite: 'lax'` (защита от CSRF)

---

#### 2. `/api/auth/refresh/route.ts` (строки 77-91)
```typescript
cookieStore.set('access_token', accessToken, {
  httpOnly: true,                                    // ✅ Всегда true
  secure: process.env.NODE_ENV === 'production',    // ✅ true на проде
  sameSite: 'lax',
  maxAge: 60 * 60 * 24, // 24 hours
  path: '/',
});

cookieStore.set('refresh_token', newRefreshToken, {
  httpOnly: true,                                    // ✅ Всегда true
  secure: process.env.NODE_ENV === 'production',    // ✅ true на проде
  sameSite: 'lax',
  maxAge: 60 * 60 * 24 * 7, // 7 days
  path: '/',
});
```

**Статус:** ✅ **ПРАВИЛЬНО**
- В этом файле `httpOnly: true` **всегда** (даже в dev)
- `secure: true` на проде

---

#### 3. `/api/auth/logout/route.ts` (строки 53-54)
```typescript
cookieStore.delete('access_token');
cookieStore.delete('refresh_token');
```

**Статус:** ✅ **ПРАВИЛЬНО** - только удаление

---

## 📊 Итоговая таблица настроек cookies

| Cookie         | httpOnly (dev) | httpOnly (prod) | secure (dev) | secure (prod) | sameSite | MaxAge          |
|----------------|----------------|-----------------|--------------|---------------|----------|-----------------|
| access_token   | ❌ false*      | ✅ true         | ❌ false     | ✅ true       | lax      | 24h (dynamic)   |
| refresh_token  | ❌ false*      | ✅ true         | ❌ false     | ✅ true       | lax      | 7 days          |

*В `/api/auth/login` - false в dev для отладки  
В `/api/auth/refresh` - всегда true

---

## 🔒 Оценка безопасности

### ✅ Что правильно:
1. **На проде включен `secure: true`** - cookies передаются только по HTTPS
2. **На проде включен `httpOnly: true`** - защита от XSS атак
3. **`sameSite: 'lax'`** - защита от большинства CSRF атак
4. **`path: '/'`** - cookies доступны для всего сайта

### ⚠️ Потенциальные улучшения:
1. **`sameSite: 'lax'` vs `'strict'`**
   - Текущее: `'lax'` - разумный выбор, позволяет работать с внешними ссылками
   - Альтернатива: `'strict'` - более строгая защита, но может сломать некоторые переходы

2. **Development mode**
   - В `/api/auth/login` используется `httpOnly: false` в dev для удобства отладки
   - Это нормально для dev, но важно что на проде `true`

---

## 🎯 Рекомендации

### Текущая конфигурация: ✅ **БЕЗОПАСНА ДЛЯ PRODUCTION**

Никаких изменений в настройках cookies **не требуется**.

Конфигурация правильно использует:
- ✅ HTTPS-only cookies на проде (`secure: true`)
- ✅ HTTP-only cookies на проде (`httpOnly: true`)
- ✅ CSRF защиту (`sameSite: 'lax'`)
- ✅ Правильные сроки жизни токенов

### ❌ Проблем с безопасностью cookies НЕ ОБНАРУЖЕНО

---

## 📝 Для возврата к обычному режиму после отладки:

Когда закончите тестирование на проде, верните настройку логов:

**Файл:** `next.config.js` (строка 32-35)

**Было (для отладки):**
```javascript
compiler: {
  removeConsole: false,
},
```

**Вернуть обратно:**
```javascript
compiler: {
  removeConsole: process.env.NODE_ENV === 'production',
},
```

Это отключит логи в production для оптимизации и безопасности.
