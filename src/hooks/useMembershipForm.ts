import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { MembershipAdminDto, MembershipTranslationDto } from '@/types/api';
import { removeEmptyFields } from '@/lib/utils/cleanup';
import { useAdminMembershipMutation } from '@/hooks/queries';
import { useToast } from '@/components/ui';

interface UseMembershipFormOptions {
  initialData?: MembershipAdminDto;
  isEdit?: boolean;
}

const LANGUAGES: ('az' | 'en' | 'ru')[] = ['az', 'en', 'ru'];
const LANGUAGE_ORDER = { az: 0, en: 1, ru: 2 } as const;

function initializeTranslations(data?: MembershipAdminDto): MembershipTranslationDto[] {
  const existing = [...(data?.translations ?? [])];

  LANGUAGES.forEach((langCode) => {
    if (!existing.find((t) => t.languageCode === langCode)) {
      existing.push({
        languageCode: langCode,
        title: '',
        content: '',
        excerpt: '',
        servicesProvided: '',
        partnershipDetails: '',
        contactInfo: '',
      });
    }
  });

  return existing.sort(
    (a, b) =>
      LANGUAGE_ORDER[a.languageCode as keyof typeof LANGUAGE_ORDER] -
      LANGUAGE_ORDER[b.languageCode as keyof typeof LANGUAGE_ORDER],
  );
}

function buildInitialState(data?: MembershipAdminDto): MembershipAdminDto {
  return {
    name: data?.name ?? '',
    fullName: data?.fullName ?? '',
    logoUrl: data?.logoUrl ?? '',
    imageUrl: data?.imageUrl ?? '',
    websiteUrl: data?.websiteUrl ?? '',
    partnershipType: data?.partnershipType ?? '',
    sortOrder: data?.sortOrder ?? 0,
    active: data?.active ?? true,
    translations: initializeTranslations(data),
  };
}

export function useMembershipForm({ initialData, isEdit = false }: UseMembershipFormOptions) {
  const router = useRouter();
  const toast = useToast();
  const mutations = useAdminMembershipMutation();

  const [logoPreview, setLogoPreview] = useState<string>('');
  const [imagePreview, setImagePreview] = useState<string>('');
  const [formData, setFormData] = useState<MembershipAdminDto>(() =>
    buildInitialState(isEdit ? initialData : undefined),
  );

  // Sync when edit data arrives (async fetch)
  useEffect(() => {
    if (isEdit && initialData) {
      setFormData(buildInitialState(initialData));
      setLogoPreview(initialData.logoUrl ?? '');
      setImagePreview(initialData.imageUrl ?? '');
    }
  }, [initialData, isEdit]);

  const updateField = <K extends keyof MembershipAdminDto>(
    field: K,
    value: MembershipAdminDto[K],
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const updateTranslation = (
    index: number,
    field: keyof MembershipTranslationDto,
    value: string,
  ) => {
    setFormData((prev) => ({
      ...prev,
      translations: prev.translations.map((t, i) =>
        i === index ? { ...t, [field]: value } : t,
      ),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Keep only translations that have at least a title
    const filteredTranslations = formData.translations.filter((t) =>
      t.title?.trim(),
    );

    if (filteredTranslations.length === 0 || !filteredTranslations.some((t) => t.title?.trim())) {
      toast.warning('Please provide at least one translation with a title');
      return;
    }

    if (!formData.name?.trim()) {
      toast.warning('Name is required');
      return;
    }

    const cleanedTranslations: MembershipTranslationDto[] = filteredTranslations.map((t) => {
      const cleaned: MembershipTranslationDto = {
        languageCode: t.languageCode,
        title: t.title?.trim() ?? '',
      };
      if (t.id) cleaned.id = t.id;
      if (t.content?.trim()) cleaned.content = t.content.trim();
      if (t.excerpt?.trim()) cleaned.excerpt = t.excerpt.trim();
      if (t.servicesProvided?.trim()) cleaned.servicesProvided = t.servicesProvided.trim();
      if (t.partnershipDetails?.trim()) cleaned.partnershipDetails = t.partnershipDetails.trim();
      if (t.contactInfo?.trim()) cleaned.contactInfo = t.contactInfo.trim();
      return cleaned;
    });

    const { translations, ...mainData } = formData;
    const dataToSend = {
      ...removeEmptyFields(mainData),
      translations: cleanedTranslations,
    } as MembershipAdminDto;

    try {
      if (isEdit && initialData?.id) {
        await mutations.update.mutateAsync({ id: initialData.id, data: dataToSend });
        toast.success('Membership updated successfully!');
      } else {
        await mutations.create.mutateAsync(dataToSend);
        toast.success('Membership created successfully!');
      }
      router.push('/dashboard/memberships');
    } catch (error: any) {
      const message = error?.response?.data?.message ?? error?.message ?? 'Unknown error';
      toast.error(`Failed to ${isEdit ? 'update' : 'create'} membership: ${message}`);
    }
  };

  return {
    formData,
    logoPreview,
    imagePreview,
    isLoading: mutations.create.isPending || mutations.update.isPending,
    handleSubmit,
    updateField,
    updateTranslation,
    setLogoPreview,
    setImagePreview,
  };
}
