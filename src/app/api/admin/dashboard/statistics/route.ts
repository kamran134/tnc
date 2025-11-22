import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8080';

export async function GET(request: NextRequest) {
  try {
    // Получаем токен из cookies
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('access_token')?.value;

    console.log('📊 [Dashboard Statistics API] Request received');
    console.log('🍪 Access token from cookies:', accessToken ? `EXISTS (${accessToken.substring(0, 20)}...)` : '❌ MISSING');

    if (!accessToken) {
      console.log('❌ No access token - returning 401');
      return NextResponse.json(
        { message: 'Not authenticated' },
        { status: 401 }
      );
    }

    console.log('🌐 Backend URL:', BACKEND_URL);
    console.log('🚀 Forwarding request to backend:', `${BACKEND_URL}/api/admin/dashboard/statistics`);

    // Проксируем запрос к Java бэкенду
    const response = await fetch(`${BACKEND_URL}/api/admin/dashboard/statistics`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    console.log('📥 Backend response status:', response.status);

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Failed to fetch dashboard statistics' }));
      console.log('❌ Backend error:', error);
      return NextResponse.json(
        { message: error.message || 'Failed to fetch dashboard statistics' },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log('✅ Dashboard statistics received from backend');
    return NextResponse.json(data, { status: 200 });

  } catch (error) {
    console.error('❌ Dashboard statistics error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
