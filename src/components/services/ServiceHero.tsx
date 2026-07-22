'use client';

import { useParams } from 'next/navigation';
import Image from 'next/image';
import { usePageHeroQuery } from '@/hooks/queries';
import type { LanguageCode } from '@/types/api';
import { sanitizeHtml } from '@/lib/sanitize';
import { resolveImageUrl } from '@/lib/utils/image';

interface HeroData {
  title: string;
  subtitle?: string;
  heroDescription?: string;
  buttonText?: string;
  buttonUrl?: string;
  backgroundImageUrl?: string;
}

export default function ServiceHero() {
  const params = useParams();
  const lang = ((params.lang as string) || 'az') as LanguageCode;

  const { data: slidesData, isLoading } = usePageHeroQuery('SERVICES', lang);
  // Backend returns an array; take the first active entry
  const heroData: HeroData | null = Array.isArray(slidesData) ? (slidesData[0] ?? null) : (slidesData ?? null);

  const rawTitle = heroData?.title || 'Our Professional Services';
  const rawSubtitle = heroData?.subtitle || '';
  const rawDescription = heroData?.heroDescription || 'Comprehensive tax, legal, and consulting solutions tailored to your business needs';
  const hasBackgroundImage = !!heroData?.backgroundImageUrl;

  if (isLoading) {
    return (
      <section className="bg-gradient-to-r from-sky-400 to-sky-500 text-white section-padding">
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
    <section className={`relative ${hasBackgroundImage ? '' : 'bg-gradient-to-r from-sky-400 to-sky-500'} text-white section-padding overflow-hidden`}>
      {/* Background image layer */}
      {hasBackgroundImage && (
        <>
          <Image
            src={resolveImageUrl(heroData!.backgroundImageUrl)!}
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
              className="hero-rte text-2xl md:text-3xl font-semibold mb-4 text-white/90"
              dangerouslySetInnerHTML={{ __html: sanitizeHtml(rawSubtitle) }}
            />
          )}
          <div
            className="hero-rte text-xl md:text-2xl text-white/80"
            dangerouslySetInnerHTML={{ __html: sanitizeHtml(rawDescription) }}
          />
        </div>
      </div>
    </section>
  )
}
