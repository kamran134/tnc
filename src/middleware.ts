import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// ПРОСТАЯ ЛОГИКА: только /dashboard требует токен
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Только для /dashboard (НЕ для /dashboard/login)
  if (pathname.startsWith('/dashboard') && !pathname.startsWith('/dashboard/login')) {
    const accessToken = request.cookies.get('access_token');
    
    console.log('Middleware check for:', pathname);
    console.log('Access token present:', !!accessToken);
    console.log('All cookies:', request.cookies.getAll().map(c => c.name));
    
    if (!accessToken) {
      console.log('No access token, redirecting to login');
      return NextResponse.redirect(new URL('/dashboard/login', request.url));
    }
    console.log('Access token found, allowing access');
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*']
};
