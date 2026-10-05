import { NextRequest, NextResponse } from 'next/server';
import { backendFetch } from '@/lib/auth/server';

export async function GET(request: NextRequest) {
  try {
    const rawDays = request.nextUrl.searchParams.get('days') ?? '';
    const days = /^\d{1,3}$/.test(rawDays) ? rawDays : '30';

    // Проксируем запрос к Java бэкенду
    const response = await backendFetch(`/api/admin/dashboard/traffic?days=${days}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Failed to fetch traffic analytics' }));
      return NextResponse.json(
        { message: error.message || 'Failed to fetch traffic analytics' },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data, { status: 200 });

  } catch (error) {
    console.error('❌ Dashboard traffic error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
