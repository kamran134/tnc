import { NextRequest, NextResponse } from 'next/server';
import { backendFetch } from '@/lib/auth/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Проксируем запрос к Java бэкенду
    const response = await backendFetch(`/api/admin/service-categories/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Failed to fetch service category' }));
      return NextResponse.json(
        { message: error.message || 'Failed to fetch service category' },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data, { status: 200 });

  } catch (error) {
    console.error('Service category fetch error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    // Проксируем запрос к Java бэкенду
    const response = await backendFetch(`/api/admin/service-categories/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      let errorMessage = 'Failed to update service category';

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
    console.error('Service category update error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Проксируем запрос к Java бэкенду
    const response = await backendFetch(`/api/admin/service-categories/${id}`, {
      method: 'DELETE',
      headers: {
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Failed to delete service category' }));
      return NextResponse.json(
        { message: error.message || 'Failed to delete service category' },
        { status: response.status }
      );
    }

    return NextResponse.json({ success: true }, { status: 200 });

  } catch (error) {
    console.error('Service category deletion error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
