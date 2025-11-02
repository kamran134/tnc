import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8080';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Проксируем запрос к Java бэкенду согласно Swagger: /api/auth/login
    const response = await fetch(`${BACKEND_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Login failed' }));
      return NextResponse.json(
        { message: error.message || 'Invalid credentials' },
        { status: response.status }
      );
    }

    const data = await response.json();

    console.log('=== LOGIN DEBUG ===');
    console.log('Request URL:', request.url);
    console.log('NODE_ENV:', process.env.NODE_ENV);
    console.log('X-Forwarded-Proto:', request.headers.get('x-forwarded-proto'));
    console.log('Host:', request.headers.get('host'));

    // Создаем NextResponse и устанавливаем HTTP-only cookies
    const nextResponse = NextResponse.json(data.user, { status: 200 });
    
    // Проверяем протокол из заголовков (для Nginx proxy) или из URL
    const forwardedProto = request.headers.get('x-forwarded-proto');
    const isSecure = forwardedProto === 'https' || request.url.startsWith('https://');
    
    console.log('Protocol from header:', forwardedProto);
    console.log('Protocol from URL:', request.url.split('://')[0]);
    console.log('Final isSecure:', isSecure);
    
    nextResponse.cookies.set('access_token', data.accessToken, {
      httpOnly: true,
      secure: isSecure,
      sameSite: 'lax',
      maxAge: data.expiresIn || 86400,
      path: '/',
    });

    nextResponse.cookies.set('refresh_token', data.refreshToken, {
      httpOnly: true,
      secure: isSecure,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    });

    console.log('✅ Cookies set successfully');
    console.log('Access token length:', data.accessToken?.length);
    console.log('Refresh token length:', data.refreshToken?.length);

    return nextResponse;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
