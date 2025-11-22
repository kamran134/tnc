import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8080';

export async function POST(request: NextRequest) {
  try {
    // Получаем токен из cookies
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('access_token')?.value;

    if (!accessToken) {
      return NextResponse.json(
        { message: 'Not authenticated' },
        { status: 401 }
      );
    }

    // Получаем FormData из запроса
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const fileType = formData.get('fileType') as string;
    const description = formData.get('description') as string;

    if (!file) {
      return NextResponse.json(
        { message: 'No file provided' },
        { status: 400 }
      );
    }

    if (!fileType) {
      return NextResponse.json(
        { message: 'File type is required' },
        { status: 400 }
      );
    }

    // Проверяем тип файла
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { message: 'Invalid file type. Only JPG, PNG, GIF, and WEBP images are allowed.' },
        { status: 400 }
      );
    }

    // Проверяем размер файла (максимум 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { message: 'File too large. Maximum size is 5MB.' },
        { status: 400 }
      );
    }

    // Создаем FormData для отправки на бекенд
    const backendFormData = new FormData();
    backendFormData.append('file', file);

    // Создаем URL с параметрами
    const url = new URL(`${BACKEND_URL}/api/admin/files/upload`);
    url.searchParams.append('fileType', fileType);
    if (description) {
      url.searchParams.append('description', description);
    }

    console.log('Uploading file:', {
      name: file.name,
      size: file.size,
      type: file.type,
      fileType,
      description
    });

    // Отправляем файл на бекенд
    const response = await fetch(url.toString(), {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
      body: backendFormData,
    });

    if (!response.ok) {
      let errorMessage = 'Failed to upload file';
      
      try {
        const error = await response.text();
        console.error('Backend upload error:', error);
        
        if (error.includes('virus') || error.includes('malware')) {
          errorMessage = 'File rejected by security scan. Please try a different file.';
        } else if (error.includes('size') || error.includes('large')) {
          errorMessage = 'File is too large. Please use a smaller image.';
        } else if (error.includes('type') || error.includes('format')) {
          errorMessage = 'Invalid file format. Please use JPG, PNG, GIF, or WEBP images.';
        } else {
          try {
            const jsonError = JSON.parse(error);
            errorMessage = jsonError.message || errorMessage;
          } catch {
            errorMessage = error.length > 100 ? 'Upload error occurred' : error;
          }
        }
      } catch {
        errorMessage = `Upload failed (HTTP ${response.status})`;
      }
      
      return NextResponse.json(
        { message: errorMessage },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log('File uploaded successfully:', data.id, data.fileName);
    return NextResponse.json(data, { status: 201 });

  } catch (error) {
    console.error('File upload error:', error);
    return NextResponse.json(
      { message: 'Network error or server unavailable' },
      { status: 500 }
    );
  }
}
