# 🔍 Отладка проблемы с логином на проде

## 🚨 Проблема:
На проде после логина cookies НЕ устанавливаются и происходит редирект обратно на `/dashboard/login`

## ✅ Что добавлено:

### 1. Расширенное логирование в клиенте
**Файл:** `src/app/dashboard/login/page.tsx`
- Логи BEFORE/AFTER login запроса
- Проверка cookies до и после
- Проверка заголовков ответа
- Задержка 500ms перед редиректом

### 2. Улучшенное логирование в API route
**Файл:** `src/app/api/auth/login/route.ts`
- Более детальные логи установки cookies
- Информация о domain, path, flags

## 🔍 Что нужно проверить:

### Шаг 1: Пересобрать и задеплоить
```bash
# Локально
git add .
git commit -m "feat: add detailed login debugging"
git push

# На сервере
cd /path/to/tnc
git pull
docker compose -f docker-compose.prod.yml build
docker compose -f docker-compose.prod.yml up -d
```

### Шаг 2: Смотреть логи
```bash
docker compose -f docker-compose.prod.yml logs -f web
```

### Шаг 3: Попробовать залогиниться

**В браузере:**
1. Открыть DevTools (F12)
2. Перейти на вкладку **Network**
3. Открыть `https://tnc.az/dashboard/login`
4. Ввести credentials и нажать Login
5. **ВАЖНО:** Найти запрос `POST /api/auth/login` в Network tab

### Шаг 4: Проверить что искать в логах

**Должны быть такие логи:**

```
🔐 ======================== API ROUTE: LOGIN START ========================
⏰ Time: ...
🌐 Backend URL: https://tnc.az
📦 Request Body: {"email":"...","password":"..."}
🚀 Forwarding request to backend: https://tnc.az/api/auth/login
📥 Backend response status: 200 OK
✅ Login successful from backend!
📦 Response data: ...
🔑 Access Token: EXISTS (...)
🔑 Refresh Token: EXISTS (...)
🍪 ======================== SETTING COOKIES ========================
🍪 NODE_ENV: production
🍪 Secure flag: true
🍪 HttpOnly flag: true
🍪 SameSite: lax
🍪 Domain: NOT SET (will use current domain)
🍪 Path: /
✅ access_token cookie set
✅ refresh_token cookie set
📤 Sending response to client
🔐 ======================== API ROUTE: LOGIN SUCCESS ========================
```

**И в логах клиента (Browser Console):**

```
🔐 CLIENT: ==================== LOGIN START ====================
⏰ Time: ...
📧 Email: ...
🌐 Current URL: https://tnc.az/dashboard/login
🍪 Cookies BEFORE login: (может быть пусто)
🚀 Sending POST to /api/auth/login...
📥 CLIENT: Response received!
📥 Status: 200 OK
📥 Response headers:
   content-type: application/json
   set-cookie: access_token=...; refresh_token=...
✅ CLIENT: Login successful!
🔑 Access token: EXISTS (...)
🍪 Cookies after 500ms delay: (может быть пусто если httpOnly=true!)
🔄 Redirecting to /dashboard...
```

---

## 🔍 Что проверить в Browser DevTools:

### Network Tab:
1. Найти запрос `POST /api/auth/login`
2. Открыть вкладку **Headers**
3. Прокрутить вниз до **Response Headers**
4. **ПРОВЕРИТЬ:** Есть ли заголовок `Set-Cookie`?

**Должно быть:**
```
Set-Cookie: access_token=eyJ...; Path=/; HttpOnly; Secure; SameSite=Lax
Set-Cookie: refresh_token=eyJ...; Path=/; HttpOnly; Secure; SameSite=Lax
```

### Application Tab:
1. Открыть **Application** → **Cookies** → `https://tnc.az`
2. **ПРОВЕРИТЬ:** Есть ли cookies `access_token` и `refresh_token`?

**Должны быть:**
| Name          | Value      | Domain | Path | Secure | HttpOnly | SameSite |
|---------------|------------|--------|------|--------|----------|----------|
| access_token  | eyJ...     | tnc.az | /    | ✓      | ✓        | Lax      |
| refresh_token | eyJ...     | tnc.az | /    | ✓      | ✓        | Lax      |

---

## ❓ Возможные проблемы:

### 1. ❌ В логах НЕТ вызова `/api/auth/login`
**Причина:** Запрос не доходит до API route
**Решение:** Проверить Network tab в браузере, возможно CORS или другая ошибка

### 2. ❌ Set-Cookie заголовок НЕ отправляется
**Причина:** Проблема с NextResponse.cookies.set()
**Решение:** Проверить логи API route, возможно ошибка при установке

### 3. ❌ Set-Cookie есть, но cookies НЕ сохраняются браузером
**Возможные причины:**
- `Secure` флаг требует HTTPS (проверить что используется https://)
- `SameSite=Lax` проблемы с кросс-доменными запросами
- Браузер блокирует third-party cookies (проверить настройки браузера)

### 4. ❌ Cookies устанавливаются, но middleware их НЕ видит
**Причина:** Cookie не отправляется в следующем запросе
**Решение:** Проверить Domain/Path в cookies

---

## 🎯 Следующие шаги:

1. ✅ Пересобрать и задеплоить с новыми логами
2. ✅ Попробовать залогиниться
3. ✅ Скопировать **ВСЕ логи** (включая POST /api/auth/login)
4. ✅ Сделать скриншот Network tab и Application/Cookies tab
5. ✅ Отправить мне логи и скриншоты

**Тогда я смогу точно сказать в чём проблема!**
