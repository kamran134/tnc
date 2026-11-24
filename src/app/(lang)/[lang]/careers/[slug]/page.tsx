'use client';

import { useParams } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';
import SiteShell from '@/components/site/SiteShell';
import { PrimaryLink } from '@/components/site/SiteBits';
import { LanguageCode } from '@/types/api';
import { useTranslations } from '@/hooks/useTranslations';
import { useCareerBySlugQuery } from '@/hooks/queries';
import { careersService } from '@/lib/api';
import { useLanguage } from '@/contexts/LanguageContext';
import { sanitizeHtml } from '@/lib/sanitize';
import { formatDateDMY } from '@/lib/utils/date';

export default function CareerDetail() {
  const { t } = useTranslations();
  const params = useParams();
  const lang = params.lang as LanguageCode;
  const slug = params.slug as string;

  const { data: career, isLoading: loading, error } = useCareerBySlugQuery(slug, lang);
  const { setSlugResolver } = useLanguage();

  // Register a slug resolver so language switching navigates to the correct slug
  useEffect(() => {
    if (!career) {
      setSlugResolver(null);
      return;
    }
    const careerId = career.id;
    setSlugResolver(async (newLocale: LanguageCode) => {
      try {
        const translated = await careersService.getById(careerId, newLocale);
        return `/${newLocale}/careers/${translated.slug}`;
      } catch {
        return `/${newLocale}/careers`;
      }
    });
    return () => {
      setSlugResolver(null);
    };
  }, [career, setSlugResolver]);

  const getEmploymentTypeLabel = (type?: string) => {
    const types: Record<string, string> = {
      'FULL_TIME': t('careers.fullTime'),
      'PART_TIME': t('careers.partTime'),
      'CONTRACT': t('careers.contract'),
      'REMOTE': t('careers.remote'),
    };
    return type ? types[type] || type : '';
  };

  const backLink = (
    <Link
      href={`/${lang}/careers`}
      className="inline-flex min-h-[44px] items-center gap-2 self-start font-semibold text-navy-accent transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-navy-accent"
    >
      <span aria-hidden="true">←</span> {t('careers.backToCareers')}
    </Link>
  );

  const meta: { label: string; value: string }[] = career
    ? [
        { label: t('careers.location'), value: career.location },
        ...(career.employmentType ? [{ label: t('careers.type'), value: getEmploymentTypeLabel(career.employmentType) }] : []),
        ...(career.salaryRange
          ? [{ label: t('careers.salary'), value: career.salaryRange === 'BY_NEGOTIATION' ? t('careers.byNegotiation') : career.salaryRange }]
          : []),
        ...(career.company ? [{ label: t('careers.company'), value: career.company }] : []),
        ...(career.department ? [{ label: t('careers.department'), value: career.department }] : []),
        { label: t('careers.posted'), value: formatDateDMY(career.postDate) },
      ]
    : [];

  return (
    <SiteShell>
      <section className="site-wrap flex flex-col gap-10 pb-24 pt-10">
        {backLink}

        {loading ? (
          <div className="mx-auto flex w-full max-w-[760px] flex-col gap-6" aria-hidden="true">
            <div className="h-16 animate-pulse rounded-lg bg-navy-800" />
            <div className="h-40 animate-pulse rounded-[10px] bg-navy-800" />
          </div>
        ) : error || !career ? (
          <p role="alert" className="m-0 text-navy-text2">
            {t('careers.notFound')}
          </p>
        ) : (
          <article className="mx-auto flex w-full max-w-[760px] flex-col gap-8">
            <h1 className="m-0 text-[clamp(32px,4vw,54px)] font-semibold leading-[1.1] tracking-[-0.03em]">
              {career.title}
            </h1>

            <dl className="m-0 grid grid-cols-2 gap-4 border-y border-navy-line py-6 md:grid-cols-3">
              {meta.map((item) => (
                <div key={item.label} className="flex flex-col gap-1">
                  <dt className="text-sm text-navy-muted">{item.label}</dt>
                  <dd className="m-0 font-medium text-navy-text">{item.value}</dd>
                </div>
              ))}
            </dl>

            {career.excerpt && (
              <p className="m-0 border-l-[3px] border-navy-accent pl-5 text-xl text-navy-text2">{career.excerpt}</p>
            )}

            <div className="flex flex-col gap-3">
              <h2 className="m-0 text-[26px] font-semibold tracking-[-0.015em]">{t('careers.jobDescription')}</h2>
              <div className="site-prose text-lg" dangerouslySetInnerHTML={{ __html: sanitizeHtml(career.content) }} />
            </div>

            {career.requirements && (
              <div className="flex flex-col gap-3">
                <h2 className="m-0 text-[26px] font-semibold tracking-[-0.015em]">{t('careers.requirements')}</h2>
                <div
                  className="site-prose text-lg"
                  dangerouslySetInnerHTML={{ __html: sanitizeHtml(career.requirements) }}
                />
              </div>
            )}

            {career.expiryDate && new Date(career.expiryDate) > new Date() && (
              <p className="m-0 rounded-md border border-navy-input bg-navy-700 px-4 py-3 text-navy-text">
                <span className="font-semibold">{t('careers.applicationDeadline')}:</span>{' '}
                <span className="font-plexmono">{formatDateDMY(career.expiryDate)}</span>
              </p>
            )}

            <div className="flex flex-col items-start gap-[18px] rounded-xl border border-navy-line bg-navy-800 p-[clamp(24px,4vw,40px)]">
              <h2 className="m-0 text-[clamp(24px,3vw,32px)] font-semibold tracking-[-0.02em]">
                {t('careers.interestedInPosition')}
              </h2>
              <p className="m-0 max-w-[640px] text-navy-text2">{t('careers.interestedDescription')}</p>
              <PrimaryLink href={`/${lang}/contact`}>{t('careers.applyNow')}</PrimaryLink>
            </div>
          </article>
        )}
      </section>
    </SiteShell>
  );
}
