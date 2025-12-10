'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ImageUpload, useToast } from '@/components/ui';
import { removeEmptyFields } from '@/lib/utils/cleanup';
import LanguageTabs from '@/components/admin/LanguageTabs';

interface Translation {
  languageCode: string;
  title: string;
  content: string;
  excerpt: string;
}

export default function EditServicePage() {
  const router = useRouter();
  const params = useParams();
  const serviceId = params.id as string;
  const toast = useToast();
  
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [formData, setFormData] = useState({
    category: '',
    iconUrl: '',
    sortOrder: 0,
    active: true,
    translations: [
      { languageCode: 'az', title: '', content: '', excerpt: '' },
      { languageCode: 'en', title: '', content: '', excerpt: '' },
      { languageCode: 'ru', title: '', content: '', excerpt: '' },
    ] as Translation[]
  });

  // Load service data
  useEffect(() => {
    const loadService = async () => {
      try {
        setIsLoadingData(true);
        const response = await fetch(`/api/admin/services/${serviceId}`);
        
        if (response.ok) {
          const data = await response.json();
          console.log('Loaded service data:', data);
          
          // Конвертируем iconUrl из /api/files/ в /uploads/
          let iconUrl = data.iconUrl || '';
          if (iconUrl && iconUrl.includes('/api/files/')) {
            iconUrl = iconUrl.replace(/^https?:\/\/[^\/]+/, '').replace('/api/files/', '/uploads/');
          }
          
          // Transform backend data to form format
          setFormData({
            category: data.category || '',
            iconUrl: iconUrl,
            sortOrder: data.sortOrder || 0,
            active: data.active !== false,
            translations: [
              {
                languageCode: 'az',
                title: data.translations?.find((t: any) => t.languageCode === 'az')?.title || '',
                content: data.translations?.find((t: any) => t.languageCode === 'az')?.content || '',
                excerpt: data.translations?.find((t: any) => t.languageCode === 'az')?.excerpt || ''
              },
              {
                languageCode: 'en',
                title: data.translations?.find((t: any) => t.languageCode === 'en')?.title || '',
                content: data.translations?.find((t: any) => t.languageCode === 'en')?.content || '',
                excerpt: data.translations?.find((t: any) => t.languageCode === 'en')?.excerpt || ''
              },
              {
                languageCode: 'ru',
                title: data.translations?.find((t: any) => t.languageCode === 'ru')?.title || '',
                content: data.translations?.find((t: any) => t.languageCode === 'ru')?.content || '',
                excerpt: data.translations?.find((t: any) => t.languageCode === 'ru')?.excerpt || ''
              }
            ]
          });
        } else {
          const error = await response.json();
          console.error('Failed to load service:', error);
          toast.error('Failed to load service: ' + (error.message || 'Unknown error'));
          router.push('/dashboard/services');
        }
      } catch (error) {
        console.error('Error loading service:', error);
        toast.error('Error loading service');
        router.push('/dashboard/services');
      } finally {
        setIsLoadingData(false);
      }
    };

    if (serviceId) {
      loadService();
    }
  }, [serviceId, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Фильтруем переводы - оставляем только те, где есть title или content
      const filteredData = {
        ...formData,
        translations: formData.translations.filter(t => t.title.trim() || t.content.trim())
      };

      // Удаляем все пустые поля
      const cleanedData = removeEmptyFields(filteredData);

      const response = await fetch(`/api/admin/services/${serviceId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cleanedData)
      });

      if (response.ok) {
        toast.success('Service updated successfully!');
        router.push('/dashboard/services');
      } else {
        const error = await response.json();
        console.error('Failed to update service:', error);
        toast.error('Failed to update service: ' + (error.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error updating service:', error);
      toast.error('Network error. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const updateTranslation = (langIndex: number, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      translations: prev.translations.map((t, i) => 
        i === langIndex ? { ...t, [field]: value } : t
      )
    }));
  };

  if (isLoadingData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
          <p className="text-gray-600">Loading service...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Edit Service</h1>
              <p className="text-gray-600">Update service information and translations</p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => router.push('/dashboard/services')}
                className="px-4 py-2 text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                ← Back to Services
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* General Info */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">General Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 text-gray-900 placeholder:text-gray-400"
                  placeholder="e.g., Accounting, Tax, Legal"
                  required
                />
              </div>
              
              <ImageUpload
                value={formData.iconUrl}
                onChange={(iconUrl: string) => setFormData(prev => ({ ...prev, iconUrl }))}
                fileType="SERVICE_IMAGE"
                label="Service Icon"
                description="Icon or image for the service"
                className="md:col-span-2"
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Sort Order</label>
                <input
                  type="number"
                  value={formData.sortOrder}
                  onChange={(e) => setFormData(prev => ({ ...prev, sortOrder: parseInt(e.target.value) || 0 }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 text-gray-900 placeholder:text-gray-400"
                  placeholder="0"
                  min="0"
                />
              </div>

              <div className="md:col-span-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.active}
                    onChange={(e) => setFormData(prev => ({ ...prev, active: e.target.checked }))}
                    className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                  />
                  <span className="ml-2 text-sm text-gray-700">Active (visible on website)</span>
                </label>
              </div>
            </div>
          </div>

          {/* Translations */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Translations</h2>
            <LanguageTabs>
              {(activeLanguage, index) => {
                const translation = formData.translations[index];
                
                return (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Service Title</label>
                      <input
                        type="text"
                        value={translation.title}
                        onChange={(e) => updateTranslation(index, 'title', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 text-gray-900 placeholder:text-gray-400"
                        placeholder={`Service title in ${translation.languageCode.toUpperCase()}`}
                        minLength={5}
                        required={translation.languageCode === 'az'}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Short Description</label>
                      <textarea
                        value={translation.excerpt}
                        onChange={(e) => updateTranslation(index, 'excerpt', e.target.value)}
                        rows={2}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 text-gray-900 placeholder:text-gray-400"
                        placeholder={`Brief service description in ${translation.languageCode.toUpperCase()}`}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Detailed Description</label>
                      <textarea
                        value={translation.content}
                        onChange={(e) => updateTranslation(index, 'content', e.target.value)}
                        rows={8}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 text-gray-900 placeholder:text-gray-400"
                        placeholder={`Detailed service description in ${translation.languageCode.toUpperCase()}`}
                        required={translation.languageCode === 'az'}
                      />
                    </div>
                  </div>
                );
              }}
            </LanguageTabs>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Updating...' : 'Update Service'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}