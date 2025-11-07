# 🚀 Быстрая инструкция по отладке

## ✅ Что сделано:
- Увеличена задержка перед редиректом до **10 секунд**
- Теперь у вас есть время проверить DevTools!

---

## 📋 Шаги:

### 1. Пересобрать на сервере:
```bash
cd /path/to/tnc
git pull
docker compose -f docker-compose.prod.yml build
docker compose -f docker-compose.prod.yml up -d
```

### 2. В браузере:
1. **Открыть DevTools (F12)**
2. **Network tab:** Поставить галочку **"Preserve log"** ✅
3. **Console tab:** Поставить галочку **"Preserve log"** ✅ (через шестерёнку)
4. Обновить страницу `https://tnc.az/dashboard/login`
5. Ввести credentials и нажать Login
6. **У вас будет 10 секунд!** 

### 3. Что проверить в Network tab:
- Найти запрос `POST /api/auth/login`
- Кликнуть на него
- Открыть вкладку **Headers**
- Прокрутить вниз до **Response Headers**
- **Скопировать всё** и отправить мне

### 4. Что проверить в Console:
- Найти логи начинающиеся с `🔐 CLIENT:`
- **Скопировать всё** и отправить мне

### 5. В докер логах:
```bash
docker compose -f docker-compose.prod.yml logs -f web
```
- Найти секцию `🔐 ======================== API ROUTE: LOGIN START`
- **Скопировать всё** от LOGIN START до LOGIN SUCCESS/ERROR

---

## 🎯 Что мне нужно увидеть:

### ✅ Из Browser Console:
```
🔐 CLIENT: ==================== LOGIN START ====================
⏰ Time: ...
📧 Email: ...
🍪 Cookies BEFORE login: ...
🚀 Sending POST to /api/auth/login...
📥 CLIENT: Response received!
📥 Status: 200 OK
📥 Response headers:
   set-cookie: ...  <-- ЭТО ВАЖНО!
...
```

### ✅ Из Network tab → POST /api/auth/login → Response Headers:
```
Set-Cookie: access_token=...; Path=/; HttpOnly; Secure; SameSite=Lax
Set-Cookie: refresh_token=...; Path=/; HttpOnly; Secure; SameSite=Lax
```

### ✅ Из Docker logs:
```
🔐 ======================== API ROUTE: LOGIN START ========================
...
🍪 ======================== SETTING COOKIES ========================
✅ access_token cookie set
✅ refresh_token cookie set
...
🔐 ======================== API ROUTE: LOGIN SUCCESS ========================
```

---

## ⚠️ После отладки:

Не забудьте вернуть задержку обратно на 500ms:
```typescript
await new Promise(resolve => setTimeout(resolve, 500));
```

Вместо:
```typescript
await new Promise(resolve => setTimeout(resolve, 10000));
```
