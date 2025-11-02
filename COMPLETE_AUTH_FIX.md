# Полное исправление аутентификации

## Что было не так (критические ошибки)

### 1. ❌ Неправильные URL к бекенду
**Было:** `/auth/login`, `/auth/me`, `/auth/logout`  
**Должно быть:** `/api/auth/login`, `/api/auth/me`, `/api/auth/logout`  
**Swagger показывает:** Все auth endpoints начинаются с `/api/auth/`

### 2. ❌ Неправильный URL в .env.local
**Было:** `https://tnc.az/api`  
**Должно быть:** `http://localhost:8080`  
**Причина:** Java backend крутится на localhost:8080

### 3. ❌ router.refresh() вызывал бесконечные перезагрузки
**Было:** После login и logout вызывался `router.refresh()`  
**Проблема:** Это заставляло dashboard layout перезагружаться постоянно  
**Решение:** Убрал все `router.refresh()` - Next.js сам обновит Server Components

### 4. ❌ Dashboard layout показывал error page
**Было:** Если user === null, показывалась error страница  
**Проблема:** Это создавало лишний шаг и путало пользователя  
**Решение:** Просто redirect('/dashboard/login') если нет user

## Исправленные файлы

### 1. `/src/app/api/auth/login/route.ts`
```typescript
// ✅ Исправил URL
const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
```

### 2. `/src/app/api/auth/me/route.ts`
```typescript
// ✅ Исправил URL
const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
```

### 3. `/src/app/api/auth/logout/route.ts`
```typescript
// ✅ Исправил URL
await fetch(`${API_BASE_URL}/api/auth/logout`, {
```

### 4. `/src/lib/auth/server.ts`
```typescript
// ✅ Исправил URL
const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
```

### 5. `/src/app/dashboard/login/page.tsx`
```typescript
// ✅ Убрал router.refresh()
await authService.login({ email, password });
router.push('/dashboard');
// УБРАЛ: router.refresh();
```

### 6. `/src/app/dashboard/page.tsx`
```typescript
// ✅ Убрал router.refresh()
await authService.logout()
router.push('/dashboard/login')
// УБРАЛ: router.refresh()
```

### 7. `/src/app/dashboard/layout.tsx`
```typescript
// ✅ Убрал error page, просто redirect
if (!user) {
  redirect('/dashboard/login');
}
```

### 8. `/src/middleware.ts`
```typescript
// ✅ Добавил очистку cookies при редиректе
if (isDashboardPage && !accessToken) {
  const response = NextResponse.redirect(new URL('/dashboard/login', request.url));
  response.cookies.delete('access_token');
  response.cookies.delete('refresh_token');
  return response;
}
```

### 9. `/.env.local`
```bash
# ✅ Исправил URL на локальный
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
```

## Архитектура аутентификации (правильная)

### Флоу авторизации:

1. **Пользователь вводит логин/пароль** → `/dashboard/login` (client component)
2. **POST /api/auth/login** → проксирует на Java backend `POST /api/auth/login`
3. **Java backend возвращает** `{ accessToken, refreshToken, user }`
4. **Next.js API route сохраняет токены** в HTTP-only cookies
5. **Возвращает клиенту** только `{ user }` (токены в cookies)
6. **router.push('/dashboard')** → переход на dashboard
7. **Middleware проверяет** наличие `access_token` cookie
8. **Если есть токен** → пропускает на `/dashboard`
9. **Dashboard layout (Server Component)** получает user с бекенда через `getCurrentUser()`
10. **Если user есть** → рендерит dashboard с данными пользователя

### Флоу выхода:

1. **Пользователь нажимает Logout** → `authService.logout()`
2. **POST /api/auth/logout** → проксирует на Java backend `POST /api/auth/logout`
3. **Удаляет cookies** на Next.js стороне
4. **router.push('/dashboard/login')** → редирект на login
5. **Middleware видит отсутствие токена** → разрешает доступ к login page

### Защита routes:

- **Middleware** (`/src/middleware.ts`) проверяет только наличие cookie `access_token`
- **Dashboard layout** проверяет валидность токена через `/api/auth/me`
- **Если токен невалиден** → redirect на login (middleware удалит cookies)

## Что должно работать

✅ Логин с правильными credentials → заход в dashboard  
✅ Логин с неправильными credentials → ошибка на login page  
✅ Попытка зайти в /dashboard без токена → редирект на login  
✅ Попытка зайти на /dashboard/login с токеном → редирект в dashboard  
✅ Logout → очистка cookies и редирект на login  
✅ Refresh страницы в dashboard → user подгружается заново  
✅ Backend недоступен → redirect на login  

## Запуск для проверки

```bash
# Убедись что Java backend запущен на localhost:8080
# Проверь что там есть эндпоинты /api/auth/login, /api/auth/me

# Запусти Next.js
npm run dev

# Открой http://localhost:3000/dashboard
# Должен редиректнуть на /dashboard/login
# Введи credentials
# Должен зайти в dashboard
```

## Тестовые сценарии

1. **Успешный логин:**
   - Открой `/dashboard/login`
   - Введи правильный email/password
   - Должен перенаправить в `/dashboard`
   - Должны показаться данные пользователя

2. **Неуспешный логин:**
   - Открой `/dashboard/login`
   - Введи неправильный email/password
   - Должна появиться ошибка "Invalid credentials"
   - Остаёшься на `/dashboard/login`

3. **Защита dashboard:**
   - Открой `/dashboard` БЕЗ авторизации
   - Должен редиректнуть на `/dashboard/login`

4. **Logout:**
   - Зайди в dashboard
   - Нажми Logout
   - Должен выйти на `/dashboard/login`
   - Попытка вернуться на `/dashboard` → снова редирект на login

5. **Refresh в dashboard:**
   - Зайди в dashboard
   - Нажми F5
   - Должен остаться в dashboard (НЕ выкинуть на login)
   - Данные пользователя должны подгрузиться

## Важные замечания

- ❗ **НЕ** используй `router.refresh()` после `router.push()` - это вызывает бесконечные перезагрузки
- ❗ Все auth endpoints должны начинаться с `/api/auth/` (не просто `/auth/`)
- ❗ Backend URL должен быть `http://localhost:8080` (не `https://tnc.az/api`)
- ❗ Токены хранятся ТОЛЬКО в HTTP-only cookies (не в localStorage)
- ❗ Middleware проверяет только наличие токена, layout проверяет валидность

## Если всё равно не работает

1. **Проверь что Java backend запущен:**
   ```bash
   curl http://localhost:8080/api/auth/login
   # Должен вернуть что-то (не connection refused)
   ```

2. **Проверь что .env.local правильный:**
   ```bash
   cat .env.local
   # Должен быть NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
   ```

3. **Перезапусти dev server:**
   ```bash
   # Ctrl+C чтобы остановить
   npm run dev
   ```

4. **Очисти cookies в браузере:**
   - F12 → Application → Cookies → localhost:3000
   - Удали `access_token` и `refresh_token`
   - Перезагрузи страницу

5. **Проверь Network tab:**
   - F12 → Network
   - Попробуй логин
   - Смотри что приходит в ответах (особенно POST /api/auth/login)
