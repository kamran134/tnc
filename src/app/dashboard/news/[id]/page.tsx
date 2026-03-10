'use client';

import { useParams, useRouter } from 'next/navigation';
import NewsEditForm from '@/components/admin/NewsEditForm';
import { useAdminNewsDetailQuery } from '@/hooks/queries';

export default function EditNewsPage() {
  const params = useParams();
  const router = useRouter();
  const newsId = params?.id as string;

  const { data: newsData, isLoading, error } = useAdminNewsDetailQuery(newsId);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mx-auto mb-2"></div>
          <p className="text-gray-600">Loading news article...</p>
        </div>
      </div>
    );
  }

  if (error || !newsData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <svg
            className="mx-auto h-12 w-12 text-red-500 mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {error instanceof Error ? error.message : 'News article not found'}
          </h3>
          <button
            onClick={() => router.push('/dashboard/news')}
            className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Back to News
          </button>
        </div>
      </div>
    );
  }

  return <NewsEditForm initialData={newsData} />;
}