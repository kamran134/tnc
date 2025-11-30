import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8080';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // Получаем токен из cookies
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('access_token')?.value;

    console.log(`🔐 [Admin Core Value API] GET request for ID: ${id}`);
    console.log('🍪 Access token from cookies:', accessToken ? `EXISTS (${accessToken.substring(0, 20)}...)` : '❌ MISSING');

    if (!accessToken) {
      console.log('❌ No access token - returning 401');
      return NextResponse.json(
        { message: 'Not authenticated' },
        { status: 401 }
      );
    }

    const backendUrl = `${BACKEND_URL}/api/admin/core-values/${id}`;
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
      const error = await response.json().catch(() => ({ message: 'Failed to fetch core value' }));
      console.log('❌ Backend returned error:', error);
      return NextResponse.json(
        { message: error.message || 'Failed to fetch core value' },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log('✅ Core value fetched successfully');
    return NextResponse.json(data, { status: 200 });

  } catch (error) {
    console.error('Core value fetch error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    
    // Получаем токен из cookies
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('access_token')?.value;

    console.log(`🔐 [Admin Core Value API] PUT request for ID: ${id}`);
    console.log('🍪 Access token from cookies:', accessToken ? `EXISTS (${accessToken.substring(0, 20)}...)` : '❌ MISSING');

    if (!accessToken) {
      console.log('❌ No access token - returning 401');
      return NextResponse.json(
        { message: 'Not authenticated' },
        { status: 401 }
      );
    }

    const backendUrl = `${BACKEND_URL}/api/admin/core-values/${id}`;
    console.log('🚀 Proxying to backend:', backendUrl);
    
    const response = await fetch(backendUrl, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    console.log('📥 Backend response status:', response.status);

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Failed to update core value' }));
      console.log('❌ Backend returned error:', error);
      return NextResponse.json(
        { message: error.message || 'Failed to update core value' },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log('✅ Core value updated successfully');
    return NextResponse.json(data, { status: 200 });

  } catch (error) {
    console.error('Core value update error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // Получаем токен из cookies
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('access_token')?.value;

    console.log(`🔐 [Admin Core Value API] DELETE request for ID: ${id}`);
    console.log('🍪 Access token from cookies:', accessToken ? `EXISTS (${accessToken.substring(0, 20)}...)` : '❌ MISSING');

    if (!accessToken) {
      console.log('❌ No access token - returning 401');
      return NextResponse.json(
        { message: 'Not authenticated' },
        { status: 401 }
      );
    }

    const backendUrl = `${BACKEND_URL}/api/admin/core-values/${id}`;
    console.log('🚀 Proxying to backend:', backendUrl);
    
    const response = await fetch(backendUrl, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    console.log('📥 Backend response status:', response.status);

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Failed to delete core value' }));
      console.log('❌ Backend returned error:', error);
      return NextResponse.json(
        { message: error.message || 'Failed to delete core value' },
        { status: response.status }
      );
    }

    console.log('✅ Core value deleted successfully');
    return NextResponse.json({ message: 'Core value deleted successfully' }, { status: 200 });

  } catch (error) {
    console.error('Core value deletion error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
