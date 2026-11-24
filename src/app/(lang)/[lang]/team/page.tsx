'use client';

import { useParams } from 'next/navigation';
import SiteShell from '@/components/site/SiteShell';
import SitePageHero from '@/components/site/SitePageHero';
import { TeamCard } from '@/components/site/SiteBits';
import { useTeamList } from '@/hooks/site/useSiteQueries';
import { useTranslations } from '@/hooks/useTranslations';
import type { LanguageCode } from '@/types/api';

export default function TeamPage() {
  const params = useParams();
  const lang = ((params.lang as string) || 'az') as LanguageCode;
  const { t } = useTranslations();
  const { data: members = [], isLoading, error } = useTeamList(lang);

  return (
    <SiteShell>
      <SitePageHero pageTag="TEAM" breadcrumb={t('nav.team')} fallbackTitle={t('nav.team')} wideDescription />

      <section className="site-wrap pb-16 pt-14 md:pb-[112px]">
        {isLoading ? (
          <div className="grid grid-cols-[repeat(auto-fill,minmax(min(260px,100%),1fr))] gap-4" aria-hidden="true">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="aspect-[4/5] animate-pulse rounded-[10px] bg-navy-800" />
            ))}
          </div>
        ) : error ? (
          <p role="alert" className="text-center text-navy-text2">
            {t('common.error')}
          </p>
        ) : members.length === 0 ? (
          <p className="text-center text-navy-muted">{t('common.noResults')}</p>
        ) : (
          <div className="grid grid-cols-[repeat(auto-fill,minmax(min(260px,100%),1fr))] gap-4">
            {members.map((member) => (
              <TeamCard key={member.id} member={member} lang={lang} />
            ))}
          </div>
        )}
      </section>
    </SiteShell>
  );
}
