'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { PageTag } from '@/types/api';
import { decodeHtmlEntities } from '@/lib/sanitize';

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
}

export default function PageHero({ 
  pageTag,
  fallbackTitle = 'Welcome',
  fallbackDescription = 'Professional services for your business',
  variant = 'gradient' 
}: PageHeroProps) {
  const pathname = usePathname();
  const [heroData, setHeroData] = useState<PageHeroData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Определяем язык из URL
  const lang = pathname?.startsWith('/ru') ? 'ru' : pathname?.startsWith('/az') ? 'az' : 'en';

  useEffect(() => {
    const fetchHeroData = async () => {
      try {
        const response = await fetch(`/api/page-hero/${pageTag}?lang=${lang}`);
        if (response.ok) {
          const data = await response.json();
          // Backend returns an array; take the first active entry
          const first = Array.isArray(data) ? data[0] ?? null : data;
          setHeroData(first);
        } else {
          console.log(`Page hero API returned ${response.status}, using fallback`);
        }
      } catch (error) {
        console.log('Error fetching page hero, using fallback:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHeroData();
  }, [pageTag, lang]);

  const bgClass = 'bg-gradient-to-r from-sky-400 to-sky-500';

  const title = decodeHtmlEntities(heroData?.title) || fallbackTitle;
  const description = decodeHtmlEntities(heroData?.heroDescription) || decodeHtmlEntities(heroData?.subtitle) || fallbackDescription;

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
    <section className={`${bgClass} text-white section-padding`}>
      <div className="container-max">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            {title}
          </h1>
          {heroData?.subtitle && heroData.subtitle !== title && (
            <p className="text-2xl md:text-3xl text-white/90 mb-4 font-medium">
              {decodeHtmlEntities(heroData.subtitle)}
            </p>
          )}
          <p className="text-xl md:text-2xl text-white/80">
            {description}
          </p>
          {heroData?.buttonText && heroData?.buttonUrl && (
            <div className="mt-8">
              <a
                href={heroData.buttonUrl}
                className="inline-block px-8 py-3 bg-white text-sky-600 font-semibold rounded-lg hover:bg-white/90 transition-colors"
              >
                {decodeHtmlEntities(heroData.buttonText)}
              </a>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
