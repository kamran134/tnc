import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const locales = ['az', 'en', 'ru'];
const defaultLocale = 'az';

// ЛОГИКА: авторизация для /dashboard + поддержка языков
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Только для /dashboard (НЕ для /dashboard/login)
  if (pathname.startsWith('/dashboard') && !pathname.startsWith('/dashboard/login')) {
    const accessToken = request.cookies.get('access_token');
    
    if (!accessToken) {
      return NextResponse.redirect(new URL('/dashboard/login', request.url));
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
