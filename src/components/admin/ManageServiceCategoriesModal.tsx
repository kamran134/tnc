'use client';

import { useState, useEffect } from 'react';
import { ServiceCategoryAdminDto } from '@/types/api';
import { adminServiceCategoriesService } from '@/lib/api';
import { useToast } from '@/components/ui';
import { ConfirmModal } from '@/components/ui';
import { getServiceCategoryIconByName } from '@/lib/icons/service-category-icons';
import { getTranslation } from '@/lib/utils/translations';
import ServiceCategoryFormModal from './ServiceCategoryFormModal';

interface ManageServiceCategoriesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ManageServiceCategoriesModal({
  isOpen,
  onClose,
}: ManageServiceCategoriesModalProps) {
  const [categories, setCategories] = useState<ServiceCategoryAdminDto[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<ServiceCategoryAdminDto | null>(null);
  const toast = useToast();
  const [deleteTarget, setDeleteTarget] = useState<number | null>(null);

  const loadCategories = async () => {
    setIsLoading(true);
    try {
      const data = await adminServiceCategoriesService.getAllAsList();
      setCategories(data.sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0)));
    } catch (error) {
      console.error('Failed to load categories:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadCategories();
    }
  }, [isOpen]);

  const handleDelete = async (id: number) => {
    setDeleteTarget(id);
  };

  const confirmDelete = async () => {
    if (deleteTarget === null) return;
    try {
      await adminServiceCategoriesService.delete(deleteTarget);
      await loadCategories();
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete category');
    } finally {
      setDeleteTarget(null);
    }
  };

  const handleEdit = (category: ServiceCategoryAdminDto) => {
    setSelectedCategory(category);
    setIsFormOpen(true);
  };

  const handleCreate = () => {
    setSelectedCategory(null);
    setIsFormOpen(true);
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setSelectedCategory(null);
  };

  const handleFormSuccess = () => {
    loadCategories();
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-40 overflow-y-auto">
        <div className="flex min-h-screen items-center justify-center p-4">
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
            onClick={onClose}
          />

          {/* Modal */}
          <div className="relative bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b sticky top-0 bg-white z-10">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Service Categories</h2>
                <p className="text-sm text-gray-600 mt-1">Manage service categories and their translations</p>
              </div>
              <div className="flex items-center space-x-3">
                <button
                  type="button"
                  onClick={handleCreate}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  + Add Category
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              {isLoading ? (
                <div className="flex justify-center items-center py-12">
                  <div className="flex items-center space-x-3">
                    <svg className="animate-spin h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span className="text-xl font-medium text-gray-700">Loading...</span>
                  </div>
                </div>
              ) : categories.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-lg mb-4">No categories yet</p>
                  <button
                    type="button"
                    onClick={handleCreate}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Create First Category
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {categories.map((category) => {
                    const Icon = getServiceCategoryIconByName(category.iconUrl);
                    const azTranslation = getTranslation(category.translations);
                    
                    return (
                      <div
                        key={category.id}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
                      >
                        <div className="flex items-center space-x-4">
                          {/* Icon */}
                          <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center border border-gray-200">
                            {Icon ? (
                              <Icon className="w-6 h-6 text-blue-600" />
                            ) : (
                              <span className="text-gray-400 text-xs">No icon</span>
                            )}
                          </div>

                          {/* Info */}
                          <div>
                            <div className="flex items-center space-x-2">
                              <h3 className="font-semibold text-gray-900">
                                {azTranslation?.name || 'Untitled'}
                              </h3>
                              <span className={`px-2 py-1 text-xs font-medium rounded ${
                                category.active
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-gray-100 text-gray-800'
                              }`}>
                                {category.active ? 'Active' : 'Inactive'}
                              </span>
                            </div>
                            <p className="text-sm text-gray-500 mt-1">
                              Code: <span className="font-mono">{category.code}</span>
                              {category.sortOrder !== undefined && (
                                <span className="ml-3">Order: {category.sortOrder}</span>
                              )}
                            </p>
                            <div className="flex items-center space-x-2 mt-1">
                              {category.translations.map((t) => (
                                <span
                                  key={t.languageCode}
                                  className="px-2 py-0.5 text-xs bg-blue-50 text-blue-700 rounded"
                                >
                                  {t.languageCode.toUpperCase()}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center space-x-2">
                          <button
                            type="button"
                            onClick={() => handleEdit(category)}
                            className="px-3 py-1.5 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(category.id)}
                            className="px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Form Modal */}
      <ServiceCategoryFormModal
        isOpen={isFormOpen}
        onClose={handleFormClose}
        onSuccess={handleFormSuccess}
        category={selectedCategory}
      />

      <ConfirmModal
        open={deleteTarget !== null}
        title="Delete category"
        message="Are you sure you want to delete this category?"
        confirmLabel="Delete"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </>
  );
}
