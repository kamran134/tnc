'use client';

import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { CompanyInfoDto } from '@/types/api';

interface VisionProps {
  lang: string;
  companyInfo: CompanyInfoDto | null;
}

export default function Vision({ lang, companyInfo }: VisionProps) {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section ref={ref as any} className="snap-start section-padding bg-primary-50 flex items-center" style={{ minHeight: '100vh' }}>
      <div className="container-max">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className={`text-3xl md:text-4xl font-bold text-gray-900 mb-8 transition-all duration-1000 ${isVisible ? 'opacity-100 scale-100 rotate-0' : 'opacity-0 scale-90 -rotate-3'}`}>
            {companyInfo?.visionTitle || 'Our Vision'}
          </h2>
          <div className={`prose prose-lg mx-auto transition-all duration-1200 delay-200 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-20'}`}>
            <p className="text-xl text-gray-700 leading-relaxed">
              {companyInfo?.visionDescription || 'Our aspiration is to consistently deliver exceptional outcomes that go beyond client expectations.'}
            </p>
          </div>
          {companyInfo?.visions && companyInfo.visions.length > 0 && (
            <div className="mt-8 space-y-6">
              {companyInfo.visions.map((vision, index) => (
                <div 
                  key={vision.id || index}
                  className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                  style={{ transitionDelay: `${(index + 3) * 150}ms` }}
                >
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{vision.title}</h3>
                  <p className="text-lg text-gray-700">{vision.description}</p>
                </div>
              ))}
            </div>
          )}
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
