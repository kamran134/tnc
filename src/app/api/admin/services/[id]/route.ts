import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8080';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
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

    // Проксируем запрос к Java бэкенду
    const response = await fetch(`${BACKEND_URL}/api/admin/services/${id}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Failed to fetch service' }));
      return NextResponse.json(
        { message: error.message || 'Failed to fetch service' },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data, { status: 200 });

  } catch (error) {
    console.error('Service fetch error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
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
    
    console.log('Updating service with data:', JSON.stringify(body, null, 2));
    
    // Проксируем запрос к Java бэкенду
    const response = await fetch(`${BACKEND_URL}/api/admin/services/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      let errorMessage = 'Failed to update service';
      
      try {
        const error = await response.text();
        console.error('Backend error response:', error);
        
        try {
          const jsonError = JSON.parse(error);
          errorMessage = jsonError.message || errorMessage;
        } catch {
          errorMessage = error.length > 100 ? 'Server error occurred' : error;
        }
      } catch {
        errorMessage = `Server error (HTTP ${response.status})`;
      }
      
      return NextResponse.json(
        { message: errorMessage },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log('Service updated successfully:', data.id);
    return NextResponse.json(data, { status: 200 });

  } catch (error) {
    console.error('Service update error:', error);
    return NextResponse.json(
      { message: 'Network error or server unavailable' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
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

    // Проксируем запрос к Java бэкенду
    const response = await fetch(`${BACKEND_URL}/api/admin/services/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Failed to delete service' }));
      return NextResponse.json(
        { message: error.message || 'Failed to delete service' },
        { status: response.status }
      );
    }

    return NextResponse.json({}, { status: 204 });

  } catch (error) {
    console.error('Service delete error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}