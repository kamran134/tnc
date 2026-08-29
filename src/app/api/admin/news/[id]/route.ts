import { NextRequest, NextResponse } from 'next/server';
import { backendFetch } from '@/lib/auth/server';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    // Проксируем запрос к Java бэкенду
    const response = await backendFetch(`/api/admin/news/${id}`, {
      method: 'GET',
      headers: {
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

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();

    // Проксируем запрос к Java бэкенду
    const response = await backendFetch(`/api/admin/news/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      let errorMessage = 'Failed to update news';

      try {
        const error = await response.text();
        console.error('Backend error response:', error);

        // Проверяем специфические ошибки кеша
        if (error.includes('Cannot find cache named')) {
          errorMessage = 'Server cache configuration issue. Please contact administrator.';
        } else if (error.includes('publishedNewsPages')) {
          errorMessage = 'Cache service unavailable. Please try again later.';
        } else {
          try {
            const jsonError = JSON.parse(error);
            errorMessage = jsonError.message || errorMessage;
          } catch {
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
    return NextResponse.json(data, { status: 200 });

  } catch (error) {
    console.error('News update error:', error);
    return NextResponse.json(
      { message: 'Network error or server unavailable' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    // Проксируем запрос к Java бэкенду
    const response = await backendFetch(`/api/admin/news/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Failed to delete news' }));
      return NextResponse.json(
        { message: error.message || 'Failed to delete news' },
        { status: response.status }
      );
    }

    return NextResponse.json({}, { status: 204 });

  } catch (error) {
    console.error('News delete error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}