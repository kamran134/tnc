'use client'

import { useParams } from 'next/navigation'
import Link from 'next/link'
import { Briefcase, Building2, Calendar, Clock, Lightbulb, MapPin, TrendingUp, Users, Wallet } from 'lucide-react'
import SiteShell from '@/components/site/SiteShell'
import { SitePageHeroView } from '@/components/site/SitePageHero'
import { ArrowLink } from '@/components/site/SiteBits'
import { LanguageCode } from '@/types/api'
import { useTranslations } from '@/hooks/useTranslations'
import { useCareersListQuery, useCompanyInfo } from '@/hooks/queries'
import { sanitizeHtml } from '@/lib/sanitize'
import { resolveImageUrl } from '@/lib/utils/image'
import { formatDateDMY } from '@/lib/utils/date'

// Careers has no page-hero record in the API: static image + locale strings.
const CAREERS_HERO_IMAGE = '/uploads/service_image/2c4d47ff-6835-40ec-a39f-05599520cc05.png'

export default function CareersPage() {
  const { t } = useTranslations();
  const params = useParams();
  const lang = (params.lang as LanguageCode) || 'az';

  const { data, isLoading: loading, error } = useCareersListQuery(lang);
  const { data: companyInfo } = useCompanyInfo(lang);

  const jobOpenings = data?.content || [];

  const getEmploymentTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      FULL_TIME: t('careers.fullTime'),
      PART_TIME: t('careers.partTime'),
      CONTRACT: t('careers.contract'),
      REMOTE: t('careers.remote'),
    };
    return labels[type] ?? type;
  };

  const perks = [
    { title: t('careers.professionalGrowth'), text: t('careers.professionalGrowthDesc'), Icon: TrendingUp },
    { title: t('careers.expertTeam'), text: t('careers.expertTeamDesc'), Icon: Users },
    { title: t('careers.innovation'), text: t('careers.innovationDesc'), Icon: Lightbulb },
  ];

  return (
    <SiteShell>
      <SitePageHeroView
        breadcrumb={t('nav.careers')}
        eyebrow={t('careers.workingAtTnc')}
        title={t('careers.title')}
        description={t('careers.heroDescription')}
        imageUrl={resolveImageUrl(CAREERS_HERO_IMAGE)}
      />

      {/* Why work with us */}
      <section className="site-wrap flex flex-col gap-10 pb-16 pt-14 md:pb-[104px]">
        <h2 className="site-h2 max-w-[820px]">{t('careers.whyWorkWithUs')}</h2>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(min(300px,100%),1fr))] gap-4">
          {perks.map(({ title, text, Icon }) => (
            <div
              key={title}
              className="box-border flex flex-col gap-4 rounded-[10px] border border-navy-line bg-navy-800 p-8"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-navy-700 text-navy-accent">
                <Icon className="h-6 w-6" strokeWidth={1.6} aria-hidden="true" />
              </span>
              <h3 className="m-0 text-[22px] font-semibold leading-tight">{title}</h3>
              <p className="m-0 text-[15px] text-navy-text2">{text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Openings */}
      <section id="open-positions" className="border-y border-navy-line bg-navy-900">
        <div className="site-wrap flex flex-col gap-8 py-16 md:py-[104px]">
          <div className="flex max-w-[760px] flex-col gap-3.5">
            <h2 className="site-h2">{t('careers.currentOpenings')}</h2>
            <p className="m-0 text-navy-muted">{t('careers.joinTeam')}</p>
          </div>

          {loading ? (
            <div className="flex flex-col gap-4" aria-hidden="true">
              {[0, 1].map((i) => (
                <div key={i} className="h-40 animate-pulse rounded-[10px] bg-navy-800" />
              ))}
            </div>
          ) : error ? (
            <p role="alert" className="m-0 text-navy-text2">
              {t('careers.errorLoading')}
            </p>
          ) : jobOpenings.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-[18px] rounded-[10px] border border-dashed border-navy-input px-6 py-16 text-center">
              <Briefcase className="h-10 w-10 text-navy-accent" strokeWidth={1.6} aria-hidden="true" />
              <span className="text-xl font-medium text-navy-text2">{t('careers.noOpenings')}</span>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {jobOpenings.map((job) => (
                <article
                  key={job.id}
                  className="box-border flex flex-wrap items-start justify-between gap-6 rounded-[10px] border border-navy-line bg-navy-800 p-6 transition-colors hover:border-[#3A6688] md:p-8"
                >
                  <div className="flex min-w-0 flex-[1_1_420px] flex-col gap-4">
                    <h3 className="m-0 text-2xl font-semibold leading-tight">
                      <Link
                        href={`/${lang}/careers/${job.slug}`}
                        className="transition-colors hover:text-navy-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-navy-accent"
                      >
                        {job.title}
                      </Link>
                    </h3>
                    <ul className="m-0 flex list-none flex-wrap gap-x-5 gap-y-2 p-0 text-sm text-navy-muted">
                      <li className="flex items-center gap-1.5">
                        <MapPin className="h-4 w-4 text-navy-accent" aria-hidden="true" />
                        {job.location}
                      </li>
                      {job.employmentType && (
                        <li className="flex items-center gap-1.5">
                          <Clock className="h-4 w-4 text-navy-accent" aria-hidden="true" />
                          {getEmploymentTypeLabel(job.employmentType)}
                        </li>
                      )}
                      {job.company && (
                        <li className="flex items-center gap-1.5">
                          <Building2 className="h-4 w-4 text-navy-accent" aria-hidden="true" />
                          {job.company}
                        </li>
                      )}
                      {job.department && (
                        <li className="flex items-center gap-1.5">
                          <Users className="h-4 w-4 text-navy-accent" aria-hidden="true" />
                          {job.department}
                        </li>
                      )}
                      {job.salaryRange && (
                        <li className="flex items-center gap-1.5">
                          <Wallet className="h-4 w-4 text-navy-accent" aria-hidden="true" />
                          {job.salaryRange === 'BY_NEGOTIATION' ? t('careers.byNegotiation') : job.salaryRange}
                        </li>
                      )}
                      <li className="flex items-center gap-1.5 font-plexmono">
                        <Calendar className="h-4 w-4 text-navy-accent" aria-hidden="true" />
                        {t('careers.posted')}: {formatDateDMY(job.postDate)}
                      </li>
                    </ul>
                    {job.excerpt && <p className="m-0 text-navy-text2">{job.excerpt}</p>}
                    {job.requirements && (
                      <div>
                        <h4 className="mb-2 mt-0 font-semibold text-navy-text">{t('careers.requirements')}</h4>
                        <div
                          className="site-prose text-[15px]"
                          dangerouslySetInnerHTML={{ __html: sanitizeHtml(job.requirements) }}
                        />
                      </div>
                    )}
                  </div>
                  <ArrowLink href={`/${lang}/careers/${job.slug}`}>{t('careers.viewDetails')}</ArrowLink>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      {companyInfo?.email && (
        <section className="site-wrap py-16 md:py-[104px]">
          <div className="flex flex-col items-start gap-[18px] rounded-xl border border-navy-line bg-navy-800 p-[clamp(28px,4vw,56px)]">
            <h3 className="m-0 text-[clamp(26px,3vw,38px)] font-semibold tracking-[-0.02em]">{t('careers.noRightPosition')}</h3>
            <p className="m-0 max-w-[640px] text-navy-text2">{t('careers.submitResumeDesc')}</p>
            <a
              href={`mailto:${companyInfo.email}`}
              className="inline-flex min-h-[56px] items-center rounded-md bg-navy-accent px-7 font-semibold text-navy-950 transition-colors hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              {t('careers.submitResume')}
            </a>
          </div>
        </section>
      )}
    </SiteShell>
  )
}
