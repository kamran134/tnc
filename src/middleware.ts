import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// ПРОСТАЯ ЛОГИКА: только /dashboard требует токен
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  console.log('🔒 MIDDLEWARE START =====================');
  console.log('📍 Path:', pathname);
  console.log('🌐 Full URL:', request.url);
  
  // Только для /dashboard (НЕ для /dashboard/login)
  if (pathname.startsWith('/dashboard') && !pathname.startsWith('/dashboard/login')) {
    const accessToken = request.cookies.get('access_token');
    
    console.log('🔐 Protected route detected:', pathname);
    console.log('🍪 Access token cookie:', accessToken?.value ? `EXISTS (${accessToken.value.substring(0, 20)}...)` : 'MISSING');
    console.log('🍪 All cookies:', request.cookies.getAll().map(c => `${c.name}=${c.value.substring(0, 10)}...`));
    
    if (!accessToken) {
      console.log('❌ NO ACCESS TOKEN - Redirecting to login');
      console.log('🔒 MIDDLEWARE END (REDIRECT) =====================\n');
      return NextResponse.redirect(new URL('/dashboard/login', request.url));
    }
    console.log('✅ ACCESS TOKEN FOUND - Allowing access');
  } else {
    console.log('📖 Public route or login page - allowing access');
  }

  console.log('🔒 MIDDLEWARE END (PASS) =====================\n');
  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*']
};
