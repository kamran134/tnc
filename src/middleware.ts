import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if the route is a dashboard route (except login)
  if (pathname.startsWith('/dashboard') && !pathname.startsWith('/dashboard/login')) {
    // Check for access token in cookies or localStorage (cookies are preferred for SSR)
    const accessToken = request.cookies.get('access_token');

    // If no token, redirect to login
    if (!accessToken) {
      const loginUrl = new URL('/dashboard/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // If trying to access login page while authenticated, redirect to dashboard
  if (pathname === '/dashboard/login') {
    const accessToken = request.cookies.get('access_token');
    if (accessToken) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/dashboard/:path*',
};
