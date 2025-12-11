'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ImageUpload, useToast } from '@/components/ui';
import { removeEmptyFields } from '@/lib/utils/cleanup';
import LanguageTabs from '@/components/admin/LanguageTabs';
import { PageHeroAdminDto, PageTag } from '@/types/api';
import { useAdminPageHeroDetailQuery, useUpdatePageHeroMutation } from '@/hooks/queries';

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

export default function EditPageHeroPage() {
  const router = useRouter();
  const params = useParams();
  const heroId = params.id as string;
  const toast = useToast();
  
  const { data: heroData, isLoading: isLoadingData } = useAdminPageHeroDetailQuery(heroId);
  const updateMutation = useUpdatePageHeroMutation();
  
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    pageTag: 'HOME' as PageTag,
    isActive: true,
    translations: [
      { languageCode: 'az', title: '', subtitle: '', heroDescription: '', buttonText: '', buttonUrl: '', backgroundImageUrl: '', heroImageUrl: '', metaTitle: '', metaDescription: '' },
      { languageCode: 'en', title: '', subtitle: '', heroDescription: '', buttonText: '', buttonUrl: '', backgroundImageUrl: '', heroImageUrl: '', metaTitle: '', metaDescription: '' },
      { languageCode: 'ru', title: '', subtitle: '', heroDescription: '', buttonText: '', buttonUrl: '', backgroundImageUrl: '', heroImageUrl: '', metaTitle: '', metaDescription: '' },
    ] as Translation[]
  });

  useEffect(() => {
    if (heroData) {
      setFormData({
        pageTag: heroData.pageTag,
        isActive: heroData.isActive,
        translations: [
          {
            languageCode: 'az',
            title: heroData.translations?.find((t: any) => t.languageCode === 'az')?.title || '',
            subtitle: heroData.translations?.find((t: any) => t.languageCode === 'az')?.subtitle || '',
            heroDescription: heroData.translations?.find((t: any) => t.languageCode === 'az')?.heroDescription || '',
            buttonText: heroData.translations?.find((t: any) => t.languageCode === 'az')?.buttonText || '',
            buttonUrl: heroData.translations?.find((t: any) => t.languageCode === 'az')?.buttonUrl || '',
            backgroundImageUrl: heroData.translations?.find((t: any) => t.languageCode === 'az')?.backgroundImageUrl || '',
            heroImageUrl: heroData.translations?.find((t: any) => t.languageCode === 'az')?.heroImageUrl || '',
            metaTitle: heroData.translations?.find((t: any) => t.languageCode === 'az')?.metaTitle || '',
            metaDescription: heroData.translations?.find((t: any) => t.languageCode === 'az')?.metaDescription || ''
          },
          {
            languageCode: 'en',
            title: heroData.translations?.find((t: any) => t.languageCode === 'en')?.title || '',
            subtitle: heroData.translations?.find((t: any) => t.languageCode === 'en')?.subtitle || '',
            heroDescription: heroData.translations?.find((t: any) => t.languageCode === 'en')?.heroDescription || '',
            buttonText: heroData.translations?.find((t: any) => t.languageCode === 'en')?.buttonText || '',
            buttonUrl: heroData.translations?.find((t: any) => t.languageCode === 'en')?.buttonUrl || '',
            backgroundImageUrl: heroData.translations?.find((t: any) => t.languageCode === 'en')?.backgroundImageUrl || '',
            heroImageUrl: heroData.translations?.find((t: any) => t.languageCode === 'en')?.heroImageUrl || '',
            metaTitle: heroData.translations?.find((t: any) => t.languageCode === 'en')?.metaTitle || '',
            metaDescription: heroData.translations?.find((t: any) => t.languageCode === 'en')?.metaDescription || ''
          },
          {
            languageCode: 'ru',
            title: heroData.translations?.find((t: any) => t.languageCode === 'ru')?.title || '',
            subtitle: heroData.translations?.find((t: any) => t.languageCode === 'ru')?.subtitle || '',
            heroDescription: heroData.translations?.find((t: any) => t.languageCode === 'ru')?.heroDescription || '',
            buttonText: heroData.translations?.find((t: any) => t.languageCode === 'ru')?.buttonText || '',
            buttonUrl: heroData.translations?.find((t: any) => t.languageCode === 'ru')?.buttonUrl || '',
            backgroundImageUrl: heroData.translations?.find((t: any) => t.languageCode === 'ru')?.backgroundImageUrl || '',
            heroImageUrl: heroData.translations?.find((t: any) => t.languageCode === 'ru')?.heroImageUrl || '',
            metaTitle: heroData.translations?.find((t: any) => t.languageCode === 'ru')?.metaTitle || '',
            metaDescription: heroData.translations?.find((t: any) => t.languageCode === 'ru')?.metaDescription || ''
          }
        ]
      });
    }
  }, [heroData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const filteredData = {
        ...formData,
        translations: formData.translations.filter(t => t.title.trim())
      };

      const cleanedData = removeEmptyFields(filteredData);

      await updateMutation.mutateAsync({ 
        id: Number(heroId), 
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

  if (isLoadingData) {
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
                      <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
                      <input
                        type="text"
                        value={translation.title}
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
                        value={translation.subtitle}
                        onChange={(e) => updateTranslation(activeIndex, 'subtitle', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-gray-50 text-gray-900 placeholder:text-gray-400"
                        placeholder={`Hero subtitle in ${activeLanguage.toUpperCase()}`}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                      <textarea
                        value={translation.heroDescription}
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

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Hero Image URL</label>
                      <ImageUpload
                        value={translation.heroImageUrl}
                        onChange={(url) => updateTranslation(activeIndex, 'heroImageUrl', url)}
                        fileType="COMPANY_LOGO"
                        label="Hero Image"
                      />
                    </div>

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
