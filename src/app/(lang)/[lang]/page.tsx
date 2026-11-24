'use client';

import { useParams } from 'next/navigation';
import SiteShell from '@/components/site/SiteShell';
import HomeHero from '@/components/site/home/HomeHero';
import {
  HomeMemberships,
  HomeServices,
  HomeMission,
  HomeVision,
  HomeValues,
  HomeTeam,
  HomeNews,
  HomeContact,
} from '@/components/site/home/HomeSections';
import { LanguageCode } from '@/types/api';
import { useCompanyInfo } from '@/hooks/queries';

export default function HomePage() {
  const params = useParams();
  const lang = ((params.lang as string) || 'az') as LanguageCode;

  // Cached by React Query and shared with the footer
  const { data: companyInfo } = useCompanyInfo(lang);

  return (
    <SiteShell>
      <HomeHero />
      <HomeMemberships />
      <HomeServices />
      <HomeMission companyInfo={companyInfo} />
      <HomeVision companyInfo={companyInfo} />
      <HomeValues companyInfo={companyInfo} />
      <HomeTeam />
      <HomeNews />
      <HomeContact />
    </SiteShell>
  );
}
