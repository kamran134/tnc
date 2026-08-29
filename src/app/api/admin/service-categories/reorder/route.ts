import { NextRequest, NextResponse } from 'next/server';
import { backendFetch } from '@/lib/auth/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const backendUrl = `/api/admin/service-categories/reorder`;

    const response = await backendFetch(backendUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Failed to reorder service categories' }));
      return NextResponse.json(
        { message: error.message || 'Failed to reorder service categories' },
        { status: response.status }
      );
    }

    return NextResponse.json({ message: 'Service categories reordered successfully' }, { status: 200 });

  } catch (error) {
    console.error('Service categories reorder error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
