import { NextRequest, NextResponse } from 'next/server';
import { backendFetch } from '@/lib/auth/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const params = new URLSearchParams(searchParams);

    // Проксируем запрос к Java бэкенду
    const backendUrl = `/api/admin/services?${params}`;

    const response = await backendFetch(backendUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Failed to fetch services' }));
      return NextResponse.json(
        { message: error.message || 'Failed to fetch services' },
        { status: response.status }
      );
    }

    const data = await response.json();

    // Если данные приходят в формате {content, page}, нужно преобразовать в Spring Page формат
    if (data.page && !data.totalElements) {
      const transformedData = {
        content: data.content,
        totalElements: data.page.totalElements,
        totalPages: data.page.totalPages,
        size: data.page.size,
        number: data.page.number,
        numberOfElements: data.page.numberOfElements || data.content?.length || 0,
        first: data.page.first,
        last: data.page.last,
        empty: data.page.empty,
        sort: data.page.sort || [],
        pageable: data.page.pageable || {}
      };
      return NextResponse.json(transformedData, { status: 200 });
    }

    return NextResponse.json(data, { status: 200 });

  } catch (error) {
    console.error('Services fetch error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Проксируем запрос к Java бэкенду
    const response = await backendFetch(`/api/admin/services`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Failed to create service' }));
      return NextResponse.json(
        { message: error.message || 'Failed to create service' },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data, { status: 201 });

  } catch (error) {
    console.error('Service creation error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
