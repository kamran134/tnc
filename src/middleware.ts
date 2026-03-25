import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { LANGUAGES, DEFAULT_LANGUAGE } from '@/lib/utils/translations';

const locales = LANGUAGES;
const defaultLocale = DEFAULT_LANGUAGE;

// ЛОГИКА: авторизация для /dashboard + поддержка языков + автоматический refresh
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Только для /dashboard (НЕ для /dashboard/login)
  if (pathname.startsWith('/dashboard') && !pathname.startsWith('/dashboard/login')) {
    const accessToken = request.cookies.get('access_token')?.value;
    
    // Если есть access token - пропускаем
    if (accessToken) {
      return NextResponse.next();
    }
    
    // Нет токена - редирект на login
    const loginUrl = new URL('/dashboard/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
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
