'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import LanguageTabs from '@/components/admin/LanguageTabs';
import { ImageUpload, useToast } from '@/components/ui';
import RichTextEditor from '@/components/admin/RichTextEditor';
import { adminAboutSectionsService } from '@/lib/api';
import type { AboutSectionAdminDto, AboutSectionTranslationDto, LanguageCode } from '@/types/api';

interface AboutSectionFormProps {
  initialData?: AboutSectionAdminDto;
  isEdit?: boolean;
}

const LANGUAGES: LanguageCode[] = ['az', 'en', 'ru'];

const emptyTranslation = (lang: LanguageCode): AboutSectionTranslationDto => ({
  languageCode: lang,
  title: '',
  subtitle: '',
  description: '',
  imageUrl: '',
});

export default function AboutSectionForm({ initialData, isEdit = false }: AboutSectionFormProps) {
  const router = useRouter();
  const toast = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [translations, setTranslations] = useState<AboutSectionTranslationDto[]>(() =>
    LANGUAGES.map((lang) => {
      const existing = initialData?.translations?.find((t) => t.languageCode === lang);
      return existing ?? emptyTranslation(lang);
    })
  );

  const getTranslation = useCallback(
    (lang: LanguageCode) => translations.find((t) => t.languageCode === lang) ?? emptyTranslation(lang),
    [translations]
  );

  const updateTranslation = useCallback(
    (lang: LanguageCode, field: keyof AboutSectionTranslationDto, value: string) => {
      setTranslations((prev) =>
        prev.map((t) => (t.languageCode === lang ? { ...t, [field]: value } : t))
      );
    },
    []
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const payload = { translations };
      if (isEdit && initialData) {
        await adminAboutSectionsService.update(initialData.id, payload);
        toast.success('Section updated successfully!');
      } else {
        await adminAboutSectionsService.create(payload);
        toast.success('Section created successfully!');
      }
      router.push('/dashboard/about-sections');
    } catch (error: any) {
      toast.error(error.message || 'Failed to save section');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {isEdit ? 'Edit About Section' : 'New About Section'}
              </h1>
              <p className="text-sm text-gray-500 mt-0.5">
                {isEdit ? 'Update section content and image' : 'Add a new block to the About page'}
              </p>
            </div>
            <button
              type="button"
              onClick={() => router.push('/dashboard/about-sections')}
              className="px-4 py-2 text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              ← Back
            </button>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-1">Multilingual Content</h2>
          <p className="text-sm text-gray-500 mb-6">
            Fill in Title, Subtitle, Description, and Image for each language.
          </p>
          <LanguageTabs>
            {(activeLang) => {
              const t = getTranslation(activeLang);
              return (
                <div className="space-y-6">
                  {/* Title */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Title
                    </label>
                    <input
                      type="text"
                      value={t.title || ''}
                      onChange={(e) => updateTranslation(activeLang, 'title', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Section heading..."
                    />
                  </div>

                  {/* Subtitle */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Subtitle / Tag
                      <span className="text-gray-400 font-normal ml-1">(shown above the title in accent color)</span>
                    </label>
                    <input
                      type="text"
                      value={t.subtitle || ''}
                      onChange={(e) => updateTranslation(activeLang, 'subtitle', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g. Our Story, Our Mission..."
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <RichTextEditor
                      value={t.description || ''}
                      onChange={(val) => updateTranslation(activeLang, 'description', val)}
                      placeholder="Section body text..."
                    />
                  </div>

                  {/* Image */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Image
                      <span className="text-gray-400 font-normal ml-1">(recommended: 4:3 ratio, min 800×600px)</span>
                    </label>
                    <ImageUpload
                      value={t.imageUrl || ''}
                      onChange={(url) => updateTranslation(activeLang, 'imageUrl', url)}
                      fileType="SERVICE_IMAGE"
                      label=""
                      description="Upload section image"
                    />
                  </div>
                </div>
              );
            }}
          </LanguageTabs>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={() => router.push('/dashboard/about-sections')}
            className="px-6 py-2 text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Saving...
              </>
            ) : isEdit ? (
              'Update Section'
            ) : (
              'Create Section'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
