# 🐳 Docker Quick Start для TnC Website

## Быстрый запуск в разработке

```bash
# Клонировать репозиторий
git clone https://github.com/kamran134/tnc.git
cd tnc

# Запустить в development режиме
npm run docker:dev
```

## Локальная сборка и тестирование

```bash
# Собрать Docker образ
npm run docker:build

# Запустить контейнер
npm run docker:run

# Остановить все контейнеры
npm run docker:stop

# Очистить Docker кэш
npm run docker:clean
```

## Production деплой

```bash
# На сервере
docker-compose -f docker-compose.prod.yml up -d

# Мониторинг
docker-compose logs -f
docker-compose ps
```

## Полезные команды

```bash
# Просмотр логов
docker-compose logs app -f

# Вход в контейнер
docker-compose exec app sh

# Обновление образа
docker-compose pull && docker-compose up -d

# Рестарт сервисов
docker-compose restart
```

📖 **Полная документация**: [DEPLOYMENT_GUIDE.md](./docs/DEPLOYMENT_GUIDE.md)