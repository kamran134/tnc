import { NextRequest, NextResponse } from 'next/server';
import { backendFetch } from '@/lib/auth/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const response = await backendFetch(`/api/admin/about-sections/reorder`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Failed to reorder about sections' }));
      return NextResponse.json({ message: error.message || 'Failed to reorder about sections' }, { status: response.status });
    }

    return new NextResponse(null, { status: 200 });
  } catch (error) {
    console.error('About sections reorder error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
