# 🔑 Настройка GHCR_PAT для GitHub Container Registry

## Что такое GHCR_PAT?

**GHCR_PAT** (GitHub Container Registry Personal Access Token) - это персональный токен доступа с правами для работы с packages.

## Различия токенов:

| Токен | Создание | Права packages | Использование |
|-------|----------|----------------|---------------|
| `GITHUB_TOKEN` | Автоматически | Ограниченные | ❌ Не работает с GHCR |
| `GHCR_PAT` | Вручную | Полные | ✅ Работает с GHCR |

## 📋 Пошаговая инструкция создания GHCR_PAT:

### 1. Создание Personal Access Token

1. Идите на **GitHub.com** → **Settings** (ваш профиль, правый верхний угол)
2. **Developer settings** (в левом меню внизу)
3. **Personal access tokens** → **Tokens (classic)**
4. **Generate new token (classic)**

### 2. Настройка токена

**Название:** `TnC GHCR Access`

**Scopes (выберите):**
- ✅ `write:packages` - Загрузка packages
- ✅ `read:packages` - Чтение packages  
- ✅ `delete:packages` - Удаление packages (опционально)

**Expiration:** `No expiration` или выберите длительный срок

### 3. Сохранение токена

1. **Generate token**
2. **ВАЖНО:** Скопируйте токен сразу! Он больше не отобразится
3. Сохраните его в безопасном месте

### 4. Добавление в репозиторий

1. **Ваш репозиторий** → **Settings**
2. **Secrets and variables** → **Actions** 
3. **New repository secret**
4. **Name:** `GHCR_PAT`
5. **Value:** Вставьте скопированный токен
6. **Add secret**

## ✅ Проверка

После добавления секрета `GHCR_PAT`:

1. Сделайте `git push` 
2. Проверьте **Actions** в репозитории
3. Build должен пройти успешно
4. Образ появится в **Packages** раздел вашего профиля

## 🔧 Что происходит в workflow:

```yaml
# Для сборки и публикации образа
password: ${{ secrets.GHCR_PAT }}

# Для деплоя на сервер  
echo ${{ secrets.GHCR_PAT }} | docker login ghcr.io -u kamran134 --password-stdin
```

## 🎯 Результат

После настройки Docker образы будут успешно публиковаться:
```
ghcr.io/kamran134/tnc:latest
```

И автоматически деплоиться на ваш сервер!