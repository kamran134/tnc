'use client';

import { useState, useEffect } from 'react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { companyInfoService } from '@/lib/api';
import { CompanyInfoDto, LanguageCode } from '@/types/api';

interface VisionProps {
  lang?: string;
}

export default function Vision({ lang = 'az' }: VisionProps) {
  const { ref, isVisible } = useScrollAnimation();
  const [companyInfo, setCompanyInfo] = useState<CompanyInfoDto | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCompanyInfo = async () => {
      try {
        const data = await companyInfoService.getCompanyInfo(lang as LanguageCode);
        setCompanyInfo(data);
      } catch (error) {
        console.error('Failed to load company info for vision:', error);
      } finally {
        setLoading(false);
      }
    };

    loadCompanyInfo();
  }, [lang]);

  if (loading) {
    return (
      <section className="snap-start section-padding bg-primary-50 flex items-center" style={{ minHeight: '100vh' }}>
        <div className="container-max">
          <div className="max-w-4xl mx-auto text-center">
            <div className="animate-pulse">
              <div className="h-10 bg-gray-200 rounded w-64 mx-auto mb-8"></div>
              <div className="h-32 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section ref={ref as any} className="snap-start section-padding bg-primary-50 flex items-center" style={{ minHeight: '100vh' }}>
      <div className="container-max">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className={`text-3xl md:text-4xl font-bold text-gray-900 mb-8 transition-all duration-1000 ${isVisible ? 'opacity-100 scale-100 rotate-0' : 'opacity-0 scale-90 -rotate-3'}`}>
            {companyInfo?.visionTitle || 'Our Vision'}
          </h2>
          <div className={`prose prose-lg mx-auto transition-all duration-1200 delay-200 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-20'}`}>
            <p className="text-xl text-gray-700 leading-relaxed">
              {companyInfo?.visionDescription || 'Our aspiration is to consistently deliver exceptional outcomes that go beyond client expectations, contributing significant value to their businesses. We aim to establish ourselves as a leading firm on both the national and regional stages, upholding the highest standards of ethical integrity and expertise.'}
            </p>
          </div>
          <div className={`mt-12 bg-white rounded-lg p-8 shadow-md transition-all duration-1200 delay-500 ${isVisible ? 'opacity-100 scale-100 rotate-0' : 'opacity-0 scale-75 rotate-6'}`}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Leading the Industry</h3>
                <p className="text-gray-600">
                  Establishing ourselves as the premier choice for tax and consulting services 
                  across Azerbaijan and the region.
                </p>
              </div>
              <div className="text-center">
                <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center mx-auto">
                  <svg className="w-12 h-12 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
