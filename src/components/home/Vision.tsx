'use client';

import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { CompanyInfoDto } from '@/types/api';
import { getIconByName } from '@/lib/icons/mission-vision-icons';

interface VisionProps {
  lang: string;
  companyInfo: CompanyInfoDto | null;
}

export default function Vision({ companyInfo }: VisionProps) {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section ref={ref as any} className="snap-start section-padding bg-gray-50 flex items-center" style={{ minHeight: '100vh' }}>
      <div className="container-max">
        <div className={`text-center mb-16 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {companyInfo?.visionTitle || 'Our Vision'}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {companyInfo?.visionDescription || 'Our aspiration is to consistently deliver exceptional outcomes that go beyond client expectations.'}
          </p>
        </div>

        {companyInfo?.visions && companyInfo.visions.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {companyInfo.visions.map((vision, index) => {
              const Icon = getIconByName(vision.icon);
              return (
                <div
                  key={vision.id || index}
                  className={`bg-white p-8 rounded-lg hover:shadow-lg transition-all duration-1000 ease-out ${isVisible ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-50 translate-y-20'}`}
                  style={{ transitionDelay: `${index * 150}ms` }}
                >
                  <div className="flex items-center mb-6">
                    <div className="w-12 h-12 bg-sky-100 rounded-full flex items-center justify-center mr-4">
                      {Icon ? (
                        <Icon className="w-6 h-6 text-sky-600" />
                      ) : (
                        <svg className="w-6 h-6 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">{vision.title}</h3>
                  </div>
                  <p className="text-gray-700 leading-relaxed">{vision.description}</p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  )
}
