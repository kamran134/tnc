import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8080';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const params = new URLSearchParams(searchParams);

    // Получаем токен из cookies
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('access_token')?.value;

    console.log('🔐 [Admin Memberships API] GET request received');
    console.log('🍪 Access token from cookies:', accessToken ? `EXISTS (${accessToken.substring(0, 20)}...)` : '❌ MISSING');

    if (!accessToken) {
      console.log('❌ No access token - returning 401');
      return NextResponse.json(
        { message: 'Not authenticated' },
        { status: 401 }
      );
    }

    // Проксируем запрос к Java бэкенду
    const backendUrl = `${BACKEND_URL}/api/admin/memberships?${params}`;
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
      const error = await response.json().catch(() => ({ message: 'Failed to fetch memberships' }));
      console.log('❌ Backend returned error:', error);
      return NextResponse.json(
        { message: error.message || 'Failed to fetch memberships' },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log('✅ Memberships fetched successfully');
    return NextResponse.json(data, { status: 200 });

  } catch (error) {
    console.error('Memberships fetch error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Получаем токен из cookies
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('access_token')?.value;

    console.log('🔐 [Admin Memberships API] POST request received');
    console.log('🍪 Access token from cookies:', accessToken ? `EXISTS (${accessToken.substring(0, 20)}...)` : '❌ MISSING');

    if (!accessToken) {
      console.log('❌ No access token - returning 401');
      return NextResponse.json(
        { message: 'Not authenticated' },
        { status: 401 }
      );
    }

    // Check if this is a reorder request
    if (request.url.includes('/reorder')) {
      const backendUrl = `${BACKEND_URL}/api/admin/memberships/reorder`;
      console.log('🚀 Proxying reorder to backend:', backendUrl);
      
      const response = await fetch(backendUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      console.log('📥 Backend response status:', response.status);

      if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'Failed to reorder memberships' }));
        console.log('❌ Backend returned error:', error);
        return NextResponse.json(
          { message: error.message || 'Failed to reorder memberships' },
          { status: response.status }
        );
      }

      console.log('✅ Memberships reordered successfully');
      return NextResponse.json({ message: 'Memberships reordered successfully' }, { status: 200 });
    }
    
    // Regular POST (create)
    const backendUrl = `${BACKEND_URL}/api/admin/memberships`;
    console.log('🚀 Proxying to backend:', backendUrl);
    
    const response = await fetch(backendUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    console.log('📥 Backend response status:', response.status);

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Failed to create membership' }));
      console.log('❌ Backend returned error:', error);
      return NextResponse.json(
        { message: error.message || 'Failed to create membership' },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log('✅ Membership created successfully');
    return NextResponse.json(data, { status: 201 });

  } catch (error) {
    console.error('Membership creation error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
