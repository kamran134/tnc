import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8080';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Получаем токен из cookies
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('access_token')?.value;
    if (!accessToken) {
      return NextResponse.json(
        { message: 'Not authenticated' },
        { status: 401 }
      );
    }
    
    const backendUrl = `${BACKEND_URL}/api/admin/memberships/reorder`;
    const response = await fetch(backendUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Failed to reorder memberships' }));
      return NextResponse.json(
        { message: error.message || 'Failed to reorder memberships' },
        { status: response.status }
      );
    }
    return NextResponse.json({ message: 'Memberships reordered successfully' }, { status: 200 });

  } catch (error) {
    console.error('Memberships reorder error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
