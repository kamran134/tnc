'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ImageUpload, useToast } from '@/components/ui';
import { removeEmptyFields } from '@/lib/utils/cleanup';
import LanguageTabs from '@/components/admin/LanguageTabs';
import RichTextEditor from '@/components/admin/RichTextEditor';
import { PageHeroAdminDto, PageTag } from '@/types/api';
import { useUpdatePageHeroMutation } from '@/hooks/queries';
import { decodeHtmlEntities } from '@/lib/sanitize';
import { getTranslation } from '@/lib/utils/translations';

const PAGE_TAG_LABELS: Record<PageTag, string> = {
  HOME: 'Home Page',
  ABOUT: 'About Page',
  SERVICES: 'Services Page',
  CAREER: 'Career Page',
  NEWS: 'News Page',
  CONTACT: 'Contact Page',
  TEAM: 'Team Page',
  MEMBERSHIP: 'Membership Page',
};

interface Translation {
  languageCode: string;
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

interface PageHeroEditFormProps {
  initialData: PageHeroAdminDto;
}

function buildFormData(data: PageHeroAdminDto) {
  return {
    pageTag: data.pageTag,
    isActive: data.isActive,
    sortOrder: data.sortOrder ?? 0,
    translations: [
      {
        languageCode: 'az',
        title: getTranslation(data.translations, 'az')?.title || '',
        subtitle: getTranslation(data.translations, 'az')?.subtitle || '',
        heroDescription: getTranslation(data.translations, 'az')?.heroDescription || '',
        buttonText: decodeHtmlEntities(getTranslation(data.translations, 'az')?.buttonText) || '',
        buttonUrl: getTranslation(data.translations, 'az')?.buttonUrl || '',
        backgroundImageUrl: getTranslation(data.translations, 'az')?.backgroundImageUrl || '',
        heroImageUrl: getTranslation(data.translations, 'az')?.heroImageUrl || '',
        metaTitle: decodeHtmlEntities(getTranslation(data.translations, 'az')?.metaTitle) || '',
        metaDescription: decodeHtmlEntities(getTranslation(data.translations, 'az')?.metaDescription) || ''
      },
      {
        languageCode: 'en',
        title: getTranslation(data.translations, 'en')?.title || '',
        subtitle: getTranslation(data.translations, 'en')?.subtitle || '',
        heroDescription: getTranslation(data.translations, 'en')?.heroDescription || '',
        buttonText: decodeHtmlEntities(getTranslation(data.translations, 'en')?.buttonText) || '',
        buttonUrl: getTranslation(data.translations, 'en')?.buttonUrl || '',
        backgroundImageUrl: getTranslation(data.translations, 'en')?.backgroundImageUrl || '',
        heroImageUrl: getTranslation(data.translations, 'en')?.heroImageUrl || '',
        metaTitle: decodeHtmlEntities(getTranslation(data.translations, 'en')?.metaTitle) || '',
        metaDescription: decodeHtmlEntities(getTranslation(data.translations, 'en')?.metaDescription) || ''
      },
      {
        languageCode: 'ru',
        title: getTranslation(data.translations, 'ru')?.title || '',
        subtitle: getTranslation(data.translations, 'ru')?.subtitle || '',
        heroDescription: getTranslation(data.translations, 'ru')?.heroDescription || '',
        buttonText: decodeHtmlEntities(getTranslation(data.translations, 'ru')?.buttonText) || '',
        buttonUrl: getTranslation(data.translations, 'ru')?.buttonUrl || '',
        backgroundImageUrl: getTranslation(data.translations, 'ru')?.backgroundImageUrl || '',
        heroImageUrl: getTranslation(data.translations, 'ru')?.heroImageUrl || '',
        metaTitle: decodeHtmlEntities(getTranslation(data.translations, 'ru')?.metaTitle) || '',
        metaDescription: decodeHtmlEntities(getTranslation(data.translations, 'ru')?.metaDescription) || ''
      }
    ] as Translation[]
  };
}

export default function PageHeroEditForm({ initialData }: PageHeroEditFormProps) {
  const router = useRouter();
  const toast = useToast();
  const heroId = initialData.id!;

  const updateMutation = useUpdatePageHeroMutation();

  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState(() => buildFormData(initialData));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const filteredData = {
        ...formData,
        translations: formData.translations.filter(t => t.title.replace(/<[^>]*>/g, '').trim())
      };

      const cleanedData = removeEmptyFields(filteredData) as import('@/types/api').UpdatePageHeroRequest;

      await updateMutation.mutateAsync({
        id: heroId,
        data: cleanedData
      });

      toast.success('Page hero updated successfully!');
      router.push('/dashboard/page-hero');
    } catch (error) {
      console.error('Error updating page hero:', error);
      toast.error('Failed to update page hero');
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
              <h1 className="text-2xl font-bold text-gray-900">Edit Page Hero</h1>
              <p className="text-gray-600">{PAGE_TAG_LABELS[formData.pageTag]}</p>
            </div>
            <button
              onClick={() => router.push('/dashboard/page-hero')}
              className="px-4 py-2 text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              ← Back to List
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Page</label>
                <input
                  type="text"
                  value={PAGE_TAG_LABELS[formData.pageTag]}
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600"
                />
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
                <p className="mt-1 text-xs text-gray-400">Lower value = displayed first (for HOME slider)</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                    className="w-4 h-4 text-green-600 rounded focus:ring-green-500"
                  />
                  <span className="text-sm text-gray-700">Active</span>
                </div>
              </div>
            </div>
          </div>

          {/* Translations */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Content Translations</h2>
            
            <LanguageTabs>
              {(activeLanguage, activeIndex) => {
                const translation = formData.translations[activeIndex];
                
                return (
                  <div className="space-y-4 pt-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Title {activeLanguage === 'az' && <span className="text-red-500">*</span>}
                      </label>
                      <p className="text-xs text-gray-400 mb-2">Max ~150 visible characters — supports bold, italic, underline, font size, alignment, color</p>
                      <RichTextEditor
                        key={`title-${activeLanguage}`}
                        toolbarType="title"
                        maxLength={150}
                        value={translation.title}
                        onChange={(v) => updateTranslation(activeIndex, 'title', v)}
                        placeholder={`Hero title in ${activeLanguage.toUpperCase()}`}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle</label>
                      <p className="text-xs text-gray-400 mb-2">Max ~400 visible characters — supports bold, italic, underline, font size, alignment, color</p>
                      <RichTextEditor
                        key={`subtitle-${activeLanguage}`}
                        toolbarType="subtitle"
                        maxLength={400}
                        value={translation.subtitle}
                        onChange={(v) => updateTranslation(activeIndex, 'subtitle', v)}
                        placeholder={`Hero subtitle in ${activeLanguage.toUpperCase()}`}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                      <p className="text-xs text-gray-400 mb-2">Max ~1800 visible characters — supports full formatting (headers, lists, links, colors, etc.)</p>
                      <RichTextEditor
                        key={`desc-${activeLanguage}`}
                        toolbarType="full"
                        maxLength={1800}
                        value={translation.heroDescription}
                        onChange={(v) => updateTranslation(activeIndex, 'heroDescription', v)}
                        placeholder={`Hero description in ${activeLanguage.toUpperCase()}`}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Button Text</label>
                        <input
                          type="text"
                          value={translation.buttonText}
                          onChange={(e) => updateTranslation(activeIndex, 'buttonText', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-gray-50 text-gray-900 placeholder:text-gray-400"
                          placeholder="Call to action button text"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Button URL</label>
                        <input
                          type="text"
                          value={translation.buttonUrl}
                          onChange={(e) => updateTranslation(activeIndex, 'buttonUrl', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-gray-50 text-gray-900 placeholder:text-gray-400"
                          placeholder="/contact"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Background Image URL</label>
                      <ImageUpload
                        value={translation.backgroundImageUrl}
                        onChange={(url) => updateTranslation(activeIndex, 'backgroundImageUrl', url)}
                        fileType="COMPANY_LOGO"
                        label="Background Image"
                      />
                    </div>

                    {/* <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Hero Image URL</label>
                      <ImageUpload
                        value={translation.heroImageUrl}
                        onChange={(url) => updateTranslation(activeIndex, 'heroImageUrl', url)}
                        fileType="COMPANY_LOGO"
                        label="Hero Image"
                      />
                    </div> */}

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Meta Title (SEO)</label>
                      <input
                        type="text"
                        value={translation.metaTitle}
                        onChange={(e) => updateTranslation(activeIndex, 'metaTitle', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-gray-50 text-gray-900 placeholder:text-gray-400"
                        placeholder="SEO meta title"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Meta Description (SEO)</label>
                      <textarea
                        value={translation.metaDescription}
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

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Updating...' : 'Update Page Hero'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
