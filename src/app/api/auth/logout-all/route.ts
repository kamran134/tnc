import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8080';

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('access_token')?.value;

    if (!accessToken) {
      return NextResponse.json(
        { message: 'Not authenticated' },
        { status: 401 }
      );
    }

    // Проксируем запрос на backend: POST /api/auth/logout-all
    const response = await fetch(`${BACKEND_URL}/api/auth/logout-all`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
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
    const response2 = NextResponse.json(
      { message: 'Logged out from all devices successfully' },
      { status: 200 }
    );

    response2.cookies.delete('access_token');
    response2.cookies.delete('refresh_token');

    return response2;

  } catch (error) {
    console.error('Logout all error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
