'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { ServiceCategoryAdminDto, ServiceCategoryTranslationDto } from '@/types/api';
import { adminServiceCategoriesService } from '@/lib/api';
import { getServiceCategoryIcons } from '@/lib/icons/service-category-icons';

export default function EditServiceCategoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [formData, setFormData] = useState<{
    code: string;
    iconUrl: string;
    active: boolean;
    translations: ServiceCategoryTranslationDto[];
  } | null>(null);

  const [activeTab, setActiveTab] = useState<'az' | 'en' | 'ru'>('az');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadCategory = async () => {
      try {
        const category = await adminServiceCategoriesService.getById(parseInt(id));
        setFormData({
          code: category.code,
          iconUrl: category.iconUrl || '',
          active: category.active,
          translations: [
            category.translations.find(t => t.languageCode === 'az') || { languageCode: 'az', name: '', description: '' },
            category.translations.find(t => t.languageCode === 'en') || { languageCode: 'en', name: '', description: '' },
            category.translations.find(t => t.languageCode === 'ru') || { languageCode: 'ru', name: '', description: '' },
          ],
        });
      } catch (err) {
        setError('Failed to load category');
      } finally {
        setIsLoading(false);
      }
    };

    loadCategory();
  }, [id]);

  const updateTranslation = (index: number, field: string, value: string) => {
    if (!formData) return;
    const updatedTranslations = [...formData.translations];
    updatedTranslations[index] = { ...updatedTranslations[index], [field]: value };
    setFormData({ ...formData, translations: updatedTranslations });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData) return;
    
    setIsSubmitting(true);
    setError(null);

    try {
      const filledTranslations = formData.translations.filter(t => t.name.trim() !== '');
      
      if (filledTranslations.length === 0) {
        throw new Error('At least one translation is required');
      }

      await adminServiceCategoriesService.update(parseInt(id), {
        ...formData,
        translations: filledTranslations,
      });

      router.push('/dashboard/service-categories');
    } catch (err: any) {
      setError(err.message || 'Failed to update category');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center space-x-3">
          <svg className="animate-spin h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span className="text-xl font-medium text-gray-700">Loading...</span>
        </div>
      </div>
    );
  }

  if (!formData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || 'Category not found'}</p>
          <button
            onClick={() => router.push('/dashboard/service-categories')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Back to Categories
          </button>
        </div>
      </div>
    );
  }

  const currentTranslation = formData.translations.find(t => t.languageCode === activeTab);
  const currentIndex = formData.translations.findIndex(t => t.languageCode === activeTab);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Edit Category</h1>
              <p className="text-gray-600">Update service category details</p>
            </div>
            <button
              onClick={() => router.push('/dashboard/service-categories')}
              className="px-4 py-2 text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              ← Back
            </button>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {/* Code */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Code <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.code}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600"
              disabled
            />
            <p className="text-xs text-gray-500 mt-1">Code cannot be changed</p>
          </div>

          {/* Icon Selector */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Icon
            </label>
            <div className="grid grid-cols-5 gap-2 max-h-80 overflow-y-auto p-2 border border-gray-200 rounded-lg">
              {getServiceCategoryIcons().map((iconOption) => {
                const Icon = iconOption.icon;
                const isSelected = formData.iconUrl === iconOption.name;
                
                return (
                  <button
                    key={iconOption.name}
                    type="button"
                    onClick={() => setFormData({ ...formData, iconUrl: iconOption.name })}
                    className={`p-3 rounded-lg border-2 transition-all flex flex-col items-center justify-center gap-2 hover:border-blue-500 hover:bg-blue-50 ${
                      isSelected ? 'border-blue-600 bg-blue-100 shadow-md' : 'border-gray-200 bg-white'
                    }`}
                    title={iconOption.label}
                  >
                    <Icon className={`w-6 h-6 ${isSelected ? 'text-blue-600' : 'text-gray-600'}`} />
                    <span className={`text-xs ${isSelected ? 'text-blue-700 font-medium' : 'text-gray-500'}`}>
                      {iconOption.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Status */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="active"
              checked={formData.active}
              onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
              className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
            />
            <label htmlFor="active" className="ml-2 text-sm font-medium text-gray-700">
              Active
            </label>
          </div>

          {/* Language Tabs */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Translations <span className="text-red-500">*</span>
            </label>
            <div className="flex space-x-2 border-b border-gray-200 mb-4">
              {['az', 'en', 'ru'].map((lang) => (
                <button
                  key={lang}
                  type="button"
                  onClick={() => setActiveTab(lang as 'az' | 'en' | 'ru')}
                  className={`px-4 py-2 font-medium text-sm transition-colors ${
                    activeTab === lang
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {lang.toUpperCase()}
                </button>
              ))}
            </div>

            {currentTranslation && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Name ({activeTab.toUpperCase()}) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={currentTranslation.name}
                    onChange={(e) => updateTranslation(currentIndex, 'name', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required={activeTab === 'az'}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description ({activeTab.toUpperCase()})
                  </label>
                  <textarea
                    value={currentTranslation.description || ''}
                    onChange={(e) => updateTranslation(currentIndex, 'description', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <button
              type="button"
              onClick={() => router.push('/dashboard/service-categories')}
              className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Updating...' : 'Update Category'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
