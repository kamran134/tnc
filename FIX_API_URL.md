# Исправление: Frontend использует localhost вместо production API

## Проблема

Frontend в production отправляет запросы на `http://localhost:8080/api/` вместо `https://tnc.az/api/`

## Причина

**Next.js переменные `NEXT_PUBLIC_*` встраиваются в код ВО ВРЕМЯ СБОРКИ (`npm run build`), а не при запуске контейнера!**

Ранее мы пытались установить `NEXT_PUBLIC_API_BASE_URL` в `docker-compose.prod.yml`, но это не работает, потому что:
1. Docker образ уже собран в GitHub Actions
2. `NEXT_PUBLIC_*` переменные должны быть установлены **перед `npm run build`**
3. Установка переменных в runtime (при `docker run`) не влияет на код

## Решение

### Что изменено:

1. **Dockerfile** - добавлен build-time аргумент:
   ```dockerfile
   ARG NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
   ENV NEXT_PUBLIC_API_BASE_URL=${NEXT_PUBLIC_API_BASE_URL}
   ```

2. **GitHub Actions** (`.github/workflows/deploy.yml`) - добавлен build-arg:
   ```yaml
   build-args: |
     NEXT_PUBLIC_API_BASE_URL=https://tnc.az/api
   ```

3. **docker-compose.prod.yml** - убрана ненужная переменная окружения

## Как применить исправление

### Шаг 1: Закоммитить изменения

```bash
git add .
git commit -m "fix: Add NEXT_PUBLIC_API_BASE_URL as build-time argument"
git push origin main
```

### Шаг 2: Дождаться сборки в GitHub Actions

GitHub Actions автоматически:
1. Запустит тесты
2. Соберёт новый Docker образ **с правильным API URL**
3. Загрузит образ в GHCR
4. Задеплоит на сервер

Проверить статус: https://github.com/kamran134/tnc/actions

### Шаг 3: Проверить на сервере

```bash
# SSH на сервер
ssh user@your-server

# Проверить что контейнеры обновились
cd /opt/tnc
docker compose -f docker-compose.prod.yml ps

# Посмотреть логи
docker compose -f docker-compose.prod.yml logs -f app

# Проверить образ (должна быть свежая дата)
docker images | grep tnc
```

### Шаг 4: Проверить в браузере

1. Откройте https://tnc.az
2. Откройте DevTools (F12) → Network
3. Перезагрузите страницу (Ctrl+Shift+R - hard reload)
4. Проверьте что API запросы идут на `https://tnc.az/api/...` вместо `localhost:8080`

## Альтернативное решение (если не хотите ждать GitHub Actions)

### Пересобрать образ вручную на сервере:

```bash
# SSH на сервер
ssh user@your-server

# Перейти в директорию с кодом
cd /path/to/tnc-source

# Обновить код
git pull origin main

# Собрать образ с правильным API URL
docker build \
  --build-arg NEXT_PUBLIC_API_BASE_URL=https://tnc.az/api \
  -t ghcr.io/kamran134/tnc:latest \
  .

# Или если используете docker-compose для сборки
docker compose -f docker-compose.prod.yml build \
  --build-arg NEXT_PUBLIC_API_BASE_URL=https://tnc.az/api

# Перезапустить
docker compose -f docker-compose.prod.yml up -d
```

## Проверка что исправление работает

### 1. Проверить переменную в контейнере:

```bash
docker exec tnc-website-prod sh -c 'echo $NEXT_PUBLIC_API_BASE_URL'
# Вернёт пустоту - это нормально, переменная встроена в JS код
```

### 2. Проверить в браузере:

```javascript
// Откройте DevTools Console на https://tnc.az
console.log(process.env.NEXT_PUBLIC_API_BASE_URL)
// Должно показать: undefined (это нормально в production build)

// Но код всё равно будет использовать правильный URL
// Проверьте Network tab - запросы должны идти на https://tnc.az/api/
```

### 3. Проверить исходный код в браузере:

```bash
# Найдите в исходниках _next/static/chunks/
# Найдите строку с API URL, должно быть:
# "https://tnc.az/api" вместо "http://localhost:8080"
```

### 4. Тестовый API запрос:

```bash
# С сервера
curl https://tnc.az/api/actuator/health

# Должен вернуть:
# {"status":"UP"}
```

## Важные замечания

### ✅ Build-time vs Runtime переменные:

| Переменная | Когда устанавливается | Где доступна |
|---|---|---|
| `NEXT_PUBLIC_*` | Build time (`npm run build`) | В браузере (зашита в JS) |
| `NODE_ENV` | Runtime (`docker run`) | На сервере |

### ✅ Для разных окружений:

```bash
# Development (локально)
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080 npm run dev

# Staging
docker build --build-arg NEXT_PUBLIC_API_BASE_URL=https://staging.tnc.az/api

# Production
docker build --build-arg NEXT_PUBLIC_API_BASE_URL=https://tnc.az/api
```

### ✅ В CI/CD pipeline (GitHub Actions):

```yaml
build-args: |
  NEXT_PUBLIC_API_BASE_URL=${{ secrets.API_BASE_URL || 'https://tnc.az/api' }}
```

## Что дальше?

После деплоя проверьте:
- [ ] API запросы идут на `https://tnc.az/api/*`
- [ ] CORS работает корректно
- [ ] Авторизация работает
- [ ] Все страницы загружаются данные

Если всё работает - исправление применено успешно! ✅
