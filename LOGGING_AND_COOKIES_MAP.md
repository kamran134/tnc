# 🗺️ Карта расположения настроек логирования и cookies

## 📍 1. ЛОГИРОВАНИЕ

### Основная настройка (ИЗМЕНЕНО ✅):
```
next.config.js
  └─ line 30-33: compiler.removeConsole
     ├─ БЫЛО: process.env.NODE_ENV === 'production' (логи отключены на проде)
     └─ СТАЛО: false (логи ВКЛЮЧЕНЫ везде, включая прод) ⚠️
```

### Где используются console.log (основные места):
```
src/
├─ middleware.ts (строки 7-43)
│  └─ Логирует все запросы к /dashboard и проверку cookies
│
├─ app/api/auth/
│  ├─ login/route.ts (строки 6-102)
│  │  └─ Детальные логи входа, установки cookies
│  │
│  ├─ refresh/route.ts (строки 7-102)
│  │  └─ Логи обновления токенов
│  │
│  └─ logout/route.ts (строки 7-60)
│     └─ Логи выхода из системы
```

---

## 🍪 2. НАСТРОЙКИ COOKIES

### A. Login Route (первичная установка):
```
src/app/api/auth/login/route.ts
  └─ lines 53-90: Установка cookies после успешного логина
     ├─ line 54: const isSecure = process.env.NODE_ENV === 'production'
     │           └─ На проде: true ✅ (только HTTPS)
     │           └─ В dev: false (для localhost без SSL)
     │
     ├─ line 58: const useHttpOnly = process.env.NODE_ENV === 'production'
     │           └─ На проде: true ✅ (JS не может читать)
     │           └─ В dev: false (для отладки в DevTools)
     │
     ├─ lines 68-74: access_token cookie
     │  └─ { httpOnly: useHttpOnly, secure: isSecure, sameSite: 'lax', ... }
     │
     └─ lines 77-83: refresh_token cookie
        └─ { httpOnly: useHttpOnly, secure: isSecure, sameSite: 'lax', ... }
```

### B. Refresh Route (обновление токенов):
```
src/app/api/auth/refresh/route.ts
  └─ lines 77-91: Обновление cookies при refresh
     ├─ lines 77-83: access_token cookie
     │  └─ { httpOnly: true, secure: NODE_ENV === 'production', sameSite: 'lax' }
     │     └─ Здесь httpOnly ВСЕГДА true (даже в dev)
     │
     └─ lines 85-91: refresh_token cookie
        └─ { httpOnly: true, secure: NODE_ENV === 'production', sameSite: 'lax' }
           └─ Здесь httpOnly ВСЕГДА true (даже в dev)
```

### C. Logout Route (удаление):
```
src/app/api/auth/logout/route.ts
  └─ lines 53-54: Удаление cookies
     ├─ cookieStore.delete('access_token')
     └─ cookieStore.delete('refresh_token')
```

### D. Middleware (чтение):
```
src/middleware.ts
  └─ lines 18-27: Чтение cookies для проверки авторизации
     ├─ const accessToken = request.cookies.get('access_token')
     └─ Проверка наличия токена для защищенных роутов /dashboard/*
```

---

## 📊 Визуальная схема потока cookies:

```
┌─────────────────────────────────────────────────────────────────┐
│                      PRODUCTION (HTTPS)                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  1. POST /api/auth/login                                        │
│     └─> Set-Cookie: access_token                               │
│         ├─ secure: ✅ true (только HTTPS)                      │
│         ├─ httpOnly: ✅ true (защита от XSS)                   │
│         ├─ sameSite: lax (защита от CSRF)                      │
│         └─ maxAge: 24h                                          │
│                                                                 │
│  2. Middleware /dashboard/*                                     │
│     └─> Читает cookie 'access_token'                           │
│         ├─ Если есть → пропускает                              │
│         └─ Если нет → redirect /dashboard/login                │
│                                                                 │
│  3. POST /api/auth/refresh                                      │
│     └─> Обновляет cookies новыми токенами                      │
│         └─ { secure: ✅ true, httpOnly: ✅ true }              │
│                                                                 │
│  4. POST /api/auth/logout                                       │
│     └─> Удаляет оба cookies                                    │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                    DEVELOPMENT (HTTP)                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  1. POST /api/auth/login                                        │
│     └─> Set-Cookie: access_token                               │
│         ├─ secure: ❌ false (работает без HTTPS)               │
│         ├─ httpOnly: ❌ false (видно в DevTools для отладки)   │
│         ├─ sameSite: lax                                        │
│         └─ maxAge: 24h                                          │
│                                                                 │
│  2-4. Остальное аналогично production                           │
│       но refresh всегда использует httpOnly: true               │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🎯 Быстрые команды для проверки:

### На проде проверить логи:
```bash
# Docker logs
docker compose -f docker-compose.prod.yml logs -f web

# Или если используете pm2/systemd
journalctl -u tnc-web -f
```

### Проверить cookies в браузере:
```
Chrome DevTools → Application → Cookies → https://tnc.az
Должны быть:
├─ access_token  (Secure ✅, HttpOnly ✅, SameSite: Lax)
└─ refresh_token (Secure ✅, HttpOnly ✅, SameSite: Lax)
```

---

## ⚠️ ВАЖНО ПОМНИТЬ:

После завершения отладки **ОБЯЗАТЕЛЬНО вернуть**:
```javascript
// next.config.js line 32
compiler: {
  removeConsole: process.env.NODE_ENV === 'production',
}
```

Иначе в production bundle будут включены все console.log, что:
- 📦 Увеличит размер bundle
- 🐌 Замедлит работу
- 🔓 Может раскрыть чувствительную информацию в браузере клиента
