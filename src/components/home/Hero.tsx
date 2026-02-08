'use client';

import { useParams } from 'next/navigation'
import Link from 'next/link'
import { useScrollAnimation } from '@/hooks/useScrollAnimation'
import { useTranslations } from '@/hooks/useTranslations'
import { useEffect, useState } from 'react'
import { CompanyInfoDto } from '@/types/api'

interface HeroData {
  title: string;
  subtitle?: string;
  heroDescription?: string;
  buttonText?: string;
  buttonUrl?: string;
}

interface HeroProps {
  companyInfo?: CompanyInfoDto | null;
}

export default function Hero({ companyInfo }: HeroProps) {
  const params = useParams();
  const lang = (params.lang as string) || 'az';
  const { ref, isVisible } = useScrollAnimation();
  const { t } = useTranslations();
  const [heroData, setHeroData] = useState<HeroData | null>(null);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchHeroData = async () => {
      try {
        const response = await fetch(`/api/page-hero/HOME?lang=${lang}`);
        if (response.ok) {
          const data = await response.json();
          setHeroData(data);
        }
      } catch (error) {
        console.error('Error fetching hero data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHeroData();
  }, [lang]);

  const title = heroData?.title || 'Professional Tax & Consulting Services';
  const subtitle = heroData?.subtitle || '';
  const description = heroData?.heroDescription || 'Delivering excellence with integrity. Expert guidance for your business growth and compliance needs.';
  const buttonText = heroData?.buttonText || 'Our Services';
  const buttonUrl = `/${lang}${heroData?.buttonUrl}` || `/${lang}/services`;

  if (isLoading) {
    return (
      <section ref={ref as any} className="snap-start relative bg-gradient-to-br from-sky-400 via-sky-500 to-blue-600 text-white flex items-center justify-center overflow-hidden" style={{ height: 'calc(100vh - 73px)' }}>
        <div className="container-max relative z-20">
          <div className="text-center max-w-6xl mx-auto">
            <div className="h-16 bg-white/10 rounded-lg animate-pulse mb-12 mx-auto max-w-3xl"></div>
            <div className="h-10 bg-white/10 rounded-lg animate-pulse mb-8 mx-auto max-w-2xl"></div>
            <div className="h-8 bg-white/10 rounded-lg animate-pulse mb-12 mx-auto max-w-2xl"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section ref={ref as any} className="snap-start relative bg-gradient-to-br from-sky-400 via-sky-500 to-blue-600 text-white flex items-center justify-center overflow-hidden" style={{ height: 'calc(100vh - 73px)' }}>
      <div className="container-max relative z-20">
        <div className={`text-center max-w-6xl mx-auto transition-all duration-1200 ease-out ${isVisible ? 'opacity-100 scale-100 blur-0' : 'opacity-0 scale-90 blur-sm'}`}>
          <h1 className="text-5xl md:text-5xl font-bold mb-12">
            {title}
          </h1>
          {subtitle && (
            <h2 className="text-3xl md:text-4xl font-semibold mb-8 text-sky-100">
              {subtitle}
            </h2>
          )}
          <div className="text-center max-w-3xl mx-auto">
            <p className="text-xl md:text-2xl mb-12 text-primary-100">
              {description}
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                href={buttonUrl.startsWith('/') ? buttonUrl : `/${lang}/${buttonUrl}`}
                className="bg-white text-primary-700 font-semibold py-4 px-10 rounded-lg hover:bg-gray-100 transition-colors duration-200 text-lg"
              >
                {buttonText}
              </Link>
              <Link
                href={`/${lang}/contact`}
                className="border-2 border-white text-white font-semibold py-4 px-10 rounded-lg hover:bg-white hover:text-primary-700 transition-colors duration-200 text-lg"
              >
                {t('home.hero.getInTouch')}
              </Link>
            </div>
          </div>
          
        </div>
      </div>
    </section>
  )
}
