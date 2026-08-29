import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { refreshAccessToken, clearAuthCookies, REFRESH_COOKIE } from '@/lib/auth/server';

export async function POST() {
  try {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get(REFRESH_COOKIE)?.value;

    if (!refreshToken) {
      return NextResponse.json(
        { message: 'No refresh token' },
        { status: 401 }
      );
    }

    const newAccessToken = await refreshAccessToken();

    if (!newAccessToken) {
      await clearAuthCookies();
      return NextResponse.json(
        { message: 'Failed to refresh token' },
        { status: 401 }
      );
    }

    return NextResponse.json({ message: 'Token refreshed' }, { status: 200 });
  } catch (error) {
    console.error('Token refresh failed:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
