'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

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

  useEffect(() => {
    const fetchHeroData = async () => {
      try {
        const response = await fetch(`/api/page-hero/SERVICES?lang=${lang}`);
        if (response.ok) {
          const data = await response.json();
          setHeroData(data);
        }
      } catch (error) {
        console.error('Error fetching hero data:', error);
      }
    };

    fetchHeroData();
  }, [lang]);

  const title = heroData?.title || 'Our Professional Services';
  const subtitle = heroData?.subtitle || '';
  const description = heroData?.heroDescription || 'Comprehensive tax, legal, and consulting solutions tailored to your business needs';

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
