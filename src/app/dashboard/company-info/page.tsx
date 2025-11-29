'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { adminCompanyInfoService, authService } from '@/lib/api';
import { CompanyInfoAdminDto, CompanyInfoTranslationDto } from '@/types/api';

export default function CompanyInfoPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [exists, setExists] = useState(false);
  const [formData, setFormData] = useState<CompanyInfoAdminDto>({
    email: '',
    phone: '',
    website: '',
    linkedinUrl: '',
    logoUrl: '',
    foundedYear: '',
    translations: [
      { languageCode: 'az', companyName: '', address: '', mission: '', vision: '', description: '', history: '', values: '' },
      { languageCode: 'en', companyName: '', address: '', mission: '', vision: '', description: '', history: '', values: '' },
      { languageCode: 'ru', companyName: '', address: '', mission: '', vision: '', description: '', history: '', values: '' },
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
      
      if (exists) {
        await adminCompanyInfoService.update(formData);
        alert('Company information updated successfully!');
      } else {
        await adminCompanyInfoService.create(formData);
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

  const updateTranslation = (index: number, field: keyof CompanyInfoTranslationDto, value: string) => {
    const newTranslations = [...formData.translations];
    newTranslations[index] = { ...newTranslations[index], [field]: value };
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
        email: '',
        phone: '',
        website: '',
        linkedinUrl: '',
        logoUrl: '',
        foundedYear: '',
        translations: [
          { languageCode: 'az', companyName: '', address: '', mission: '', vision: '', description: '', history: '', values: '' },
          { languageCode: 'en', companyName: '', address: '', mission: '', vision: '', description: '', history: '', values: '' },
          { languageCode: 'ru', companyName: '', address: '', mission: '', vision: '', description: '', history: '', values: '' },
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
              <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 text-gray-900 placeholder:text-gray-400"
                placeholder="info@company.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone *</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 text-gray-900 placeholder:text-gray-400"
                placeholder="+994 XX XXX XX XX"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Website</label>
              <input
                type="url"
                value={formData.website || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 text-gray-900 placeholder:text-gray-400"
                placeholder="https://company.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">LinkedIn URL</label>
              <input
                type="url"
                value={formData.linkedinUrl || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, linkedinUrl: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 text-gray-900 placeholder:text-gray-400"
                placeholder="https://linkedin.com/company/..."
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
                <label className="block text-sm font-medium text-gray-700 mb-2">Company Name *</label>
                <input
                  type="text"
                  value={translation.companyName}
                  onChange={(e) => updateTranslation(index, 'companyName', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 text-gray-900 placeholder:text-gray-400"
                  placeholder={`Company name in ${translation.languageCode.toUpperCase()}`}
                  required={translation.languageCode === 'az'}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Address *</label>
                <input
                  type="text"
                  value={translation.address}
                  onChange={(e) => updateTranslation(index, 'address', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 text-gray-900 placeholder:text-gray-400"
                  placeholder={`Office address in ${translation.languageCode.toUpperCase()}`}
                  required={translation.languageCode === 'az'}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={translation.description || ''}
                  onChange={(e) => updateTranslation(index, 'description', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 text-gray-900 placeholder:text-gray-400"
                  placeholder={`Brief company description in ${translation.languageCode.toUpperCase()}`}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Mission *</label>
                <textarea
                  value={translation.mission}
                  onChange={(e) => updateTranslation(index, 'mission', e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 text-gray-900 placeholder:text-gray-400"
                  placeholder={`Company mission statement in ${translation.languageCode.toUpperCase()}`}
                  required={translation.languageCode === 'az'}
                  minLength={10}
                  maxLength={1000}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Vision *</label>
                <textarea
                  value={translation.vision}
                  onChange={(e) => updateTranslation(index, 'vision', e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 text-gray-900 placeholder:text-gray-400"
                  placeholder={`Company vision in ${translation.languageCode.toUpperCase()}`}
                  required={translation.languageCode === 'az'}
                  minLength={10}
                  maxLength={1000}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">History</label>
                <textarea
                  value={translation.history || ''}
                  onChange={(e) => updateTranslation(index, 'history', e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 text-gray-900 placeholder:text-gray-400"
                  placeholder={`Company history in ${translation.languageCode.toUpperCase()}`}
                  maxLength={1000}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Core Values</label>
                <textarea
                  value={translation.values || ''}
                  onChange={(e) => updateTranslation(index, 'values', e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 text-gray-900 placeholder:text-gray-400"
                  placeholder={`Company core values in ${translation.languageCode.toUpperCase()}`}
                  maxLength={1000}
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
