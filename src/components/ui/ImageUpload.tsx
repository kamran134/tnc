'use client';
import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';

interface ImageUploadProps {
  value?: string; // URL текущего изображения
  onChange: (imageUrl: string, fileId?: number) => void;
  fileType: 'NEWS_IMAGE' | 'SERVICE_IMAGE' | 'CAREER_IMAGE' | 'COMPANY_LOGO' | 'USER_AVATAR';
  label: string;
  description?: string;
  required?: boolean;
  className?: string;
}

export default function ImageUpload({
  value,
  onChange,
  fileType,
  label,
  description,
  required = false,
  className = ''
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState<string>(value || '');
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Синхронизируем preview с внешним value
  useEffect(() => {
    setPreview(value || '');
  }, [value]);

  const handleFileSelect = async (file: File) => {
    if (!file) return;

    // Проверяем тип файла
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      alert('Invalid file type. Only JPG, PNG, GIF, and WEBP images are allowed.');
      return;
    }

    // Проверяем размер файла (максимум 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      alert('File too large. Maximum size is 5MB.');
      return;
    }

    // Создаем превью
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setPreview(e.target.result as string);
      }
    };
    reader.readAsDataURL(file);

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('fileType', fileType);
      if (description) {
        formData.append('description', description);
      }

      const response = await fetch('/api/admin/files/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        console.log('File uploaded:', data);
        
        // Конвертируем бэкенд URL для nginx
        // Бэкенд возвращает: http://localhost:8080/api/files/news_image/filename.jpg
        // Nginx раздаёт из: /uploads/news_image/filename.jpg
        let imageUrl = data.fileUrl;
        if (imageUrl) {
          // Удаляем базовый URL и заменяем /api/files/ на /uploads/
          imageUrl = imageUrl.replace(/^https?:\/\/[^\/]+/, '').replace('/api/files/', '/uploads/');
        }
        
        onChange(imageUrl, data.id);
      } else {
        const error = await response.json();
        console.error('Upload failed:', error);
        alert('Upload failed: ' + (error.message || 'Unknown error'));
        setPreview(value || '');
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Upload error. Please try again.');
      setPreview(value || '');
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragIn = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragOut = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleFileSelect(files[0]);
    }
  };

  const handleClick = () => {
    if (!isUploading) {
      fileInputRef.current?.click();
    }
  };

  const handleRemove = () => {
    setPreview('');
    onChange('', undefined);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <label className="block text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      
      <div className="space-y-4">
        {/* Upload Area */}
        <div
          onClick={handleClick}
          onDragEnter={handleDragIn}
          onDragLeave={handleDragOut}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={`
            relative border-2 border-dashed rounded-lg p-6 transition-colors cursor-pointer
            ${dragActive 
              ? 'border-blue-500 bg-blue-50' 
              : 'border-gray-300 hover:border-gray-400'
            }
            ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}
          `}
        >
          {isUploading ? (
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
              <p className="text-sm text-gray-600">Uploading...</p>
            </div>
          ) : (
            <div className="text-center">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 48 48"
              >
                <path
                  d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <div className="mt-2">
                <p className="text-sm text-gray-600">
                  Click to upload or drag and drop
                </p>
                <p className="text-xs text-gray-500">
                  PNG, JPG, GIF, WEBP up to 5MB
                </p>
              </div>
            </div>
          )}
          
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileInputChange}
            className="hidden"
            disabled={isUploading}
          />
        </div>

        {/* Preview */}
        {preview && (
          <div className="space-y-2">
            <div className="relative inline-block">
              <Image
                src={preview}
                alt="Preview"
                width={300}
                height={200}
                className="max-w-full max-h-48 rounded-lg border border-gray-200 object-contain"
                unoptimized
              />
              <button
                type="button"
                onClick={handleRemove}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
              >
                ×
              </button>
            </div>
            <p className="text-xs text-gray-500">
              Click the × button to remove the image
            </p>
          </div>
        )}
      </div>
    </div>
  );
}