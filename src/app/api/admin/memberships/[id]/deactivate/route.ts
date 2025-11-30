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

    console.log(`🔐 [Admin Membership Deactivate API] PATCH request for ID: ${id}`);
    console.log('🍪 Access token from cookies:', accessToken ? `EXISTS (${accessToken.substring(0, 20)}...)` : '❌ MISSING');

    if (!accessToken) {
      console.log('❌ No access token - returning 401');
      return NextResponse.json(
        { message: 'Not authenticated' },
        { status: 401 }
      );
    }

    const backendUrl = `${BACKEND_URL}/api/admin/memberships/${id}/deactivate`;
    console.log('🚀 Proxying to backend:', backendUrl);
    
    const response = await fetch(backendUrl, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    console.log('📥 Backend response status:', response.status);

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Failed to deactivate membership' }));
      console.log('❌ Backend returned error:', error);
      return NextResponse.json(
        { message: error.message || 'Failed to deactivate membership' },
        { status: response.status }
      );
    }

    console.log('✅ Membership deactivated successfully');
    return NextResponse.json({ message: 'Membership deactivated successfully' }, { status: 200 });

  } catch (error) {
    console.error('Membership deactivation error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
