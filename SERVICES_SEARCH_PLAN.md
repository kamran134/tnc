# План добавления поиска для сервисов

## Этап 1: Backend (ЗАВЕРШЕН ✅)

### 1.1 Создать ServiceSpecification.java
- [x] Создать файл `backend-tnc/src/main/java/az/tnc/backend/specification/ServiceSpecification.java`
- [x] Добавить методы `titleContains()` и `contentContains()` (по аналогии с NewsSpecification)

### 1.2 Обновить ServiceService интерфейс
- [x] Добавить метод `findServicesAdminWithFilters()` в `ServiceService.java`

### 1.3 Обновить ServiceServiceImpl
- [x] Реализовать метод `findServicesAdminWithFilters()` с использованием Specification
- [x] Добавить импорт `ServiceSpecification` и `Specification`

### 1.4 Обновить AdminServiceController
- [x] Добавить параметры `title`, `content` и `active` в метод `getAllServicesAdmin()`
- [x] Добавить условие для вызова метода с фильтрами

## Этап 2: Frontend (ЗАВЕРШЕН ✅)

### 2.1 Обновить API сервис
- [x] Изменить `src/lib/api/admin-services.service.ts` - добавить параметры `title`, `content`, `categoryCode`, `active` в getAll метод

### 2.2 Обновить хук useAdminServicesListQuery
- [x] Добавить поддержку параметров поиска в `src/hooks/queries/useAdminServicesQueries.ts`
- [x] Добавить параметры в query keys для правильного кеширования

### 2.3 Создать debounce хук
- [x] Создать `src/hooks/useDebounce.ts` для оптимизации поиска

### 2.4 Обновить страницу админки сервисов
- [x] Связать поле поиска с API в `src/app/dashboard/services/page.tsx`
- [x] Добавить debounce для поиска (500ms)
- [x] Добавить сброс страницы при изменении поиска
- [x] Передавать searchTerm в title и content одновременно

## Текущий статус
- Этап: Завершен ✅
- Дата: 2026-02-05
- Статус: Готово к тестированию после деплоя
