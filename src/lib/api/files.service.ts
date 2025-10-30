import apiClient, { handleApiError } from './client';
import {
  FileUploadDto,
  PageFileUploadDto,
  FileStatistics,
  FileType,
} from '@/types/api';

export const adminFilesService = {
  // Upload file
  async upload(
    file: File,
    fileType: FileType,
    description?: string
  ): Promise<FileUploadDto> {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await apiClient.post<FileUploadDto>('/admin/files/upload', formData, {
        params: { fileType, description },
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Get files list
  async getAll(params?: {
    fileType?: FileType;
    page?: number;
    size?: number;
  }): Promise<PageFileUploadDto> {
    try {
      const response = await apiClient.get<PageFileUploadDto>('/admin/files', { params });
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Get file by ID
  async getById(id: number): Promise<FileUploadDto> {
    try {
      const response = await apiClient.get<FileUploadDto>(`/admin/files/${id}`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Delete file
  async delete(id: number): Promise<void> {
    try {
      await apiClient.delete(`/admin/files/${id}`);
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Get file types
  async getFileTypes(): Promise<Record<string, string>> {
    try {
      const response = await apiClient.get<Record<string, string>>('/admin/files/types');
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Get file statistics
  async getStatistics(): Promise<FileStatistics> {
    try {
      const response = await apiClient.get<FileStatistics>('/admin/files/statistics');
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
};

// File Download Service (Public)
export const filesService = {
  // Download file by type and name
  getDownloadUrl(fileType: string, fileName: string): string {
    return `${apiClient.defaults.baseURL}/api/files/${fileType}/${fileName}`;
  },

  // Download file by ID
  getDownloadUrlById(id: number): string {
    return `${apiClient.defaults.baseURL}/api/files/by-id/${id}`;
  },
};
