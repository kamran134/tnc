import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';

export async function POST(request: NextRequest) {
  console.log('========================================================================');
  console.log('🔄 ======================== API ROUTE: /auth/refresh START ========================');
  console.log('⏰ Server Time:', new Date().toISOString());
  console.log('🌐 Backend URL:', API_BASE_URL);
  console.log('🔍 Request URL:', request.url);
  console.log('🔍 Request Method:', request.method);
  
  try {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get('refresh_token')?.value;
    
    console.log('🍪 Reading cookies from request...');
    const allCookies = cookieStore.getAll();
    console.log('🍪 All cookies:', allCookies.map(c => `${c.name}=${c.value.substring(0, 20)}...`));
    console.log('🔑 Refresh Token:', refreshToken ? `EXISTS (${refreshToken.substring(0, 30)}...)` : '❌ MISSING');

    if (!refreshToken) {
      console.log('❌ NO REFRESH TOKEN - Returning 401');
      console.log('🔄 ======================== API ROUTE: /auth/refresh END (401) ========================');
      console.log('========================================================================\n');
      return NextResponse.json(
        { message: 'No refresh token' },
        { status: 401 }
      );
    }

    console.log('🚀 Forwarding refresh request to backend:', `${API_BASE_URL}/auth/refresh`);
    console.log('📦 Request body:', JSON.stringify({ refreshToken: refreshToken.substring(0, 30) + '...' }));
    
    // Обновляем токен через бэкенд
    const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refreshToken }),
    });

    console.log('📥 Backend response status:', response.status, response.statusText);
    console.log('📋 Backend response headers:', JSON.stringify(Object.fromEntries(response.headers.entries()), null, 2));

    if (!response.ok) {
      console.log('❌ Backend returned error status:', response.status);
      console.log('🗑️ Deleting invalid tokens...');
      
      // Удаляем невалидные токены
      cookieStore.delete('access_token');
      cookieStore.delete('refresh_token');
      console.log('✅ Cookies deleted');
      
      const errorText = await response.text();
      console.log('💥 Error response:', errorText);
      console.log('🔄 ======================== API ROUTE: /auth/refresh END (ERROR) ========================');
      console.log('========================================================================\n');
      
      return NextResponse.json(
        { message: 'Failed to refresh token' },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log('✅ Token refresh successful!');
    console.log('📦 Response data:', JSON.stringify(data, null, 2));
    
    const { accessToken, refreshToken: newRefreshToken } = data;
    console.log('🔑 New Access Token:', accessToken ? `EXISTS (${accessToken.substring(0, 30)}...)` : '❌ MISSING');
    console.log('🔑 New Refresh Token:', newRefreshToken ? `EXISTS (${newRefreshToken.substring(0, 30)}...)` : '❌ MISSING');

    console.log('🍪 Setting new cookies...');
    
    // Обновляем токены в cookies
    cookieStore.set('access_token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24, // 24 hours
      path: '/',
    });
    console.log('✅ access_token cookie set');

    cookieStore.set('refresh_token', newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });
    console.log('✅ refresh_token cookie set');
    
    console.log('🔄 ======================== API ROUTE: /auth/refresh END (SUCCESS) ========================');
    console.log('========================================================================\n');

    return NextResponse.json({ message: 'Token refreshed' }, { status: 200 });
  } catch (error) {
    console.error('💥 ======================== API ROUTE: /auth/refresh EXCEPTION ========================');
    console.error('❌ Error:', error);
    console.error('❌ Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    console.log('========================================================================\n');
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
