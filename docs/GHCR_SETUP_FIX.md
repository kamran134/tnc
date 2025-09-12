# 🔧 GitHub Container Registry (GHCR) Setup Fix

## Проблема
```
ERROR: failed to push ghcr.io/kamran134/tnc:main: denied: installation not allowed to Create organization package
```

## Причины
1. **Отсутствие permissions** для packages в workflow
2. **Неправильное имя образа** (должно быть lowercase)
3. **Возможные ограничения** в настройках репозитория

## ✅ Исправления в workflow

### 1. Добавлены permissions
```yaml
permissions:
  contents: read
  packages: write
```

### 2. Исправлено имя образа
```yaml
env:
  REGISTRY: ghcr.io
  IMAGE_NAME: kamran134/tnc  # lowercase, explicit
```

### 3. Улучшена metadata конфигурация
```yaml
- name: Extract metadata
  id: meta
  uses: docker/metadata-action@v5
  with:
    images: ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}
    flavor: |
      latest=auto
```

## 🔧 Дополнительные настройки GitHub

### Проверьте настройки репозитория:

1. **Repository Settings** → **Actions** → **General**
   - Workflow permissions: "Read and write permissions" ✅

2. **Repository Settings** → **Actions** → **General** 
   - "Allow GitHub Actions to create and approve pull requests" ✅

3. **Repository Settings** → **Code and automation** → **Packages**
   - Package creation: "Public" или "Private" (на ваше усмотрение)

### Если всё ещё не работает:

1. **Создайте Personal Access Token (PAT)**:
   - GitHub → Settings → Developer settings → Personal access tokens
   - Scopes: `write:packages`, `read:packages`
   
2. **Добавьте PAT как Secret**:
   - Repository → Settings → Secrets → `GHCR_PAT`
   
3. **Обновите workflow** для использования PAT:
   ```yaml
   - name: Log in to Container Registry
     uses: docker/login-action@v3
     with:
       registry: ${{ env.REGISTRY }}
       username: ${{ github.actor }}
       password: ${{ secrets.GHCR_PAT }}  # вместо GITHUB_TOKEN
   ```

## 🎯 Результат

После этих изменений Docker образы должны успешно публиковаться в GitHub Container Registry по адресу:
```
ghcr.io/kamran134/tnc:latest
```