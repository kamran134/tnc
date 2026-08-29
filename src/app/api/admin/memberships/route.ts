import { NextRequest, NextResponse } from 'next/server';
import { backendFetch } from '@/lib/auth/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const params = new URLSearchParams(searchParams);

    // Проксируем запрос к Java бэкенду
    const backendUrl = `/api/admin/memberships?${params}`;
    const response = await backendFetch(backendUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Failed to fetch memberships' }));
      return NextResponse.json(
        { message: error.message || 'Failed to fetch memberships' },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data, { status: 200 });

  } catch (error) {
    console.error('Memberships fetch error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Check if this is a reorder request
    if (request.url.includes('/reorder')) {
      const backendUrl = `/api/admin/memberships/reorder`;
      const response = await backendFetch(backendUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });
      if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'Failed to reorder memberships' }));
        return NextResponse.json(
          { message: error.message || 'Failed to reorder memberships' },
          { status: response.status }
        );
      }
      return NextResponse.json({ message: 'Memberships reordered successfully' }, { status: 200 });
    }

    // Regular POST (create)
    const backendUrl = `/api/admin/memberships`;
    const response = await backendFetch(backendUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Failed to create membership' }));
      return NextResponse.json(
        { message: error.message || 'Failed to create membership' },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data, { status: 201 });

  } catch (error) {
    console.error('Membership creation error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
