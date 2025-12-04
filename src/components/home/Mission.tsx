'use client';

import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { CompanyInfoDto } from '@/types/api';

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
              {companyInfo.missions.map((mission, index) => (
                <div
                  key={mission.id || index}
                  className={`text-center transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-16'}`}
                  style={{ transitionDelay: '300ms' }}>
                    <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">{mission.title}</h3>
              <p className="text-gray-600">{mission.description}</p>
                </div>
              ))}
            </div>
            // <div className="mt-8 space-y-6">
            //   {companyInfo.missions.map((mission, index) => (
            //     <div 
            //       key={mission.id || index}
            //       className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
            //       style={{ transitionDelay: `${(index + 3) * 150}ms` }}
            //     >
            //       <h3 className="text-xl font-semibold text-gray-900 mb-2">{mission.title}</h3>
            //       <p className="text-lg text-gray-700">{mission.description}</p>
            //     </div>
            //   ))}
            // </div>
          )}
          {/* <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className={`text-center transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-16'}`} style={{ transitionDelay: '300ms' }}>
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Innovation</h3>
              <p className="text-gray-600">Innovative thinking and modern approaches</p>
            </div>
            <div className={`text-center transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-16'}`} style={{ transitionDelay: '500ms' }}>
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Excellence</h3>
              <p className="text-gray-600">Commitment to the highest quality standards</p>
            </div>
            <div className={`text-center transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-16'}`} style={{ transitionDelay: '700ms' }}>
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Value</h3>
              <p className="text-gray-600">Building lasting value for our clients</p>
            </div>
          </div> */}
        </div>
      </div>
    </section>
  )
}
