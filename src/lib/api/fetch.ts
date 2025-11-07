/**
 * Утилита для авторизованных fetch запросов
 * Автоматически добавляет Authorization header с токеном из localStorage
 */

export async function authorizedFetch(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  // Получаем токен из localStorage
  const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;

  // Объединяем заголовки
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
    ...(token && { 'Authorization': `Bearer ${token}` }),
  };

  // Выполняем запрос с credentials: 'include' для cookies
  return fetch(url, {
    ...options,
    credentials: 'include',
    headers,
  });
}
