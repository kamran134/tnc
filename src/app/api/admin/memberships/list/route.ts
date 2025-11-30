import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8080';

export async function GET(request: NextRequest) {
  try {
    // Получаем токен из cookies
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('access_token')?.value;

    console.log('🔐 [Admin Memberships List API] GET request received');
    console.log('🍪 Access token from cookies:', accessToken ? `EXISTS (${accessToken.substring(0, 20)}...)` : '❌ MISSING');

    if (!accessToken) {
      console.log('❌ No access token - returning 401');
      return NextResponse.json(
        { message: 'Not authenticated' },
        { status: 401 }
      );
    }

    // Проксируем запрос к Java бэкенду
    const backendUrl = `${BACKEND_URL}/api/admin/memberships/list`;
    console.log('🚀 Proxying to backend:', backendUrl);
    
    const response = await fetch(backendUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    console.log('📥 Backend response status:', response.status);

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Failed to fetch memberships list' }));
      console.log('❌ Backend returned error:', error);
      return NextResponse.json(
        { message: error.message || 'Failed to fetch memberships list' },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log('✅ Memberships list fetched successfully');
    return NextResponse.json(data, { status: 200 });

  } catch (error) {
    console.error('Memberships list fetch error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
