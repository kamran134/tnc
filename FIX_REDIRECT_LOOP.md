# 🐛 FIX: Бесконечный цикл редиректов на /dashboard/login

## Проблема
После авторизации происходили сотни запросов к `/dashboard/login` с кодом `307` (Temporary Redirect).

## Причина
**Бесконечный цикл редиректов:**

1. **Dashboard Layout** пытался получить `user` с Java бэкенда
2. Если бэкенд недоступен → `getCurrentUser()` возвращал `null`
3. Layout делал `redirect('/dashboard/login')`
4. **Middleware** видел токен в cookies → редиректил обратно на `/dashboard`
5. Layout снова проверял → опять `null` → **ЦИКЛ!**

```typescript
// ❌ БЫЛО (dashboard/layout.tsx)
const user = await getCurrentUser();
if (!user) {
  redirect('/dashboard/login'); // 👈 БЕСКОНЕЧНЫЙ ЦИКЛ!
}
```

```typescript
// ❌ Middleware редиректил обратно
if (isLoginPage && accessToken) {
  return NextResponse.redirect('/dashboard'); // 👈 И ОБРАТНО!
}
```

## Решение

### ✅ Изменено в `dashboard/layout.tsx`
**Убрали `redirect()` из layout**, теперь показываем ошибку вместо редиректа:

```typescript
// ✅ СТАЛО
const user = await getCurrentUser();
if (!user) {
  // Показываем ошибку, а не делаем редирект
  return <AuthenticationError />;
}
```

**Логика:**
- Middleware уже проверил токен
- Layout только получает данные пользователя
- Если данные недоступны (бэкенд не работает) → показываем ошибку
- Никаких редиректов → никаких циклов!

### ✅ Улучшено в `middleware.ts`
Добавлена чёткая логика без дублирующих проверок:

```typescript
const isLoginPage = pathname === '/dashboard/login';
const isDashboardPage = pathname.startsWith('/dashboard') && !isLoginPage;

// Защита dashboard страниц
if (isDashboardPage && !accessToken) {
  return NextResponse.redirect('/dashboard/login');
}

// Редирект с login если уже залогинен
if (isLoginPage && accessToken) {
  return NextResponse.redirect('/dashboard');
}
```

## Результат

**До:**
```
GET /dashboard/login 307 in 72ms
GET /dashboard/login 307 in 81ms
GET /dashboard/login 307 in 78ms
... (бесконечно)
```

**После:**
```
GET /dashboard/login 200 in 3444ms
✅ Всего ОДИН запрос!
```

## Важно
Теперь для работы dashboard **требуется запущенный Java бэкенд** на `http://localhost:8080`, иначе пользователь увидит страницу ошибки с объяснением.

Если нужно тестировать без бэкенда, можно временно изменить `getCurrentUser()` чтобы возвращать mock данные.
