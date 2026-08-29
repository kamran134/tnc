import { NextRequest, NextResponse } from 'next/server';
import { backendFetch } from '@/lib/auth/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const backendUrl = `/api/admin/team/reorder`;

    const response = await backendFetch(backendUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Failed to reorder team members' }));
      return NextResponse.json(
        { message: error.message || 'Failed to reorder team members' },
        { status: response.status }
      );
    }

    return NextResponse.json({ message: 'Team members reordered successfully' }, { status: 200 });

  } catch (error) {
    console.error('Team members reorder error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
