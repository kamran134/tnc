'use client';

import { useParams, useRouter } from 'next/navigation';
import AboutSectionForm from '@/components/admin/AboutSectionForm';
import { useAdminAboutSectionDetailQuery } from '@/hooks/queries';

export default function EditAboutSectionPage() {
  const params = useParams();
  const router = useRouter();
  const id = Number(params?.id);

  const { data: section, isLoading, error } = useAdminAboutSectionDetailQuery(id);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center space-x-3">
          <svg className="animate-spin h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <span className="text-xl font-medium text-gray-700">Loading section...</span>
        </div>
      </div>
    );
  }

  if (error || !section) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <svg className="mx-auto h-12 w-12 text-red-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {(error as any)?.message || 'Section not found'}
          </h3>
          <button
            onClick={() => router.push('/dashboard/about-sections')}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Back to About Sections
          </button>
        </div>
      </div>
    );
  }

  return <AboutSectionForm initialData={section} isEdit={true} />;
}
