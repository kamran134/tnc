import { NextRequest, NextResponse } from 'next/server';
import { backendFetch } from '@/lib/auth/server';

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = await params;

    const backendUrl = `/api/admin/team/${id}`;

    const response = await backendFetch(backendUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Team member not found' }));
      return NextResponse.json(
        { message: error.message || 'Team member not found' },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data, { status: 200 });

  } catch (error) {
    console.error('Team member fetch error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const backendUrl = `/api/admin/team/${id}`;

    const response = await backendFetch(backendUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Failed to update team member' }));
      return NextResponse.json(
        { message: error.message || 'Failed to update team member' },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data, { status: 200 });

  } catch (error) {
    console.error('Team member update error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = await params;

    const backendUrl = `/api/admin/team/${id}`;

    const response = await backendFetch(backendUrl, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Failed to delete team member' }));
      return NextResponse.json(
        { message: error.message || 'Failed to delete team member' },
        { status: response.status }
      );
    }

    return NextResponse.json({ message: 'Team member deleted successfully' }, { status: 200 });

  } catch (error) {
    console.error('Team member deletion error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = await params;
    const url = new URL(request.url);
    const action = url.pathname.split('/').pop(); // 'activate' or 'deactivate'

    const backendUrl = `/api/admin/team/${id}/${action}`;

    const response = await backendFetch(backendUrl, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: `Failed to ${action} team member` }));
      return NextResponse.json(
        { message: error.message || `Failed to ${action} team member` },
        { status: response.status }
      );
    }

    return NextResponse.json({ message: `Team member ${action}d successfully` }, { status: 200 });

  } catch (error) {
    console.error('Team member status change error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
