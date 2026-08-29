import { NextRequest, NextResponse } from 'next/server';
import { backendFetch } from '@/lib/auth/server';

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    // Проксируем запрос к Java бэкенду
    const response = await backendFetch(`/api/admin/news/${id}/publish`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Failed to publish news' }));
      return NextResponse.json(
        { message: error.message || 'Failed to publish news' },
        { status: response.status }
      );
    }

    return NextResponse.json({}, { status: 200 });

  } catch (error) {
    console.error('News publish error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
