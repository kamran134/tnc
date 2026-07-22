import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.BACKEND_URL || 'http://localhost:8080';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const searchParams = request.nextUrl.searchParams;
    const lang = searchParams.get('lang') || 'az';

    const response = await fetch(
      `${API_BASE_URL}/api/careers/id/${id}?lang=${lang}`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
        next: { revalidate: 60 },
      }
    );

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json(
          { error: 'Career posting not found' },
          { status: 404 }
        );
      }
      throw new Error(`API responded with status ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching career by ID:', error);
    return NextResponse.json(
      { error: 'Failed to fetch career posting' },
      { status: 500 }
    );
  }
}
