import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'https://tnc.az';

export async function POST(request: NextRequest) {
  console.log('========================================================================');
  console.log('🔐 ======================== API ROUTE: LOGIN START ========================');
  console.log('⏰ Time:', new Date().toISOString());
  console.log('🌐 Backend URL:', BACKEND_URL);
  console.log('🔍 Request URL:', request.url);
  console.log('🔍 Request Method:', request.method);
  console.log('📋 Request Headers:', JSON.stringify(Object.fromEntries(request.headers.entries()), null, 2));
  
  try {
    const body = await request.json();
    console.log('� Request Body:', JSON.stringify(body, null, 2));
    
    console.log('🚀 Forwarding request to backend:', `${BACKEND_URL}/api/auth/login`);
    
    // Проксируем запрос к Java бэкенду согласно Swagger: /api/auth/login
    const backendResponse = await fetch(`${BACKEND_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    console.log('📥 Backend response status:', backendResponse.status, backendResponse.statusText);
    console.log('📋 Backend response headers:', JSON.stringify(Object.fromEntries(backendResponse.headers.entries()), null, 2));

    if (!backendResponse.ok) {
      const error = await backendResponse.json().catch(() => ({ message: 'Login failed' }));
      console.error('❌ Login failed from backend:', error);
      console.log('🔐 ======================== API ROUTE: LOGIN ERROR ========================');
      console.log('========================================================================\n');
      return NextResponse.json(
        { message: error.message || 'Invalid credentials' },
        { status: backendResponse.status }
      );
    }

    const data = await backendResponse.json();
    console.log('✅ Login successful from backend!');
    console.log('📦 Response data:', JSON.stringify(data, null, 2));
    console.log('🔑 Access Token:', data.accessToken ? `EXISTS (${data.accessToken.substring(0, 30)}...)` : '❌ MISSING');
    console.log('🔑 Refresh Token:', data.refreshToken ? `EXISTS (${data.refreshToken.substring(0, 30)}...)` : '❌ MISSING');
    console.log('⏱️ Expires In:', data.expiresIn);

    // Создаем NextResponse и устанавливаем HTTP-only cookies
    const nextResponse = NextResponse.json(data, { status: 200 });
    
    // В development всегда используем secure: false для localhost
    const isSecure = process.env.NODE_ENV === 'production';
    
    // В development НЕ используем httpOnly чтобы можно было проверить в devtools
    const useHttpOnly = process.env.NODE_ENV === 'production';
    
    console.log('🍪 ======================== SETTING COOKIES ========================');
    console.log('🍪 NODE_ENV:', process.env.NODE_ENV);
    console.log('🍪 Secure flag:', isSecure);
    console.log('🍪 HttpOnly flag:', useHttpOnly);
    console.log('🍪 SameSite:', 'lax');
    console.log('🍪 Domain: NOT SET (will use current domain)');
    console.log('🍪 Path: /');
    
    const accessTokenMaxAge = data.expiresIn || 86400;
    const refreshTokenMaxAge = 60 * 60 * 24 * 7;
    
    console.log('🍪 Access Token MaxAge:', accessTokenMaxAge, 'seconds');
    console.log('🍪 Refresh Token MaxAge:', refreshTokenMaxAge, 'seconds');
    
    nextResponse.cookies.set('access_token', data.accessToken, {
      httpOnly: useHttpOnly,
      secure: isSecure,
      sameSite: 'lax',
      maxAge: accessTokenMaxAge,
      path: '/',
    });
    console.log('✅ access_token cookie set');

    nextResponse.cookies.set('refresh_token', data.refreshToken, {
      httpOnly: useHttpOnly,
      secure: isSecure,
      sameSite: 'lax',
      maxAge: refreshTokenMaxAge,
      path: '/',
    });
    console.log('✅ refresh_token cookie set');

    const responseCookies = nextResponse.cookies.getAll();
    console.log('🍪 All response cookies:');
    responseCookies.forEach(cookie => {
      console.log(`   - ${cookie.name}: ${cookie.value.substring(0, 30)}...`);
    });
    
    console.log('✅ Cookies configured successfully');
    console.log('📤 Sending response to client');
    console.log('🔐 ======================== API ROUTE: LOGIN SUCCESS ========================');
    console.log('========================================================================\n');

    return nextResponse;
  } catch (error) {
    console.error('💥 ======================== API ROUTE: LOGIN EXCEPTION ========================');
    console.error('❌ Error:', error);
    console.error('❌ Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    console.log('========================================================================\n');
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
