import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { TeamMemberAdminDto, TeamMemberTranslationDto } from '@/types/api';
import { removeEmptyFields } from '@/lib/utils/cleanup';
import {
  useCreateTeamMemberMutation,
  useUpdateTeamMemberMutation,
} from '@/hooks/queries';
import { useToast } from '@/components/ui';

interface UseTeamMemberFormOptions {
  initialData?: TeamMemberAdminDto;
  isEdit?: boolean;
}

export function useTeamMemberForm({ initialData, isEdit = false }: UseTeamMemberFormOptions) {
  const router = useRouter();
  const toast = useToast();
  const [imagePreview, setImagePreview] = useState<string>('');

  // Mutations
  const createMutation = useCreateTeamMemberMutation();
  const updateMutation = useUpdateTeamMemberMutation();

  // Form state
  const [formData, setFormData] = useState<TeamMemberAdminDto>({
    email: initialData?.email || '',
    phone: initialData?.phone || '',
    imageUrl: initialData?.imageUrl || '',
    linkedinUrl: initialData?.linkedinUrl || '',
    twitterUrl: initialData?.twitterUrl || '',
    active: initialData?.active ?? true,
    sortOrder: initialData?.sortOrder ?? 0,
    translations: initialData?.translations || [
      {
        languageCode: 'az',
        fullName: '',
        position: '',
        bio: '',
        positionDescription: '',
      },
      {
        languageCode: 'en',
        fullName: '',
        position: '',
        bio: '',
        positionDescription: '',
      },
      {
        languageCode: 'ru',
        fullName: '',
        position: '',
        bio: '',
        positionDescription: '',
      },
    ],
  });

  // Sync formData when initialData changes (for edit mode)
  useEffect(() => {
    if (initialData && isEdit) {
      // Ensure all 3 languages exist
      const allLanguages: ('az' | 'en' | 'ru')[] = ['az', 'en', 'ru'];
      const translations = [...(initialData.translations || [])];

      allLanguages.forEach((langCode) => {
        if (!translations.find((t) => t.languageCode === langCode)) {
          translations.push({
            languageCode: langCode,
            fullName: '',
            position: '',
            bio: '',
            positionDescription: '',
          });
        }
      });

      // Sort to ensure correct order: az, en, ru
      translations.sort((a, b) => {
        const order = { az: 0, en: 1, ru: 2 };
        return order[a.languageCode] - order[b.languageCode];
      });

      setFormData({
        email: initialData.email || '',
        phone: initialData.phone || '',
        imageUrl: initialData.imageUrl || '',
        linkedinUrl: initialData.linkedinUrl || '',
        twitterUrl: initialData.twitterUrl || '',
        active: initialData.active ?? true,
        sortOrder: initialData.sortOrder ?? 0,
        translations,
      });
      setImagePreview(initialData.imageUrl || '');
    }
  }, [initialData, isEdit]);

  // Handle submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Filter translations - keep only those with fullName AND languageCode
      const filteredTranslations = formData.translations.filter(
        (t) => t.fullName.trim() && t.languageCode
      );

      // Validate at least one translation
      if (filteredTranslations.length === 0) {
        toast.warning('Please provide at least one name translation');
        return;
      }

      // Clean empty fields from main data, but keep translations structure intact
      const { translations, ...mainData } = formData;
      const cleanedMainData = removeEmptyFields(mainData);

      // Final data with cleaned main fields and full translation structure
      const dataToSend = {
        ...cleanedMainData,
        translations: filteredTranslations,
      };

      console.log('Sending team member data:', dataToSend);

      if (isEdit && initialData?.id) {
        await updateMutation.mutateAsync({
          id: initialData.id,
          data: dataToSend,
        });
        toast.success('Team member updated successfully!');
      } else {
        await createMutation.mutateAsync(dataToSend);
        toast.success('Team member created successfully!');
      }

      router.push('/dashboard/team');
    } catch (error: any) {
      console.error('Error saving team member:', error);
      const errorMessage = error?.message || 'Unknown error';
      toast.error(`Failed to ${isEdit ? 'update' : 'create'} team member: ${errorMessage}`);
    }
  };

  // Update translation helper
  const updateTranslation = (
    index: number,
    field: keyof TeamMemberTranslationDto,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      translations: prev.translations.map((t, i) => (i === index ? { ...t, [field]: value } : t)),
    }));
  };

  // Update form field helper
  const updateField = <K extends keyof TeamMemberAdminDto>(
    field: K,
    value: TeamMemberAdminDto[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return {
    formData,
    imagePreview,
    isLoading: createMutation.isPending || updateMutation.isPending,
    handleSubmit,
    updateTranslation,
    updateField,
    setImagePreview,
  };
}
