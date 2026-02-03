'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ImageUpload, useToast } from '@/components/ui';
import { removeEmptyFields } from '@/lib/utils/cleanup';
import LanguageTabs from '@/components/admin/LanguageTabs';
import RichTextEditor from '@/components/admin/RichTextEditor';
import { adminServiceCategoriesService } from '@/lib/api';
import type { ServiceCategoryAdminDto } from '@/types/api';

interface Translation {
  id?: number;
  languageCode: string;
  title: string;
  content: string;
  excerpt: string;
}

interface ServiceData {
  id: number;
  serviceCategoryId: number | null;
  iconUrl: string | null;
  active: boolean;
  translations: Translation[];
}

export default function EditServicePage() {
  const router = useRouter();
  const params = useParams();
  const serviceId = params.id as string;
  const toast = useToast();
  
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [categories, setCategories] = useState<ServiceCategoryAdminDto[]>([]);
  const [formData, setFormData] = useState({
    serviceCategoryId: null as number | null,
    iconUrl: '',
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
        const response = await fetch(`/api/admin/services/${serviceId}`);
        if (!response.ok) throw new Error('Failed to load service');
        const serviceData: ServiceData = await response.json();
        
        // Конвертируем iconUrl из /api/files/ в /uploads/
        let iconUrl = serviceData.iconUrl || '';
        if (iconUrl && iconUrl.includes('/api/files/')) {
          iconUrl = iconUrl.replace(/^https?:\/\/[^\/]+/, '').replace('/api/files/', '/uploads/');
        }
        
        setFormData({
          serviceCategoryId: serviceData.serviceCategoryId || null,
          iconUrl: iconUrl,
          active: serviceData.active !== false,
          translations: [
            {
              languageCode: 'az',
              title: serviceData.translations?.find((t: Translation) => t.languageCode === 'az')?.title || '',
              content: serviceData.translations?.find((t: Translation) => t.languageCode === 'az')?.content || '',
              excerpt: serviceData.translations?.find((t: Translation) => t.languageCode === 'az')?.excerpt || ''
            },
            {
              languageCode: 'en',
              title: serviceData.translations?.find((t: Translation) => t.languageCode === 'en')?.title || '',
              content: serviceData.translations?.find((t: Translation) => t.languageCode === 'en')?.content || '',
              excerpt: serviceData.translations?.find((t: Translation) => t.languageCode === 'en')?.excerpt || ''
            },
            {
              languageCode: 'ru',
              title: serviceData.translations?.find((t: Translation) => t.languageCode === 'ru')?.title || '',
              content: serviceData.translations?.find((t: Translation) => t.languageCode === 'ru')?.content || '',
              excerpt: serviceData.translations?.find((t: Translation) => t.languageCode === 'ru')?.excerpt || ''
            }
          ]
        });
      } catch (error) {
        console.error('Failed to load service:', error);
        toast.error('Failed to load service');
      } finally {
        setIsLoadingData(false);
      }
    };
    loadService();
  }, [serviceId, toast]);

  // Load categories
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await adminServiceCategoriesService.getAllAsList();
        setCategories(data);
      } catch (error) {
        console.error('Failed to load categories:', error);
        toast.error('Failed to load categories');
      }
    };
    loadCategories();
  }, [toast]);

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
      toast.error('Failed to update service');
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
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.serviceCategoryId || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, serviceCategoryId: e.target.value ? parseInt(e.target.value) : null }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 text-gray-900"
                  required
                >
                  <option value="">Select Category</option>
                  {categories.filter(c => c.active).map(category => (
                    <option key={category.id} value={category.id}>
                      {category.translations.find(t => t.languageCode === 'en')?.name || 
                       category.translations.find(t => t.languageCode === 'az')?.name || 
                       category.code}
                    </option>
                  ))}
                </select>
              </div>
              
              <ImageUpload
                value={formData.iconUrl}
                onChange={(iconUrl: string) => setFormData(prev => ({ ...prev, iconUrl }))}
                fileType="SERVICE_IMAGE"
                label="Service Icon"
                description="Icon or image for the service"
                className="md:col-span-2"
              />

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="active"
                  checked={formData.active}
                  onChange={(e) => setFormData(prev => ({ ...prev, active: e.target.checked }))}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="active" className="ml-2 text-sm font-medium text-gray-700">
                  Active service
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
                        placeholder={translation.languageCode === 'az' ? 'Xidmətin adı...' : translation.languageCode === 'en' ? 'Service title...' : 'Название услуги...'}
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
                        placeholder={translation.languageCode === 'az' ? 'Qısa təsvir...' : translation.languageCode === 'en' ? 'Brief service description...' : 'Краткое описание...'}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Detailed Description</label>
                      <RichTextEditor
                        key={translation.languageCode}
                        value={translation.content}
                        onChange={(value) => updateTranslation(index, 'content', value)}
                        placeholder={translation.languageCode === 'az' ? 'Xidmətin ətraflı təsviri...' : translation.languageCode === 'en' ? 'Detailed service description...' : 'Подробное описание услуги...'}
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