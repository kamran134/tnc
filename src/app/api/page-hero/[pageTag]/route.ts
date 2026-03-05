import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8080';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ pageTag: string }> }
) {
  try {
    const { pageTag } = await params;
    const { searchParams } = new URL(request.url);
    const lang = searchParams.get('lang') || 'en';

    const response = await fetch(
      `${BACKEND_URL}/api/page-hero/${pageTag}?lang=${lang}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-store',
      }
    );

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch page hero' },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching page hero:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
