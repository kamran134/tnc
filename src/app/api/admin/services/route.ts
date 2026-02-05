import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8080';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const params = new URLSearchParams(searchParams);

    // Получаем токен из cookies
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('access_token')?.value;

    console.log('🔐 [Admin Services API] Request received');
    console.log('🍪 Access token from cookies:', accessToken ? `EXISTS (${accessToken.substring(0, 20)}...)` : '❌ MISSING');

    if (!accessToken) {
      console.log('❌ No access token - returning 401');
      return NextResponse.json(
        { message: 'Not authenticated' },
        { status: 401 }
      );
    }

    // Проксируем запрос к Java бэкенду
    const backendUrl = `${BACKEND_URL}/api/admin/services?${params}`;
    console.log('🚀 Proxying to backend:', backendUrl);
    
    const response = await fetch(backendUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    console.log('📥 Backend response status:', response.status);

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Failed to fetch services' }));
      console.log('❌ Backend returned error:', error);
      return NextResponse.json(
        { message: error.message || 'Failed to fetch services' },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log('✅ Services fetched successfully');
    console.log('📊 Raw data structure:', data);
    console.log('📊 Data has page object:', !!data.page);
    
    // Если данные приходят в формате {content, page}, нужно преобразовать в Spring Page формат
    if (data.page && !data.totalElements) {
      console.log('🔄 Transforming data structure from {content, page} to Spring Page format');
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
      console.log('✅ Transformed data:', transformedData);
      return NextResponse.json(transformedData, { status: 200 });
    }
    
    console.log('📊 Data structure:', {
      totalElements: data.totalElements,
      totalPages: data.totalPages,
      size: data.size,
      number: data.number,
      contentLength: data.content?.length || 0
    });
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
    
    // Получаем токен из cookies
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('access_token')?.value;

    if (!accessToken) {
      return NextResponse.json(
        { message: 'Not authenticated' },
        { status: 401 }
      );
    }
    
    // Проксируем запрос к Java бэкенду
    const response = await fetch(`${BACKEND_URL}/api/admin/services`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
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
