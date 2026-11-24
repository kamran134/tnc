'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { Briefcase, Check, Mail, MapPin, Phone } from 'lucide-react';
import { useTranslations } from '@/hooks/useTranslations';
import {
  useCompanyInfo,
  useMemberships,
  useNewsListQuery,
  usePageHeroQuery,
  useServiceCategories,
  useServicesListQuery,
} from '@/hooks/queries';
import { useAboutSections, useTeamList } from '@/hooks/site/useSiteQueries';
import { rvDelay, useReveal } from '@/hooks/useReveal';
import { getServiceCategoryIconByName } from '@/lib/icons/service-category-icons';
import { resolveImageUrl } from '@/lib/utils/image';
import { formatPhone, phoneHref } from '@/lib/utils/phone';
import { htmlToText } from '@/lib/utils/text';
import { ArrowLink, NewsCard, TeamCard } from '../SiteBits';
import SiteContactForm from '../SiteContactForm';
import type { CompanyInfoDto, LanguageCode, MissionVisionValueItemDto } from '@/types/api';

function useLang(): LanguageCode {
  const params = useParams();
  return ((params.lang as string) || 'az') as LanguageCode;
}

/* ───────────────────────── Memberships ───────────────────────── */

export function HomeMemberships() {
  const lang = useLang();
  const { t } = useTranslations();
  const { data: memberships = [] } = useMemberships(lang);
  const revealRef = useReveal();

  if (memberships.length === 0) return null;

  return (
    <section ref={revealRef} className="site-wrap flex flex-col gap-5 pb-[88px] pt-6" aria-label={t('home.memberships')}>
      <span className="rv-item font-plexmono text-[13px] text-navy-muted">{t('home.memberships')}</span>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(min(170px,100%),1fr))] gap-3">
        {memberships.map((m, i) => {
          const logo = resolveImageUrl(m.logoUrl);
          const inner = (
            <div className="relative h-full w-full">
              {logo ? (
                <Image src={logo} alt={m.title} fill unoptimized sizes="200px" className="object-contain" />
              ) : (
                <span className="flex h-full items-center justify-center text-center text-sm font-semibold text-navy-950">
                  {m.title}
                </span>
              )}
            </div>
          );
          const boxClass =
            'rv-item box-border block h-24 rounded-lg bg-white p-4 transition-[box-shadow,transform] duration-300 ease-out hover:shadow-[0_0_0_2px_#7CC4F2] motion-safe:hover:-translate-y-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy-accent';
          return m.websiteUrl ? (
            <a
              key={m.id}
              href={m.websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={rvDelay(i + 1)}
              className={boxClass}
            >
              {inner}
            </a>
          ) : (
            <div key={m.id} style={rvDelay(i + 1)} className={boxClass}>
              {inner}
            </div>
          );
        })}
      </div>
    </section>
  );
}

/* ───────────────────────── Services tiles ───────────────────────── */

export function HomeServices() {
  const lang = useLang();
  const { t } = useTranslations();
  const { data: categories = [] } = useServiceCategories(lang);
  const { data: services = [] } = useServicesListQuery(lang);
  const { data: heroData } = usePageHeroQuery('SERVICES', lang);
  const hero = Array.isArray(heroData) ? heroData[0] : heroData;
  const description = htmlToText(hero?.heroDescription);
  const revealRef = useReveal();

  const sorted = [...categories].sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
  if (sorted.length === 0) return null;

  return (
    <section ref={revealRef} className="site-wrap flex flex-col gap-10 pb-[112px]">
      <div className="rv-item flex flex-wrap items-end justify-between gap-5">
        <h2 className="site-h2 max-w-[640px]">{t('services.title')}</h2>
        {description && <p className="m-0 max-w-[440px] text-navy-muted">{description}</p>}
      </div>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(min(340px,100%),1fr))] gap-4">
        {sorted.map((category, i) => {
          const Icon = getServiceCategoryIconByName(category.iconUrl) ?? Briefcase;
          const items = services
            .filter((s) => s.categoryCode === category.code)
            .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
          return (
            <Link
              key={category.id}
              href={`/${lang}/services/${category.code}`}
              style={rvDelay(i + 1)}
              className="rv-item group box-border flex min-h-[300px] flex-col gap-5 rounded-[10px] border border-navy-line bg-navy-800 p-8 transition-[border-color,transform] duration-300 ease-out hover:border-[#3A6688] motion-safe:hover:-translate-y-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy-accent"
            >
              <span className="flex items-start justify-between">
                <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-navy-700 text-navy-accent transition-transform duration-300 ease-out motion-safe:group-hover:scale-110">
                  <Icon className="h-6 w-6" strokeWidth={1.6} aria-hidden="true" />
                </span>
                {items.length > 0 && <span className="font-plexmono text-[13px] text-navy-muted">{items.length}</span>}
              </span>
              <span className="text-2xl font-semibold leading-tight tracking-[-0.01em]">{category.name}</span>
              <span className="mt-auto flex flex-wrap gap-2">
                {items.slice(0, 3).map((s) => (
                  <span key={s.id} className="rounded-full bg-navy-700 px-3 py-1.5 text-[13px] text-navy-text2">
                    {s.title}
                  </span>
                ))}
              </span>
            </Link>
          );
        })}
      </div>
      <div className="rv-item" style={rvDelay(sorted.length + 1)}>
        <ArrowLink href={`/${lang}/services`}>{t('services.viewAll')}</ArrowLink>
      </div>
    </section>
  );
}

/* ───────────────────────── Mission / Vision ───────────────────────── */

function CheckList({ items }: { items: MissionVisionValueItemDto[] }) {
  return (
    <ul className="m-0 flex list-none flex-col p-0">
      {items.map((item, i) => (
        <li key={item.id ?? i} className="flex gap-4 border-b border-navy-line py-4 text-navy-text2">
          <Check className="mt-0.5 h-[22px] w-[22px] flex-none text-navy-accent" aria-hidden="true" />
          <span>
            {item.title?.trim() && <strong className="font-semibold text-navy-text">{item.title.trim()} </strong>}
            {item.description}
          </span>
        </li>
      ))}
    </ul>
  );
}

function SplitImage({ src, delay = 0 }: { src?: string; delay?: number }) {
  if (!src) return null;
  return (
    <div style={rvDelay(delay)} className="rv-item relative h-[360px] min-w-0 flex-[1_1_360px] overflow-hidden rounded-[10px] bg-navy-700 md:h-[600px]">
      <Image src={src} alt="" fill sizes="(min-width: 1024px) 45vw, 100vw" className="object-cover" />
    </div>
  );
}

export function HomeMission({ companyInfo }: { companyInfo: CompanyInfoDto | null | undefined }) {
  const lang = useLang();
  const { t } = useTranslations();
  const { data: heroData } = usePageHeroQuery('NEWS', lang);
  const hero = Array.isArray(heroData) ? heroData[0] : heroData;
  const image = resolveImageUrl(hero?.backgroundImageUrl);
  const revealRef = useReveal();

  if (!companyInfo) return null;

  return (
    <section ref={revealRef} className="border-y border-navy-line bg-navy-900">
      <div className="site-wrap flex flex-wrap items-center gap-14 py-16 md:py-[104px]">
        <div className="rv-item flex min-w-0 flex-[1_1_520px] flex-col gap-6">
          <h2 className="site-h2">{companyInfo.missionTitle || t('home.mission')}</h2>
          {companyInfo.missionDescription && <p className="m-0 text-navy-text2">{companyInfo.missionDescription}</p>}
          {companyInfo.missions?.length > 0 && <CheckList items={companyInfo.missions} />}
        </div>
        <SplitImage src={image} delay={2} />
      </div>
    </section>
  );
}

export function HomeVision({ companyInfo }: { companyInfo: CompanyInfoDto | null | undefined }) {
  const lang = useLang();
  const { t } = useTranslations();
  const { data: sections = [] } = useAboutSections(lang);
  const last = [...sections].sort((a, b) => (b.sortOrder || 0) - (a.sortOrder || 0))[0];
  const image = resolveImageUrl(last?.imageUrl);
  const revealRef = useReveal();

  if (!companyInfo) return null;

  return (
    <section ref={revealRef}>
      <div className="site-wrap flex flex-wrap items-center gap-14 py-16 md:py-[104px]">
        <SplitImage src={image} />
        <div style={rvDelay(2)} className="rv-item flex min-w-0 flex-[1_1_520px] flex-col gap-6">
          <h2 className="site-h2">{companyInfo.visionTitle || t('home.vision')}</h2>
          {companyInfo.visionDescription && <p className="m-0 text-navy-text2">{companyInfo.visionDescription}</p>}
          {companyInfo.visions?.length > 0 && <CheckList items={companyInfo.visions} />}
        </div>
      </div>
    </section>
  );
}

/* ───────────────────────── Values ───────────────────────── */

export function HomeValues({ companyInfo }: { companyInfo: CompanyInfoDto | null | undefined }) {
  const { t } = useTranslations();
  const values = companyInfo?.values ?? [];
  const revealRef = useReveal();
  if (!companyInfo || values.length === 0) return null;

  return (
    <section ref={revealRef} className="border-y border-navy-line bg-navy-900">
      <div className="site-wrap flex flex-col gap-10 py-16 md:py-[104px]">
        <div className="rv-item flex max-w-[760px] flex-col gap-4">
          <h2 className="site-h2">{t('home.coreValues')}</h2>
          {companyInfo.valuesDescription && <p className="m-0 text-navy-muted">{companyInfo.valuesDescription}</p>}
        </div>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(min(320px,100%),1fr))] gap-4">
          {values.map((value, i) => (
            <div
              key={value.id ?? i}
              style={rvDelay(i + 1)}
              className="rv-item box-border flex flex-col gap-3.5 rounded-[10px] border border-navy-line bg-navy-800 p-8"
            >
              <span className="font-plexmono text-[13px] text-navy-accent">{String(i + 1).padStart(2, '0')}</span>
              <h3 className="m-0 text-[22px] font-semibold leading-tight">{value.title}</h3>
              <p className="m-0 text-[15px] text-navy-text2">{value.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ───────────────────────── Team teaser ───────────────────────── */

export function HomeTeam() {
  const lang = useLang();
  const { t } = useTranslations();
  const { data: members = [] } = useTeamList(lang);
  const { data: heroData } = usePageHeroQuery('TEAM', lang);
  const hero = Array.isArray(heroData) ? heroData[0] : heroData;
  const heading = htmlToText(hero?.subtitle) || t('nav.team');
  const revealRef = useReveal();

  if (members.length === 0) return null;

  return (
    <section ref={revealRef} className="site-wrap flex flex-col gap-11 py-16 md:py-[112px]">
      <div className="rv-item flex flex-wrap items-end justify-between gap-5">
        <h2 className="site-h2">{heading}</h2>
        <ArrowLink href={`/${lang}/team`}>{t('common.viewAll')}</ArrowLink>
      </div>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(min(260px,100%),1fr))] gap-4">
        {members.map((member, i) => (
          <TeamCard key={member.id} member={member} lang={lang} className="rv-item" style={rvDelay(i + 1)} />
        ))}
      </div>
    </section>
  );
}

/* ───────────────────────── News teaser ───────────────────────── */

export function HomeNews() {
  const lang = useLang();
  const { t } = useTranslations();
  const { data } = useNewsListQuery({ lang, page: 0, size: 3 });
  const articles = data?.content ?? [];
  const revealRef = useReveal();

  if (articles.length === 0) return null;

  return (
    <section ref={revealRef} className="border-t border-navy-line bg-navy-900">
      <div className="site-wrap flex flex-col gap-10 py-16 md:py-[104px]">
        <div className="rv-item flex flex-wrap items-end justify-between gap-5">
          <h2 className="site-h2">{t('news.latestNews')}</h2>
          <ArrowLink href={`/${lang}/news`}>{t('common.viewAll')}</ArrowLink>
        </div>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(min(320px,100%),1fr))] gap-6">
          {articles.slice(0, 3).map((article, i) => (
            <NewsCard
              key={article.id}
              article={article}
              lang={lang}
              readMore={t('common.readMore')}
              className="rv-item"
              style={rvDelay(i + 1)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ───────────────────────── Contact block ───────────────────────── */

export function HomeContact() {
  const lang = useLang();
  const { t } = useTranslations();
  const { data: companyInfo } = useCompanyInfo(lang);
  const revealRef = useReveal();
  const rowLink =
    'flex min-h-[44px] items-center gap-3.5 transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-navy-accent';

  return (
    <section ref={revealRef} className="site-wrap flex flex-wrap gap-14 py-16 md:py-[112px]">
      <div className="rv-item flex flex-[1_1_380px] flex-col gap-7">
        <h2 className="site-h2">{t('contact.title')}</h2>
        <p className="m-0 max-w-[440px] text-navy-muted">{t('contact.getInTouch')}</p>
        <div className="flex flex-col gap-[18px] pt-2">
          {companyInfo?.address && (
            <span className="flex items-start gap-3.5">
              <MapPin className="mt-0.5 h-[22px] w-[22px] flex-none text-navy-accent" strokeWidth={1.6} aria-hidden="true" />
              <span>{companyInfo.address}</span>
            </span>
          )}
          {companyInfo?.phone && (
            <a href={phoneHref(companyInfo.phone)} className={rowLink}>
              <Phone className="h-[22px] w-[22px] flex-none text-navy-accent" strokeWidth={1.6} aria-hidden="true" />
              {formatPhone(companyInfo.phone)}
            </a>
          )}
          {companyInfo?.email && (
            <a href={`mailto:${companyInfo.email}`} className={rowLink}>
              <Mail className="h-[22px] w-[22px] flex-none text-navy-accent" strokeWidth={1.6} aria-hidden="true" />
              {companyInfo.email}
            </a>
          )}
        </div>
      </div>
      <SiteContactForm />
    </section>
  );
}
