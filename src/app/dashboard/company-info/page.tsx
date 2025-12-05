'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { adminCompanyInfoService, authService } from '@/lib/api';
import { CompanyInfoAdminDto, CompanyInfoTranslationDto, MissionVisionValueItemDto } from '@/types/api';
import { removeEmptyFields } from '@/lib/utils/cleanup';
import IconSelector from '@/components/admin/IconSelector';
import { getMissionIcons, getVisionIcons } from '@/lib/icons/mission-vision-icons';
import LanguageTabs from '@/components/admin/LanguageTabs';

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
      
      // Синхронизируем длины массивов missions/visions/values для всех языков
      if (data.translations && data.translations.length > 0) {
        const maxMissions = Math.max(...data.translations.map(t => t.missions?.length || 0));
        const maxVisions = Math.max(...data.translations.map(t => t.visions?.length || 0));
        const maxValues = Math.max(...data.translations.map(t => t.values?.length || 0));
        
        data.translations.forEach((translation, index) => {
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
  };

  const removeItem = (translationIndex: number, type: 'missions' | 'visions' | 'values', itemIndex: number) => {
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
  };

  const updateItem = (translationIndex: number, type: 'missions' | 'visions' | 'values', itemIndex: number, field: keyof MissionVisionValueItemDto, value: string | number) => {
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
                    icons={getMissionIcons()}
                    selectedIcon={formData.translations[0].missions[missionIndex].icon || ''}
                    onSelect={(iconName) => {
                      updateItem(0, 'missions', missionIndex, 'icon', iconName);
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
                ))}
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
                    icons={getVisionIcons()}
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
