import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// ПРОСТАЯ ЛОГИКА: только /dashboard требует токен
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Только для /dashboard (НЕ для /dashboard/login)
  if (pathname.startsWith('/dashboard') && !pathname.startsWith('/dashboard/login')) {
    const accessToken = request.cookies.get('access_token');
    if (!accessToken) {
      return NextResponse.redirect(new URL('/dashboard/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*']
};
