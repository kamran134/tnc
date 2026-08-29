import { NextRequest, NextResponse } from 'next/server';
import { backendFetch } from '@/lib/auth/server';

export async function GET(request: NextRequest, { params }: { params: Promise<{ pageTag: string }> }) {
  try {
    const { pageTag } = await params;

    const response = await backendFetch(`/api/admin/page-hero/tag/${pageTag}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Failed to fetch page hero' }));
      return NextResponse.json(
        { message: error.message || 'Failed to fetch page hero' },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data, { status: 200 });

  } catch (error) {
    console.error('Page hero fetch error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
