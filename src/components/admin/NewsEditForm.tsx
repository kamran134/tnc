'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ImageUpload, useToast } from '@/components/ui';
import { removeEmptyFields } from '@/lib/utils/cleanup';
import { getTranslation, isDefaultLanguage } from '@/lib/utils/translations';
import LanguageTabs from '@/components/admin/LanguageTabs';
import RichTextEditor from '@/components/admin/RichTextEditor';
import { useUpdateNewsMutation, usePublishNewsMutation, useUnpublishNewsMutation } from '@/hooks/queries';
import type { NewsAdminDto } from '@/types/api';

interface Translation {
  languageCode: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
}

interface NewsEditFormProps {
  initialData: NewsAdminDto;
}

function buildFormData(data: NewsAdminDto) {
  // Конвертируем imageUrl из /api/files/ в /uploads/
  let imageUrl = data.imageUrl || '';
  if (imageUrl && imageUrl.includes('/api/files/')) {
    imageUrl = imageUrl.replace(/^https?:\/\/[^\/]+/, '').replace('/api/files/', '/uploads/');
  }

  return {
    published: data.published || false,
    author: data.author || '',
    imageUrl: imageUrl,
    category: data.category || '',
    readTimeMinutes: data.readTimeMinutes || 5,
    tags: data.tags || '',
    translations: [
      {
        languageCode: 'az',
        title: getTranslation(data.translations, 'az')?.title || '',
        slug: getTranslation(data.translations, 'az')?.slug || '',
        content: getTranslation(data.translations, 'az')?.content || '',
        excerpt: getTranslation(data.translations, 'az')?.excerpt || ''
      },
      {
        languageCode: 'en',
        title: getTranslation(data.translations, 'en')?.title || '',
        slug: getTranslation(data.translations, 'en')?.slug || '',
        content: getTranslation(data.translations, 'en')?.content || '',
        excerpt: getTranslation(data.translations, 'en')?.excerpt || ''
      },
      {
        languageCode: 'ru',
        title: getTranslation(data.translations, 'ru')?.title || '',
        slug: getTranslation(data.translations, 'ru')?.slug || '',
        content: getTranslation(data.translations, 'ru')?.content || '',
        excerpt: getTranslation(data.translations, 'ru')?.excerpt || ''
      }
    ] as Translation[]
  };
}

export default function NewsEditForm({ initialData }: NewsEditFormProps) {
  const router = useRouter();
  const toast = useToast();
  const newsId = initialData.id!;

  const updateMutation = useUpdateNewsMutation();
  const publishMutation = usePublishNewsMutation();
  const unpublishMutation = useUnpublishNewsMutation();

  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState(() => buildFormData(initialData));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Фильтруем переводы - оставляем только те, где есть title или content
      const filteredData = {
        ...formData,
        translations: formData.translations.filter(t => t.title.trim() || t.content.trim())
      };

      // Удаляем все пустые поля, НО сохраняем imageUrl даже если пустой
      const cleanedData: any = removeEmptyFields(filteredData);

      // Если imageUrl был пустым (удален пользователем), явно отправляем null
      if (!formData.imageUrl || formData.imageUrl.trim() === '') {
        cleanedData.imageUrl = null;
      }

      await updateMutation.mutateAsync({ id: newsId, data: cleanedData });
      toast.success('News article updated successfully!');
      router.push('/dashboard/news');
    } catch (error) {
      toast.error('Network error. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTogglePublish = async () => {
    try {
      if (formData.published) {
        await unpublishMutation.mutateAsync(newsId);
        toast.success('Article unpublished successfully!');
      } else {
        await publishMutation.mutateAsync(newsId);
        toast.success('Article published successfully!');
      }
      setFormData(prev => ({ ...prev, published: !prev.published }));
    } catch (error) {
      toast.error('An error occurred. Please try again.');
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
              <h1 className="text-2xl font-bold text-gray-900">Edit News Article</h1>
              <p className="text-gray-600">Update article content and settings</p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => router.push('/dashboard/news')}
                className="px-4 py-2 text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                ← Back to News
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
                <label className="block text-sm font-medium text-gray-700 mb-2">Author</label>
                <input
                  type="text"
                  value={formData.author}
                  onChange={(e) => setFormData(prev => ({ ...prev, author: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-gray-50 text-gray-900 placeholder:text-gray-400"
                  placeholder="Article author"
                />
              </div>
              
              <ImageUpload
                value={formData.imageUrl}
                onChange={(imageUrl: string) => setFormData(prev => ({ ...prev, imageUrl }))}
                fileType="NEWS_IMAGE"
                label="Article Image"
                description="Featured image for the news article"
                className="md:col-span-2"
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-gray-50 text-gray-900 placeholder:text-gray-400"
                  placeholder="e.g., Company News, Industry Updates"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Read Time (minutes)</label>
                <input
                  type="number"
                  value={formData.readTimeMinutes}
                  onChange={(e) => setFormData(prev => ({ ...prev, readTimeMinutes: parseInt(e.target.value) || 5 }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-gray-50 text-gray-900 placeholder:text-gray-400"
                  placeholder="5"
                  min="1"
                  max="60"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-gray-50 text-gray-900 placeholder:text-gray-400"
                  placeholder="tag1, tag2, tag3"
                />
              </div>

              <div className="md:col-span-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.published}
                    onChange={(e) => setFormData(prev => ({ ...prev, published: e.target.checked }))}
                    className="rounded border-gray-300 text-green-600 shadow-sm focus:border-green-300 focus:ring focus:ring-green-200 focus:ring-opacity-50"
                  />
                  <span className="ml-2 text-sm text-gray-700">Publish immediately</span>
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
                      <label className="block text-sm font-medium text-gray-700 mb-2">Article Title</label>
                      <input
                        type="text"
                        value={translation.title}
                        onChange={(e) => updateTranslation(index, 'title', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-gray-50 text-gray-900 placeholder:text-gray-400"
                        placeholder={translation.languageCode === 'az' ? 'Məqalənin başlığı...' : translation.languageCode === 'en' ? 'Article title...' : 'Название статьи...'}
                        minLength={5}
                        required={isDefaultLanguage(translation.languageCode)}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Slug (URL)</label>
                      <input
                        type="text"
                        value={translation.slug}
                        onChange={(e) => updateTranslation(index, 'slug', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-gray-50 text-gray-900 placeholder:text-gray-400"
                        placeholder={`article-url-${translation.languageCode}`}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Excerpt</label>
                      <textarea
                        value={translation.excerpt}
                        onChange={(e) => updateTranslation(index, 'excerpt', e.target.value)}
                        rows={2}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-gray-50 text-gray-900 placeholder:text-gray-400"
                        placeholder={translation.languageCode === 'az' ? 'Qısa məzmun...' : translation.languageCode === 'en' ? 'Brief excerpt...' : 'Краткое содержание...'}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Article Content</label>
                      <RichTextEditor
                        key={translation.languageCode}
                        value={translation.content}
                        onChange={(value) => updateTranslation(index, 'content', value)}
                        placeholder={translation.languageCode === 'az' ? 'Məqalənin məzmunu...' : translation.languageCode === 'en' ? 'Article content...' : 'Содержание статьи...'}
                      />
                    </div>
                  </div>
                );
              }}
            </LanguageTabs>
          </div>

          {/* Submit Button */}
          <div className="flex justify-between items-center">
            <button
              type="button"
              onClick={handleTogglePublish}
              className={`px-6 py-3 rounded-lg transition-colors ${
                formData.published
                  ? 'bg-yellow-600 hover:bg-yellow-700 text-white'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              {formData.published ? 'Unpublish Article' : 'Publish Article'}
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Updating...' : 'Update Article'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
