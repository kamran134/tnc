import { NextResponse } from 'next/server';
import { backendFetch } from '@/lib/auth/server';

export async function GET() {
  try {
    // Куки при 401 чистит сам backendFetch (после неудачного рефреша) — отдельная
    // логика удаления здесь не нужна.
    const response = await backendFetch('/api/auth/me', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { message: 'Failed to get user data' },
        { status: response.status }
      );
    }

    const user = await response.json();
    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.error('Auth /me error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
