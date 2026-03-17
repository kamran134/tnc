import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8080';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const cookieStore = await cookies();
    const accessToken = cookieStore.get('access_token')?.value;

    if (!accessToken) {
      return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
    }

    const response = await fetch(`${BACKEND_URL}/api/admin/about-sections/reorder`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
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
