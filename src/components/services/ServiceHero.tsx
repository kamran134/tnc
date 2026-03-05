'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { decodeHtmlEntities } from '@/lib/sanitize';

interface HeroData {
  title: string;
  subtitle?: string;
  heroDescription?: string;
  buttonText?: string;
  buttonUrl?: string;
}

export default function ServiceHero() {
  const params = useParams();
  const lang = (params.lang as string) || 'en';
  const [heroData, setHeroData] = useState<HeroData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchHeroData = async () => {
      try {
        const response = await fetch(`/api/page-hero/SERVICES?lang=${lang}`);
        if (response.ok) {
          const data = await response.json();
          // Backend returns an array; take the first active entry
          const first = Array.isArray(data) ? data[0] ?? null : data;
          setHeroData(first);
        }
      } catch (error) {
        console.error('Error fetching hero data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHeroData();
  }, [lang]);

  const title = decodeHtmlEntities(heroData?.title) || 'Our Professional Services';
  const subtitle = decodeHtmlEntities(heroData?.subtitle) || '';
  const description = decodeHtmlEntities(heroData?.heroDescription) || 'Comprehensive tax, legal, and consulting solutions tailored to your business needs';

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
    <section className="bg-gradient-to-r from-sky-400 to-sky-500 text-white section-padding">
      <div className="container-max">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            {title}
          </h1>
          {subtitle && subtitle !== title && (
            <h2 className="text-2xl md:text-3xl font-semibold mb-4 text-white/90">
              {subtitle}
            </h2>
          )}
          <p className="text-xl md:text-2xl text-white/80">
            {description}
          </p>
        </div>
      </div>
    </section>
  )
}
