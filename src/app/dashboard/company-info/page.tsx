'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { CompanyInfoAdminDto, CompanyInfoTranslationDto, MissionVisionValueItemDto } from '@/types/api';
import { removeEmptyFields } from '@/lib/utils/cleanup';
import IconSelector from '@/components/admin/IconSelector';
import { getMissionIcons, getVisionIcons } from '@/lib/icons/mission-vision-icons';
import LanguageTabs from '@/components/admin/LanguageTabs';
import { useToast, ImageUpload } from '@/components/ui';
import { useCompanyInfoQuery, useCompanyInfoMutation } from '@/hooks/queries';

const DEFAULT_FORM_DATA: CompanyInfoAdminDto = {
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
      missions: [{ title: '', description: '', displayOrder: 1, icon: '' }],
      visionTitle: '',
      visionDescription: '',
      visions: [{ title: '', description: '', displayOrder: 1, icon: '' }],
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
      missions: [{ title: '', description: '', displayOrder: 1, icon: '' }],
      visionTitle: '',
      visionDescription: '',
      visions: [{ title: '', description: '', displayOrder: 1, icon: '' }],
      valuesTitle: '',
      valuesDescription: '',
      values: [{ title: '', description: '', displayOrder: 1 }],
    },
    { 
      languageCode: 'ru', 
      address: '', 
      description: '', 
      history: '',
      missionTitle: '',
      missionDescription: '',
      missions: [{ title: '', description: '', displayOrder: 1, icon: '' }],
      visionTitle: '',
      visionDescription: '',
      visions: [{ title: '', description: '', displayOrder: 1, icon: '' }],
      valuesTitle: '',
      valuesDescription: '',
      values: [{ title: '', description: '', displayOrder: 1 }],
    },
  ]
};

function normalizeCompanyInfo(data: CompanyInfoAdminDto): CompanyInfoAdminDto {
  // Ensure all 3 languages exist
  const allLanguages: ('az' | 'en' | 'ru')[] = ['az', 'en', 'ru'];
  const normalizedData = { ...data };
  
  if (normalizedData.translations) {
    allLanguages.forEach(langCode => {
      if (!normalizedData.translations.find(t => t.languageCode === langCode)) {
        normalizedData.translations.push({
          languageCode: langCode,
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
          values: []
        });
      }
    });
    
    // Sort to ensure correct order: az, en, ru
    normalizedData.translations.sort((a, b) => {
      const order = { az: 0, en: 1, ru: 2 };
      return order[a.languageCode] - order[b.languageCode];
    });
    
    // Синхронизируем длины массивов missions/visions/values для всех языков
    if (normalizedData.translations.length > 0) {
      const maxMissions = Math.max(...normalizedData.translations.map(t => t.missions?.length || 0));
      const maxVisions = Math.max(...normalizedData.translations.map(t => t.visions?.length || 0));
      const maxValues = Math.max(...normalizedData.translations.map(t => t.values?.length || 0));
      
      normalizedData.translations.forEach((translation, index) => {
        // Дополняем missions до максимальной длины
        while ((translation.missions?.length || 0) < maxMissions) {
          if (!translation.missions) translation.missions = [];
          translation.missions.push({
            title: '',
            description: '',
            displayOrder: translation.missions.length + 1,
            ...(index === 0 ? { icon: '' } : {})
          });
        }
        
        // Дополняем visions до максимальной длины
        while ((translation.visions?.length || 0) < maxVisions) {
          if (!translation.visions) translation.visions = [];
          translation.visions.push({
            title: '',
            description: '',
            displayOrder: translation.visions.length + 1,
            ...(index === 0 ? { icon: '' } : {})
          });
        }
        
        // Дополняем values до максимальной длины
        while ((translation.values?.length || 0) < maxValues) {
          if (!translation.values) translation.values = [];
          translation.values.push({
            title: '',
            description: '',
            displayOrder: translation.values.length + 1
          });
        }
      });
    }
  }
  
  return normalizedData;
}

export default function CompanyInfoPage() {
  const router = useRouter();
  const toast = useToast();
  const [formData, setFormData] = useState<CompanyInfoAdminDto>(DEFAULT_FORM_DATA);

  // React Query hooks
  const { data: serverData, isLoading: isLoadingData, error } = useCompanyInfoQuery();
  const { create, update, delete: deleteCompanyInfo } = useCompanyInfoMutation();

  // Memoized values
  const exists = useMemo(() => !!serverData, [serverData]);
  const isSubmitting = useMemo(
    () => create.isPending || update.isPending || deleteCompanyInfo.isPending,
    [create.isPending, update.isPending, deleteCompanyInfo.isPending]
  );

  // Initialize form with server data (only once when data loads)
  useEffect(() => {
    if (serverData) {
      setFormData(normalizeCompanyInfo(serverData));
    }
  }, [serverData]);

  // Memoized update handlers
  const updateTranslation = useCallback((index: number, field: keyof CompanyInfoTranslationDto, value: any) => {
    const newTranslations = [...formData.translations];
    newTranslations[index] = { ...newTranslations[index], [field]: value };
    setFormData(prev => ({ ...prev, translations: newTranslations }));
  }, [formData.translations]);

  const addItem = useCallback((translationIndex: number, type: 'missions' | 'visions' | 'values') => {
    const newTranslations = [...formData.translations];
    const itemsLength = newTranslations[0][type].length;
    
    // Add item to ALL languages
    newTranslations.forEach((translation, index) => {
      const newItem: MissionVisionValueItemDto = {
        title: '',
        description: '',
        displayOrder: itemsLength + 1,
        ...(type !== 'values' && index === 0 ? { icon: '' } : {})
      };
      newTranslations[index] = {
        ...newTranslations[index],
        [type]: [...newTranslations[index][type], newItem]
      };
    });
    
    setFormData(prev => ({ ...prev, translations: newTranslations }));
  }, [formData.translations]);

  const removeItem = useCallback((translationIndex: number, type: 'missions' | 'visions' | 'values', itemIndex: number) => {
    const newTranslations = [...formData.translations];
    
    // Remove item from ALL languages
    newTranslations.forEach((translation, index) => {
      const items = [...newTranslations[index][type]];
      items.splice(itemIndex, 1);
      newTranslations[index] = {
        ...newTranslations[index],
        [type]: items
      };
    });
    
    setFormData(prev => ({ ...prev, translations: newTranslations }));
  }, [formData.translations]);

  const updateItem = useCallback((translationIndex: number, type: 'missions' | 'visions' | 'values', itemIndex: number, field: keyof MissionVisionValueItemDto, value: string | number) => {
    const newTranslations = [...formData.translations];
    
    // Ensure the array exists
    if (!newTranslations[translationIndex][type]) {
      newTranslations[translationIndex][type] = [];
    }
    
    // Ensure the item exists at the index
    if (!newTranslations[translationIndex][type][itemIndex]) {
      newTranslations[translationIndex][type][itemIndex] = {
        title: '',
        description: '',
        displayOrder: itemIndex + 1
      };
    }
    
    const items = [...newTranslations[translationIndex][type]];
    items[itemIndex] = { ...items[itemIndex], [field]: value };
    newTranslations[translationIndex] = {
      ...newTranslations[translationIndex],
      [type]: items
    };
    setFormData(prev => ({ ...prev, translations: newTranslations }));
  }, [formData.translations]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Фильтруем переводы - оставляем только те, где есть хотя бы одно заполненное поле
    const filteredData = {
      ...formData,
      translations: formData.translations.filter(t => 
        t.address?.trim() || 
        t.description?.trim() || 
        t.history?.trim() ||
        t.missionTitle?.trim() ||
        t.missionDescription?.trim() ||
        t.visionTitle?.trim() ||
        t.visionDescription?.trim() ||
        t.valuesTitle?.trim() ||
        t.valuesDescription?.trim() ||
        (t.missions && t.missions.length > 0 && t.missions.some(m => m.title?.trim() || m.description?.trim())) ||
        (t.visions && t.visions.length > 0 && t.visions.some(v => v.title?.trim() || v.description?.trim())) ||
        (t.values && t.values.length > 0 && t.values.some(v => v.title?.trim() || v.description?.trim()))
      )
    };
    
    // Clean the form data before sending to backend
    const cleanedData = removeEmptyFields(filteredData);
    
    try {
      if (exists) {
        await update.mutateAsync(cleanedData as CompanyInfoAdminDto);
        toast.success('Company information updated successfully!');
      } else {
        await create.mutateAsync(cleanedData as CompanyInfoAdminDto);
        toast.success('Company information created successfully!');
      }
    } catch (err: any) {
      console.error('Failed to save company info:', err);
      toast.error(err.message || 'Failed to save company information');
    }
  }, [formData, exists, create, update, toast]);

  const handleDelete = useCallback(async () => {
    if (!confirm('Are you sure you want to delete company information?')) {
      return;
    }

    try {
      await deleteCompanyInfo.mutateAsync();
      toast.success('Company information deleted successfully!');
      setFormData(DEFAULT_FORM_DATA);
    } catch (err: any) {
      console.error('Failed to delete company info:', err);
      toast.error(err.message || 'Failed to delete company information');
    }
  }, [deleteCompanyInfo, toast]);

  // Memoize mission and vision icons (before any conditional returns)
  const missionIcons = useMemo(() => getMissionIcons(), []);
  const visionIcons = useMemo(() => getVisionIcons(), []);

  // Show loading state
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
            disabled={isSubmitting}
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
              <ImageUpload
                label="Company Logo"
                value={formData.logoUrl || ''}
                onChange={(imageUrl) => setFormData(prev => ({ ...prev, logoUrl: imageUrl }))}
                fileType="COMPANY_LOGO"
              />
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
          );
        }}
      </LanguageTabs>
    </div>

        {/* Mission Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Mission Section</h2>
          
          <LanguageTabs>
            {(activeLanguage, langIndex) => {
              const translation = formData.translations[langIndex];
              return (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Section Title {translation.languageCode === 'az' ? '*' : ''}
                    </label>
                    <input
                      type="text"
                      value={translation.missionTitle}
                      onChange={(e) => updateTranslation(langIndex, 'missionTitle', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-gray-50 text-gray-900"
                      placeholder="e.g., Our Mission"
                      required={translation.languageCode === 'az'}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Section Description</label>
                    <textarea
                      value={translation.missionDescription || ''}
                      onChange={(e) => updateTranslation(langIndex, 'missionDescription', e.target.value)}
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-gray-50 text-gray-900"
                      placeholder="Brief description"
                    />
                  </div>
                </div>
              );
            }}
          </LanguageTabs>

          <div className="mt-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Mission Items</h3>
              <button
                type="button"
                onClick={() => addItem(0, 'missions')}
                className="px-3 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                + Add Mission
              </button>
            </div>

            {formData.translations[0].missions.map((_, missionIndex) => (
              <div key={missionIndex} className="border border-gray-200 rounded-lg p-4 mb-4 bg-blue-50">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="font-semibold text-gray-900">Mission #{missionIndex + 1}</h4>
                  {formData.translations[0].missions.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeItem(0, 'missions', missionIndex)}
                      className="text-red-600 text-sm hover:text-red-700 font-medium"
                    >
                      Remove
                    </button>
                  )}
                </div>

                {/* Icon Selector */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Icon (for az language)</label>
                  <IconSelector
                    icons={missionIcons}
                    selectedIcon={formData.translations[0].missions[missionIndex].icon || ''}
                    onSelect={(iconName) => {
                      updateItem(0, 'missions', missionIndex, 'icon', iconName);
                    }}
                  />
                </div>

                {/* Fields for each language */}
                {formData.translations.map((translation, langIndex) => {
                  console.log(`Mission ${missionIndex}, Lang ${translation.languageCode}:`, translation.missions?.[missionIndex]);
                  return (
                  <div key={translation.languageCode} className="mb-4 p-3 bg-white rounded border border-gray-200">
                    <h5 className="text-sm font-semibold text-gray-700 mb-2">
                      {translation.languageCode.toUpperCase()}
                    </h5>
                    <div className="space-y-2">
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Title</label>
                        <input
                          type="text"
                          placeholder="Title"
                          value={translation.missions?.[missionIndex]?.title || ''}
                          onChange={(e) => updateItem(langIndex, 'missions', missionIndex, 'title', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 bg-gray-50 text-gray-900"
                          required={translation.languageCode === 'az'}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Description</label>
                        <textarea
                          placeholder="Description"
                          value={translation.missions?.[missionIndex]?.description || ''}
                          onChange={(e) => updateItem(langIndex, 'missions', missionIndex, 'description', e.target.value)}
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 bg-gray-50 text-gray-900"
                          required={translation.languageCode === 'az'}
                        />
                      </div>
                    </div>
                  </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* Vision Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Vision Section</h2>
          
          <LanguageTabs>
            {(activeLanguage, langIndex) => {
              const translation = formData.translations[langIndex];
              return (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Section Title {translation.languageCode === 'az' ? '*' : ''}
                    </label>
                    <input
                      type="text"
                      value={translation.visionTitle}
                      onChange={(e) => updateTranslation(langIndex, 'visionTitle', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 bg-gray-50 text-gray-900"
                      placeholder="e.g., Our Vision"
                      required={translation.languageCode === 'az'}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Section Description</label>
                    <textarea
                      value={translation.visionDescription || ''}
                      onChange={(e) => updateTranslation(langIndex, 'visionDescription', e.target.value)}
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 bg-gray-50 text-gray-900"
                      placeholder="Brief description"
                    />
                  </div>
                </div>
              );
            }}
          </LanguageTabs>

          <div className="mt-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Vision Items</h3>
              <button
                type="button"
                onClick={() => addItem(0, 'visions')}
                className="px-3 py-2 text-sm bg-green-600 text-white rounded hover:bg-green-700"
              >
                + Add Vision
              </button>
            </div>

            {formData.translations[0].visions.map((_, visionIndex) => (
              <div key={visionIndex} className="border border-gray-200 rounded-lg p-4 mb-4 bg-green-50">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="font-semibold text-gray-900">Vision #{visionIndex + 1}</h4>
                  {formData.translations[0].visions.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeItem(0, 'visions', visionIndex)}
                      className="text-red-600 text-sm hover:text-red-700 font-medium"
                    >
                      Remove
                    </button>
                  )}
                </div>

                {/* Icon Selector */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Icon (for az language)</label>
                  <IconSelector
                    icons={visionIcons}
                    selectedIcon={formData.translations[0].visions[visionIndex].icon || ''}
                    onSelect={(iconName) => {
                      updateItem(0, 'visions', visionIndex, 'icon', iconName);
                    }}
                  />
                </div>

                {/* Fields for each language */}
                {formData.translations.map((translation, langIndex) => (
                  <div key={translation.languageCode} className="mb-4 p-3 bg-white rounded border border-gray-200">
                    <h5 className="text-sm font-semibold text-gray-700 mb-2">
                      {translation.languageCode.toUpperCase()}
                    </h5>
                    <div className="space-y-2">
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Title</label>
                        <input
                          type="text"
                          placeholder="Title"
                          value={translation.visions?.[visionIndex]?.title || ''}
                          onChange={(e) => updateItem(langIndex, 'visions', visionIndex, 'title', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 bg-gray-50 text-gray-900"
                          required={translation.languageCode === 'az'}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Description</label>
                        <textarea
                          placeholder="Description"
                          value={translation.visions?.[visionIndex]?.description || ''}
                          onChange={(e) => updateItem(langIndex, 'visions', visionIndex, 'description', e.target.value)}
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 bg-gray-50 text-gray-900"
                          required={translation.languageCode === 'az'}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Values Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Values Section</h2>
          
          <LanguageTabs>
            {(activeLanguage, langIndex) => {
              const translation = formData.translations[langIndex];
              return (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Section Title {translation.languageCode === 'az' ? '*' : ''}
                    </label>
                    <input
                      type="text"
                      value={translation.valuesTitle}
                      onChange={(e) => updateTranslation(langIndex, 'valuesTitle', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 bg-gray-50 text-gray-900"
                      placeholder="e.g., Our Core Values"
                      required={translation.languageCode === 'az'}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Section Description</label>
                    <textarea
                      value={translation.valuesDescription || ''}
                      onChange={(e) => updateTranslation(langIndex, 'valuesDescription', e.target.value)}
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 bg-gray-50 text-gray-900"
                      placeholder="Brief description"
                    />
                  </div>
                </div>
              );
            }}
          </LanguageTabs>

          <div className="mt-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Value Items</h3>
              <button
                type="button"
                onClick={() => addItem(0, 'values')}
                className="px-3 py-2 text-sm bg-purple-600 text-white rounded hover:bg-purple-700"
              >
                + Add Value
              </button>
            </div>

            {formData.translations[0].values.map((_, valueIndex) => (
              <div key={valueIndex} className="border border-gray-200 rounded-lg p-4 mb-4 bg-purple-50">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="font-semibold text-gray-900">Value #{valueIndex + 1}</h4>
                  {formData.translations[0].values.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeItem(0, 'values', valueIndex)}
                      className="text-red-600 text-sm hover:text-red-700 font-medium"
                    >
                      Remove
                    </button>
                  )}
                </div>

                {/* Fields for each language */}
                {formData.translations.map((translation, langIndex) => (
                  <div key={translation.languageCode} className="mb-4 p-3 bg-white rounded border border-gray-200">
                    <h5 className="text-sm font-semibold text-gray-700 mb-2">
                      {translation.languageCode.toUpperCase()}
                    </h5>
                    <div className="space-y-2">
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Title</label>
                        <input
                          type="text"
                          placeholder="Title"
                          value={translation.values?.[valueIndex]?.title || ''}
                          onChange={(e) => updateItem(langIndex, 'values', valueIndex, 'title', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-purple-500 bg-gray-50 text-gray-900"
                          required={translation.languageCode === 'az'}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Description</label>
                        <textarea
                          placeholder="Description"
                          value={translation.values?.[valueIndex]?.description || ''}
                          onChange={(e) => updateItem(langIndex, 'values', valueIndex, 'description', e.target.value)}
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-purple-500 bg-gray-50 text-gray-900"
                          required={translation.languageCode === 'az'}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (exists ? 'Updating...' : 'Creating...') : (exists ? 'Update Company Info' : 'Create Company Info')}
          </button>
        </div>
      </form>
    </div>
  );
}
