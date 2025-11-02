# Исправление: Двойное /api/ и редирект на логин

## 🔴 Проблемы

### 1. Двойное `/api/` в URL
**Запросы выглядят так:**
```
https://tnc.az/api/api/memberships  ← НЕПРАВИЛЬНО!
https://tnc.az/api/api/core-values  ← НЕПРАВИЛЬНО!
```

**Должно быть:**
```
https://tnc.az/api/memberships  ✓
https://tnc.az/api/core-values  ✓
```

**Причина:**
```typescript
// В GitHub Secrets установлено:
NEXT_PUBLIC_API_BASE_URL = "https://tnc.az/api"  ← С /api на конце!

// В коде:
baseURL: "https://tnc.az/api"  ← из переменной
запрос:  "/api/memberships"    ← начинается с /api/
итого:   "https://tnc.az/api/api/memberships"  ← ДВОЙНОЕ!
```

### 2. Редирект на логин при 401
**Что происходит:**
1. Публичный endpoint возвращает 401 (из-за неправильного URL)
2. Axios interceptor ловит 401
3. Редиректит на `/dashboard/login` **для любого 401**, даже на главной странице!

**Причина:**
```typescript
// В client.ts
if (error.response?.status === 401) {
  window.location.href = '/dashboard/login';  // ← Редирект для ВСЕХ 401!
}
```

---

## ✅ Решения

### Решение 1: Исправить NEXT_PUBLIC_API_BASE_URL

#### На GitHub (в Secrets):

1. Откройте: https://github.com/kamran134/tnc/settings/secrets/actions

2. Найдите секрет `NEXT_PUBLIC_API_BASE_URL`

3. Измените значение:
   ```
   Было: https://tnc.az/api
   Стало: https://tnc.az
   ```
   ☝️ **БЕЗ `/api` на конце!**

4. Нажмите "Update secret"

#### Почему так?

```typescript
// С нашим изменением:
baseURL: "https://tnc.az"       ← БЕЗ /api
запрос:  "/api/memberships"     ← начинается с /api/
итого:   "https://tnc.az/api/memberships"  ← ПРАВИЛЬНО! ✓
```

---

### Решение 2: Не редиректить публичные endpoints

**Исправлено в `src/lib/api/client.ts`:**

```typescript
// Добавлен список публичных endpoints
const publicEndpoints = [
  '/api/home-content',
  '/api/core-values',
  '/api/memberships',
  '/api/company-info',
  '/api/services',
  '/api/news',
  '/api/careers',
  '/api/contact'
];

// Проверяем перед редиректом
if (error.response?.status === 401) {
  // Для публичных endpoints - просто возвращаем ошибку
  if (isPublicEndpoint) {
    return Promise.reject(error);  // ← НЕТ редиректа!
  }
  
  // Для защищённых endpoints - редирект на логин
  window.location.href = '/dashboard/login';
}
```

**Результат:**
- ✅ На главной странице: если API недоступен → показываем ошибку, НЕ редиректим
- ✅ В dashboard: если нет авторизации → редирект на логин
- ✅ Нет неожиданных редиректов

---

## 📝 Применение изменений

### Шаг 1: Изменить GitHub Secret

```
1. https://github.com/kamran134/tnc/settings/secrets/actions
2. NEXT_PUBLIC_API_BASE_URL
3. Изменить на: https://tnc.az (БЕЗ /api)
4. Update secret
```

### Шаг 2: Закоммитить изменения в client.ts

```bash
git add src/lib/api/client.ts
git commit -m "fix: Don't redirect public endpoints on 401"
git push origin main
```

### Шаг 3: GitHub Actions пересоберёт образ

Подождите 5-10 минут, пока:
1. GitHub Actions соберёт новый образ с правильным API URL
2. Образ задеплоится на сервер

### Шаг 4: Проверить

Откройте https://tnc.az в браузере (Ctrl+Shift+R для hard reload):

**Network tab должен показывать:**
```
✅ https://tnc.az/api/memberships?lang=az
✅ https://tnc.az/api/core-values?lang=az
```

**НЕ должно быть:**
```
❌ https://tnc.az/api/api/memberships
❌ Редиректа на /dashboard/login
```

---

## 🔍 Дополнительная диагностика

### Проверить текущий API URL в production:

```javascript
// В DevTools Console на https://tnc.az
console.log(process.env.NEXT_PUBLIC_API_BASE_URL)
```

**Должно вернуть:** `undefined` (в production build переменная встроена в код)

### Проверить запросы:

```javascript
// В DevTools Console
// Открыть Network tab → XHR
// Перезагрузить страницу
// Проверить URL запросов
```

### Если всё ещё `/api/api/`:

Значит образ не пересобрался с новым секретом:

```bash
# На сервере
ssh user@server
cd /opt/tnc-website
docker compose -f docker-compose.prod.yml pull app
docker compose -f docker-compose.prod.yml up -d app
docker compose -f docker-compose.prod.yml logs -f app
```

---

## 🎯 Альтернативное решение (если не хотите ждать GitHub Actions)

### Вариант A: Пересобрать образ локально

```bash
# Локально
docker build \
  --build-arg NEXT_PUBLIC_API_BASE_URL=https://tnc.az \
  -t ghcr.io/kamran134/tnc:latest \
  .

docker push ghcr.io/kamran134/tnc:latest

# На сервере
ssh user@server
cd /opt/tnc-website
docker compose -f docker-compose.prod.yml pull app
docker compose -f docker-compose.prod.yml up -d app
```

### Вариант B: Изменить nginx (временное решение)

Если бэкенд НЕ требует авторизации для публичных endpoints, можно:

```nginx
# В nginx.conf
location /api/ {
  # Убрать /api/ из начала пути
  rewrite ^/api/(.*)$ /$1 break;
  proxy_pass http://backend:8080;
}
```

Но это **НЕ рекомендуется**, лучше исправить frontend.

---

## ❓ FAQ

### Q: Почему бэкенд возвращает 401 для публичных endpoints?

**A:** Потому что запрос идёт на неправильный URL:
```
GET /api/api/memberships  ← Такого endpoint нет!
→ 404 Not Found или 401 Unauthorized
```

### Q: Нужно ли менять что-то на бэкенде?

**A:** Нет! Бэкенд правильный. Проблема только во frontend.

### Q: Будет ли это работать локально?

**A:** Да! Локально используется fallback:
```typescript
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';
//                                                                     ↑ БЕЗ /api
```

### Q: Что делать если после изменения всё равно не работает?

**A:** Проверьте:
1. ✓ GitHub Secret изменён на `https://tnc.az` (БЕЗ /api)
2. ✓ GitHub Actions успешно завершился
3. ✓ На сервере образ обновился (проверьте дату: `docker images | grep tnc`)
4. ✓ Hard reload в браузере (Ctrl+Shift+R)
5. ✓ Очистите localStorage и cookies

---

## 📋 Чеклист

- [ ] Изменён GitHub Secret `NEXT_PUBLIC_API_BASE_URL` на `https://tnc.az`
- [ ] Закоммичен `client.ts` с исправлением публичных endpoints
- [ ] GitHub Actions завершился успешно
- [ ] На сервере образ обновился
- [ ] В браузере URL правильные: `/api/memberships` (БЕЗ двойного /api/)
- [ ] На главной странице нет редиректа на логин
- [ ] В dashboard редирект на логин работает (если не авторизован)
