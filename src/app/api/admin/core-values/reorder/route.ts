import { NextRequest, NextResponse } from 'next/server';
import { backendFetch } from '@/lib/auth/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const backendUrl = `/api/admin/core-values/reorder`;
    const response = await backendFetch(backendUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Failed to reorder core values' }));
      return NextResponse.json(
        { message: error.message || 'Failed to reorder core values' },
        { status: response.status }
      );
    }
    return NextResponse.json({ message: 'Core values reordered successfully' }, { status: 200 });

  } catch (error) {
    console.error('Core values reorder error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
