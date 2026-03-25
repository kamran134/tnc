'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ContactAdminDto } from '@/types/api';

export default function ContactDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  
  const [contact, setContact] = useState<ContactAdminDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [adminNotes, setAdminNotes] = useState('');

  useEffect(() => {
    loadContact();
  }, [id]);

  const loadContact = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/admin/contacts/${id}`);
      
      if (response.ok) {
        const data = await response.json();
        setContact(data);
        setAdminNotes(data.adminNotes || '');
      } else {
        console.error('Failed to load contact');
      }
    } catch (error) {
      console.error('Error loading contact:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateStatus = async (newStatus: string) => {
    try {
      setIsSaving(true);
      const response = await fetch(`/api/admin/contacts/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        await loadContact();
      }
    } catch (error) {
      console.error('Error updating status:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const saveAdminNotes = async () => {
    try {
      setIsSaving(true);
      const response = await fetch(`/api/admin/contacts/${id}/notes`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adminNotes })
      });

      if (response.ok) {
        await loadContact();
        alert('Заметки сохранены');
      }
    } catch (error) {
      console.error('Error saving notes:', error);
      alert('Ошибка при сохранении заметок');
    } finally {
      setIsSaving(false);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('ru-RU', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return '-';
    }
  };

  const getStatusColor = (status?: string) => {
    if (!status) return 'bg-gray-100 text-gray-800';
    
    switch (status.toUpperCase()) {
      case 'NEW':
        return 'bg-blue-100 text-blue-800';
      case 'READ':
        return 'bg-yellow-100 text-yellow-800';
      case 'REPLIED':
        return 'bg-green-100 text-green-800';
      case 'CLOSED':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status?: string) => {
    if (!status) return 'New';
    
    switch (status.toUpperCase()) {
      case 'NEW':
        return 'New';
      case 'READ':
        return 'Read';
      case 'REPLIED':
        return 'Replied';
      case 'CLOSED':
        return 'Closed';
      default:
        return status;
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

  if (!contact) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Contact not found</h2>
          <button
            onClick={() => router.push('/dashboard/contacts')}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Back to list
          </button>
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
              <h1 className="text-2xl font-bold text-gray-900">Contact Details</h1>
              <p className="text-gray-600">View and manage customer inquiry</p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => router.push('/dashboard/contacts')}
                className="px-4 py-2 text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                ← Back to list
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Contact Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Contact Details Card */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-xl font-bold text-gray-900">Contact Information</h2>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(contact.status)}`}>
                  {getStatusLabel(contact.status)}
                </span>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Name</label>
                  <p className="text-base text-gray-900">{contact.name || '-'}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Email</label>
                  <p className="text-base text-gray-900">
                    <a href={`mailto:${contact.email}`} className="text-blue-600 hover:text-blue-800">
                      {contact.email || '-'}
                    </a>
                  </p>
                </div>

                {contact.phone && (
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Phone</label>
                    <p className="text-base text-gray-900">
                      <a href={`tel:${contact.phone}`} className="text-blue-600 hover:text-blue-800">
                        {contact.phone}
                      </a>
                    </p>
                  </div>
                )}

                {contact.company && (
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Company</label>
                    <p className="text-base text-gray-900">{contact.company}</p>
                  </div>
                )}

                {contact.subject && (
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Subject</label>
                    <p className="text-base text-gray-900 font-medium">{contact.subject}</p>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Message</label>
                  <div className="text-base text-gray-900 bg-gray-50 p-4 rounded-lg whitespace-pre-wrap">
                    {contact.message || '-'}
                  </div>
                </div>
              </div>
            </div>

            {/* Admin Notes Card */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Admin Notes</h2>
              <div className="space-y-4">
                <textarea
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  rows={6}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 text-gray-900"
                  placeholder="Add notes about this inquiry..."
                />
                <button
                  onClick={saveAdminNotes}
                  disabled={isSaving}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {isSaving ? 'Saving...' : 'Save Notes'}
                </button>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Status Card */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Status Management</h3>
              <div className="space-y-3">
                <button
                  onClick={() => updateStatus('NEW')}
                  disabled={isSaving}
                  className={`w-full px-4 py-2 rounded-lg transition-colors ${
                    contact.status === 'NEW'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  } disabled:opacity-50`}
                >
                  New
                </button>
                <button
                  onClick={() => updateStatus('READ')}
                  disabled={isSaving}
                  className={`w-full px-4 py-2 rounded-lg transition-colors ${
                    contact.status === 'READ'
                      ? 'bg-yellow-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  } disabled:opacity-50`}
                >
                  Read
                </button>
                <button
                  onClick={() => updateStatus('REPLIED')}
                  disabled={isSaving}
                  className={`w-full px-4 py-2 rounded-lg transition-colors ${
                    contact.status === 'REPLIED'
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  } disabled:opacity-50`}
                >
                  Replied
                </button>
                <button
                  onClick={() => updateStatus('CLOSED')}
                  disabled={isSaving}
                  className={`w-full px-4 py-2 rounded-lg transition-colors ${
                    contact.status === 'CLOSED'
                      ? 'bg-gray-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  } disabled:opacity-50`}
                >
                  Closed
                </button>
              </div>
            </div>

            {/* Metadata Card */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Metadata</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <span className="font-medium text-gray-500">Received:</span>
                  <p className="text-gray-900 mt-1">{formatDate(contact.submissionDate || contact.createdAt)}</p>
                </div>
                
                {contact.repliedAt && (
                  <div>
                    <span className="font-medium text-gray-500">Replied:</span>
                    <p className="text-gray-900 mt-1">{formatDate(contact.repliedAt)}</p>
                  </div>
                )}

                {contact.repliedBy && (
                  <div>
                    <span className="font-medium text-gray-500">Replied by:</span>
                    <p className="text-gray-900 mt-1">{contact.repliedBy}</p>
                  </div>
                )}

                {contact.updatedAt && (
                  <div>
                    <span className="font-medium text-gray-500">Updated:</span>
                    <p className="text-gray-900 mt-1">{formatDate(contact.updatedAt)}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
