'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { ArrowRight } from 'lucide-react';
import { useTranslations } from '@/hooks/useTranslations';
import { useCompanyInfo, usePageHeroQuery } from '@/hooks/queries';
import { resolveImageUrl } from '@/lib/utils/image';
import { decodeHtmlEntities, sanitizeHtml } from '@/lib/sanitize';
import type { LanguageCode, PageHeroUserDto } from '@/types/api';

// How long text stays fully visible before the leave animation starts
const SLIDE_HOLD_MS = 5500;
// Text leave animation duration (slides down + fades out)
const TEXT_OUT_MS = 400;
// Background cross-fade duration
const BG_FADE_MS = 900;

export default function HomeHero() {
  const params = useParams();
  const lang = ((params.lang as string) || 'az') as LanguageCode;
  const { t } = useTranslations();
  const { data: companyInfo } = useCompanyInfo(lang);

  const { data: slidesData, isLoading } = usePageHeroQuery('HOME', lang);
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

  // Show text shortly after slides arrive (or immediately when there are none)
  useEffect(() => {
    if (isLoading) return;
    const id = setTimeout(() => setTextVisible(true), 250);
    return () => clearTimeout(id);
  }, [slides.length, isLoading]);

  // Transition: text out -> bg swap -> text in
  const transitionTo = useCallback((nextIndex: number) => {
    clearTimeouts();
    setTextVisible(false);
    schedule(() => {
      setActiveIndex(nextIndex);
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

  const sectionClass = 'relative flex min-h-[760px] flex-col overflow-hidden bg-navy-950 md:min-h-[820px]';

  if (isLoading) {
    return (
      <section className={sectionClass}>
        <div className="site-wrap flex flex-1 flex-col justify-center gap-7 pb-10 pt-32" aria-hidden="true">
          <div className="h-20 max-w-[820px] animate-pulse rounded-lg bg-white/10" />
          <div className="h-8 max-w-[560px] animate-pulse rounded-lg bg-white/10" />
        </div>
      </section>
    );
  }

  const hasSlides = slides.length > 0;
  const current = hasSlides ? slides[Math.min(activeIndex, slides.length - 1)] : null;
  const buttonText = current ? decodeHtmlEntities(current.buttonText) || t('home.hero.ourServices') : t('home.hero.ourServices');
  const buttonUrl = current ? buildButtonUrl(current) : `/${lang}/services`;

  return (
    <section className={sectionClass}>
      {/* Background images: cross-fade between slides */}
      <div className="absolute inset-0">
        {slides.map((slide, i) => {
          const src = resolveImageUrl(slide.backgroundImageUrl);
          return (
            <div
              key={slide.id ?? i}
              aria-hidden="true"
              className="absolute inset-0"
              style={{ transition: `opacity ${BG_FADE_MS}ms ease-in-out`, opacity: i === activeIndex ? 1 : 0 }}
            >
              {src && (
                <Image
                  src={src}
                  alt=""
                  fill
                  priority={i === 0}
                  sizes="100vw"
                  className="object-cover object-[75%_50%]"
                />
              )}
            </div>
          );
        })}
      </div>
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(90deg, rgba(7,27,46,0.97) 0%, rgba(7,27,46,0.88) 38%, rgba(7,27,46,0.35) 70%, rgba(7,27,46,0.2) 100%)',
        }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-[280px]"
        style={{ background: 'linear-gradient(0deg, #071B2E 0%, rgba(7,27,46,0) 100%)' }}
      />

      {/* Slide content */}
      <div
        className="site-wrap relative flex flex-1 flex-col justify-center gap-7 pb-10 pt-32"
        style={{
          transition: `opacity ${TEXT_OUT_MS}ms ease-out, transform ${TEXT_OUT_MS}ms ease-out`,
          opacity: textVisible ? 1 : 0,
          transform: textVisible ? 'translateY(0)' : 'translateY(28px)',
        }}
      >
        {current ? (
          <>
            <div
              role="heading"
              aria-level={1}
              className="hero-rte max-w-[820px] text-[clamp(40px,6vw,84px)] font-semibold leading-[1.02] tracking-[-0.03em]"
              dangerouslySetInnerHTML={{ __html: sanitizeHtml(current.title) }}
            />
            {current.subtitle && (
              <div
                role="heading"
                aria-level={2}
                className="hero-rte max-w-[640px] text-xl font-medium text-navy-accent"
                dangerouslySetInnerHTML={{ __html: sanitizeHtml(current.subtitle) }}
              />
            )}
            {current.heroDescription && (
              <div
                className="hero-rte max-w-[560px] text-[19px] text-navy-text2"
                dangerouslySetInnerHTML={{ __html: sanitizeHtml(current.heroDescription) }}
              />
            )}
          </>
        ) : (
          <>
            <h1 className="m-0 max-w-[820px] text-[clamp(40px,6vw,84px)] font-semibold leading-[1.02] tracking-[-0.03em]">
              {companyInfo?.companyName || 'TnC'}
            </h1>
            {companyInfo?.description && (
              <p className="m-0 max-w-[560px] text-[19px] text-navy-text2">{companyInfo.description}</p>
            )}
          </>
        )}
        <div className="flex flex-wrap gap-3.5 pt-2">
          <Link
            href={buttonUrl}
            className="inline-flex min-h-[56px] items-center gap-2.5 rounded-md bg-navy-accent px-7 font-semibold text-navy-950 transition-colors hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            {buttonText}
            <ArrowRight className="h-[18px] w-[18px]" aria-hidden="true" />
          </Link>
          <Link
            href={`/${lang}/contact`}
            className="inline-flex min-h-[56px] items-center rounded-md border border-[rgba(234,241,246,0.4)] px-7 font-semibold text-navy-text transition-colors hover:border-white hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            {t('home.hero.getInTouch')}
          </Link>
        </div>
      </div>

      {/* Slide dots */}
      <div className="site-wrap relative flex items-center gap-1 pb-8">
        {slides.length > 1 &&
          slides.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => goTo(i)}
              aria-label={String(i + 1)}
              aria-current={i === activeIndex ? 'true' : undefined}
              className="flex h-11 w-11 cursor-pointer items-center justify-center border-0 bg-transparent p-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-navy-accent"
            >
              <span
                className={`block h-2.5 rounded-full transition-all duration-300 ${
                  i === activeIndex ? 'w-7 bg-navy-accent' : 'w-2.5 bg-[rgba(234,241,246,0.4)]'
                }`}
              />
            </button>
          ))}
      </div>
    </section>
  );
}
