'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ServiceAdminDto } from '@/types/api';
import { useAdminServicesListQuery, useDeleteServiceMutation } from '@/hooks/queries';
import { Pagination } from '@/components/ui';

export default function ServicesPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const { data: servicesData, isLoading } = useAdminServicesListQuery({ 
    page: currentPage, 
    size: pageSize 
  });
  const deleteServiceMutation = useDeleteServiceMutation();

  const getTranslation = (service: ServiceAdminDto, lang: string = 'az') => {
    return service.translations?.find(t => t.languageCode === lang) || service.translations?.[0];
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString();
  };

  const handleDelete = async (serviceId: number) => {
    if (!confirm('Are you sure you want to delete this service?')) return;
    
    try {
      await deleteServiceMutation.mutateAsync(serviceId);
    } catch (error) {
      console.error('Error deleting service:', error);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(0); // Reset to first page when changing page size
  };

  const handleToggleActive = async (serviceId: number, currentStatus: boolean) => {
    try {
      const action = currentStatus ? 'deactivate' : 'activate';
      const response = await fetch(`/api/admin/services/${serviceId}/${action}`, {
        method: 'PATCH',
      });

      if (response.ok) {
        // Refresh the list
        window.location.reload();
      } else {
        alert(`Failed to ${action} service`);
      }
    } catch (error) {
      console.error('Error toggling service status:', error);
      alert('Error updating service status');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center space-x-3">
          <svg className="animate-spin h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span className="text-xl font-medium text-gray-700">Loading services...</span>
        </div>
      </div>
    );
  }

  // Debug: log the data structure
  console.log('Services Data:', servicesData);
  console.log('Pagination info:', {
    totalElements: servicesData?.totalElements,
    totalPages: servicesData?.totalPages,
    size: servicesData?.size,
    number: servicesData?.number,
    contentLength: servicesData?.content?.length
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Services Management</h1>
              <p className="text-gray-600">Manage company services and offerings</p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => router.push('/dashboard/service-categories')}
                className="px-4 py-2 text-blue-600 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
              >
                📁 Manage Categories
              </button>
              <button
                onClick={() => router.push('/dashboard')}
                className="px-4 py-2 text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                ← Back to Dashboard
              </button>
              <button
                onClick={() => router.push('/dashboard/services/new')}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                + Add Service
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Search Services</label>
              <input
                type="text"
                placeholder="Search services..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 text-gray-900 placeholder:text-gray-400"
              />
            </div>
            <div className="flex items-end">
              <button
                onClick={() => { setSearchTerm(''); setCategoryFilter(''); }}
                className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {/* Services Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {servicesData?.content?.map((service) => {
                  const translation = getTranslation(service);
                  
                  return (
                    <tr key={service.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {translation?.title || 'No title'}
                          </div>
                          <div className="text-sm text-gray-500 truncate max-w-xs">
                            {translation?.excerpt || translation?.content?.substring(0, 100) + '...'}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {service.categoryName || service.category || 'No category'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          service.active 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {service.active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {service.sortOrder || '-'}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {formatDate(service.createdAt)}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => router.push(`/dashboard/services/${service.id}`)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => service.id && handleToggleActive(service.id, service.active ?? false)}
                            className={service.active ? "text-orange-600 hover:text-orange-900" : "text-green-600 hover:text-green-900"}
                          >
                            {service.active ? 'Deactivate' : 'Activate'}
                          </button>
                          <button
                            onClick={() => service.id && handleDelete(service.id)}
                            className="text-red-600 hover:text-red-900"
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
        </div>
        
        {/* Debug info - временно */}
        {servicesData && (
          <div className="bg-yellow-50 border border-yellow-200 rounded p-4 mt-4">
            <h3 className="font-bold text-yellow-800 mb-2">Debug Info:</h3>
            <pre className="text-xs overflow-auto">
              {JSON.stringify({
                totalElements: servicesData.totalElements,
                totalPages: servicesData.totalPages,
                size: servicesData.size,
                number: servicesData.number,
                contentLength: servicesData.content?.length,
                first: servicesData.first,
                last: servicesData.last
              }, null, 2)}
            </pre>
          </div>
        )}
        
        {/* Pagination - placed outside table container */}
        {servicesData && (
          <div className="bg-white rounded-b-lg shadow-sm border-t-0 border border-gray-200 mt-0">
            <Pagination
              currentPage={servicesData.number || 0}
              totalPages={servicesData.totalPages || 1}
              pageSize={servicesData.size || pageSize}
              totalElements={servicesData.totalElements || 0}
              onPageChange={handlePageChange}
              onPageSizeChange={handlePageSizeChange}
            />
          </div>
        )}

        {servicesData?.content?.length === 0 && !isLoading && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No services found</h3>
            <p className="mt-1 text-sm text-gray-500">Get started by creating a new service.</p>
            <div className="mt-6">
              <button
                onClick={() => router.push('/dashboard/services/new')}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                + Add Service
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}