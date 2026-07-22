'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useTranslations } from '@/hooks/useTranslations';
import { resolveImageUrl } from '@/lib/utils/image';
import { usePageHeroQuery } from '@/hooks/queries';
import { useEffect, useState, useRef, useCallback } from 'react';
import type { LanguageCode, PageHeroUserDto } from '@/types/api';
import { decodeHtmlEntities, sanitizeHtml } from '@/lib/sanitize';

// How long text stays fully visible before the leave animation starts
const SLIDE_HOLD_MS = 5500;
// Text leave animation duration (slides down + fades out)
const TEXT_OUT_MS = 400;
// Background cross-fade duration
const BG_FADE_MS = 900;

interface HeroProps {
  companyInfo?: unknown;
}

export default function Hero(_: HeroProps) {
  const params = useParams();
  const lang = (params.lang as string) || 'az';
  const { t } = useTranslations();

  const { data: slidesData, isLoading } = usePageHeroQuery('HOME', lang as LanguageCode);
  const slides: PageHeroUserDto[] = Array.isArray(slidesData) ? slidesData : slidesData ? [slidesData] : [];
  const [activeIndex, setActiveIndex] = useState(0);
  const [textVisible, setTextVisible] = useState(false);
  // Tracks in-flight timeouts so we can cancel them on unmount / manual nav
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearTimeouts = () => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
  };

  const schedule = (fn: () => void, delay: number) => {
    const id = setTimeout(fn, delay);
    timeoutsRef.current.push(id);
    return id;
  };

  // Cancel any pending slide-transition timeouts on unmount
  useEffect(() => clearTimeouts, []);

  // Show text shortly after slides arrive
  useEffect(() => {
    if (slides.length === 0) return;
    const id = setTimeout(() => setTextVisible(true), 250);
    return () => clearTimeout(id);
  }, [slides.length]);

  // Transition: text out â†’ bg swap â†’ text in
  const transitionTo = useCallback((nextIndex: number) => {
    clearTimeouts();
    // 1. Text leaves
    setTextVisible(false);
    // 2. After text is gone â€” swap background
    schedule(() => {
      setActiveIndex(nextIndex);
      // 3. After bg cross-fade â€” show new text
      schedule(() => setTextVisible(true), BG_FADE_MS);
    }, TEXT_OUT_MS);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Auto-advance: timer starts when text becomes visible
  useEffect(() => {
    if (!textVisible || slides.length <= 1) return;
    const id = setTimeout(() => {
      transitionTo((activeIndex + 1) % slides.length);
    }, SLIDE_HOLD_MS);
    return () => clearTimeout(id);
  }, [textVisible, activeIndex, slides.length, transitionTo]);

  const goTo = (index: number) => {
    if (index === activeIndex) return;
    transitionTo(index);
  };

  const buildButtonUrl = (slide: PageHeroUserDto) => {
    const raw = slide.buttonUrl || '/services';
    if (raw.startsWith('http')) return raw;
    const clean = raw.startsWith('/') ? raw : `/${raw}`;
    return `/${lang}${clean}`;
  };

  const skeletonSection = (
    <section
      className="snap-start relative bg-gradient-to-br from-sky-400 via-sky-500 to-blue-600 text-white flex items-center justify-center overflow-hidden"
      style={{ height: 'calc(100vh - 73px)' }}
    >
      <div className="container-max relative z-10">
        <div className="text-center max-w-6xl mx-auto">
          <div className="h-16 bg-white/10 rounded-lg animate-pulse mb-12 mx-auto max-w-3xl" />
          <div className="h-10 bg-white/10 rounded-lg animate-pulse mb-8 mx-auto max-w-2xl" />
          <div className="h-8 bg-white/10 rounded-lg animate-pulse mb-12 mx-auto max-w-2xl" />
        </div>
      </div>
    </section>
  );

  if (isLoading) return skeletonSection;

  const effectiveSlides: PageHeroUserDto[] = slides.length > 0 ? slides : [
    {
      id: 0,
      pageTag: 'HOME',
      sortOrder: 0,
      languageCode: lang,
      title: 'Professional Tax & Consulting Services',
      heroDescription: 'Delivering excellence with integrity. Expert guidance for your business growth and compliance needs.',
      buttonText: 'Our Services',
      buttonUrl: '/services',
    },
  ];

  const currentSlide = effectiveSlides[activeIndex];
  const buttonText = decodeHtmlEntities(currentSlide.buttonText) || 'Our Services';
  const buttonUrl = buildButtonUrl(currentSlide);

  return (
    <section
      className="snap-start relative bg-gradient-to-br from-sky-400 via-sky-500 to-blue-600 text-white overflow-hidden"
      style={{ height: 'calc(100vh - 73px)' }}
    >
      {/* Background images â€” cross-fade between slides */}
      <div className="absolute inset-0">
        {effectiveSlides.map((slide, i) => (
          <div
            key={slide.id ?? i}
            aria-hidden={i !== activeIndex}
            style={{
              position: 'absolute',
              inset: 0,
              transition: `opacity ${BG_FADE_MS}ms ease-in-out`,
              opacity: i === activeIndex ? 1 : 0,
            }}
          >
            {slide.backgroundImageUrl && (
              <Image
                src={resolveImageUrl(slide.backgroundImageUrl)!}
                alt=""
                fill
                priority={i === activeIndex}
                sizes="100vw"
                className="object-cover"
              />
            )}
          </div>
        ))}
        {/* Layer 1: universal dark scrim — guarantees white text contrast
             regardless of how bright the client's uploaded image is */}
        <div className="absolute inset-0 bg-black/50" />
        {/* Layer 2: brand colour tint on top of the dark scrim */}
        <div className="absolute inset-0 bg-gradient-to-br from-sky-600/35 via-sky-500/25 to-blue-700/35" />
        {/* Layer 3: top-fade for the transparent header — extra darkening
             over the nav area so menu items are always legible */}
        <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-black/40 to-transparent" />
      </div>

      {/* Text content â€” single block that animates in/out */}
      <div
        className="relative z-10 h-full flex items-center justify-center"
        style={{
          transition: `opacity ${TEXT_OUT_MS}ms ease-out, transform ${TEXT_OUT_MS}ms ease-out`,
          opacity: textVisible ? 1 : 0,
          transform: textVisible ? 'translateY(0)' : 'translateY(28px)',
        }}
      >
        <div className="container-max w-full">
          <div className="text-center max-w-6xl mx-auto">
            <div
              role="heading"
              aria-level={1}
              className="hero-rte text-5xl font-bold mb-12"
              dangerouslySetInnerHTML={{ __html: sanitizeHtml(currentSlide.title) }}
            />

            {currentSlide.subtitle && (
              <div
                role="heading"
                aria-level={2}
                className="hero-rte text-3xl md:text-4xl font-semibold mb-8 text-sky-100"
                dangerouslySetInnerHTML={{ __html: sanitizeHtml(currentSlide.subtitle) }}
              />
            )}

            <div className="text-center max-w-3xl mx-auto">
              {currentSlide.heroDescription && (
                <div
                  className="hero-rte text-xl md:text-2xl mb-12 text-sky-100"
                  dangerouslySetInnerHTML={{ __html: sanitizeHtml(currentSlide.heroDescription) }}
                />
              )}

              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link
                  href={buttonUrl}
                  className="bg-white text-sky-700 font-semibold py-4 px-10 rounded-lg hover:bg-gray-100 transition-colors duration-200 text-lg"
                >
                  {buttonText}
                </Link>
                <Link
                  href={`/${lang}/contact`}
                  className="border-2 border-white text-white font-semibold py-4 px-10 rounded-lg hover:bg-white hover:text-sky-700 transition-colors duration-200 text-lg"
                >
                  {t('home.hero.getInTouch')}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation dots */}
      {effectiveSlides.length > 1 && (
        <div className="absolute bottom-8 left-0 right-0 z-20 flex justify-center gap-2">
          {effectiveSlides.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={`rounded-full transition-all duration-300 ${
                i === activeIndex
                  ? 'w-6 h-3 bg-white'
                  : 'w-3 h-3 bg-white/50 hover:bg-white/80'
              }`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
