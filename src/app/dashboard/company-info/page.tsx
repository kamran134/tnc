'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { adminCompanyInfoService, authService } from '@/lib/api';
import { CompanyInfoAdminDto, CompanyInfoTranslationDto, MissionVisionValueItemDto } from '@/types/api';
import { removeEmptyFields } from '@/lib/utils/cleanup';

export default function CompanyInfoPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [exists, setExists] = useState(false);
  const [formData, setFormData] = useState<CompanyInfoAdminDto>({
    companyName: '',
    email: '',
    phone: '',
    website: '',
    linkedinUrl: '',
    logoUrl: '',
    foundedYear: '',
    teamSize: '',
    translations: [
      { 
        languageCode: 'az', 
        address: '', 
        description: '', 
        history: '',
        missionTitle: '',
        missionDescription: '',
        missions: [{ title: '', description: '', displayOrder: 1 }],
        visionTitle: '',
        visionDescription: '',
        visions: [{ title: '', description: '', displayOrder: 1 }],
        valuesTitle: '',
        valuesDescription: '',
        values: [{ title: '', description: '', displayOrder: 1 }],
      },
      { 
        languageCode: 'en', 
        address: '', 
        description: '', 
        history: '',
        missionTitle: '',
        missionDescription: '',
        missions: [],
        visionTitle: '',
        visionDescription: '',
        visions: [],
        valuesTitle: '',
        valuesDescription: '',
        values: [],
      },
      { 
        languageCode: 'ru', 
        address: '', 
        description: '', 
        history: '',
        missionTitle: '',
        missionDescription: '',
        missions: [],
        visionTitle: '',
        visionDescription: '',
        visions: [],
        valuesTitle: '',
        valuesDescription: '',
        values: [],
      },
    ]
  });

  // Load company info data
  useEffect(() => {
    checkAuthAndLoad();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const checkAuthAndLoad = async () => {
    try {
      const isAuthenticated = await authService.isAuthenticated();
      
      if (!isAuthenticated) {
        router.push('/dashboard/login');
        return;
      }

      await loadCompanyInfo();
    } catch (err) {
      console.error('Auth check failed:', err);
      router.push('/dashboard/login');
    }
  };

  const loadCompanyInfo = async () => {
    try {
      setIsLoadingData(true);
      const data = await adminCompanyInfoService.get();
      console.log('Loaded company info:', data);
      setExists(true);
      setFormData(data);
    } catch (err: any) {
      console.log('Company info not found, create mode');
      setExists(false);
    } finally {
      setIsLoadingData(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsLoading(true);
      
      // Clean the form data before sending to backend
      const cleanedData = removeEmptyFields(formData);
      
      if (exists) {
        await adminCompanyInfoService.update(cleanedData as CompanyInfoAdminDto);
        alert('Company information updated successfully!');
      } else {
        await adminCompanyInfoService.create(cleanedData as CompanyInfoAdminDto);
        alert('Company information created successfully!');
        setExists(true);
      }
      
      await loadCompanyInfo();
    } catch (err: any) {
      console.error('Failed to save company info:', err);
      alert(err.message || 'Failed to save company information');
    } finally {
      setIsLoading(false);
    }
  };

  const updateTranslation = (index: number, field: keyof CompanyInfoTranslationDto, value: any) => {
    const newTranslations = [...formData.translations];
    newTranslations[index] = { ...newTranslations[index], [field]: value };
    setFormData(prev => ({ ...prev, translations: newTranslations }));
  };

  const addItem = (translationIndex: number, type: 'missions' | 'visions' | 'values') => {
    const newTranslations = [...formData.translations];
    const items = newTranslations[translationIndex][type];
    const newItem: MissionVisionValueItemDto = {
      title: '',
      description: '',
      displayOrder: items.length + 1
    };
    newTranslations[translationIndex] = {
      ...newTranslations[translationIndex],
      [type]: [...items, newItem]
    };
    setFormData(prev => ({ ...prev, translations: newTranslations }));
  };

  const removeItem = (translationIndex: number, type: 'missions' | 'visions' | 'values', itemIndex: number) => {
    const newTranslations = [...formData.translations];
    const items = [...newTranslations[translationIndex][type]];
    items.splice(itemIndex, 1);
    newTranslations[translationIndex] = {
      ...newTranslations[translationIndex],
      [type]: items
    };
    setFormData(prev => ({ ...prev, translations: newTranslations }));
  };

  const updateItem = (translationIndex: number, type: 'missions' | 'visions' | 'values', itemIndex: number, field: keyof MissionVisionValueItemDto, value: string | number) => {
    const newTranslations = [...formData.translations];
    const items = [...newTranslations[translationIndex][type]];
    items[itemIndex] = { ...items[itemIndex], [field]: value };
    newTranslations[translationIndex] = {
      ...newTranslations[translationIndex],
      [type]: items
    };
    setFormData(prev => ({ ...prev, translations: newTranslations }));
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete company information?')) {
      return;
    }

    try {
      setIsLoading(true);
      await adminCompanyInfoService.delete();
      alert('Company information deleted successfully!');
      setExists(false);
      setFormData({
        companyName: '',
        email: '',
        phone: '',
        website: '',
        linkedinUrl: '',
        logoUrl: '',
        foundedYear: '',
        teamSize: '',
        translations: [
          { 
            languageCode: 'az', 
            address: '', 
            description: '', 
            history: '',
            missionTitle: '',
            missionDescription: '',
            missions: [{ title: '', description: '', displayOrder: 1 }],
            visionTitle: '',
            visionDescription: '',
            visions: [{ title: '', description: '', displayOrder: 1 }],
            valuesTitle: '',
            valuesDescription: '',
            values: [{ title: '', description: '', displayOrder: 1 }],
          },
          { 
            languageCode: 'en', 
            address: '', 
            description: '', 
            history: '',
            missionTitle: '',
            missionDescription: '',
            missions: [],
            visionTitle: '',
            visionDescription: '',
            visions: [],
            valuesTitle: '',
            valuesDescription: '',
            values: [],
          },
          { 
            languageCode: 'ru', 
            address: '', 
            description: '', 
            history: '',
            missionTitle: '',
            missionDescription: '',
            missions: [],
            visionTitle: '',
            visionDescription: '',
            visions: [],
            valuesTitle: '',
            valuesDescription: '',
            values: [],
          },
        ]
      });
    } catch (err: any) {
      console.error('Failed to delete company info:', err);
      alert(err.message || 'Failed to delete company information');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoadingData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8 flex justify-between items-center">
        <div>
          <button
            onClick={() => router.push('/dashboard')}
            className="text-primary-600 hover:text-primary-700 mb-4 flex items-center gap-2"
          >
            ← Back to Dashboard
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Company Information</h1>
          <p className="text-gray-600 mt-2">
            Manage company details, mission, vision and contact information
          </p>
        </div>
        {exists && (
          <button
            onClick={handleDelete}
            type="button"
            disabled={isLoading}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
          >
            Delete
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* General Information */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">General Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Company Name *</label>
              <input
                type="text"
                value={formData.companyName}
                onChange={(e) => setFormData(prev => ({ ...prev, companyName: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-gray-50 text-gray-900"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-gray-50 text-gray-900"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone *</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-gray-50 text-gray-900"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Website</label>
              <input
                type="url"
                value={formData.website || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-gray-50 text-gray-900"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">LinkedIn URL</label>
              <input
                type="url"
                value={formData.linkedinUrl || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, linkedinUrl: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-gray-50 text-gray-900"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Founded Year</label>
              <input
                type="text"
                value={formData.foundedYear || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, foundedYear: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 text-gray-900 placeholder:text-gray-400"
                placeholder="2020"
                pattern="[0-9]{4}"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Logo URL</label>
              <input
                type="url"
                value={formData.logoUrl || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, logoUrl: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 text-gray-900 placeholder:text-gray-400"
                placeholder="/uploads/logo.png"
              />
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
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address {translation.languageCode === 'az' ? '*' : ''}
                </label>
                <input
                  type="text"
                  value={translation.address}
                  onChange={(e) => updateTranslation(index, 'address', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-gray-50 text-gray-900"
                  required={translation.languageCode === 'az'}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={translation.description || ''}
                  onChange={(e) => updateTranslation(index, 'description', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-gray-50 text-gray-900"
                />
              </div>

              {/* Mission Section */}
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <div className="mb-3">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mission Section Title {translation.languageCode === 'az' ? '*' : ''}
                  </label>
                  <input
                    type="text"
                    value={translation.missionTitle}
                    onChange={(e) => updateTranslation(index, 'missionTitle', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
                    placeholder="e.g., Our Mission"
                    required={translation.languageCode === 'az'}
                  />
                </div>
                <div className="mb-3">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Mission Section Description</label>
                  <textarea
                    value={translation.missionDescription || ''}
                    onChange={(e) => updateTranslation(index, 'missionDescription', e.target.value)}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
                    placeholder="Brief description of mission section"
                  />
                </div>
                <div className="flex justify-between items-center mb-3">
                  <label className="block text-sm font-medium text-gray-700">
                    Mission Items {translation.languageCode === 'az' ? '*' : ''}
                  </label>
                  <button
                    type="button"
                    onClick={() => addItem(index, 'missions')}
                    className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    + Add Mission
                  </button>
                </div>
                {translation.missions.map((item, iIndex) => (
                  <div key={iIndex} className="border border-gray-200 rounded-lg p-4 mb-3 bg-white">
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium text-gray-600">Mission #{iIndex + 1}</span>
                      {translation.missions.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeItem(index, 'missions', iIndex)}
                          className="text-red-600 text-sm hover:text-red-700"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                    <div className="space-y-2">
                      <input
                        type="text"
                        placeholder="Title"
                        value={item.title}
                        onChange={(e) => updateItem(index, 'missions', iIndex, 'title', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 bg-gray-50 text-gray-900"
                        required={translation.languageCode === 'az'}
                      />
                      <textarea
                        placeholder="Description"
                        value={item.description}
                        onChange={(e) => updateItem(index, 'missions', iIndex, 'description', e.target.value)}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 bg-gray-50 text-gray-900"
                        required={translation.languageCode === 'az'}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Vision Section */}
              <div className="mt-6 p-4 bg-green-50 rounded-lg">
                <div className="mb-3">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Vision Section Title {translation.languageCode === 'az' ? '*' : ''}
                  </label>
                  <input
                    type="text"
                    value={translation.visionTitle}
                    onChange={(e) => updateTranslation(index, 'visionTitle', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 bg-white text-gray-900"
                    placeholder="e.g., Our Vision"
                    required={translation.languageCode === 'az'}
                  />
                </div>
                <div className="mb-3">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Vision Section Description</label>
                  <textarea
                    value={translation.visionDescription || ''}
                    onChange={(e) => updateTranslation(index, 'visionDescription', e.target.value)}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 bg-white text-gray-900"
                    placeholder="Brief description of vision section"
                  />
                </div>
                <div className="flex justify-between items-center mb-3">
                  <label className="block text-sm font-medium text-gray-700">
                    Vision Items {translation.languageCode === 'az' ? '*' : ''}
                  </label>
                  <button
                    type="button"
                    onClick={() => addItem(index, 'visions')}
                    className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700"
                  >
                    + Add Vision
                  </button>
                </div>
                {translation.visions.map((item, iIndex) => (
                  <div key={iIndex} className="border border-gray-200 rounded-lg p-4 mb-3 bg-white">
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium text-gray-600">Vision #{iIndex + 1}</span>
                      {translation.visions.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeItem(index, 'visions', iIndex)}
                          className="text-red-600 text-sm hover:text-red-700"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                    <div className="space-y-2">
                      <input
                        type="text"
                        placeholder="Title"
                        value={item.title}
                        onChange={(e) => updateItem(index, 'visions', iIndex, 'title', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 bg-gray-50 text-gray-900"
                        required={translation.languageCode === 'az'}
                      />
                      <textarea
                        placeholder="Description"
                        value={item.description}
                        onChange={(e) => updateItem(index, 'visions', iIndex, 'description', e.target.value)}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 bg-gray-50 text-gray-900"
                        required={translation.languageCode === 'az'}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Values Section */}
              <div className="mt-6 p-4 bg-purple-50 rounded-lg">
                <div className="mb-3">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Values Section Title {translation.languageCode === 'az' ? '*' : ''}
                  </label>
                  <input
                    type="text"
                    value={translation.valuesTitle}
                    onChange={(e) => updateTranslation(index, 'valuesTitle', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 bg-white text-gray-900"
                    placeholder="e.g., Our Core Values"
                    required={translation.languageCode === 'az'}
                  />
                </div>
                <div className="mb-3">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Values Section Description</label>
                  <textarea
                    value={translation.valuesDescription || ''}
                    onChange={(e) => updateTranslation(index, 'valuesDescription', e.target.value)}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 bg-white text-gray-900"
                    placeholder="Brief description of values section"
                  />
                </div>
                <div className="flex justify-between items-center mb-3">
                  <label className="block text-sm font-medium text-gray-700">
                    Value Items {translation.languageCode === 'az' ? '*' : ''}
                  </label>
                  <button
                    type="button"
                    onClick={() => addItem(index, 'values')}
                    className="px-3 py-1 text-sm bg-purple-600 text-white rounded hover:bg-purple-700"
                  >
                    + Add Value
                  </button>
                </div>
                {translation.values.map((item, iIndex) => (
                  <div key={iIndex} className="border border-gray-200 rounded-lg p-4 mb-3 bg-white">
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium text-gray-600">Value #{iIndex + 1}</span>
                      {translation.values.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeItem(index, 'values', iIndex)}
                          className="text-red-600 text-sm hover:text-red-700"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                    <div className="space-y-2">
                      <input
                        type="text"
                        placeholder="Title"
                        value={item.title}
                        onChange={(e) => updateItem(index, 'values', iIndex, 'title', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-purple-500 bg-gray-50 text-gray-900"
                        required={translation.languageCode === 'az'}
                      />
                      <textarea
                        placeholder="Description"
                        value={item.description}
                        onChange={(e) => updateItem(index, 'values', iIndex, 'description', e.target.value)}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-purple-500 bg-gray-50 text-gray-900"
                        required={translation.languageCode === 'az'}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">History</label>
                <textarea
                  value={translation.history || ''}
                  onChange={(e) => updateTranslation(index, 'history', e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-gray-50 text-gray-900"
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
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (exists ? 'Updating...' : 'Creating...') : (exists ? 'Update Company Info' : 'Create Company Info')}
          </button>
        </div>
      </form>
    </div>
  );
}
