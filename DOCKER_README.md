# 🐳 Docker Quick Start для TnC Website

## 🚀 Быстрый деплой на сервер (GHCR)

```bash
# Создание директории
sudo mkdir -p /opt/tnc-website && cd /opt/tnc-website

# Скачивание конфигурации
curl -o docker-compose.prod.yml https://raw.githubusercontent.com/kamran134/tnc/main/docker-compose.prod.yml

# Авторизация в GHCR
docker login ghcr.io -u kamran134

# Запуск приложения (образ загружается из GHCR)
docker-compose -f docker-compose.prod.yml up -d
```

## 💻 Локальная разработка

```bash
# Клонировать репозиторий
git clone https://github.com/kamran134/tnc.git
cd tnc

# Запустить в development режиме
npm run docker:dev
```

## 🔧 Локальная сборка и тестирование

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

## 🔄 Обновление на сервере

```bash
# Загрузка нового образа
docker-compose -f docker-compose.prod.yml pull

# Перезапуск с новым образом
docker-compose -f docker-compose.prod.yml up -d

# Проверка логов
docker-compose -f docker-compose.prod.yml logs -f
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