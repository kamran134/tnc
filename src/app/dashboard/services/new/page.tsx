'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ImageUpload } from '@/components/ui';
import { removeEmptyFields } from '@/lib/utils/cleanup';

export default function CreateServicePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    category: '',
    iconUrl: '',
    sortOrder: 0,
    active: true,
    translations: [
      {
        languageCode: 'az' as const,
        title: '',
        content: '',
        excerpt: ''
      },
      {
        languageCode: 'en' as const,
        title: '',
        content: '',
        excerpt: ''
      },
      {
        languageCode: 'ru' as const,
        title: '',
        content: '',
        excerpt: ''
      }
    ]
  });

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

      const response = await fetch('/api/admin/services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cleanedData)
      });

      if (response.ok) {
        router.push('/dashboard/services');
      } else {
        const error = await response.json();
        console.error('Failed to create service:', error);
        alert('Failed to create service: ' + (error.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error creating service:', error);
      alert('Error creating service');
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Create Service</h1>
              <p className="text-gray-600">Add a new company service</p>
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
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Service Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 text-gray-900"
                  required
                >
                  <option value="">Select Category</option>
                  <option value="Accounting">Accounting</option>
                  <option value="Finance">Finance</option>
                  <option value="Tax">Tax</option>
                  <option value="Legal">Legal</option>
                  <option value="HR">HR</option>
                  <option value="Consulting">Consulting</option>
                  <option value="Audit">Audit</option>
                  <option value="Business">Business</option>
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
          {formData.translations.map((translation, index) => (
            <div key={translation.languageCode} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                {translation.languageCode.toUpperCase()} Translation
              </h2>
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
            </div>
          ))}

          {/* Submit */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => router.push('/dashboard/services')}
                className="px-6 py-2 text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {isLoading ? 'Creating...' : 'Create Service'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}