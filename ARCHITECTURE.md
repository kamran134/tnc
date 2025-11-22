# Архитектура аутентификации

## 📋 Обзор

Проект использует **cookie-based authentication** с HTTP-only cookies для безопасного хранения токенов.

## 🏗️ Архитектура (2 окружения)

### 🖥️ Локальная разработка (npm run dev)

```
Браузер → http://localhost:3000/api/* 
  → Next.js API Routes (src/app/api/*)
    → Берет токен из HTTP-only cookies
      → Проксирует на Java Backend (localhost:8080 или BACKEND_URL)
        → Добавляет Authorization: Bearer <token>
          → Backend обрабатывает запрос
```

**Особенности:**
- ❌ Nginx НЕ используется
- ✅ Все API запросы обрабатывает Next.js
- ✅ Cookies: `secure: false`, `httpOnly: false` (для debug в DevTools)
- ✅ Токены хранятся ТОЛЬКО в cookies (не в localStorage)

### 🌐 Production (сервер с nginx)

```
Браузер → https://tnc.az/api/*
  → Nginx (порт 443)
    → Проксирует на Next.js app:3000
      → Next.js API Routes (src/app/api/*)
        → Берет токен из HTTP-only cookies
          → Проксирует на Java Backend (backend:8080)
            → Добавляет Authorization: Bearer <token>
              → Backend обрабатывает запрос
```

**Особенности:**
- ✅ Nginx как reverse proxy
- ✅ Все `/api/*` идут через Next.js (НЕ напрямую на backend!)
- ✅ Cookies: `secure: true`, `httpOnly: true` (максимальная безопасность)
- ✅ SSL/TLS шифрование

## 🔐 Flow аутентификации

### 1. Login
```typescript
POST /api/auth/login
├─ Next.js API route (src/app/api/auth/login/route.ts)
│  ├─ Проксирует на backend: POST /api/auth/login
│  ├─ Получает токены от бекенда
│  ├─ Устанавливает HTTP-only cookies:
│  │  ├─ access_token (expires in 24h)
│  │  └─ refresh_token (expires in 7d)
│  └─ Возвращает данные клиенту
└─ Клиент перенаправляется на /dashboard
```

### 2. Admin API запросы
```typescript
GET/POST/PUT/PATCH /api/admin/*
├─ Next.js API route (src/app/api/admin/*/route.ts)
│  ├─ Читает access_token из cookies
│  ├─ Проверяет наличие токена
│  ├─ Проксирует на backend с заголовком:
│  │  └─ Authorization: Bearer <access_token>
│  └─ Возвращает ответ клиенту
└─ Клиент получает данные
```

### 3. Logout
```typescript
POST /api/auth/logout
├─ Next.js API route (src/app/api/auth/logout/route.ts)
│  ├─ Удаляет cookies (maxAge: 0)
│  └─ Возвращает 200 OK
└─ Клиент перенаправляется на /dashboard/login
```

## 📁 Структура Next.js API Routes

```
src/app/api/
├── auth/
│   ├── login/route.ts       # Аутентификация + установка cookies
│   ├── logout/route.ts      # Удаление cookies
│   └── refresh/route.ts     # Обновление токенов
└── admin/
    ├── services/
    │   ├── route.ts         # GET list, POST create
    │   └── [id]/route.ts    # GET detail, PUT update
    ├── careers/
    │   ├── route.ts         # GET list, POST create
    │   └── [id]/route.ts    # PATCH toggle active
    ├── contacts/
    │   ├── route.ts         # GET list
    │   └── [id]/route.ts    # PATCH update status
    ├── news/
    │   ├── route.ts         # GET list, POST create
    │   └── [id]/route.ts    # GET detail, PUT update
    ├── dashboard/route.ts   # Dashboard stats
    └── files/
        └── upload/route.ts  # File upload
```

## 🔧 Nginx конфигурация (production)

```nginx
# ВСЕ API запросы идут через Next.js
location /api/ {
    proxy_pass http://frontend;  # app:3000
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    # ... остальные заголовки
}
```

**ВАЖНО:** 
- ❌ НЕ проксируем `/api/*` напрямую на backend
- ✅ ВСЁ идет через Next.js для cookie management

## 🚀 Переменные окружения

### Development (.env.local)
```env
BACKEND_URL=http://localhost:8080
NODE_ENV=development
```

### Production (docker-compose.prod.yml)
```yaml
environment:
  BACKEND_URL: http://backend:8080
  NODE_ENV: production
```

## ✅ Почему именно так?

### Безопасность
- ✅ HTTP-only cookies защищают от XSS атак
- ✅ Токены никогда не попадают в JavaScript на клиенте
- ✅ HTTPS в продакшене шифрует все данные

### Простота
- ✅ Клиентский код использует обычный `fetch()` без заголовков
- ✅ Авторизация управляется автоматически через cookies
- ✅ Нет необходимости в interceptors на клиенте

### Единообразие
- ✅ Все API запросы идут через единую точку (Next.js)
- ✅ Один паттерн для всех endpoints
- ✅ Легко добавлять новые API routes

## ❌ Что НЕ нужно делать

### ❌ НЕ использовать localStorage для токенов
```typescript
// ❌ НЕПРАВИЛЬНО
localStorage.setItem('access_token', token);
const token = localStorage.getItem('access_token');
fetch('/api/admin/services', {
  headers: { 'Authorization': `Bearer ${token}` }
});
```

### ❌ НЕ добавлять Authorization вручную на клиенте
```typescript
// ❌ НЕПРАВИЛЬНО
const response = await fetch('/api/admin/services', {
  headers: {
    'Authorization': `Bearer ${someToken}`
  }
});
```

### ✅ Правильный способ
```typescript
// ✅ ПРАВИЛЬНО - просто fetch, без заголовков
const response = await fetch('/api/admin/services');
```

## 🐛 Отладка

### Проверка cookies в браузере
1. DevTools → Application → Cookies → localhost:3000
2. Должны быть cookies: `access_token`, `refresh_token`
3. В production они будут `HttpOnly` (невидимы в JS)

### Проверка запросов
1. DevTools → Network → выбрать запрос `/api/admin/*`
2. Request Headers → должен быть `Cookie: access_token=...`
3. В Next.js API route токен извлекается автоматически

### Логи
- В development все логи видны в консоли `npm run dev`
- Логи login/logout подробные с префиксами 🔐, 🍪, ✅, ❌

## 📝 Changelog

### 2024-11-18
- ✅ Откачен `authorizedFetch` utility
- ✅ Возврат к cookie-based auth без localStorage
- ✅ Исправлен nginx для проксирования всех `/api/*` через Next.js
- ✅ Удалены все ручные Bearer токены из клиентского кода
