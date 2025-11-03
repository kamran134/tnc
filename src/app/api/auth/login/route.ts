import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'https://tnc.az';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    console.log('🔐 Login request received');
    console.log('Backend URL:', BACKEND_URL);
    
    // Проксируем запрос к Java бэкенду согласно Swagger: /api/auth/login
    const response = await fetch(`${BACKEND_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    console.log('Backend response status:', response.status);

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Login failed' }));
      console.error('Login failed:', error);
      return NextResponse.json(
        { message: error.message || 'Invalid credentials' },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log('✅ Login successful from backend');
    console.log('📦 Response data keys:', Object.keys(data));
    console.log('🔑 Has accessToken:', !!data.accessToken);
    console.log('🔑 Has refreshToken:', !!data.refreshToken);
    console.log('🔑 Access token length:', data.accessToken?.length);
    console.log('🔑 Refresh token length:', data.refreshToken?.length);

    // Создаем NextResponse и устанавливаем HTTP-only cookies
    const nextResponse = NextResponse.json(data, { status: 200 });
    
    // В development всегда используем secure: false для localhost
    const isSecure = process.env.NODE_ENV === 'production';
    
    console.log('🍪 Setting cookies with secure:', isSecure);
    console.log('🍪 NODE_ENV:', process.env.NODE_ENV);
    
    // В development НЕ используем httpOnly чтобы можно было проверить в devtools
    const useHttpOnly = process.env.NODE_ENV === 'production';
    console.log('🍪 Using httpOnly:', useHttpOnly);
    
    nextResponse.cookies.set('access_token', data.accessToken, {
      httpOnly: useHttpOnly,
      secure: isSecure,
      sameSite: 'lax',
      maxAge: data.expiresIn || 86400,
      path: '/',
    });

    nextResponse.cookies.set('refresh_token', data.refreshToken, {
      httpOnly: useHttpOnly,
      secure: isSecure,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    });

    console.log('✅ Cookies set in response');
    console.log('🍪 Response cookies:', nextResponse.cookies.getAll().map(c => c.name));
    console.log('📤 Sending response to client\n');

    return nextResponse;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
