'use client';

import { useState, useEffect, useRef } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { LoadingSpinner, Alert, PageHero } from '@/components/ui';

interface AboutSection {
  id: number;
  sortOrder: number;
  title?: string;
  subtitle?: string;
  description?: string;
  imageUrl?: string;
}

interface AboutPageProps {
  params: Promise<{ lang: string }>;
}

// Per-section visibility hook (each section has its own observer)
function useSectionVisible(threshold = 0.18) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const thresholdRef = useRef(threshold);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: thresholdRef.current }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return { ref, isVisible };
}

// ────────────────────────────────────────────────────────────────────────────
// Single section block — Variant B "Cinematic Numbers"
// ────────────────────────────────────────────────────────────────────────────
function SectionBlock({ section, index }: { section: AboutSection; index: number }) {
  const { ref, isVisible } = useSectionVisible(0.15);
  const isEven = index % 2 === 0;

  // Image reveals from the outer edge inward (left for even, right for odd)
  const imageClipStart = isEven ? 'inset(0 100% 0 0 round 16px)' : 'inset(0 0 0 100% round 16px)';
  const imageClipEnd = 'inset(0 0% 0 0% round 16px)';

  // Text slides in from opposite side
  const textTranslateStart = isEven ? 'translateX(56px)' : 'translateX(-56px)';

  return (
    <section
      ref={ref}
      className={`relative overflow-hidden ${isEven ? 'bg-white' : 'bg-slate-50'}`}
    >
      <div className="container-max section-padding">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* ── Image column ── */}
          <div className={`relative ${isEven ? 'lg:order-1' : 'lg:order-2'}`}>
            {/* Soft glow behind image */}
            <div
              className={`absolute -inset-6 rounded-3xl pointer-events-none transition-opacity duration-700 ${isEven ? 'bg-sky-50' : 'bg-slate-100'}`}
              style={{ opacity: isVisible ? 1 : 0 }}
            />

            {/* Image with clip-path reveal */}
            <div
              className="relative z-10 overflow-hidden rounded-2xl shadow-xl aspect-[4/3]"
              style={{
                clipPath: isVisible ? imageClipEnd : imageClipStart,
                transition: 'clip-path 1.05s cubic-bezier(0.77, 0, 0.18, 1)',
              }}
            >
              {section.imageUrl ? (
                <img
                  src={section.imageUrl}
                  alt={section.title || ''}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-sky-400 via-sky-500 to-sky-600 flex items-center justify-center">
                  <svg className="w-20 h-20 text-white/25" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" />
                  </svg>
                </div>
              )}
            </div>

            {/* Corner accent square */}
            <div
              className={`absolute z-20 w-14 h-14 border-[3px] border-sky-500 rounded-br-xl pointer-events-none ${isEven ? '-bottom-3 -right-3' : '-bottom-3 -left-3'}`}
              style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'scale(1)' : 'scale(0)',
                transformOrigin: isEven ? 'bottom right' : 'bottom left',
                transition: 'opacity 0.4s ease-out, transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
                transitionDelay: '0.65s',
              }}
            />
          </div>

          {/* ── Text column ── */}
          <div
            className={`relative ${isEven ? 'lg:order-2' : 'lg:order-1'}`}
            style={{
              transform: isVisible ? 'translateX(0)' : textTranslateStart,
              opacity: isVisible ? 1 : 0,
              transition: 'transform 0.85s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.85s ease-out',
              transitionDelay: '0.15s',
            }}
          >
            <div className="relative z-10">
              {/* Subtitle / tag */}
              {section.subtitle && (
                <p
                  className="text-sky-600 font-semibold text-sm uppercase tracking-widest mb-3 flex items-center gap-2"
                  style={{
                    opacity: isVisible ? 1 : 0,
                    transform: isVisible ? 'translateY(0)' : 'translateY(8px)',
                    transition: 'opacity 0.5s ease-out, transform 0.5s ease-out',
                    transitionDelay: '0.3s',
                  }}
                >
                  <span className="block w-6 h-0.5 bg-sky-500 flex-shrink-0" />
                  {section.subtitle}
                </p>
              )}

              {/* Title */}
              {section.title && (
                <h2
                  className="text-3xl lg:text-4xl font-bold text-gray-900 mb-5 leading-tight"
                  style={{
                    opacity: isVisible ? 1 : 0,
                    transform: isVisible ? 'translateY(0)' : 'translateY(8px)',
                    transition: 'opacity 0.55s ease-out, transform 0.55s ease-out',
                    transitionDelay: '0.42s',
                  }}
                >
                  {section.title}
                </h2>
              )}

              {/* Description */}
              {section.description && (
                <div
                  className="text-gray-600 text-base lg:text-lg leading-relaxed prose prose-sky max-w-none"
                  style={{
                    opacity: isVisible ? 1 : 0,
                    transform: isVisible ? 'translateY(0)' : 'translateY(8px)',
                    transition: 'opacity 0.55s ease-out, transform 0.55s ease-out',
                    transitionDelay: '0.54s',
                  }}
                  dangerouslySetInnerHTML={{ __html: section.description }}
                />
              )}

              {/* Empty state hint */}
              {!section.title && !section.description && (
                <p className="text-gray-400 italic">Content coming soon…</p>
              )}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// Page
// ────────────────────────────────────────────────────────────────────────────
export default function AboutPage({ params }: AboutPageProps) {
  const [lang, setLang] = useState('az');
  const [sections, setSections] = useState<AboutSection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    params.then(({ lang: resolvedLang }) => {
      setLang(resolvedLang);
      loadContent(resolvedLang);
    });
  }, [params]);

  const loadContent = async (language: string) => {
    try {
      setIsLoading(true);
      const res = await fetch(`/api/about-content?lang=${language}`);
      if (!res.ok) throw new Error('Failed to load');
      const data = await res.json();
      setSections(data.sections || []);
      setError(null);
    } catch {
      setError(
        language === 'az'
          ? 'Məzmunu yükləmək alınmadı'
          : language === 'ru'
          ? 'Не удалось загрузить контент'
          : 'Failed to load content'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const fallbackTitle =
    lang === 'az' ? 'Haqqımızda' : lang === 'ru' ? 'О нас' : 'About Us';
  const fallbackDesc =
    lang === 'az'
      ? 'TnC Vergi və Konsaltinq şirkəti haqqında ətraflı məlumat'
      : lang === 'ru'
      ? 'Узнайте больше о компании TnC Tax & Consulting'
      : 'Learn more about TnC Tax & Consulting';

  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <PageHero
          pageTag="ABOUT"
          fallbackTitle={fallbackTitle}
          fallbackDescription={fallbackDesc}
        />

        {isLoading ? (
          <div className="section-padding flex justify-center">
            <LoadingSpinner />
          </div>
        ) : error ? (
          <div className="section-padding container-max max-w-2xl mx-auto">
            <Alert type="error" message={error} />
          </div>
        ) : sections.length === 0 ? (
          <div className="section-padding text-center text-gray-500">
            {lang === 'az' ? 'Məzmun tezliklə əlavə ediləcək…' : lang === 'ru' ? 'Контент скоро появится…' : 'Content coming soon…'}
          </div>
        ) : (
          sections.map((section, idx) => (
            <SectionBlock key={section.id} section={section} index={idx} />
          ))
        )}
      </main>
      <Footer />
    </div>
  );
}
