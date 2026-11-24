'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { ArrowRight } from 'lucide-react';
import { usePageHeroQuery } from '@/hooks/queries';
import { useTranslations } from '@/hooks/useTranslations';
import { resolveImageUrl } from '@/lib/utils/image';
import { sanitizeHtml } from '@/lib/sanitize';
import type { LanguageCode, PageTag } from '@/types/api';

export interface SitePageHeroAction {
  label: string;
  href: string;
}

interface SitePageHeroViewProps {
  /** Label of the current page in the breadcrumb. */
  breadcrumb: string;
  title?: string;
  subtitle?: string;
  description?: string;
  eyebrow?: string;
  imageUrl?: string;
  action?: SitePageHeroAction;
  wideDescription?: boolean;
  loading?: boolean;
}

const stripTags = (s: string) => s.replace(/<[^>]*>/g, '').trim();

export function SitePageHeroView({
  breadcrumb,
  title,
  subtitle,
  description,
  eyebrow,
  imageUrl,
  action,
  wideDescription = false,
  loading = false,
}: SitePageHeroViewProps) {
  const params = useParams();
  const lang = (params.lang as string) || 'az';
  const { t } = useTranslations();
  const showSubtitle = !!subtitle && stripTags(subtitle) !== stripTags(title || '');

  return (
    <section className="site-under-header relative flex min-h-[calc(440px+var(--site-header-h))] flex-col justify-center overflow-hidden">
      {imageUrl && (
        <Image src={imageUrl} alt="" fill priority sizes="100vw" className="object-cover" />
      )}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(90deg, rgba(7,27,46,0.96) 0%, rgba(7,27,46,0.85) 45%, rgba(7,27,46,0.45) 100%)',
        }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-40"
        style={{ background: 'linear-gradient(0deg, #071B2E 0%, rgba(7,27,46,0) 100%)' }}
      />
      <div className="site-wrap relative flex flex-col gap-5 py-12 md:py-[72px]">
        <nav
          aria-label="Breadcrumb"
          className="flex flex-wrap items-center gap-x-2.5 gap-y-1.5 text-sm text-navy-muted"
        >
          <Link href={`/${lang}`} className="text-navy-muted transition-colors hover:text-white">
            {t('breadcrumbs.home')}
          </Link>
          <span aria-hidden="true">/</span>
          <span aria-current="page">{breadcrumb}</span>
        </nav>

        {loading ? (
          <div className="flex flex-col gap-4" aria-hidden="true">
            <div className="h-14 max-w-xl animate-pulse rounded-lg bg-white/10" />
            <div className="h-6 max-w-md animate-pulse rounded-lg bg-white/10" />
          </div>
        ) : (
          <>
            {eyebrow && (
              <span className="font-plexmono text-[13px] tracking-[0.08em] text-navy-accent">{eyebrow}</span>
            )}
            {title && (
              <div
                role="heading"
                aria-level={1}
                className="hero-rte text-[clamp(40px,5vw,68px)] font-semibold leading-[1.05] tracking-[-0.03em]"
                dangerouslySetInnerHTML={{ __html: sanitizeHtml(title) }}
              />
            )}
            {showSubtitle && (
              <div
                role="heading"
                aria-level={2}
                className="hero-rte text-xl font-medium text-navy-accent"
                dangerouslySetInnerHTML={{ __html: sanitizeHtml(subtitle!) }}
              />
            )}
            {description && (
              <div
                className={`hero-rte text-lg text-navy-text2 ${wideDescription ? 'max-w-[760px]' : 'max-w-[640px]'}`}
                dangerouslySetInnerHTML={{ __html: sanitizeHtml(description) }}
              />
            )}
            {action && (
              <div className="pt-2">
                <Link
                  href={action.href}
                  className="inline-flex min-h-[56px] items-center gap-2.5 rounded-md bg-navy-accent px-7 font-semibold text-navy-950 transition-colors hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                  {action.label}
                  <ArrowRight className="h-[18px] w-[18px]" aria-hidden="true" />
                </Link>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}

interface SitePageHeroProps {
  pageTag: PageTag;
  breadcrumb: string;
  fallbackTitle: string;
  fallbackDescription?: string;
  action?: SitePageHeroAction;
  wideDescription?: boolean;
}

/** Page hero fed by the page-hero API (first active slide), with locale fallbacks. */
export default function SitePageHero({
  pageTag,
  breadcrumb,
  fallbackTitle,
  fallbackDescription,
  action,
  wideDescription,
}: SitePageHeroProps) {
  const params = useParams();
  const lang = ((params.lang as string) || 'az') as LanguageCode;
  const { data, isLoading } = usePageHeroQuery(pageTag, lang);
  const hero = Array.isArray(data) ? data[0] ?? null : data ?? null;

  return (
    <SitePageHeroView
      breadcrumb={breadcrumb}
      loading={isLoading}
      title={hero?.title || fallbackTitle}
      subtitle={hero?.subtitle}
      description={hero?.heroDescription || fallbackDescription}
      imageUrl={resolveImageUrl(hero?.backgroundImageUrl)}
      action={action}
      wideDescription={wideDescription}
    />
  );
}
