import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8080';

export async function POST(request: NextRequest) {
  console.log('========================================================================');
  console.log('🚪 ======================== API ROUTE: /auth/logout START ========================');
  console.log('⏰ Server Time:', new Date().toISOString());
  console.log('🌐 Backend URL:', BACKEND_URL);
  console.log('🔍 Request URL:', request.url);
  console.log('🔍 Request Method:', request.method);
  
  try {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get('refresh_token')?.value;
    
    console.log('🍪 Reading cookies from request...');
    const allCookies = cookieStore.getAll();
    console.log('🍪 All cookies:', allCookies.map(c => `${c.name}=${c.value.substring(0, 20)}...`));
    console.log('🔑 Refresh Token:', refreshToken ? `EXISTS (${refreshToken.substring(0, 30)}...)` : '❌ MISSING');

    // Если есть refresh token, пытаемся сделать logout на бэкенде согласно Swagger
    if (refreshToken) {
      console.log('🚀 Forwarding logout request to backend:', `${BACKEND_URL}/auth/logout`);
      console.log('📦 Request body:', JSON.stringify({ refreshToken: refreshToken.substring(0, 30) + '...' }));
      
      try {
        const response = await fetch(`${BACKEND_URL}/auth/logout`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ refreshToken }),
        });
        
        console.log('📥 Backend response status:', response.status, response.statusText);
        
        if (response.ok) {
          console.log('✅ Backend logout successful');
        } else {
          console.log('⚠️ Backend logout returned error but continuing...');
        }
      } catch (error) {
        console.error('⚠️ Backend logout error (continuing anyway):', error);
        // Продолжаем даже если бэкенд недоступен
      }
    } else {
      console.log('⚠️ No refresh token - skipping backend logout');
    }

    console.log('🗑️ Deleting cookies...');
    // Удаляем cookies
    cookieStore.delete('access_token');
    cookieStore.delete('refresh_token');
    console.log('✅ Cookies deleted');
    
    console.log('🚪 ======================== API ROUTE: /auth/logout END (SUCCESS) ========================');
    console.log('========================================================================\n');

    return NextResponse.json({ message: 'Logged out successfully' }, { status: 200 });
  } catch (error) {
    console.error('💥 ======================== API ROUTE: /auth/logout EXCEPTION ========================');
    console.error('❌ Error:', error);
    console.error('❌ Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    console.log('========================================================================\n');
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
