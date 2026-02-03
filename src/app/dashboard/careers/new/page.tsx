'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ui';
import { removeEmptyFields } from '@/lib/utils/cleanup';
import LanguageTabs from '@/components/admin/LanguageTabs';

export default function CreateCareerPage() {
  const router = useRouter();
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    location: '',
    employmentType: 'FULL_TIME',
    salaryRange: '',
    postDate: new Date().toISOString().slice(0, 16),
    expiryDate: '',
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

      const response = await fetch('/api/admin/careers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cleanedData)
      });

      if (response.ok) {
        toast.success('Job posting created successfully!');
        router.push('/dashboard/careers');
      } else {
        const error = await response.json();
        console.error('Failed to create career:', error);
        toast.error('Failed to create job posting: ' + (error.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error creating career:', error);
      toast.error('Error creating job posting');
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
              <h1 className="text-2xl font-bold text-gray-900">Create Job Posting</h1>
              <p className="text-gray-600">Add a new career opportunity</p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => router.push('/dashboard/careers')}
                className="px-4 py-2 text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                ← Back to Careers
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
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Job Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-gray-50 text-gray-900 placeholder:text-gray-400"
                  placeholder="e.g., Baku, Azerbaijan"
                  minLength={5}
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Employment Type</label>
                <select
                  value={formData.employmentType}
                  onChange={(e) => setFormData(prev => ({ ...prev, employmentType: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-gray-50 text-gray-900"
                >
                  <option value="FULL_TIME">Full Time</option>
                  <option value="PART_TIME">Part Time</option>
                  <option value="CONTRACT">Contract</option>
                  <option value="REMOTE">Remote</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Salary Range</label>
                <input
                  type="text"
                  value={formData.salaryRange}
                  onChange={(e) => setFormData(prev => ({ ...prev, salaryRange: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-gray-50 text-gray-900 placeholder:text-gray-400"
                  placeholder="e.g., $50,000 - $70,000"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Post Date</label>
                <input
                  type="datetime-local"
                  value={formData.postDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, postDate: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-gray-50 text-gray-900"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Expiry Date</label>
                <input
                  type="datetime-local"
                  value={formData.expiryDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, expiryDate: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-gray-50 text-gray-900"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="active"
                  checked={formData.active}
                  onChange={(e) => setFormData(prev => ({ ...prev, active: e.target.checked }))}
                  className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                />
                <label htmlFor="active" className="ml-2 text-sm font-medium text-gray-700">
                  Active posting
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
                      <label className="block text-sm font-medium text-gray-700 mb-2">Job Title</label>
                      <input
                        type="text"
                        value={translation.title}
                        onChange={(e) => updateTranslation(index, 'title', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-gray-50 text-gray-900 placeholder:text-gray-400"
                        placeholder={translation.languageCode === 'az' ? 'İş vakansiyalarının adı...' : translation.languageCode === 'en' ? 'Job title...' : 'Название вакансии...'}
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
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-gray-50 text-gray-900 placeholder:text-gray-400"
                        placeholder={translation.languageCode === 'az' ? 'Qısa təsvir...' : translation.languageCode === 'en' ? 'Brief job description...' : 'Краткое описание...'}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Job Description</label>
                      <textarea
                        value={translation.content}
                        onChange={(e) => updateTranslation(index, 'content', e.target.value)}
                        rows={8}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-gray-50 text-gray-900 placeholder:text-gray-400"
                        placeholder={translation.languageCode === 'az' ? 'Ətraflı təsvir, tələblər və məsuliyyətlər...' : translation.languageCode === 'en' ? 'Detailed job description, requirements, and responsibilities...' : 'Подробное описание, требования и обязанности...'}
                        required={translation.languageCode === 'az'}
                      />
                    </div>
                  </div>
                );
              }}
            </LanguageTabs>
          </div>

          {/* Submit */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => router.push('/dashboard/careers')}
                className="px-6 py-2 text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
              >
                {isLoading ? 'Creating...' : 'Create Job Posting'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}