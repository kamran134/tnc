import { NextRequest, NextResponse } from 'next/server';
import { backendFetch } from '@/lib/auth/server';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    // Проксируем запрос к Java бэкенду
    const response = await backendFetch(`/api/admin/services/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Failed to fetch service' }));
      return NextResponse.json(
        { message: error.message || 'Failed to fetch service' },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data, { status: 200 });

  } catch (error) {
    console.error('Service fetch error:', error);
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
    const response = await backendFetch(`/api/admin/services/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      let errorMessage = 'Failed to update service';

      try {
        const error = await response.text();
        console.error('Backend error response:', error);

        try {
          const jsonError = JSON.parse(error);
          errorMessage = jsonError.message || errorMessage;
        } catch {
          errorMessage = error.length > 100 ? 'Server error occurred' : error;
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
    console.error('Service update error:', error);
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
    const response = await backendFetch(`/api/admin/services/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Failed to delete service' }));
      return NextResponse.json(
        { message: error.message || 'Failed to delete service' },
        { status: response.status }
      );
    }

    return new NextResponse(null, { status: 204 });

  } catch (error) {
    console.error('Service delete error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}