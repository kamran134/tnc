import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const locales = ['az', 'en', 'ru'];
const defaultLocale = 'az';

// ЛОГИКА: авторизация для /dashboard + поддержка языков + автоматический refresh
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Только для /dashboard (НЕ для /dashboard/login)
  if (pathname.startsWith('/dashboard') && !pathname.startsWith('/dashboard/login')) {
    const accessToken = request.cookies.get('access_token')?.value;
    const refreshToken = request.cookies.get('refresh_token')?.value;
    
    // Если есть access token - пропускаем
    if (accessToken) {
      return NextResponse.next();
    } else if (refreshToken) {
      // Если нет access токена, но есть refresh - пытаемся обновить
      try {
        const refreshResponse = await fetch(new URL('/api/auth/refresh', request.url), {
          method: 'POST',
          headers: {
            Cookie: `refresh_token=${refreshToken}`,
          },
        });

        if (refreshResponse.ok) {
          // Refresh успешен - продолжаем и копируем новые cookies
          const response = NextResponse.next();
          
          // Копируем ВСЕ Set-Cookie заголовки (их может быть несколько)
          const setCookieHeaders = refreshResponse.headers.getSetCookie();
          if (setCookieHeaders && setCookieHeaders.length > 0) {
            setCookieHeaders.forEach((cookie) => {
              response.headers.append('set-cookie', cookie);
            });
          }
          
          // Добавляем язык в header
          const currentLocale = locales.find(
            (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
          ) || defaultLocale;
          response.headers.set('x-locale', currentLocale);
          
          return response;
        }
      } catch (error) {
        console.error('Middleware refresh error:', error);
      }
      
      // Refresh failed - редирект на login
      const loginUrl = new URL('/dashboard/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    } else {
      // Нет токенов - редирект на login
      const loginUrl = new URL('/dashboard/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }
  
  // Если уже на странице логина и есть access token - редирект в dashboard
  if (pathname === '/dashboard/login') {
    const accessToken = request.cookies.get('access_token')?.value;
    if (accessToken) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }

  // Проверяем, есть ли язык в URL
  const pathnameLocale = locales.find(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  // Если это корень без языка, редиректим на /az
  if (pathname === '/') {
    return NextResponse.redirect(new URL('/az', request.url));
  }

  const currentLocale = pathnameLocale || defaultLocale;
  
  const response = NextResponse.next();
  response.headers.set('x-locale', currentLocale);
  
  return response;
}

export const config = {
  matcher: [
    // Применяем ко всем путям
    '/((?!api|_next/static|_next/image|favicon.ico|uploads).*)',
  ]
};
