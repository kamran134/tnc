# ⚡ Шпаргалка: Логи и Cookies

## 🔴 ЧТО ИЗМЕНЕНО:

### ✅ Включены логи на проде
**Файл:** `next.config.js:32`
```javascript
removeConsole: false  // БЫЛО: process.env.NODE_ENV === 'production'
```

**⚠️ ВЕРНУТЬ ПОСЛЕ ОТЛАДКИ!**

---

## 🍪 НАСТРОЙКИ COOKIES (анализ):

### ✅ Всё правильно настроено!

| Место установки         | httpOnly | secure | sameSite | Статус |
|-------------------------|----------|--------|----------|--------|
| login/route.ts (прод)   | ✅ true  | ✅ true | lax     | ✅ ОК  |
| refresh/route.ts (прод) | ✅ true  | ✅ true | lax     | ✅ ОК  |

**Где находится:**
- `src/app/api/auth/login/route.ts:54` - `const isSecure = process.env.NODE_ENV === 'production'`
- `src/app/api/auth/login/route.ts:58` - `const useHttpOnly = process.env.NODE_ENV === 'production'`
- `src/app/api/auth/refresh/route.ts:79` - `secure: process.env.NODE_ENV === 'production'`

**Вывод:** ❌ Изменений НЕ ТРЕБУЕТСЯ!

---

## 📋 Чек-лист:

- [x] ✅ Логи включены на проде (`removeConsole: false`)
- [x] ✅ Cookies анализированы - всё безопасно
- [ ] ⏳ Проверить логи на проде после деплоя
- [ ] ⏳ Вернуть `removeConsole: process.env.NODE_ENV === 'production'`

---

## 🚀 Команды для деплоя:

```bash
# Пересобрать с новыми настройками
docker compose -f docker-compose.prod.yml build

# Задеплоить
docker compose -f docker-compose.prod.yml up -d

# Смотреть логи
docker compose -f docker-compose.prod.yml logs -f web
```

---

## 📚 Подробности в файлах:

- `PROD_LOGGING_ENABLED.md` - Инструкции по логам
- `COOKIE_SECURITY_AUDIT.md` - Полный аудит безопасности cookies
- `LOGGING_AND_COOKIES_MAP.md` - Карта расположения всех настроек
