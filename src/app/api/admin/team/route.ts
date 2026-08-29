import { NextRequest, NextResponse } from 'next/server';
import { backendFetch } from '@/lib/auth/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const params = new URLSearchParams(searchParams);

    const backendUrl = `/api/admin/team?${params}`;

    const response = await backendFetch(backendUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Failed to fetch team members' }));
      return NextResponse.json(
        { message: error.message || 'Failed to fetch team members' },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data, { status: 200 });

  } catch (error) {
    console.error('Team members fetch error:', error);
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
    }

    // Regular POST (create)
    const backendUrl = `/api/admin/team`;

    const response = await backendFetch(backendUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Failed to create team member' }));
      return NextResponse.json(
        { message: error.message || 'Failed to create team member' },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data, { status: 201 });

  } catch (error) {
    console.error('Team member creation error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
