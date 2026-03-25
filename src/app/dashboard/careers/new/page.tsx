'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ui';
import { removeEmptyFields } from '@/lib/utils/cleanup';
import LanguageTabs from '@/components/admin/LanguageTabs';
import RichTextEditor from '@/components/admin/RichTextEditor';
import { useCreateCareerMutation } from '@/hooks/queries';
import { isDefaultLanguage } from '@/lib/utils/translations';

export default function CreateCareerPage() {
  const router = useRouter();
  const toast = useToast();
  const createMutation = useCreateCareerMutation();
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
        position: '',
        company: '',
        department: '',
        content: '',
        excerpt: '',
        requirements: ''
      },
      {
        languageCode: 'en' as const,
        title: '',
        position: '',
        company: '',
        department: '',
        content: '',
        excerpt: '',
        requirements: ''
      },
      {
        languageCode: 'ru' as const,
        title: '',
        position: '',
        company: '',
        department: '',
        content: '',
        excerpt: '',
        requirements: ''
      }
    ]
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const filteredData = {
        ...formData,
        translations: formData.translations.filter(t => t.title.trim() || t.content.trim())
      };

      const cleanedData = removeEmptyFields(filteredData);

      await createMutation.mutateAsync(cleanedData);
      toast.success('Job posting created successfully!');
      router.push('/dashboard/careers');
    } catch (error) {
      console.error('Error creating career:', error);
      toast.error('Failed to create job posting. Please try again.');
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
                  value={formData.salaryRange === 'BY_NEGOTIATION' ? '' : formData.salaryRange}
                  onChange={(e) => setFormData(prev => ({ ...prev, salaryRange: e.target.value }))}
                  disabled={formData.salaryRange === 'BY_NEGOTIATION'}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-gray-50 text-gray-900 placeholder:text-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder="e.g., 1000 - 2000 ₼"
                />
                <div className="mt-2 flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="byNegotiation"
                    checked={formData.salaryRange === 'BY_NEGOTIATION'}
                    onChange={(e) =>
                      setFormData(prev => ({ ...prev, salaryRange: e.target.checked ? 'BY_NEGOTIATION' : '' }))
                    }
                    className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                  />
                  <label htmlFor="byNegotiation" className="text-sm text-gray-600">
                    By Agreement <span className="text-gray-400">(Razılaşma yolu ilə)</span>
                  </label>
                </div>
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
                        placeholder={translation.languageCode === 'az' ? 'İş vakansiyasının adı...' : translation.languageCode === 'en' ? 'Job title...' : 'Название вакансии...'}
                        minLength={2}
                        required={isDefaultLanguage(translation.languageCode)}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Position</label>
                      <input
                        type="text"
                        value={translation.position}
                        onChange={(e) => updateTranslation(index, 'position', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-gray-50 text-gray-900 placeholder:text-gray-400"
                        placeholder={translation.languageCode === 'az' ? 'Vəzifə adı...' : translation.languageCode === 'en' ? 'Position name...' : 'Название должности...'}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Company</label>
                        <input
                          type="text"
                          value={translation.company}
                          onChange={(e) => updateTranslation(index, 'company', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-gray-50 text-gray-900 placeholder:text-gray-400"
                          placeholder={translation.languageCode === 'az' ? 'Şirkət adı...' : translation.languageCode === 'en' ? 'Company name...' : 'Название компании...'}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
                        <input
                          type="text"
                          value={translation.department}
                          onChange={(e) => updateTranslation(index, 'department', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-gray-50 text-gray-900 placeholder:text-gray-400"
                          placeholder={translation.languageCode === 'az' ? 'Şöbə adı...' : translation.languageCode === 'en' ? 'Department name...' : 'Название отдела...'}
                        />
                      </div>
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
                      <RichTextEditor
                        key={`content-${translation.languageCode}`}
                        value={translation.content}
                        onChange={(value) => updateTranslation(index, 'content', value)}
                        placeholder={translation.languageCode === 'az' ? 'Ətraflı iş təsviri...' : translation.languageCode === 'en' ? 'Detailed job description...' : 'Подробное описание работы...'}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Requirements</label>
                      <RichTextEditor
                        key={`requirements-${translation.languageCode}`}
                        value={translation.requirements}
                        onChange={(value) => updateTranslation(index, 'requirements', value)}
                        placeholder={translation.languageCode === 'az' ? 'Tələblər...' : translation.languageCode === 'en' ? 'Requirements...' : 'Требования...'}
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