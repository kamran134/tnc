'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { ImageUpload, useToast } from '@/components/ui';
import { removeEmptyFields } from '@/lib/utils/cleanup';
import LanguageTabs from '@/components/admin/LanguageTabs';
import { PageTag } from '@/types/api';
import { useCreatePageHeroMutation } from '@/hooks/queries';

const PAGE_TAG_OPTIONS: { value: PageTag; label: string }[] = [
  { value: 'HOME', label: 'Home Page' },
  { value: 'ABOUT', label: 'About Page' },
  { value: 'SERVICES', label: 'Services Page' },
  { value: 'CAREER', label: 'Career Page' },
  { value: 'NEWS', label: 'News Page' },
  { value: 'CONTACT', label: 'Contact Page' },
  { value: 'TEAM', label: 'Team Page' },
  { value: 'MEMBERSHIP', label: 'Membership Page' },
];

interface Translation {
  languageCode: 'az' | 'en' | 'ru';
  title: string;
  subtitle: string;
  heroDescription: string;
  buttonText: string;
  buttonUrl: string;
  backgroundImageUrl: string;
  heroImageUrl: string;
  metaTitle: string;
  metaDescription: string;
}

const EMPTY_TRANSLATIONS: Translation[] = [
  { languageCode: 'az', title: '', subtitle: '', heroDescription: '', buttonText: '', buttonUrl: '', backgroundImageUrl: '', heroImageUrl: '', metaTitle: '', metaDescription: '' },
  { languageCode: 'en', title: '', subtitle: '', heroDescription: '', buttonText: '', buttonUrl: '', backgroundImageUrl: '', heroImageUrl: '', metaTitle: '', metaDescription: '' },
  { languageCode: 'ru', title: '', subtitle: '', heroDescription: '', buttonText: '', buttonUrl: '', backgroundImageUrl: '', heroImageUrl: '', metaTitle: '', metaDescription: '' },
];

export default function CreatePageHeroPage() {
  const router = useRouter();
  const toast = useToast();
  const createMutation = useCreatePageHeroMutation();

  const [formData, setFormData] = useState({
    pageTag: 'HOME' as PageTag,
    isActive: true,
    sortOrder: 0,
    translations: EMPTY_TRANSLATIONS,
  });

  const updateTranslation = (index: number, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      translations: prev.translations.map((t, i) =>
        i === index ? { ...t, [field]: value } : t,
      ),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const filteredData = {
      ...formData,
      translations: formData.translations.filter(t => t.title.trim()),
    };

    if (filteredData.translations.length === 0) {
      toast.error('Please fill in the title for at least one language (AZ is required).');
      return;
    }

    try {
      const cleanedData = removeEmptyFields(filteredData) as import('@/types/api').CreatePageHeroRequest;
      await createMutation.mutateAsync(cleanedData);
      toast.success('Hero slide created successfully!');
      router.push('/dashboard/page-hero');
    } catch (error: any) {
      console.error('Error creating page hero:', error);
      toast.error('Failed to create slide: ' + (error?.message || 'Unknown error'));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">New Hero Slide</h1>
              <p className="text-sm text-gray-500 mt-0.5">Create a new hero slide for a page</p>
            </div>
            <button
              onClick={() => router.push('/dashboard/page-hero')}
              className="px-4 py-2 text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm"
            >
              ← Back to List
            </button>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Basic Info */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-5">Basic Information</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Page *</label>
                <select
                  value={formData.pageTag}
                  onChange={(e) => setFormData(prev => ({ ...prev, pageTag: e.target.value as PageTag }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-gray-50 text-gray-900"
                  required
                >
                  {PAGE_TAG_OPTIONS.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Sort Order</label>
                <input
                  type="number"
                  min={0}
                  value={formData.sortOrder}
                  onChange={(e) => setFormData(prev => ({ ...prev, sortOrder: parseInt(e.target.value, 10) || 0 }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-gray-50 text-gray-900"
                />
                <p className="mt-1 text-xs text-gray-400">Lower value = displayed first in slider</p>
              </div>

              <div className="flex flex-col justify-end pb-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={formData.isActive}
                    onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                    className="w-4 h-4 text-green-600 rounded focus:ring-green-500"
                  />
                  <label htmlFor="isActive" className="text-sm text-gray-700 cursor-pointer">Active (visible on site)</label>
                </div>
              </div>
            </div>
          </div>

          {/* Translations */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-5">Content Translations</h2>

            <LanguageTabs>
              {(activeLanguage, activeIndex) => {
                const t = formData.translations[activeIndex];
                return (
                  <div className="space-y-4 pt-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Title {activeLanguage === 'az' && <span className="text-red-500">*</span>}
                      </label>
                      <input
                        type="text"
                        value={t.title}
                        onChange={(e) => updateTranslation(activeIndex, 'title', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-gray-50 text-gray-900 placeholder:text-gray-400"
                        placeholder={`Hero title in ${activeLanguage.toUpperCase()}`}
                        required={activeLanguage === 'az'}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Subtitle</label>
                      <input
                        type="text"
                        value={t.subtitle}
                        onChange={(e) => updateTranslation(activeIndex, 'subtitle', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-gray-50 text-gray-900 placeholder:text-gray-400"
                        placeholder={`Hero subtitle in ${activeLanguage.toUpperCase()}`}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                      <textarea
                        value={t.heroDescription}
                        onChange={(e) => updateTranslation(activeIndex, 'heroDescription', e.target.value)}
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-gray-50 text-gray-900 placeholder:text-gray-400"
                        placeholder={`Hero description in ${activeLanguage.toUpperCase()}`}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Button Text</label>
                        <input
                          type="text"
                          value={t.buttonText}
                          onChange={(e) => updateTranslation(activeIndex, 'buttonText', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-gray-50 text-gray-900 placeholder:text-gray-400"
                          placeholder="Call to action button text"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Button URL</label>
                        <input
                          type="text"
                          value={t.buttonUrl}
                          onChange={(e) => updateTranslation(activeIndex, 'buttonUrl', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-gray-50 text-gray-900 placeholder:text-gray-400"
                          placeholder="/services"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Background Image</label>
                      <ImageUpload
                        value={t.backgroundImageUrl}
                        onChange={(url) => updateTranslation(activeIndex, 'backgroundImageUrl', url)}
                        fileType="COMPANY_LOGO"
                        label="Background Image"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Hero Image</label>
                      <ImageUpload
                        value={t.heroImageUrl}
                        onChange={(url) => updateTranslation(activeIndex, 'heroImageUrl', url)}
                        fileType="COMPANY_LOGO"
                        label="Hero Image"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Meta Title (SEO)</label>
                      <input
                        type="text"
                        value={t.metaTitle}
                        onChange={(e) => updateTranslation(activeIndex, 'metaTitle', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-gray-50 text-gray-900 placeholder:text-gray-400"
                        placeholder="SEO meta title"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Meta Description (SEO)</label>
                      <textarea
                        value={t.metaDescription}
                        onChange={(e) => updateTranslation(activeIndex, 'metaDescription', e.target.value)}
                        rows={2}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-gray-50 text-gray-900 placeholder:text-gray-400"
                        placeholder="SEO meta description"
                      />
                    </div>
                  </div>
                );
              }}
            </LanguageTabs>
          </div>

          {/* Submit */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={createMutation.isPending}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              {createMutation.isPending ? 'Creating...' : 'Create Slide'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
