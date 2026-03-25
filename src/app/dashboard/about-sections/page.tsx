'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { adminAboutSectionsService } from '@/lib/api';
import { useToast } from '@/components/ui';
import type { AboutSectionAdminDto } from '@/types/api';
import { getTranslation, LANGUAGES } from '@/lib/utils/translations';

export default function AboutSectionsPage() {
  const router = useRouter();
  const [sections, setSections] = useState<AboutSectionAdminDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  const toast = useToast();

  useEffect(() => {
    loadSections();
  }, []);

  const loadSections = async () => {
    setIsLoading(true);
    try {
      const data = await adminAboutSectionsService.getAll();
      setSections(data.sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0)));
    } catch (error) {
      console.error('Failed to load about sections:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await adminAboutSectionsService.delete(id);
      setSections((prev) => prev.filter((s) => s.id !== id));
      setDeleteConfirmId(null);
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete section');
    }
  };

  const handleDragEnd = async (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(sections);
    const [moved] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, moved);
    setSections(items);

    try {
      await adminAboutSectionsService.reorder(items.map((s) => s.id));
    } catch (error) {
      console.error('Failed to reorder:', error);
      await loadSections();
    }
  };

  const getAzTranslation = (section: AboutSectionAdminDto) =>
    getTranslation(section.translations);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center space-x-3">
          <svg className="animate-spin h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <span className="text-xl font-medium text-gray-700">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">About Sections</h1>
              <p className="text-gray-500 text-sm mt-0.5">
                Drag rows to reorder. Each section appears alternating left/right on the About page.
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => router.push('/dashboard')}
                className="px-4 py-2 text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm"
              >
                ← Dashboard
              </button>
              <button
                onClick={() => router.push('/dashboard/about-sections/new')}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
              >
                + Add Section
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {sections.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-gray-500 text-lg mb-4">No about sections yet</p>
            <button
              onClick={() => router.push('/dashboard/about-sections/new')}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Create First Section
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <DragDropContext onDragEnd={handleDragEnd}>
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-3 w-10 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">⋮⋮</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Preview</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subtitle</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Languages</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <Droppable droppableId="about-sections">
                  {(provided) => (
                    <tbody
                      className="bg-white divide-y divide-gray-100"
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                    >
                      {sections.map((section, index) => {
                        const t = getAzTranslation(section);
                        return (
                          <Draggable
                            key={section.id.toString()}
                            draggableId={section.id.toString()}
                            index={index}
                          >
                            {(provided, snapshot) => (
                              <tr
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                className={`hover:bg-gray-50 transition-colors ${snapshot.isDragging ? 'bg-blue-50 shadow-lg' : ''}`}
                              >
                                {/* Drag handle */}
                                <td
                                  className="px-3 py-4 text-center cursor-grab active:cursor-grabbing"
                                  {...provided.dragHandleProps}
                                >
                                  <span className="text-gray-400 hover:text-gray-600 text-lg select-none">⋮⋮</span>
                                </td>

                                {/* Image preview */}
                                <td className="px-6 py-4">
                                  {t?.imageUrl ? (
                                    <img
                                      src={t.imageUrl}
                                      alt={t.title || ''}
                                      className="w-16 h-12 object-cover rounded-md"
                                    />
                                  ) : (
                                    <div className="w-16 h-12 bg-gray-100 rounded-md flex items-center justify-center">
                                      <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                      </svg>
                                    </div>
                                  )}
                                </td>

                                {/* Title */}
                                <td className="px-6 py-4">
                                  <span className="text-sm font-medium text-gray-900">
                                    {t?.title || <span className="text-gray-400 italic">No title</span>}
                                  </span>
                                </td>

                                {/* Subtitle */}
                                <td className="px-6 py-4">
                                  <span className="text-sm text-gray-500">
                                    {t?.subtitle || '—'}
                                  </span>
                                </td>

                                {/* Languages */}
                                <td className="px-6 py-4">
                                  <div className="flex gap-1">
                                    {LANGUAGES.map((lang) => {
                                      const hasContent = section.translations?.some(
                                        (tr) => tr.languageCode === lang && (tr.title || tr.description)
                                      );
                                      return (
                                        <span
                                          key={lang}
                                          className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium uppercase ${
                                            hasContent
                                              ? 'bg-green-100 text-green-700'
                                              : 'bg-gray-100 text-gray-400'
                                          }`}
                                        >
                                          {lang}
                                        </span>
                                      );
                                    })}
                                  </div>
                                </td>

                                {/* Sort order */}
                                <td className="px-6 py-4">
                                  <span className="text-sm text-gray-500">{section.sortOrder ?? index + 1}</span>
                                </td>

                                {/* Actions */}
                                <td className="px-6 py-4">
                                  <div className="flex items-center gap-2">
                                    <button
                                      onClick={() => router.push(`/dashboard/about-sections/${section.id}`)}
                                      className="px-3 py-1.5 text-xs bg-blue-50 text-blue-700 rounded-md hover:bg-blue-100 transition-colors"
                                    >
                                      Edit
                                    </button>
                                    {deleteConfirmId === section.id ? (
                                      <div className="flex items-center gap-1">
                                        <button
                                          onClick={() => handleDelete(section.id)}
                                          className="px-3 py-1.5 text-xs bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                                        >
                                          Confirm
                                        </button>
                                        <button
                                          onClick={() => setDeleteConfirmId(null)}
                                          className="px-3 py-1.5 text-xs bg-gray-100 text-gray-600 rounded-md hover:bg-gray-200 transition-colors"
                                        >
                                          Cancel
                                        </button>
                                      </div>
                                    ) : (
                                      <button
                                        onClick={() => setDeleteConfirmId(section.id)}
                                        className="px-3 py-1.5 text-xs bg-red-50 text-red-700 rounded-md hover:bg-red-100 transition-colors"
                                      >
                                        Delete
                                      </button>
                                    )}
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
        )}
      </div>
    </div>
  );
}
