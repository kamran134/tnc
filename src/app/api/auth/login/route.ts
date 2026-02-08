import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8080';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const backendResponse = await fetch(`${BACKEND_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!backendResponse.ok) {
      const error = await backendResponse.json().catch(() => ({ message: 'Login failed' }));
      return NextResponse.json(
        { message: error.message || 'Invalid credentials' },
        { status: backendResponse.status }
      );
    }

    const data = await backendResponse.json();
    const nextResponse = NextResponse.json(data, { status: 200 });
    
    const isSecure = process.env.NODE_ENV === 'production';
    
    // expiresIn приходит в миллисекундах, конвертируем в секунды для cookie maxAge
    const accessTokenMaxAge = data.expiresIn ? Math.floor(data.expiresIn / 1000) : 3600; // 1 час по дефолту
    const refreshTokenMaxAge = 60 * 60 * 24 * 30; // 30 дней
    
    nextResponse.cookies.set('access_token', data.accessToken, {
      httpOnly: true, // Всегда httpOnly для безопасности
      secure: isSecure,
      sameSite: 'lax',
      maxAge: accessTokenMaxAge,
      path: '/',
    });

    nextResponse.cookies.set('refresh_token', data.refreshToken, {
      httpOnly: true, // Всегда httpOnly для безопасности
      secure: isSecure,
      sameSite: 'lax',
      maxAge: refreshTokenMaxAge,
      path: '/',
    });

    return nextResponse;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
