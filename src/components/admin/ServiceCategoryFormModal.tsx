'use client';

import { useState, useEffect } from 'react';
import { ServiceCategoryAdminDto, ServiceCategoryTranslationDto } from '@/types/api';
import { adminServiceCategoriesService } from '@/lib/api';
import { getServiceCategoryIcons } from '@/lib/icons/service-category-icons';

interface ServiceCategoryFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  category?: ServiceCategoryAdminDto | null;
}

export default function ServiceCategoryFormModal({
  isOpen,
  onClose,
  onSuccess,
  category,
}: ServiceCategoryFormModalProps) {
  const [formData, setFormData] = useState({
    code: '',
    iconUrl: '',
    sortOrder: 0,
    active: true,
    translations: [
      { languageCode: 'az', name: '', description: '' },
      { languageCode: 'en', name: '', description: '' },
      { languageCode: 'ru', name: '', description: '' },
    ] as ServiceCategoryTranslationDto[],
  });

  const [activeTab, setActiveTab] = useState<'az' | 'en' | 'ru'>('az');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (category) {
      setFormData({
        code: category.code,
        iconUrl: category.iconUrl || '',
        sortOrder: category.sortOrder || 0,
        active: category.active,
        translations: [
          category.translations.find(t => t.languageCode === 'az') || { languageCode: 'az', name: '', description: '' },
          category.translations.find(t => t.languageCode === 'en') || { languageCode: 'en', name: '', description: '' },
          category.translations.find(t => t.languageCode === 'ru') || { languageCode: 'ru', name: '', description: '' },
        ],
      });
    } else {
      setFormData({
        code: '',
        iconUrl: '',
        sortOrder: 0,
        active: true,
        translations: [
          { languageCode: 'az', name: '', description: '' },
          { languageCode: 'en', name: '', description: '' },
          { languageCode: 'ru', name: '', description: '' },
        ],
      });
    }
    setError(null);
  }, [category, isOpen]);

  const updateTranslation = (index: number, field: string, value: string) => {
    const updatedTranslations = [...formData.translations];
    updatedTranslations[index] = { ...updatedTranslations[index], [field]: value };
    setFormData({ ...formData, translations: updatedTranslations });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // Фильтруем только заполненные переводы
      const filledTranslations = formData.translations.filter(t => t.name.trim() !== '');
      
      if (filledTranslations.length === 0) {
        throw new Error('At least one translation is required');
      }

      const payload = {
        ...formData,
        translations: filledTranslations,
      };

      if (category) {
        await adminServiceCategoriesService.update(category.id, payload);
      } else {
        await adminServiceCategoriesService.create(payload);
      }

      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to save category');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  const currentTranslation = formData.translations.find(t => t.languageCode === activeTab);
  const currentIndex = formData.translations.findIndex(t => t.languageCode === activeTab);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        {/* Overlay */}
        <div
          className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
          onClick={onClose}
        />

        {/* Modal */}
        <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b">
            <h2 className="text-2xl font-bold text-gray-900">
              {category ? 'Edit Category' : 'Create New Category'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
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
                onChange={(e) => setFormData({ ...formData, code: e.target.value.toLowerCase() })}
                placeholder="e.g., accounting, tax-advisory"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
                disabled={!!category}
                pattern="[a-z0-9-_]+"
                title="Only lowercase letters, numbers, hyphens and underscores"
              />
              <p className="text-xs text-gray-500 mt-1">Unique identifier (lowercase, hyphens allowed)</p>
            </div>

            {/* Icon Selector */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Icon
              </label>
              <div className="grid grid-cols-5 gap-2">
                {getServiceCategoryIcons().map((iconOption) => {
                  const Icon = iconOption.icon;
                  const isSelected = formData.iconUrl === iconOption.name;
                  
                  return (
                    <button
                      key={iconOption.name}
                      type="button"
                      onClick={() => setFormData({ ...formData, iconUrl: iconOption.name })}
                      className={`
                        relative p-3 rounded-lg border-2 transition-all
                        flex flex-col items-center justify-center gap-2
                        hover:border-blue-500 hover:bg-blue-50
                        ${isSelected 
                          ? 'border-blue-600 bg-blue-100 shadow-md' 
                          : 'border-gray-200 bg-white'
                        }
                      `}
                      title={iconOption.label}
                    >
                      <Icon 
                        className={`w-6 h-6 ${isSelected ? 'text-blue-600' : 'text-gray-600'}`}
                      />
                      <span className={`text-xs ${isSelected ? 'text-blue-700 font-medium' : 'text-gray-500'}`}>
                        {iconOption.label}
                      </span>
                      {isSelected && (
                        <div className="absolute top-1 right-1">
                          <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Sort Order */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sort Order
              </label>
              <input
                type="number"
                value={formData.sortOrder}
                onChange={(e) => setFormData({ ...formData, sortOrder: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min="0"
              />
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

              {/* Translation Fields */}
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
                onClick={onClose}
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
                {isSubmitting ? 'Saving...' : category ? 'Update Category' : 'Create Category'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
