'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { useTranslations } from '@/hooks/useTranslations';
import { useEffect, useState, useRef, useCallback } from 'react';
import type { PageHeroUserDto } from '@/types/api';

const SLIDE_DURATION_MS = 5500;
const FADE_DURATION_MS = 1100;

interface HeroProps {
  companyInfo?: unknown;
}

export default function Hero(_: HeroProps) {
  const params = useParams();
  const lang = (params.lang as string) || 'az';
  const { ref, isVisible } = useScrollAnimation();
  const { t } = useTranslations();

  const [slides, setSlides] = useState<PageHeroUserDto[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const fetchSlides = async () => {
      try {
        const response = await fetch(`/api/page-hero/HOME?lang=${lang}`);
        if (response.ok) {
          const data = await response.json();
          setSlides(Array.isArray(data) ? data : data ? [data] : []);
        }
      } catch (error) {
        console.error('Error fetching hero slides:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSlides();
  }, [lang]);

  const advance = useCallback(() => {
    setActiveIndex(i => (i + 1) % slides.length);
  }, [slides.length]);

  useEffect(() => {
    if (slides.length <= 1) return;
    timerRef.current = setTimeout(advance, SLIDE_DURATION_MS);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [activeIndex, slides.length, advance]);

  const goTo = (index: number) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setActiveIndex(index);
  };

  const buildButtonUrl = (slide: PageHeroUserDto) => {
    const raw = slide.buttonUrl || '/services';
    if (raw.startsWith('http')) return raw;
    const clean = raw.startsWith('/') ? raw : `/${raw}`;
    return `/${lang}${clean}`;
  };

  if (isLoading) {
    return (
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
  }

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

  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      className="snap-start relative bg-gradient-to-br from-sky-400 via-sky-500 to-blue-600 text-white overflow-hidden"
      style={{ height: 'calc(100vh - 73px)' }}
    >
      {/* Each slide is a self-contained unit: background + overlay + text */}
      {effectiveSlides.map((slide, i) => {
        const isActive = i === activeIndex;
        const buttonText = slide.buttonText || 'Our Services';
        const buttonUrl = buildButtonUrl(slide);

        return (
          <div
            key={slide.id ?? i}
            aria-hidden={!isActive}
            style={{
              position: 'absolute',
              inset: 0,
              transition: `opacity ${FADE_DURATION_MS}ms ease-in-out`,
              opacity: isActive ? 1 : 0,
              pointerEvents: isActive ? 'auto' : 'none',
              zIndex: isActive ? 1 : 0,
            }}
          >
            {/* Background image */}
            {slide.backgroundImageUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={slide.backgroundImageUrl}
                alt=""
                className="absolute inset-0 w-full h-full object-cover"
              />
            )}

            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-sky-600/60 via-sky-500/50 to-blue-700/60" />

            {/* Text content */}
            <div className="relative z-10 h-full flex items-center justify-center">
              <div className="container-max w-full">
                <div
                  className={`text-center max-w-6xl mx-auto transition-all duration-1000 ease-out ${
                    isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
                  }`}
                >
                  <h1 className="text-5xl font-bold mb-12">{slide.title}</h1>

                  {slide.subtitle && (
                    <h2 className="text-3xl md:text-4xl font-semibold mb-8 text-sky-100">
                      {slide.subtitle}
                    </h2>
                  )}

                  <div className="text-center max-w-3xl mx-auto">
                    {slide.heroDescription && (
                      <p className="text-xl md:text-2xl mb-12 text-sky-100">
                        {slide.heroDescription}
                      </p>
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
          </div>
        );
      })}

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
