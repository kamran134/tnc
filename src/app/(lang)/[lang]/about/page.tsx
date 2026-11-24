'use client';

import Image from 'next/image';
import { useParams } from 'next/navigation';
import SiteShell from '@/components/site/SiteShell';
import SitePageHero from '@/components/site/SitePageHero';
import { useMemberships } from '@/hooks/queries';
import { useAboutSections } from '@/hooks/site/useSiteQueries';
import { useTranslations } from '@/hooks/useTranslations';
import { resolveImageUrl } from '@/lib/utils/image';
import { sanitizeHtml } from '@/lib/sanitize';
import type { AboutSectionUserDto, LanguageCode } from '@/types/api';

function AboutSection({ section, index }: { section: AboutSectionUserDto; index: number }) {
  const even = index % 2 === 0;
  const image = resolveImageUrl(section.imageUrl);

  return (
    <section className={even ? 'bg-navy-950' : 'border-y border-navy-line bg-navy-900'}>
      <div
        className={`site-wrap flex flex-wrap items-center gap-x-16 gap-y-12 py-16 md:py-[104px] ${
          even ? 'flex-row' : 'flex-row-reverse'
        }`}
      >
        <div className="relative h-[280px] min-w-0 flex-[1_1_420px] overflow-hidden rounded-[10px] bg-navy-700 md:h-[420px]">
          {image && (
            <Image src={image} alt="" fill sizes="(min-width: 1024px) 45vw, 100vw" className="object-cover" />
          )}
        </div>
        <div className="flex min-w-0 flex-[1_1_420px] flex-col gap-5">
          {section.subtitle && (
            <span className="font-plexmono text-[13px] uppercase tracking-[0.08em] text-navy-accent">
              {section.subtitle}
            </span>
          )}
          {section.title && <h2 className="site-h2">{section.title}</h2>}
          {section.description && (
            <div
              className="site-prose"
              dangerouslySetInnerHTML={{ __html: sanitizeHtml(section.description) }}
            />
          )}
        </div>
      </div>
    </section>
  );
}

export default function AboutPage() {
  const params = useParams();
  const lang = ((params.lang as string) || 'az') as LanguageCode;
  const { t } = useTranslations();
  const { data: sections = [], isLoading, error } = useAboutSections(lang);
  const { data: memberships = [] } = useMemberships(lang);

  return (
    <SiteShell>
      <SitePageHero pageTag="ABOUT" breadcrumb={t('nav.about')} fallbackTitle={t('nav.about')} />

      {isLoading ? (
        <div className="site-wrap py-24" aria-hidden="true">
          <div className="h-[420px] animate-pulse rounded-[10px] bg-navy-800" />
        </div>
      ) : error ? (
        <p role="alert" className="site-wrap py-24 text-navy-text2">
          {t('about.errorLoading')}
        </p>
      ) : sections.length === 0 ? (
        <p className="site-wrap py-24 text-center text-navy-muted">{t('about.noSections')}</p>
      ) : (
        sections.map((section, i) => <AboutSection key={section.id} section={section} index={i} />)
      )}

      {memberships.length > 0 && (
        <section>
          <div className="site-wrap flex flex-col gap-10 pb-[112px] pt-16 md:pt-[104px]">
            <h2 className="site-h2">{t('home.memberships')}</h2>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(min(220px,100%),1fr))] gap-4">
              {memberships.map((m) => {
                const logo = resolveImageUrl(m.logoUrl);
                const chip = (
                  <div className="box-border h-[120px] rounded-lg bg-white p-4">
                    <div className="relative h-full w-full">
                      {logo && <Image src={logo} alt={m.title} fill unoptimized sizes="240px" className="object-contain" />}
                    </div>
                  </div>
                );
                return (
                  <div key={m.id} className="flex flex-col gap-3.5">
                    {m.websiteUrl ? (
                      <a
                        href={m.websiteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy-accent"
                      >
                        {chip}
                      </a>
                    ) : (
                      chip
                    )}
                    <span className="text-sm text-navy-muted">{m.title}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}
    </SiteShell>
  );
}
