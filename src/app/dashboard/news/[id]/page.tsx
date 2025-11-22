'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ImageUpload } from '@/components/ui';

interface Translation {
  languageCode: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
}

export default function EditNewsPage() {
  const router = useRouter();
  const params = useParams();
  const newsId = params.id as string;
  
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [formData, setFormData] = useState({
    published: false,
    author: '',
    imageUrl: '',
    category: '',
    readTimeMinutes: 5,
    tags: '',
    translations: [
      { languageCode: 'az', title: '', slug: '', content: '', excerpt: '' },
      { languageCode: 'en', title: '', slug: '', content: '', excerpt: '' },
      { languageCode: 'ru', title: '', slug: '', content: '', excerpt: '' },
    ] as Translation[]
  });

  // Load news data
  useEffect(() => {
    const loadNews = async () => {
      try {
        setIsLoadingData(true);
        const response = await fetch(`/api/admin/news/${newsId}`);
        
        if (response.ok) {
          const data = await response.json();
          console.log('Loaded news data:', data);
          
          // Transform backend data to form format
          setFormData({
            published: data.published || false,
            author: data.author || '',
            imageUrl: data.imageUrl || '',
            category: data.category || '',
            readTimeMinutes: data.readTimeMinutes || 5,
            tags: data.tags || '',
            translations: [
              {
                languageCode: 'az',
                title: data.translations?.find((t: any) => t.languageCode === 'az')?.title || '',
                slug: data.translations?.find((t: any) => t.languageCode === 'az')?.slug || '',
                content: data.translations?.find((t: any) => t.languageCode === 'az')?.content || '',
                excerpt: data.translations?.find((t: any) => t.languageCode === 'az')?.excerpt || ''
              },
              {
                languageCode: 'en',
                title: data.translations?.find((t: any) => t.languageCode === 'en')?.title || '',
                slug: data.translations?.find((t: any) => t.languageCode === 'en')?.slug || '',
                content: data.translations?.find((t: any) => t.languageCode === 'en')?.content || '',
                excerpt: data.translations?.find((t: any) => t.languageCode === 'en')?.excerpt || ''
              },
              {
                languageCode: 'ru',
                title: data.translations?.find((t: any) => t.languageCode === 'ru')?.title || '',
                slug: data.translations?.find((t: any) => t.languageCode === 'ru')?.slug || '',
                content: data.translations?.find((t: any) => t.languageCode === 'ru')?.content || '',
                excerpt: data.translations?.find((t: any) => t.languageCode === 'ru')?.excerpt || ''
              }
            ]
          });
        } else {
          const error = await response.json();
          console.error('Failed to load news:', error);
          alert('Failed to load news: ' + (error.message || 'Unknown error'));
          router.push('/dashboard/news');
        }
      } catch (error) {
        console.error('Error loading news:', error);
        alert('Error loading news');
        router.push('/dashboard/news');
      } finally {
        setIsLoadingData(false);
      }
    };

    if (newsId) {
      loadNews();
    }
  }, [newsId, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const response = await fetch(`/api/admin/news/${newsId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        alert('News article updated successfully!');
        router.push('/dashboard/news');
      } else {
        const error = await response.json();
        console.error('Failed to update news:', error);
        
        let errorMessage = 'Failed to update news';
        if (error.message) {
          if (error.message.includes('cache')) {
            errorMessage = 'Server configuration issue. The news may have been updated but cache needs to be refreshed. Please check the news list.';
          } else {
            errorMessage = error.message;
          }
        }
        
        alert(errorMessage);
      }
    } catch (error) {
      console.error('Error updating news:', error);
      alert('Network error. Please check your connection and try again.');
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
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mx-auto mb-2"></div>
          <p className="text-gray-600">Loading news article...</p>
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white text-gray-900 placeholder:text-gray-400"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white text-gray-900 placeholder:text-gray-400"
                  placeholder="e.g., Company News, Industry Updates"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Read Time (minutes)</label>
                <input
                  type="number"
                  value={formData.readTimeMinutes}
                  onChange={(e) => setFormData(prev => ({ ...prev, readTimeMinutes: parseInt(e.target.value) || 5 }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white text-gray-900 placeholder:text-gray-400"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white text-gray-900 placeholder:text-gray-400"
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
          {formData.translations.map((translation, index) => (
            <div key={translation.languageCode} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                {translation.languageCode.toUpperCase()} Translation
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Article Title</label>
                  <input
                    type="text"
                    value={translation.title}
                    onChange={(e) => updateTranslation(index, 'title', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white text-gray-900 placeholder:text-gray-400"
                    placeholder={`Article title in ${translation.languageCode.toUpperCase()}`}
                    minLength={5}
                    required={translation.languageCode === 'az'}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Slug (URL)</label>
                  <input
                    type="text"
                    value={translation.slug}
                    onChange={(e) => updateTranslation(index, 'slug', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white text-gray-900 placeholder:text-gray-400"
                    placeholder={`article-url-${translation.languageCode}`}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Excerpt</label>
                  <textarea
                    value={translation.excerpt}
                    onChange={(e) => updateTranslation(index, 'excerpt', e.target.value)}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white text-gray-900 placeholder:text-gray-400"
                    placeholder={`Brief article description in ${translation.languageCode.toUpperCase()}`}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Article Content</label>
                  <textarea
                    value={translation.content}
                    onChange={(e) => updateTranslation(index, 'content', e.target.value)}
                    rows={12}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white text-gray-900 placeholder:text-gray-400"
                    placeholder={`Full article content in ${translation.languageCode.toUpperCase()}`}
                    required={translation.languageCode === 'az'}
                  />
                </div>
              </div>
            </div>
          ))}

          {/* Submit Button */}
          <div className="flex justify-end">
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