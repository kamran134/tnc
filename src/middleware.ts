import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const locales = ['az', 'en', 'ru'];
const defaultLocale = 'az';

// ЛОГИКА: авторизация для /dashboard + поддержка языков
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  console.log('========================================================================');
  console.log('🔒 MIDDLEWARE START =====================');
  console.log('⏰ Time:', new Date().toISOString());
  console.log('📍 Path:', pathname);
  console.log('🌐 Full URL:', request.url);
  console.log('🔍 Method:', request.method);
  console.log('🌍 Headers:', JSON.stringify(Object.fromEntries(request.headers.entries()), null, 2));
  
  // Только для /dashboard (НЕ для /dashboard/login)
  if (pathname.startsWith('/dashboard') && !pathname.startsWith('/dashboard/login')) {
    const accessToken = request.cookies.get('access_token');
    
    console.log('🔐 Protected route detected:', pathname);
    console.log('🍪 Access token cookie:', accessToken?.value ? `EXISTS (${accessToken.value.substring(0, 30)}...)` : '❌ MISSING');
    
    const allCookies = request.cookies.getAll();
    console.log('🍪 All cookies:');
    allCookies.forEach(c => {
      console.log(`   - ${c.name}=${c.value.substring(0, 20)}...`);
    });
    
    if (!accessToken) {
      console.log('❌ NO ACCESS TOKEN FOUND');
      console.log('🔀 REDIRECTING to /dashboard/login');
      console.log('🔒 MIDDLEWARE END (REDIRECT) =====================');
      console.log('========================================================================\n');
      return NextResponse.redirect(new URL('/dashboard/login', request.url));
    }
    
    console.log('✅ ACCESS TOKEN FOUND - Allowing access');
    console.log('✅ Token value:', accessToken.value.substring(0, 50) + '...');
  } else {
    console.log('📖 Public route or login page - allowing access');
  }

  console.log('✅ MIDDLEWARE END (PASS) =====================');
  console.log('========================================================================\n');
  
  // Проверяем, есть ли язык в URL
  const pathnameLocale = locales.find(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );
  
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
