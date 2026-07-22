'use client';

import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { usePageHeroQuery } from '@/hooks/queries';
import type { LanguageCode, PageTag } from '@/types/api';
import { sanitizeHtml } from '@/lib/sanitize';
import { resolveImageUrl } from '@/lib/utils/image';

interface PageHeroProps {
  pageTag: PageTag;
  fallbackTitle?: string;
  fallbackDescription?: string;
  variant?: 'gradient' | 'solid';
}

interface PageHeroData {
  title: string;
  subtitle?: string;
  heroDescription?: string;
  buttonText?: string;
  buttonUrl?: string;
  backgroundImageUrl?: string;
  heroImageUrl?: string;
}

export default function PageHero({ 
  pageTag,
  fallbackTitle = 'Welcome',
  fallbackDescription = 'Professional services for your business',
  variant = 'gradient' 
}: PageHeroProps) {
  const pathname = usePathname();

  // Определяем язык из URL
  const lang = (pathname?.startsWith('/en') ? 'en' : pathname?.startsWith('/ru') ? 'ru' : 'az') as LanguageCode;

  const { data: slidesData, isLoading } = usePageHeroQuery(pageTag, lang);
  // Backend returns an array; take the first active entry
  const heroData: PageHeroData | null = Array.isArray(slidesData) ? (slidesData[0] ?? null) : (slidesData ?? null);

  const backgroundImageUrl = resolveImageUrl(heroData?.backgroundImageUrl);
  const hasBackgroundImage = !!backgroundImageUrl;
  const bgClass = 'bg-gradient-to-r from-sky-400 to-sky-500';

  const rawTitle = heroData?.title || fallbackTitle;
  const rawSubtitle = heroData?.subtitle || '';
  const rawDescription = heroData?.heroDescription || heroData?.subtitle || fallbackDescription;

  if (isLoading) {
    return (
      <section className={`${bgClass} text-white section-padding`}>
        <div className="container-max">
          <div className="text-center max-w-4xl mx-auto">
            <div className="h-14 bg-white/10 rounded-lg animate-pulse mb-6 mx-auto max-w-2xl"></div>
            <div className="h-8 bg-white/10 rounded-lg animate-pulse mx-auto max-w-3xl"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={`relative ${hasBackgroundImage ? '' : bgClass} text-white section-padding overflow-hidden`}>
      {/* Background image layer (per-language) */}
      {backgroundImageUrl && (
        <>
          <Image
            src={backgroundImageUrl}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          {/* Dark scrim for text contrast */}
          <div className="absolute inset-0 bg-black/50" />
          {/* Brand colour tint */}
          <div className="absolute inset-0 bg-gradient-to-r from-sky-600/30 to-sky-500/20" />
        </>
      )}

      <div className="container-max relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          <div
            role="heading"
            aria-level={1}
            className="hero-rte text-4xl md:text-5xl font-bold mb-6"
            dangerouslySetInnerHTML={{ __html: sanitizeHtml(rawTitle) }}
          />
          {rawSubtitle && rawSubtitle !== rawTitle && (
            <div
              role="heading"
              aria-level={2}
              className="hero-rte text-2xl md:text-3xl text-white/90 mb-4 font-medium"
              dangerouslySetInnerHTML={{ __html: sanitizeHtml(rawSubtitle) }}
            />
          )}
          <div
            className="hero-rte text-xl md:text-2xl text-white/80"
            dangerouslySetInnerHTML={{ __html: sanitizeHtml(rawDescription) }}
          />
          {heroData?.buttonText && heroData?.buttonUrl && (
            <div className="mt-8">
              <a
                href={heroData.buttonUrl}
                className="inline-block px-8 py-3 bg-white text-sky-600 font-semibold rounded-lg hover:bg-white/90 transition-colors"
              >
                {heroData.buttonText}
              </a>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
