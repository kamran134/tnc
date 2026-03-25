import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8080';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // Получаем токен из cookies
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('access_token')?.value;
    if (!accessToken) {
      return NextResponse.json(
        { message: 'Not authenticated' },
        { status: 401 }
      );
    }

    const backendUrl = `${BACKEND_URL}/api/admin/memberships/${id}/activate`;
    const response = await fetch(backendUrl, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Failed to activate membership' }));
      return NextResponse.json(
        { message: error.message || 'Failed to activate membership' },
        { status: response.status }
      );
    }
    return NextResponse.json({ message: 'Membership activated successfully' }, { status: 200 });

  } catch (error) {
    console.error('Membership activation error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
