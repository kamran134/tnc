import apiClient, { handleApiError } from './client';
import { ContactDto } from '@/types/api';

export const contactService = {
  // Submit contact form
  async submit(contact: ContactDto): Promise<ContactDto> {
    try {
      const response = await apiClient.post<ContactDto>('/api/contact', contact);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
};
