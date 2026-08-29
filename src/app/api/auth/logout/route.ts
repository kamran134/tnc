import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { backendFetch, clearAuthCookies, REFRESH_COOKIE } from '@/lib/auth/server';

export async function POST() {
  try {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get(REFRESH_COOKIE)?.value;

    if (refreshToken) {
      try {
        // POST /api/auth/logout на бэкенде требует аутентификации (SecurityConfig:
        // .requestMatchers(POST, "/api/auth/logout").authenticated()) — одного
        // refreshToken в теле недостаточно, нужен ещё и валидный Bearer. backendFetch
        // сам подставит Authorization и при протухшем access-токене один раз обновит
        // его перед вызовом, чтобы сессия реально отозвалась в БД.
        await backendFetch('/api/auth/logout', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ refreshToken }),
        });
      } catch (error) {
        console.error('Logout backend error:', error);
      }
    }

    // Куки чистим всегда, даже если запрос на бэкенд не удался.
    await clearAuthCookies();

    return NextResponse.json({ message: 'Logged out successfully' }, { status: 200 });
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
