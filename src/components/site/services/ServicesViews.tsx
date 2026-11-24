'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Briefcase } from 'lucide-react';
import SitePageHero from '../SitePageHero';
import ServiceAccordion from './ServiceAccordion';
import { ArrowLink, PrimaryLink } from '../SiteBits';
import { useGroupedServices } from '@/hooks/site/useGroupedServices';
import { useTranslations } from '@/hooks/useTranslations';
import { getServiceCategoryIconByName } from '@/lib/icons/service-category-icons';
import type { LanguageCode } from '@/types/api';

function useLang(): LanguageCode {
  const params = useParams();
  return ((params.lang as string) || 'az') as LanguageCode;
}

function Skeleton() {
  return (
    <div className="site-wrap py-16" aria-hidden="true">
      <div className="grid grid-cols-[repeat(auto-fit,minmax(min(360px,100%),1fr))] gap-4">
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-[300px] animate-pulse rounded-[10px] bg-navy-800" />
        ))}
      </div>
    </div>
  );
}

/* ───────────── /services : hero + category cards ───────────── */

export function ServicesIndexView() {
  const lang = useLang();
  const { t } = useTranslations();
  const { groups, isLoading, error } = useGroupedServices(lang);

  return (
    <>
      <SitePageHero
        pageTag="SERVICES"
        breadcrumb={t('breadcrumbs.services')}
        fallbackTitle={t('services.title')}
        action={{ label: t('services.viewAll'), href: `/${lang}/services/all` }}
      />
      {isLoading ? (
        <Skeleton />
      ) : error || groups.length === 0 ? (
        <p className="site-wrap py-24 text-center text-navy-muted">{t('services.noCategories')}</p>
      ) : (
        <section className="site-wrap pb-16 pt-14 md:pb-[112px]">
          <div className="grid grid-cols-[repeat(auto-fit,minmax(min(360px,100%),1fr))] gap-4">
            {groups.map(({ category, services }) => {
              const Icon = getServiceCategoryIconByName(category.iconUrl) ?? Briefcase;
              return (
                <div
                  key={category.id}
                  className="box-border flex flex-col gap-5 rounded-[10px] border border-navy-line bg-navy-800 p-8 transition-colors hover:border-[#3A6688]"
                >
                  <div className="flex items-start justify-between">
                    <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-navy-700 text-navy-accent">
                      <Icon className="h-6 w-6" strokeWidth={1.6} aria-hidden="true" />
                    </span>
                    {services.length > 0 && (
                      <span className="font-plexmono text-[13px] text-navy-muted">{services.length}</span>
                    )}
                  </div>
                  <h3 className="m-0 text-2xl font-semibold leading-tight tracking-[-0.01em]">{category.name}</h3>
                  <ul className="m-0 flex list-none flex-col gap-2.5 p-0">
                    {services.map((s) => (
                      <li key={s.id} className="flex items-start gap-3 text-[15px] text-navy-text2">
                        <span className="mt-[9px] h-1.5 w-1.5 flex-none rounded-full bg-navy-accent" aria-hidden="true" />
                        <span>{s.title}</span>
                      </li>
                    ))}
                  </ul>
                  <ArrowLink href={`/${lang}/services/${category.code}`} className="mt-auto">
                    {t('services.viewDetails')}
                  </ArrowLink>
                </div>
              );
            })}
          </div>
        </section>
      )}
    </>
  );
}

/* ───────────── /services/[categoryCode] ───────────── */

function ConsultationCard() {
  const lang = useLang();
  const { t } = useTranslations();
  return (
    <section className="site-wrap pb-16 md:pb-[112px]">
      <div className="flex flex-col items-start gap-[18px] rounded-xl border border-navy-line bg-navy-800 p-[clamp(28px,4vw,56px)]">
        <h3 className="m-0 text-[clamp(26px,3vw,38px)] font-semibold tracking-[-0.02em]">
          {t('contact.scheduleConsultation')}
        </h3>
        <p className="m-0 max-w-[640px] text-navy-text2">{t('contact.consultationDescription')}</p>
        <PrimaryLink href={`/${lang}/contact`}>{t('contact.bookConsultation')}</PrimaryLink>
      </div>
    </section>
  );
}

export function ServiceCategoryView({ categoryCode }: { categoryCode: string }) {
  const lang = useLang();
  const { t } = useTranslations();
  const { groups, isLoading } = useGroupedServices(lang);
  const current = groups.find((g) => g.category.code === categoryCode);

  return (
    <>
      <section className="border-b border-navy-line bg-navy-900">
        <div className="site-wrap flex flex-col gap-5 py-12 md:py-16">
          <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-x-2.5 gap-y-1.5 text-sm text-navy-muted">
            <Link href={`/${lang}`} className="text-navy-muted transition-colors hover:text-white">
              {t('breadcrumbs.home')}
            </Link>
            <span aria-hidden="true">/</span>
            <Link href={`/${lang}/services`} className="text-navy-muted transition-colors hover:text-white">
              {t('breadcrumbs.services')}
            </Link>
            <span aria-hidden="true">/</span>
            <span aria-current="page">{current?.category.name ?? ''}</span>
          </nav>
          {current ? (
            <div className="flex flex-wrap items-center gap-x-6 gap-y-4">
              <h1 className="m-0 max-w-[900px] text-[clamp(34px,4.4vw,56px)] font-semibold leading-[1.08] tracking-[-0.025em]">
                {current.category.name}
              </h1>
              {current.services.length > 0 && (
                <span className="rounded-full bg-navy-700 px-3.5 py-1.5 font-plexmono text-sm text-navy-accent">
                  {current.services.length}
                </span>
              )}
            </div>
          ) : isLoading ? (
            <div className="h-14 max-w-xl animate-pulse rounded-lg bg-white/10" aria-hidden="true" />
          ) : (
            <p className="m-0 text-navy-text2">{t('services.categoryNotFound')}</p>
          )}
        </div>
      </section>

      <section className="site-wrap flex flex-wrap items-start gap-12 py-12 md:py-[72px]">
        <aside className="flex max-w-[360px] flex-[1_1_280px] flex-col gap-3">
          <h2 className="m-0 text-xl font-semibold">{t('services.categories')}</h2>
          <nav aria-label={t('services.categories')} className="flex flex-col gap-1">
            {groups.map(({ category }) => {
              const active = category.code === categoryCode;
              return (
                <Link
                  key={category.id}
                  href={`/${lang}/services/${category.code}`}
                  aria-current={active ? 'page' : undefined}
                  className={`box-border flex min-h-[44px] items-center rounded-md px-3.5 py-2 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-navy-accent ${
                    active
                      ? 'bg-navy-700 font-semibold text-navy-accent'
                      : 'text-navy-text2 hover:bg-navy-800 hover:text-white'
                  }`}
                >
                  {category.name}
                </Link>
              );
            })}
          </nav>
          <ArrowLink href={`/${lang}/services`} className="pt-2">
            {t('services.allCategories')}
          </ArrowLink>
        </aside>

        <div className="min-w-0 flex-[999_1_600px]">
          {isLoading ? (
            <div className="flex flex-col gap-3" aria-hidden="true">
              {[0, 1, 2].map((i) => (
                <div key={i} className="h-16 animate-pulse rounded-[10px] bg-navy-800" />
              ))}
            </div>
          ) : !current || current.services.length === 0 ? (
            <p className="m-0 text-navy-muted">{t('services.noServices')}</p>
          ) : (
            <ServiceAccordion key={categoryCode} services={current.services} />
          )}
        </div>
      </section>

      <ConsultationCard />
    </>
  );
}

/* ───────────── /services/all ───────────── */

export function AllServicesView() {
  const lang = useLang();
  const { t } = useTranslations();
  const { groups, isLoading } = useGroupedServices(lang);

  return (
    <>
      <section className="border-b border-navy-line bg-navy-900">
        <div className="site-wrap flex flex-col gap-5 py-12 md:py-16">
          <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-x-2.5 gap-y-1.5 text-sm text-navy-muted">
            <Link href={`/${lang}`} className="text-navy-muted transition-colors hover:text-white">
              {t('breadcrumbs.home')}
            </Link>
            <span aria-hidden="true">/</span>
            <Link href={`/${lang}/services`} className="text-navy-muted transition-colors hover:text-white">
              {t('breadcrumbs.services')}
            </Link>
            <span aria-hidden="true">/</span>
            <span aria-current="page">{t('services.allServicesTitle')}</span>
          </nav>
          <h1 className="m-0 text-[clamp(34px,4.4vw,56px)] font-semibold leading-[1.08] tracking-[-0.025em]">
            {t('services.allServicesTitle')}
          </h1>
          <p className="m-0 max-w-[640px] text-lg text-navy-text2">{t('services.allServicesDescription')}</p>
        </div>
      </section>

      {isLoading ? (
        <Skeleton />
      ) : groups.length === 0 ? (
        <p className="site-wrap py-24 text-center text-navy-muted">{t('services.noServices')}</p>
      ) : (
        <div className="site-wrap flex flex-col gap-14 py-12 md:py-[72px]">
          {groups.map(({ category, services }, i) => (
            <section key={category.id} aria-labelledby={`cat-${category.id}`} className="flex flex-col gap-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 id={`cat-${category.id}`} className="m-0 text-[clamp(24px,2.6vw,32px)] font-semibold tracking-[-0.015em]">
                  {category.name}
                </h2>
                <ArrowLink href={`/${lang}/services/${category.code}`}>{t('services.viewDetails')}</ArrowLink>
              </div>
              <ServiceAccordion services={services} openFirst={i === 0} />
            </section>
          ))}
        </div>
      )}

      <ConsultationCard />
    </>
  );
}
