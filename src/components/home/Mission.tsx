'use client';

import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { CompanyInfoDto } from '@/types/api';
import { getIconByName } from '@/lib/icons/mission-vision-icons';

interface MissionProps {
  lang: string;
  companyInfo: CompanyInfoDto | null;
}

export default function Mission({ lang, companyInfo }: MissionProps) {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section ref={ref as any} className="snap-start section-padding bg-white flex items-center" style={{ minHeight: '100vh' }}>
      <div className="container-max">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className={`text-3xl md:text-4xl font-bold text-gray-900 mb-8 transition-all duration-1000 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-75'}`}>
            {companyInfo?.missionTitle || 'Our Mission'}
          </h2>
          <div className={`prose prose-lg mx-auto transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-16'}`}>
            <p className="text-xl text-gray-700 leading-relaxed">
              {companyInfo?.missionDescription || 'We are dedicated to delivering high-caliber services, grounded in a thorough understanding of our clients\' specific industries and operational needs.'}
            </p>
          </div>
          {companyInfo?.missions && companyInfo.missions.length > 0 && (
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
              {companyInfo.missions.map((mission, index) => {
                const Icon = getIconByName(mission.icon);
                return (
                  <div
                    key={mission.id || index}
                    className={`text-center transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-16'}`}
                    style={{ transitionDelay: `${(index + 3) * 150}ms` }}
                  >
                    <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      {Icon ? (
                        <Icon className="w-6 h-6 text-primary-600" />
                      ) : (
                        <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                      )}
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">{mission.title}</h3>
                    <p className="text-gray-600">{mission.description}</p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
