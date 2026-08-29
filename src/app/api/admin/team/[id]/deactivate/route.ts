import { NextRequest, NextResponse } from 'next/server';
import { backendFetch } from '@/lib/auth/server';

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

export async function PATCH(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = await params;

    const backendUrl = `/api/admin/team/${id}/deactivate`;

    const response = await backendFetch(backendUrl, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Failed to deactivate team member' }));
      return NextResponse.json(
        { message: error.message || 'Failed to deactivate team member' },
        { status: response.status }
      );
    }

    return NextResponse.json({ message: 'Team member deactivated successfully' }, { status: 200 });

  } catch (error) {
    console.error('Team member deactivation error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
