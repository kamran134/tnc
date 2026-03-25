'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ImageUpload, useToast } from '@/components/ui';
import { removeEmptyFields } from '@/lib/utils/cleanup';\nimport { getTranslation, isDefaultLanguage } from '@/lib/utils/translations';
import LanguageTabs from '@/components/admin/LanguageTabs';
import RichTextEditor from '@/components/admin/RichTextEditor';
import { adminServiceCategoriesService } from '@/lib/api';
import type { ServiceAdminDto, ServiceCategoryAdminDto } from '@/types/api';
import { useUpdateServiceMutation } from '@/hooks/queries/useAdminServicesQueries';

interface Translation {
  id?: number;
  languageCode: string;
  title: string;
  content: string;
  excerpt: string;
}

interface ServiceEditFormProps {
  initialData: ServiceAdminDto;
}

function buildFormData(data: ServiceAdminDto) {
  // Конвертируем iconUrl из /api/files/ в /uploads/
  let iconUrl = data.iconUrl || '';
  if (iconUrl && iconUrl.includes('/api/files/')) {
    iconUrl = iconUrl.replace(/^https?:\/\/[^\/]+/, '').replace('/api/files/', '/uploads/');
  }

  return {
    serviceCategoryId: data.serviceCategoryId || null,
    iconUrl: iconUrl,
    sortOrder: data.sortOrder ?? null,
    categorySortOrder: data.categorySortOrder ?? null,
    active: data.active !== false,
    translations: [
      {
        languageCode: 'az',
        title: getTranslation(data.translations, 'az')?.title || '',
        content: getTranslation(data.translations, 'az')?.content || '',
        excerpt: getTranslation(data.translations, 'az')?.excerpt || ''
      },
      {
        languageCode: 'en',
        title: getTranslation(data.translations, 'en')?.title || '',
        content: getTranslation(data.translations, 'en')?.content || '',
        excerpt: getTranslation(data.translations, 'en')?.excerpt || ''
      },
      {
        languageCode: 'ru',
        title: getTranslation(data.translations, 'ru')?.title || '',
        content: getTranslation(data.translations, 'ru')?.content || '',
        excerpt: getTranslation(data.translations, 'ru')?.excerpt || ''
      }
    ] as Translation[]
  };
}

export default function ServiceEditForm({ initialData }: ServiceEditFormProps) {
  const router = useRouter();
  const toast = useToast();
  const serviceId = initialData.id!;

  const updateServiceMutation = useUpdateServiceMutation();

  const [categories, setCategories] = useState<ServiceCategoryAdminDto[]>([]);
  const [formData, setFormData] = useState(() => buildFormData(initialData));

  // Load categories (independent request, stays in the form)
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

    try {
      // Фильтруем переводы - оставляем только те, где есть title или content
      const filteredData = {
        ...formData,
        translations: formData.translations.filter(t => t.title.trim() || t.content.trim())
      };

      // Удаляем все пустые поля EXCEPT iconUrl
      const { iconUrl, ...restData } = filteredData;
      const cleanedData: any = removeEmptyFields(restData);

      // Always include iconUrl in the request (empty string if deleted, or the URL if present)
      cleanedData.iconUrl = iconUrl;

      await updateServiceMutation.mutateAsync({
        id: serviceId,
        data: cleanedData
      });

      toast.success('Service updated successfully!');
      router.push('/dashboard/services');
    } catch (error: any) {
      console.error('Error updating service:', error);
      toast.error('Failed to update service: ' + (error?.message || 'Unknown error'));
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
                      {getTranslation(category.translations, 'en')?.name || 
                       getTranslation(category.translations)?.name || 
                       category.code}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Global Sort Order
                </label>
                <input
                  type="number"
                  value={formData.sortOrder ?? ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, sortOrder: e.target.value ? parseInt(e.target.value) : null }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 text-gray-900"
                  placeholder="Leave empty for auto-numbering"
                  min="0"
                />
                <p className="mt-1 text-xs text-gray-500">Order among ALL services</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category Sort Order
                </label>
                <input
                  type="number"
                  value={formData.categorySortOrder ?? ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, categorySortOrder: e.target.value ? parseInt(e.target.value) : null }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 text-gray-900"
                  placeholder="Leave empty for auto-numbering"
                  min="0"
                />
                <p className="mt-1 text-xs text-gray-500">Order within selected category</p>
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
                        required={isDefaultLanguage(translation.languageCode)}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Short Description</label>
                      <RichTextEditor
                        key={`excerpt-${translation.languageCode}`}
                        value={translation.excerpt}
                        onChange={(value) => updateTranslation(index, 'excerpt', value)}
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
              disabled={updateServiceMutation.isPending}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {updateServiceMutation.isPending ? 'Updating...' : 'Update Service'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
