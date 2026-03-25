'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MembershipAdminDto } from '@/types/api';
import {
  useAdminMembershipsListQuery,
  useAdminMembershipMutation,
} from '@/hooks/queries';
import { useToast } from '@/components/ui';
import { ConfirmModal } from '@/components/ui';

export default function MembershipsPage() {
  const router = useRouter();
  const toast = useToast();

  const { data: memberships = [], isLoading, isFetching, error } = useAdminMembershipsListQuery();
  const mutations = useAdminMembershipMutation();
  const [deleteTarget, setDeleteTarget] = useState<number | null>(null);

  const getAzTitle = (membership: MembershipAdminDto) =>
    membership.translations?.find((t) => t.languageCode === 'az')?.title ||
    membership.translations?.[0]?.title ||
    membership.fullName ||
    membership.name;

  const handleToggleActive = async (membership: MembershipAdminDto) => {
    try {
      if (membership.active) {
        await mutations.deactivate.mutateAsync(membership.id!);
        toast.success('Membership deactivated');
      } else {
        await mutations.activate.mutateAsync(membership.id!);
        toast.success('Membership activated');
      }
    } catch {
      toast.error('Failed to update membership status');
    }
  };

  const handleDelete = async (id: number) => {
    setDeleteTarget(id);
  };

  const confirmDelete = async () => {
    if (deleteTarget === null) return;
    try {
      await mutations.delete.mutateAsync(deleteTarget);
      toast.success('Membership deleted');
    } catch {
      toast.error('Failed to delete membership');
    } finally {
      setDeleteTarget(null);
    }
  };

  if (isLoading || (isFetching && memberships.length === 0)) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center space-x-3">
          <svg
            className="animate-spin h-8 w-8 text-blue-600"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <span className="text-xl font-medium text-gray-700">Loading memberships...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <svg className="mx-auto h-12 w-12 text-red-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Failed to load memberships</h3>
          <p className="text-gray-600 mb-4">{error instanceof Error ? error.message : 'Unknown error'}</p>
          <button
            onClick={() => router.push('/dashboard')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Memberships & Partners</h1>
              <p className="text-gray-600">Manage partner organizations and professional memberships</p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => router.push('/dashboard')}
                className="px-4 py-2 text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                ← Back to Dashboard
              </button>
              <button
                onClick={() => router.push('/dashboard/memberships/new')}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                + Add Membership
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {memberships.length === 0 ? (
            <div className="text-center py-16">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No memberships yet</h3>
              <p className="mt-1 text-sm text-gray-500">
                Add your first partner or professional membership.
              </p>
              <div className="mt-6">
                <button
                  onClick={() => router.push('/dashboard/memberships/new')}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  + Add Membership
                </button>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Organization
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Partnership Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Website
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Order
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {memberships.map((membership) => {
                    const title = getAzTitle(membership);
                    return (
                      <tr key={membership.id} className="hover:bg-gray-50">
                        {/* Logo + name */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-16 mr-4">
                              {membership.logoUrl ? (
                                <img
                                  className="h-10 w-16 object-contain"
                                  src={membership.logoUrl}
                                  alt={title}
                                />
                              ) : (
                                <div className="h-10 w-10 rounded-lg bg-sky-100 flex items-center justify-center">
                                  <svg
                                    className="h-5 w-5 text-sky-600"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                                    />
                                  </svg>
                                </div>
                              )}
                            </div>
                            <div>
                              <div className="text-sm font-medium text-gray-900">{title}</div>
                              {membership.fullName && membership.fullName !== title && (
                                <div className="text-xs text-gray-500">{membership.fullName}</div>
                              )}
                              <div className="text-xs text-gray-400">
                                {membership.translations?.length ?? 0} languages
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Partnership type */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {membership.partnershipType || (
                              <span className="text-gray-400">—</span>
                            )}
                          </div>
                        </td>

                        {/* Website */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          {membership.websiteUrl ? (
                            <a
                              href={membership.websiteUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-blue-600 hover:text-blue-800 hover:underline truncate max-w-[160px] block"
                            >
                              {membership.websiteUrl.replace(/^https?:\/\//, '')}
                            </a>
                          ) : (
                            <span className="text-sm text-gray-400">—</span>
                          )}
                        </td>

                        {/* Status */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              membership.active
                                ? 'bg-green-100 text-green-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {membership.active ? 'Active' : 'Inactive'}
                          </span>
                        </td>

                        {/* Sort order */}
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {membership.sortOrder ?? '—'}
                        </td>

                        {/* Actions */}
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end gap-3">
                            <button
                              onClick={() => router.push(`/dashboard/memberships/${membership.id}`)}
                              className="text-blue-600 hover:text-blue-900 transition-colors"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleToggleActive(membership)}
                              className="text-yellow-600 hover:text-yellow-900 transition-colors"
                            >
                              {membership.active ? 'Deactivate' : 'Activate'}
                            </button>
                            <button
                              onClick={() => handleDelete(membership.id!)}
                              className="text-red-600 hover:text-red-900 transition-colors"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>

    <ConfirmModal
      open={deleteTarget !== null}
      title="Delete membership"
      message="Delete this membership? This action cannot be undone."
      confirmLabel="Delete"
      onConfirm={confirmDelete}
      onCancel={() => setDeleteTarget(null)}
    />
    </>
  );
}
