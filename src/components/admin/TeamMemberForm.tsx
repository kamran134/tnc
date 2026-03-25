'use client';

import { TeamMemberAdminDto } from '@/types/api';
import { useTeamMemberForm } from '@/hooks/useTeamMemberForm';
import LanguageTabs from '@/components/admin/LanguageTabs';
import { ImageUpload } from '@/components/ui';
import { useRouter } from 'next/navigation';
import { LANGUAGES } from '@/lib/utils/translations';

interface TeamMemberFormProps {
  initialData?: TeamMemberAdminDto;
  isEdit?: boolean;
}

export default function TeamMemberForm({ initialData, isEdit = false }: TeamMemberFormProps) {
  const router = useRouter();
  const {
    formData,
    imagePreview,
    isLoading,
    handleSubmit,
    updateTranslation,
    updateField,
    setImagePreview,
  } = useTeamMemberForm({ initialData, isEdit });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {isEdit ? 'Edit Team Member' : 'Create Team Member'}
              </h1>
              <p className="text-gray-600">
                {isEdit ? 'Update team member information' : 'Add a new team member'}
              </p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => router.push('/dashboard/team')}
                className="px-4 py-2 text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                ← Back to Team
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Image Upload */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Profile Photo</h2>
            <div className="flex flex-col items-center">
              <div 
                className="w-32 h-32 rounded-full bg-gray-100 flex items-center justify-center border-4 border-gray-200 cursor-pointer hover:border-blue-400 transition-colors relative group"
                onClick={() => document.getElementById('photo-upload')?.click()}
              >
                {imagePreview || formData.imageUrl ? (
                  <>
                    <img
                      src={imagePreview || formData.imageUrl}
                      alt="Preview"
                      className="w-full h-full rounded-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 rounded-full transition-all flex items-center justify-center">
                      <svg className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                  </>
                ) : (
                  <svg className="w-16 h-16 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                  </svg>
                )}
              </div>
              <p className="mt-3 text-sm text-gray-600">Click on photo to upload</p>
              <p className="text-xs text-gray-500">Recommended: Square image, at least 400x400px</p>
            </div>
            
            <ImageUpload
              value=""
              onChange={(imageUrl: string) => {
                updateField('imageUrl', imageUrl);
                setImagePreview(imageUrl);
              }}
              fileType="USER_AVATAR"
              label=""
              description=""
            />
          </div>

          {/* Contact Info */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => updateField('email', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 text-gray-900 placeholder:text-gray-400"
                  placeholder="email@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => updateField('phone', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 text-gray-900 placeholder:text-gray-400"
                  placeholder="+994 XX XXX XX XX"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">LinkedIn URL</label>
                <input
                  type="url"
                  value={formData.linkedinUrl}
                  onChange={(e) => updateField('linkedinUrl', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 text-gray-900 placeholder:text-gray-400"
                  placeholder="https://linkedin.com/in/username"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Twitter URL</label>
                <input
                  type="url"
                  value={formData.twitterUrl}
                  onChange={(e) => updateField('twitterUrl', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 text-gray-900 placeholder:text-gray-400"
                  placeholder="https://twitter.com/username"
                />
              </div>
            </div>
          </div>

          {/* Settings */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Display Settings</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Sort Order</label>
                <input
                  type="number"
                  value={formData.sortOrder}
                  onChange={(e) => updateField('sortOrder', parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 text-gray-900"
                  min="0"
                />
                <p className="mt-1 text-sm text-gray-500">Lower numbers appear first</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <div className="flex items-center space-x-4 mt-3">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      checked={formData.active}
                      onChange={() => updateField('active', true)}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700">Active</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      checked={!formData.active}
                      onChange={() => updateField('active', false)}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700">Inactive</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Translations */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Team Member Information (Multilingual)</h2>
            <LanguageTabs>
              {(activeLanguage, languageIndex) => {
                // Map languageIndex to actual languageCode
                const currentLangCode = LANGUAGES[languageIndex];
                
                // Find translation by languageCode instead of array index
                const translationIndex = formData.translations.findIndex(t => t.languageCode === currentLangCode);
                const translation = translationIndex >= 0 ? formData.translations[translationIndex] : null;
                
                if (!translation) {
                  return <div className="text-gray-500">Loading translation...</div>;
                }
                return (
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={translation.fullName || ''}
                        onChange={(e) => updateTranslation(translationIndex, 'fullName', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 text-gray-900 placeholder:text-gray-400"
                        placeholder="Enter full name"
                        required={languageIndex === 0}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Position/Title</label>
                      <input
                        type="text"
                        value={translation.position || ''}
                        onChange={(e) => updateTranslation(translationIndex, 'position', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 text-gray-900 placeholder:text-gray-400"
                        placeholder="e.g., Senior Accountant"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Position Description</label>
                      <textarea
                        value={translation.positionDescription || ''}
                        onChange={(e) => updateTranslation(translationIndex, 'positionDescription', e.target.value)}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 text-gray-900 placeholder:text-gray-400"
                        placeholder="Brief description of the role"
                        maxLength={500}
                      />
                      <p className="mt-1 text-sm text-gray-500">
                        {translation.positionDescription?.length || 0}/500 characters
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Biography</label>
                      <textarea
                        value={translation.bio || ''}
                        onChange={(e) => updateTranslation(translationIndex, 'bio', e.target.value)}
                        rows={6}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 text-gray-900 placeholder:text-gray-400"
                        placeholder="Tell us about this team member..."
                        maxLength={1000}
                      />
                      <p className="mt-1 text-sm text-gray-500">{translation.bio?.length || 0}/1000 characters</p>
                    </div>
                  </div>
                );
              }}
            </LanguageTabs>
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => router.push('/dashboard/team')}
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
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  {isEdit ? 'Updating...' : 'Creating...'}
                </span>
              ) : (
                <span>{isEdit ? 'Update Team Member' : 'Create Team Member'}</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
