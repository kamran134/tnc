'use client';

import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { CompanyInfoDto } from '@/types/api';
import { getIconByName } from '@/lib/icons/mission-vision-icons';

interface MissionProps {
  lang: string;
  companyInfo: CompanyInfoDto | null;
}

export default function Mission({ companyInfo }: MissionProps) {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section ref={ref as any} className="snap-start section-padding bg-white flex items-center" style={{ minHeight: '100vh' }}>
      <div className="container-max">
        <div className={`text-center mb-16 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {companyInfo?.missionTitle || 'Our Mission'}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {companyInfo?.missionDescription || 'We are dedicated to delivering high-caliber services, grounded in a thorough understanding of our clients\' specific industries and operational needs.'}
          </p>
        </div>

        {companyInfo?.missions && companyInfo.missions.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {companyInfo.missions.map((mission, index) => {
              const Icon = getIconByName(mission.icon);
              return (
                <div
                  key={mission.id || index}
                  className={`bg-gray-50 p-8 rounded-lg hover:shadow-lg transition-all duration-1000 ease-out ${isVisible ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-50 translate-y-20'}`}
                  style={{ transitionDelay: `${index * 150}ms` }}
                >
                  <div className="flex items-center mb-6">
                    <div className="w-12 h-12 bg-sky-100 rounded-full flex items-center justify-center mr-4">
                      {Icon ? (
                        <Icon className="w-6 h-6 text-sky-600" />
                      ) : (
                        <svg className="w-6 h-6 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                      )}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">{mission.title}</h3>
                  </div>
                  <p className="text-gray-700 leading-relaxed">{mission.description}</p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  )
}
