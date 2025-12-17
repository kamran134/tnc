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

  // Helper function to initialize translations
  const initializeTranslations = (data?: TeamMemberAdminDto): TeamMemberTranslationDto[] => {
    const allLanguages: ('az' | 'en' | 'ru')[] = ['az', 'en', 'ru'];
    const existingTranslations = [...(data?.translations || [])];

    // Ensure all 3 languages exist
    allLanguages.forEach((langCode) => {
      if (!existingTranslations.find((t) => t.languageCode === langCode)) {
        existingTranslations.push({
          languageCode: langCode,
          fullName: '',
          position: '',
          bio: '',
          positionDescription: '',
        });
      }
    });

    // Sort to ensure correct order: az, en, ru
    existingTranslations.sort((a, b) => {
      const order = { az: 0, en: 1, ru: 2 };
      return order[a.languageCode] - order[b.languageCode];
    });

    return existingTranslations;
  };

  // Form state - initialize properly based on mode
  const [formData, setFormData] = useState<TeamMemberAdminDto>(() => {
    if (isEdit && initialData) {
      // Edit mode with data - use real data
      return {
        email: initialData.email || '',
        phone: initialData.phone || '',
        imageUrl: initialData.imageUrl || '',
        linkedinUrl: initialData.linkedinUrl || '',
        twitterUrl: initialData.twitterUrl || '',
        active: initialData.active ?? true,
        sortOrder: initialData.sortOrder ?? 0,
        translations: initializeTranslations(initialData),
      };
    }
    // Create mode or edit mode without data yet - use empty defaults
    return {
      email: '',
      phone: '',
      imageUrl: '',
      linkedinUrl: '',
      twitterUrl: '',
      active: true,
      sortOrder: 0,
      translations: initializeTranslations(undefined),
    };
  });

  // Sync formData when initialData changes (for edit mode)
  useEffect(() => {
    if (initialData && isEdit) {
      console.log('🔍 Loading team member data:', initialData);
      console.log('🔍 Translations from backend:', initialData.translations);
      
      const initializedTranslations = initializeTranslations(initialData);
      console.log('🔍 After initialization:', initializedTranslations);
      
      setFormData({
        email: initialData.email || '',
        phone: initialData.phone || '',
        imageUrl: initialData.imageUrl || '',
        linkedinUrl: initialData.linkedinUrl || '',
        twitterUrl: initialData.twitterUrl || '',
        active: initialData.active ?? true,
        sortOrder: initialData.sortOrder ?? 0,
        translations: initializedTranslations,
      });
      setImagePreview(initialData.imageUrl || '');
    }
  }, [initialData, isEdit]);

  // Handle submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      console.log('📤 Form data before processing:', formData);
      
      // Filter translations - keep only those with at least one filled field
      const filteredTranslations = formData.translations.filter(
        (t) => {
          const hasData = !!(
            t.fullName?.trim() ||
            t.position?.trim() ||
            t.bio?.trim() ||
            t.positionDescription?.trim()
          );
          return hasData && t.languageCode;
        }
      );

      console.log('📤 Filtered translations:', filteredTranslations);

      // Validate at least one translation with fullName
      const hasAtLeastOneName = filteredTranslations.some(t => t.fullName?.trim());
      if (!hasAtLeastOneName) {
        toast.warning('Please provide at least one name translation');
        return;
      }

      // Clean empty fields from each translation
      const cleanedTranslations = filteredTranslations.map(t => {
        const cleaned: TeamMemberTranslationDto = {
          languageCode: t.languageCode,
          fullName: t.fullName?.trim() || '',
        };
        
        // Only add optional fields if they have values
        if (t.id) cleaned.id = t.id;
        if (t.position?.trim()) cleaned.position = t.position.trim();
        if (t.bio?.trim()) cleaned.bio = t.bio.trim();
        if (t.positionDescription?.trim()) cleaned.positionDescription = t.positionDescription.trim();
        
        return cleaned;
      });

      // Clean empty fields from main data
      const { translations, ...mainData } = formData;
      const cleanedMainData = removeEmptyFields(mainData);

      // Final data with cleaned main fields and cleaned translations
      const dataToSend = {
        ...cleanedMainData,
        translations: cleanedTranslations,
      };

      console.log('📤 Sending team member data:', JSON.stringify(dataToSend, null, 2));

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
