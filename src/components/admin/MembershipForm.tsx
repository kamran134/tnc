'use client';

import { MembershipAdminDto } from '@/types/api';
import { useMembershipForm } from '@/hooks/useMembershipForm';
import LanguageTabs from '@/components/admin/LanguageTabs';
import { ImageUpload } from '@/components/ui';
import { useRouter } from 'next/navigation';
import { LANGUAGES } from '@/lib/utils/translations';

interface MembershipFormProps {
  initialData?: MembershipAdminDto;
  isEdit?: boolean;
}

export default function MembershipForm({ initialData, isEdit = false }: MembershipFormProps) {
  const router = useRouter();
  const {
    formData,
    logoPreview,
    imagePreview,
    isLoading,
    handleSubmit,
    updateField,
    updateTranslation,
    setLogoPreview,
    setImagePreview,
  } = useMembershipForm({ initialData, isEdit });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {isEdit ? 'Edit Membership' : 'Create Membership'}
              </h1>
              <p className="text-gray-600">
                {isEdit ? 'Update partner / membership details' : 'Add a new partner or membership'}
              </p>
            </div>
            <button
              onClick={() => router.push('/dashboard/memberships')}
              className="px-4 py-2 text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              ← Back to Memberships
            </button>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Identity */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Identity</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => updateField('name', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 text-gray-900 placeholder:text-gray-400"
                  placeholder="Short identifier, e.g. ICC"
                  required
                />
                <p className="mt-1 text-xs text-gray-500">Internal identifier (not shown publicly)</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                <input
                  type="text"
                  value={formData.fullName ?? ''}
                  onChange={(e) => updateField('fullName', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 text-gray-900 placeholder:text-gray-400"
                  placeholder="International Chamber of Commerce"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Partnership Type</label>
                <input
                  type="text"
                  value={formData.partnershipType ?? ''}
                  onChange={(e) => updateField('partnershipType', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 text-gray-900 placeholder:text-gray-400"
                  placeholder="e.g. Strategic Partner, Member"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Website URL</label>
                <input
                  type="url"
                  value={formData.websiteUrl ?? ''}
                  onChange={(e) => updateField('websiteUrl', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 text-gray-900 placeholder:text-gray-400"
                  placeholder="https://example.org"
                />
              </div>
            </div>
          </div>

          {/* Logo */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Logo</h2>
            <div className="flex flex-col items-center">
              <div
                className="w-32 h-32 bg-gray-100 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-400 transition-colors relative group"
                onClick={() => document.getElementById('logo-upload-trigger')?.click()}
              >
                {logoPreview || formData.logoUrl ? (
                  <>
                    <img
                      src={logoPreview || formData.logoUrl}
                      alt="Logo preview"
                      className="w-full h-full object-contain rounded-lg p-2"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 rounded-lg transition-all flex items-center justify-center">
                      <svg
                        className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                    </div>
                  </>
                ) : (
                  <div className="text-center">
                    <svg
                      className="mx-auto w-10 h-10 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <p className="mt-1 text-xs text-gray-500">Click to upload</p>
                  </div>
                )}
              </div>
              <p className="mt-2 text-xs text-gray-500">Transparent PNG recommended. Max 500×200 px.</p>
            </div>

            <div id="logo-upload-trigger">
              <ImageUpload
                value=""
                onChange={(url: string) => {
                  updateField('logoUrl', url);
                  setLogoPreview(url);
                }}
                fileType="COMPANY_LOGO"
                label=""
                description=""
              />
            </div>
          </div>

          {/* Cover image */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Cover Image</h2>
            <div className="flex flex-col items-center">
              <div
                className="w-full max-w-sm h-40 bg-gray-100 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-400 transition-colors relative group"
                onClick={() => document.getElementById('image-upload-trigger')?.click()}
              >
                {imagePreview || formData.imageUrl ? (
                  <>
                    <img
                      src={imagePreview || formData.imageUrl}
                      alt="Cover preview"
                      className="w-full h-full object-cover rounded-lg"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 rounded-lg transition-all flex items-center justify-center">
                      <svg
                        className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                    </div>
                  </>
                ) : (
                  <div className="text-center">
                    <svg
                      className="mx-auto w-10 h-10 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <p className="mt-1 text-xs text-gray-500">Click to upload</p>
                  </div>
                )}
              </div>
              <p className="mt-2 text-xs text-gray-500">Optional. Used as background / listing thumbnail.</p>
            </div>

            <div id="image-upload-trigger">
              <ImageUpload
                value=""
                onChange={(url: string) => {
                  updateField('imageUrl', url);
                  setImagePreview(url);
                }}
                fileType="SERVICE_IMAGE"
                label=""
                description=""
              />
            </div>
          </div>

          {/* Display settings */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Display Settings</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Sort Order</label>
                <input
                  type="number"
                  value={formData.sortOrder ?? 0}
                  onChange={(e) => updateField('sortOrder', parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 text-gray-900"
                  min={0}
                />
                <p className="mt-1 text-xs text-gray-500">Lower numbers appear first</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <div className="flex items-center space-x-6 mt-3">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      checked={formData.active === true}
                      onChange={() => updateField('active', true)}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700">Active</span>
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      checked={formData.active === false}
                      onChange={() => updateField('active', false)}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700">Inactive</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Multilingual content */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Membership Details (Multilingual)
            </h2>
            <LanguageTabs>
              {(activeLanguage, languageIndex) => {
                const currentLangCode = LANGUAGES[languageIndex];
                const translationIndex = formData.translations.findIndex(
                  (t) => t.languageCode === currentLangCode,
                );
                const translation =
                  translationIndex >= 0 ? formData.translations[translationIndex] : null;

                if (!translation) {
                  return <div className="text-gray-500">Loading translation...</div>;
                }

                return (
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Title <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={translation.title ?? ''}
                        onChange={(e) =>
                          updateTranslation(translationIndex, 'title', e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 text-gray-900 placeholder:text-gray-400"
                        placeholder="Displayed title of the membership"
                        required={languageIndex === 0}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Description
                      </label>
                      <textarea
                        value={translation.content ?? ''}
                        onChange={(e) =>
                          updateTranslation(translationIndex, 'content', e.target.value)
                        }
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 text-gray-900 placeholder:text-gray-400 resize-y"
                        placeholder="Full description about this membership / partnership"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Excerpt</label>
                      <textarea
                        value={translation.excerpt ?? ''}
                        onChange={(e) =>
                          updateTranslation(translationIndex, 'excerpt', e.target.value)
                        }
                        rows={2}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 text-gray-900 placeholder:text-gray-400 resize-y"
                        placeholder="Short summary (shown in cards)"
                        maxLength={500}
                      />
                      <p className="mt-1 text-xs text-gray-500">
                        {translation.excerpt?.length ?? 0}/500 characters
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Services Provided
                      </label>
                      <textarea
                        value={translation.servicesProvided ?? ''}
                        onChange={(e) =>
                          updateTranslation(translationIndex, 'servicesProvided', e.target.value)
                        }
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 text-gray-900 placeholder:text-gray-400 resize-y"
                        placeholder="List of services provided through this partnership"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Partnership Details
                      </label>
                      <textarea
                        value={translation.partnershipDetails ?? ''}
                        onChange={(e) =>
                          updateTranslation(translationIndex, 'partnershipDetails', e.target.value)
                        }
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 text-gray-900 placeholder:text-gray-400 resize-y"
                        placeholder="Terms, scope and conditions of the partnership"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Contact Info
                      </label>
                      <textarea
                        value={translation.contactInfo ?? ''}
                        onChange={(e) =>
                          updateTranslation(translationIndex, 'contactInfo', e.target.value)
                        }
                        rows={2}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 text-gray-900 placeholder:text-gray-400 resize-y"
                        placeholder="Contact person, email or phone for this partnership"
                      />
                    </div>
                  </div>
                );
              }}
            </LanguageTabs>
          </div>

          {/* Submit */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => router.push('/dashboard/memberships')}
              className="px-6 py-2 text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  {isEdit ? 'Updating...' : 'Creating...'}
                </span>
              ) : (
                <span>{isEdit ? 'Update Membership' : 'Create Membership'}</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
