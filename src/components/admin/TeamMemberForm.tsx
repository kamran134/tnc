'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { TeamMemberAdminDto, TeamMemberTranslationDto } from '@/types/api';
import { removeEmptyFields } from '@/lib/utils/cleanup';
import LanguageTabs from '@/components/admin/LanguageTabs';
import { adminFilesService } from '@/lib/api';

interface TeamMemberFormProps {
  initialData?: TeamMemberAdminDto;
  isEdit?: boolean;
}

export default function TeamMemberForm({ initialData, isEdit = false }: TeamMemberFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  
  const [formData, setFormData] = useState<TeamMemberAdminDto>({
    email: initialData?.email || '',
    phone: initialData?.phone || '',
    imageUrl: initialData?.imageUrl || '',
    linkedinUrl: initialData?.linkedinUrl || '',
    twitterUrl: initialData?.twitterUrl || '',
    active: initialData?.active ?? true,
    sortOrder: initialData?.sortOrder ?? 0,
    translations: initialData?.translations || [
      {
        languageCode: 'az',
        fullName: '',
        position: '',
        bio: '',
        positionDescription: '',
      },
      {
        languageCode: 'en',
        fullName: '',
        position: '',
        bio: '',
        positionDescription: '',
      },
      {
        languageCode: 'ru',
        fullName: '',
        position: '',
        bio: '',
        positionDescription: '',
      },
    ],
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>(formData.imageUrl || '');

  // Sync formData when initialData changes (for edit mode)
  useEffect(() => {
    if (initialData && isEdit) {
      setFormData({
        email: initialData.email || '',
        phone: initialData.phone || '',
        imageUrl: initialData.imageUrl || '',
        linkedinUrl: initialData.linkedinUrl || '',
        twitterUrl: initialData.twitterUrl || '',
        active: initialData.active ?? true,
        sortOrder: initialData.sortOrder ?? 0,
        translations: initialData.translations || [
          {
            languageCode: 'az',
            fullName: '',
            position: '',
            bio: '',
            positionDescription: '',
          },
          {
            languageCode: 'en',
            fullName: '',
            position: '',
            bio: '',
            positionDescription: '',
          },
          {
            languageCode: 'ru',
            fullName: '',
            position: '',
            bio: '',
            positionDescription: '',
          },
        ],
      });
      setImagePreview(initialData.imageUrl || '');
    }
  }, [initialData, isEdit]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImage = async (): Promise<string | null> => {
    if (!imageFile) return formData.imageUrl || null;

    try {
      setUploadingImage(true);
      const uploadedFile = await adminFilesService.upload(imageFile, 'OTHER', 'Team member photo');
      return uploadedFile.fileUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image');
      return null;
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Upload image if needed
      let imageUrl = formData.imageUrl;
      if (imageFile) {
        const uploadedUrl = await uploadImage();
        if (!uploadedUrl) {
          setIsLoading(false);
          return;
        }
        imageUrl = uploadedUrl;
      }

      // Filter translations - keep only those with fullName
      const filteredData = {
        ...formData,
        imageUrl,
        translations: formData.translations.filter((t) => t.fullName.trim()),
      };

      // Validate at least one translation
      if (filteredData.translations.length === 0) {
        alert('Please provide at least one name translation');
        setIsLoading(false);
        return;
      }

      // Clean empty fields
      const cleanedData = removeEmptyFields(filteredData);

      const url = isEdit ? `/api/admin/team/${initialData?.id}` : '/api/admin/team';
      const method = isEdit ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cleanedData),
      });

      if (response.ok) {
        alert(`Team member ${isEdit ? 'updated' : 'created'} successfully!`);
        router.push('/dashboard/team');
      } else {
        const error = await response.json();
        console.error('Failed to save team member:', error);
        alert(`Failed to ${isEdit ? 'update' : 'create'} team member: ` + (error.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error saving team member:', error);
      alert(`Error ${isEdit ? 'updating' : 'creating'} team member`);
    } finally {
      setIsLoading(false);
    }
  };

  const updateTranslation = (langIndex: number, field: keyof TeamMemberTranslationDto, value: string) => {
    setFormData((prev) => ({
      ...prev,
      translations: prev.translations.map((t, i) => (i === langIndex ? { ...t, [field]: value } : t)),
    }));
  };

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
            <div className="flex items-start gap-6">
              <div className="flex-shrink-0">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-32 h-32 rounded-full object-cover border-4 border-gray-200"
                  />
                ) : (
                  <div className="w-32 h-32 rounded-full bg-gray-100 flex items-center justify-center border-4 border-gray-200">
                    <svg className="w-16 h-16 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                    </svg>
                  </div>
                )}
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">Upload Photo</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
                <p className="mt-2 text-sm text-gray-500">
                  Recommended: Square image, at least 400x400px, JPG or PNG
                </p>
              </div>
            </div>
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
                  onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 text-gray-900 placeholder:text-gray-400"
                  placeholder="email@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 text-gray-900 placeholder:text-gray-400"
                  placeholder="+994 XX XXX XX XX"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">LinkedIn URL</label>
                <input
                  type="url"
                  value={formData.linkedinUrl}
                  onChange={(e) => setFormData((prev) => ({ ...prev, linkedinUrl: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 text-gray-900 placeholder:text-gray-400"
                  placeholder="https://linkedin.com/in/username"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Twitter URL</label>
                <input
                  type="url"
                  value={formData.twitterUrl}
                  onChange={(e) => setFormData((prev) => ({ ...prev, twitterUrl: e.target.value }))}
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
                  onChange={(e) => setFormData((prev) => ({ ...prev, sortOrder: parseInt(e.target.value) || 0 }))}
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
                      onChange={() => setFormData((prev) => ({ ...prev, active: true }))}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700">Active</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      checked={!formData.active}
                      onChange={() => setFormData((prev) => ({ ...prev, active: false }))}
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
                const translation = formData.translations[languageIndex];
                return (
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={translation.fullName}
                        onChange={(e) => updateTranslation(languageIndex, 'fullName', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 text-gray-900 placeholder:text-gray-400"
                        placeholder="Enter full name"
                        required={languageIndex === 0}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Position/Title</label>
                      <input
                        type="text"
                        value={translation.position}
                        onChange={(e) => updateTranslation(languageIndex, 'position', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 text-gray-900 placeholder:text-gray-400"
                        placeholder="e.g., Senior Accountant"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Position Description</label>
                      <textarea
                        value={translation.positionDescription}
                        onChange={(e) => updateTranslation(languageIndex, 'positionDescription', e.target.value)}
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
                        value={translation.bio}
                        onChange={(e) => updateTranslation(languageIndex, 'bio', e.target.value)}
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
              disabled={isLoading || uploadingImage}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading || uploadingImage}
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
                  {uploadingImage ? 'Uploading image...' : isEdit ? 'Updating...' : 'Creating...'}
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
