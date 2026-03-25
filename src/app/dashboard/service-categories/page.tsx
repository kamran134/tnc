'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { ServiceCategoryAdminDto } from '@/types/api';
import { adminServiceCategoriesService } from '@/lib/api';
import { useToast } from '@/components/ui';
import { ConfirmModal } from '@/components/ui';
import { getServiceCategoryIconByName } from '@/lib/icons/service-category-icons';

export default function ServiceCategoriesPage() {
  const router = useRouter();
  const toast = useToast();
  const [categories, setCategories] = useState<ServiceCategoryAdminDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<number | null>(null);

  useEffect(() => {
    loadCategories();
  }, []);

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

  const handleDragEnd = async (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(categories);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Optimistic update
    setCategories(items);

    try {
      await adminServiceCategoriesService.reorder(items.map(cat => cat.id));
    } catch (error: any) {
      console.error('Failed to reorder:', error);
      toast.error(error.message || 'Failed to update order');
      // Reload on error
      await loadCategories();
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
          <span className="text-xl font-medium text-gray-700">Loading...</span>
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
              <h1 className="text-2xl font-bold text-gray-900">Service Categories</h1>
              <p className="text-gray-600">Manage service categories and their translations</p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => router.push('/dashboard/services')}
                className="px-4 py-2 text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                ← Back to Services
              </button>
              <button
                onClick={() => router.push('/dashboard/service-categories/new')}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                + Add Category
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {categories.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <p className="text-gray-500 text-lg mb-4">No categories yet</p>
            <button
              onClick={() => router.push('/dashboard/service-categories/new')}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Create First Category
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <DragDropContext onDragEnd={handleDragEnd}>
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-12">⋮⋮</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Code</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Languages</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <Droppable droppableId="categories">
                    {(provided) => (
                      <tbody
                        className="bg-white divide-y divide-gray-200"
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                      >
                        {categories.map((category, index) => {
                          const Icon = getServiceCategoryIconByName(category.iconUrl);
                          const azTranslation = category.translations.find(t => t.languageCode === 'az');
                          
                          return (
                            <Draggable
                              key={category.id.toString()}
                              draggableId={category.id.toString()}
                              index={index}
                            >
                              {(provided, snapshot) => (
                                <tr
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  className={`hover:bg-gray-50 ${
                                    snapshot.isDragging ? 'bg-blue-50 shadow-lg' : ''
                                  }`}
                                >
                                  <td
                                    className="px-3 py-4 text-center cursor-grab active:cursor-grabbing"
                                    {...provided.dragHandleProps}
                                  >
                                    <span className="text-gray-400 hover:text-gray-600 text-lg">
                                      ⋮⋮
                                    </span>
                                  </td>
                                  <td className="px-6 py-4">
                                    <div className="flex items-center space-x-3">
                                      <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                                        {Icon ? (
                                          <Icon className="w-5 h-5 text-blue-600" />
                                        ) : (
                                          <span className="text-gray-400 text-xs">?</span>
                                        )}
                                      </div>
                                      <div>
                                        <div className="text-sm font-medium text-gray-900">
                                          {azTranslation?.name || 'Untitled'}
                                        </div>
                                        {azTranslation?.description && (
                                          <div className="text-sm text-gray-500 truncate max-w-xs">
                                            {azTranslation.description}
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  </td>
                                  <td className="px-6 py-4">
                                    <span className="font-mono text-sm text-gray-600">{category.code}</span>
                                  </td>
                                  <td className="px-6 py-4">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                      category.active 
                                        ? 'bg-green-100 text-green-800' 
                                        : 'bg-gray-100 text-gray-800'
                                    }`}>
                                      {category.active ? 'Active' : 'Inactive'}
                                    </span>
                                  </td>
                                  <td className="px-6 py-4 text-sm text-gray-900">
                                    {category.sortOrder || '-'}
                                  </td>
                                  <td className="px-6 py-4">
                                    <div className="flex items-center space-x-1">
                                      {category.translations.map((t) => (
                                        <span
                                          key={t.languageCode}
                                          className="px-2 py-0.5 text-xs bg-blue-50 text-blue-700 rounded"
                                        >
                                          {t.languageCode.toUpperCase()}
                                        </span>
                                      ))}
                                    </div>
                                  </td>
                                  <td className="px-6 py-4 text-sm font-medium">
                                    <div className="flex space-x-2">
                                      <button
                                        onClick={() => router.push(`/dashboard/service-categories/${category.id}`)}
                                        className="text-blue-600 hover:text-blue-900"
                                      >
                                        Edit
                                      </button>
                                      <button
                                        onClick={() => handleDelete(category.id)}
                                        className="text-red-600 hover:text-red-900"
                                      >
                                        Delete
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              )}
                            </Draggable>
                          );
                        })}
                        {provided.placeholder}
                      </tbody>
                    )}
                  </Droppable>
                </table>
              </DragDropContext>
            </div>
          </div>
        )}
      </div>
    </div>

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
