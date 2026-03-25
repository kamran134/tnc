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

    if (!accessToken) {
      return NextResponse.json(
        { message: 'Not authenticated' },
        { status: 401 }
      );
    }

    // Проксируем запрос к Java бэкенду
    const response = await fetch(`${BACKEND_URL}/api/admin/news?${params}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Failed to fetch news' }));
      return NextResponse.json(
        { message: error.message || 'Failed to fetch news' },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data, { status: 200 });

  } catch (error) {
    console.error('News fetch error:', error);
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

    if (!accessToken) {
      return NextResponse.json(
        { message: 'Not authenticated' },
        { status: 401 }
      );
    }
    
    // Проксируем запрос к Java бэкенду
    const response = await fetch(`${BACKEND_URL}/api/admin/news`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      let errorMessage = 'Failed to create news';
      
      try {
        const error = await response.text();
        console.error('Backend error response:', error);
        
        // Проверяем специфические ошибки кеша
        if (error.includes('Cannot find cache named')) {
          errorMessage = 'Server cache configuration issue. Please contact administrator.';
        } else if (error.includes('publishedNewsPages')) {
          errorMessage = 'Cache service unavailable. Please try again later.';
        } else {
          // Пытаемся парсить как JSON
          try {
            const jsonError = JSON.parse(error);
            errorMessage = jsonError.message || errorMessage;
          } catch {
            // Если не JSON, используем текст как есть
            errorMessage = error.length > 100 ? 'Server error occurred' : error;
          }
        }
      } catch {
        errorMessage = `Server error (HTTP ${response.status})`;
      }
      
      return NextResponse.json(
        { message: errorMessage },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data, { status: 201 });

  } catch (error) {
    console.error('News creation error:', error);
    return NextResponse.json(
      { message: 'Network error or server unavailable' },
      { status: 500 }
    );
  }
}
