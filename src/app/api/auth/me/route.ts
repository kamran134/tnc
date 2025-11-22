import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8080';

export async function GET(request: NextRequest) {
  console.log('========================================================================');
  console.log('👤 ======================== API ROUTE: /auth/me START ========================');
  console.log('⏰ Server Time:', new Date().toISOString());
  console.log('🌐 Backend URL:', BACKEND_URL);
  console.log('🔍 Request URL:', request.url);
  console.log('🔍 Request Method:', request.method);
  
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('access_token')?.value;
    
    console.log('🍪 Reading cookies from request...');
    const allCookies = cookieStore.getAll();
    console.log('🍪 All cookies:', allCookies.map(c => `${c.name}=${c.value.substring(0, 20)}...`));
    console.log('🔑 Access Token:', accessToken ? `EXISTS (${accessToken.substring(0, 30)}...)` : '❌ MISSING');

    if (!accessToken) {
      console.log('❌ NO ACCESS TOKEN - Returning 401');
      console.log('👤 ======================== API ROUTE: /auth/me END (401) ========================');
      console.log('========================================================================\n');
      return NextResponse.json(
        { message: 'Not authenticated' },
        { status: 401 }
      );
    }

    console.log('🚀 Forwarding request to backend:', `${BACKEND_URL}/api/auth/me`);
    console.log('🔑 Using Authorization header: Bearer', accessToken.substring(0, 30) + '...');
    
    // Запрашиваем данные пользователя с бэкенда согласно Swagger: /api/auth/me
    const response = await fetch(`${BACKEND_URL}/api/auth/me`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    console.log('📥 Backend response status:', response.status, response.statusText);
    console.log('📋 Backend response headers:', JSON.stringify(Object.fromEntries(response.headers.entries()), null, 2));

    if (!response.ok) {
      console.log('❌ Backend returned error status:', response.status);
      
      // Если токен невалидный, удаляем cookies
      if (response.status === 401) {
        console.log('🗑️ Token invalid - deleting cookies');
        cookieStore.delete('access_token');
        cookieStore.delete('refresh_token');
        console.log('✅ Cookies deleted');
      }
      
      const errorText = await response.text();
      console.log('💥 Error response:', errorText);
      console.log('👤 ======================== API ROUTE: /auth/me END (ERROR) ========================');
      console.log('========================================================================\n');
      
      return NextResponse.json(
        { message: 'Failed to get user data' },
        { status: response.status }
      );
    }

    const user = await response.json();
    console.log('✅ User data received from backend');
    console.log('👤 User:', JSON.stringify(user, null, 2));
    console.log('👤 ======================== API ROUTE: /auth/me END (SUCCESS) ========================');
    console.log('========================================================================\n');
    
    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.error('💥 ======================== API ROUTE: /auth/me EXCEPTION ========================');
    console.error('❌ Error:', error);
    console.error('❌ Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    console.log('========================================================================\n');
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
