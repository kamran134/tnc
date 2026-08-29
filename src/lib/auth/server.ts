/**
 * Единая точка серверной авторизованной работы с бэкендом.
 *
 * Все server-side запросы к /api/admin/** и защищённым /api/auth/** роутам должны идти
 * через backendFetch() из этого файла — он сам добавляет Authorization и делает ровно одну
 * попытку рефреша на 401. НЕ добавлять сюда модульный single-flight/кэш, разделяемый между
 * запросами: cookies() привязан к контексту конкретного запроса, общий между запросами
 * промис поставит куки не тому ответу.
 */

import { cookies, headers } from 'next/headers';
import { NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8080';

export const ACCESS_COOKIE = 'access_token';
export const REFRESH_COOKIE = 'refresh_token';
/** Куки живут 30 дней независимо от TTL токенов — валидность решает бэкенд (см. §1/§2 ТЗ). */
export const AUTH_COOKIE_MAX_AGE = 60 * 60 * 24 * 30;

async function isSecureRequest(): Promise<boolean> {
  const proto = (await headers()).get('x-forwarded-proto');
  if (proto) return proto.split(',')[0].trim() === 'https';
  return process.env.FORCE_SECURE_COOKIES === 'true';
}

export async function setAuthCookies(accessToken: string, refreshToken?: string): Promise<void> {
  const cookieStore = await cookies();
  const secure = await isSecureRequest();

  const base = {
    httpOnly: true,
    secure,
    sameSite: 'lax' as const,
    maxAge: AUTH_COOKIE_MAX_AGE,
    path: '/',
  };

  cookieStore.set(ACCESS_COOKIE, accessToken, base);
  if (refreshToken) {
    cookieStore.set(REFRESH_COOKIE, refreshToken, base);
  }
}

export async function clearAuthCookies(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(ACCESS_COOKIE);
  cookieStore.delete(REFRESH_COOKIE);
}

/** Дёргает бэкендовый /api/auth/refresh, при успехе перезаписывает куки. */
export async function refreshAccessToken(): Promise<string | null> {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get(REFRESH_COOKIE)?.value;

  if (!refreshToken) {
    return null;
  }

  try {
    const response = await fetch(`${BACKEND_URL}/api/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
      cache: 'no-store',
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json().catch(() => null);
    if (!data?.accessToken) {
      return null;
    }

    // Ротации нет: бэкенд возвращает тот же refresh token, но на всякий случай
    // подстраховываемся полем из ответа, если оно вдруг придёт.
    await setAuthCookies(data.accessToken, data.refreshToken ?? refreshToken);
    return data.accessToken as string;
  } catch (error) {
    console.error('refreshAccessToken error:', error);
    return null;
  }
}

/**
 * Запрос к бэкенду с Bearer-токеном из куки.
 * path — путь на бэкенде, например '/api/admin/news?page=0'.
 * При 401 один раз рефрешит токен и повторяет запрос.
 * Возвращает СЫРОЙ Response, чтобы вызывающий роут обрабатывал тело как раньше.
 *
 * init.body обязан быть переиспользуемым (строка, Buffer, FormData) — тело может быть
 * прочитано дважды при ретрае. Никогда не передавать в него поток (например request.body).
 */
export async function backendFetch(path: string, init: RequestInit = {}): Promise<Response> {
  const cookieStore = await cookies();
  let accessToken = cookieStore.get(ACCESS_COOKIE)?.value;
  const hasRefreshToken = !!cookieStore.get(REFRESH_COOKIE)?.value;

  if (!accessToken && !hasRefreshToken) {
    await clearAuthCookies();
    return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
  }

  // Единственная попытка рефреша на весь вызов backendFetch — учитывается и превентивный
  // рефреш (когда access-куки нет), и реактивный (по 401 от бэкенда).
  let refreshAttempted = false;

  if (!accessToken) {
    accessToken = (await refreshAccessToken()) ?? undefined;
    refreshAttempted = true;

    if (!accessToken) {
      await clearAuthCookies();
      return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
    }
  }

  const doFetch = (token: string) => {
    const requestHeaders = new Headers(init.headers);
    requestHeaders.set('Authorization', `Bearer ${token}`);
    return fetch(`${BACKEND_URL}${path}`, {
      ...init,
      headers: requestHeaders,
      cache: 'no-store',
    });
  };

  let response = await doFetch(accessToken);

  if (response.status === 401) {
    if (refreshAttempted) {
      // Уже потратили единственную попытку рефреша на этот вызов — сдаёмся.
      await clearAuthCookies();
      return response;
    }

    const newAccessToken = await refreshAccessToken();
    if (!newAccessToken) {
      await clearAuthCookies();
      return response;
    }

    response = await doFetch(newAccessToken);
    if (response.status === 401) {
      await clearAuthCookies();
    }
  }

  return response;
}
