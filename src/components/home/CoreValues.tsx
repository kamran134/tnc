'use client'

import { useState, useEffect } from 'react'
import { CompanyInfoDto, CoreValueDto, LanguageCode } from '@/types/api'
import { coreValuesService } from '@/lib/api'
import { LoadingSpinner, Alert } from '@/components/ui'
import { useScrollAnimation } from '@/hooks/useScrollAnimation'

interface CoreValuesProps {
  lang?: string;
  companyInfo: CompanyInfoDto | null;
}

export default function CoreValues({ companyInfo }: CoreValuesProps) {
  const { ref, isVisible } = useScrollAnimation()

  return (
    <section ref={ref as any} className="snap-start section-padding bg-white flex items-center" style={{ minHeight: '100vh' }}>
      <div className="container-max">
        <div className={`text-center mb-16 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {companyInfo?.valuesTitle || 'Our Core Values'}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {companyInfo?.valuesDescription || 'We are committed to upholding the highest standards of integrity, excellence, and collaboration in all that we do.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {companyInfo?.values.map((value, index) => (
            <div
              key={value.id}
              className={`bg-gray-50 p-8 rounded-lg hover:shadow-lg transition-all duration-1000 ease-out ${isVisible ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-50 translate-y-20'}`}
              style={{ transitionDelay: `${index * 150}ms` }}>
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-sky-100 rounded-full flex items-center justify-center mr-4">
                  {value.icon ? (
                    <span className="text-2xl">{value.icon}</span>
                  ) : (
                    <svg className="w-8 h-8 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                    </svg>
                  )}
                </div>
                <h3 className="text-xl font-bold text-gray-900">
                  {value.title}
                </h3>
              </div>
              <p className="text-gray-700 leading-relaxed">
                {value.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
