import { NextRequest, NextResponse } from 'next/server';
import { backendFetch } from '@/lib/auth/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const backendUrl = `/api/admin/memberships/${id}`;
    const response = await backendFetch(backendUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Failed to fetch membership' }));
      return NextResponse.json(
        { message: error.message || 'Failed to fetch membership' },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data, { status: 200 });

  } catch (error) {
    console.error('Membership fetch error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const backendUrl = `/api/admin/memberships/${id}`;
    const response = await backendFetch(backendUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Failed to update membership' }));
      return NextResponse.json(
        { message: error.message || 'Failed to update membership' },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data, { status: 200 });

  } catch (error) {
    console.error('Membership update error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const backendUrl = `/api/admin/memberships/${id}`;
    const response = await backendFetch(backendUrl, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Failed to delete membership' }));
      return NextResponse.json(
        { message: error.message || 'Failed to delete membership' },
        { status: response.status }
      );
    }
    return NextResponse.json({ message: 'Membership deleted successfully' }, { status: 200 });

  } catch (error) {
    console.error('Membership deletion error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const url = new URL(request.url);
    const action = url.pathname.split('/').pop(); // activate or deactivate

    const backendUrl = `/api/admin/memberships/${id}/${action}`;
    const response = await backendFetch(backendUrl, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: `Failed to ${action} membership` }));
      return NextResponse.json(
        { message: error.message || `Failed to ${action} membership` },
        { status: response.status }
      );
    }
    return NextResponse.json({ message: `Membership ${action}d successfully` }, { status: 200 });

  } catch (error) {
    console.error('Membership PATCH error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
