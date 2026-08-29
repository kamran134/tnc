import { NextResponse } from 'next/server';
import { backendFetch, clearAuthCookies } from '@/lib/auth/server';

export async function POST() {
  try {
    const response = await backendFetch('/api/auth/logout-all', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      let errorMessage = 'Failed to logout from all devices';

      try {
        const errorJson = JSON.parse(errorText);
        errorMessage = errorJson.message || errorMessage;
      } catch {
        errorMessage = errorText || errorMessage;
      }

      return NextResponse.json(
        { message: errorMessage },
        { status: response.status }
      );
    }

    // Очищаем cookies после logout-all
    await clearAuthCookies();

    return NextResponse.json(
      { message: 'Logged out from all devices successfully' },
      { status: 200 }
    );

  } catch (error) {
    console.error('Logout all error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
