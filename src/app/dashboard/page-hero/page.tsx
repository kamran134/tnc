'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PageHeroAdminDto, PageTag } from '@/types/api';
import { useToast } from '@/components/ui';
import { useAdminPageHeroListQuery, useActivatePageHeroMutation, useDeactivatePageHeroMutation } from '@/hooks/queries';

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

export default function PageHeroManagementPage() {
  const router = useRouter();
  const toast = useToast();
  
  const { data: pageHeroes = [], isLoading } = useAdminPageHeroListQuery();
  const activateMutation = useActivatePageHeroMutation();
  const deactivateMutation = useDeactivatePageHeroMutation();

  const handleToggleActive = async (hero: PageHeroAdminDto) => {
    try {
      const mutation = hero.isActive ? deactivateMutation : activateMutation;
      await mutation.mutateAsync(hero.id!);
      toast.success(`Page hero ${hero.isActive ? 'deactivated' : 'activated'} successfully!`);
    } catch (error) {
      console.error('Error toggling page hero:', error);
      toast.error('An error occurred');
    }
  };

  const getTranslation = (hero: PageHeroAdminDto, lang: string = 'az') => {
    return hero.translations?.find(t => t.languageCode === lang) || hero.translations?.[0];
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center space-x-3">
          <svg className="animate-spin h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span className="text-xl font-medium text-gray-700">Loading page heroes...</span>
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
              <h1 className="text-2xl font-bold text-gray-900">Page Hero Management</h1>
              <p className="text-gray-600">Manage hero sections for all pages</p>
            </div>
            <button
              onClick={() => router.push('/dashboard')}
              className="px-4 py-2 text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              ← Back to Dashboard
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Page</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subtitle</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {pageHeroes.map((hero) => {
                  const translation = getTranslation(hero);
                  return (
                    <tr key={hero.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        {PAGE_TAG_LABELS[hero.pageTag]}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {translation?.title || '-'}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {translation?.subtitle || '-'}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          hero.isActive 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {hero.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => router.push(`/dashboard/page-hero/${hero.id}`)}
                            className="text-green-600 hover:text-green-900"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleToggleActive(hero)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            {hero.isActive ? 'Deactivate' : 'Activate'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {pageHeroes.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No page heroes found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
