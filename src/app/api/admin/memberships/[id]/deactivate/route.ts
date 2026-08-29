import { NextRequest, NextResponse } from 'next/server';
import { backendFetch } from '@/lib/auth/server';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const backendUrl = `/api/admin/memberships/${id}/deactivate`;
    const response = await backendFetch(backendUrl, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Failed to deactivate membership' }));
      return NextResponse.json(
        { message: error.message || 'Failed to deactivate membership' },
        { status: response.status }
      );
    }
    return NextResponse.json({ message: 'Membership deactivated successfully' }, { status: 200 });

  } catch (error) {
    console.error('Membership deactivation error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
