'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { LoadingSpinner, Alert, Card } from '@/components/ui'
import { ServiceDto, LanguageCode } from '@/types/api'
import { servicesService } from '@/lib/api'

export default function ServicesList() {
  const params = useParams();
  const lang = (params.lang as LanguageCode) || 'az';

  const [services, setServices] = useState<ServiceDto[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (lang) {
      loadServices()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang])

  const loadServices = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await servicesService.getAll(lang)
      setServices(data)
    } catch (err) {
      console.error('Failed to load services:', err)
      setError('Failed to load services')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <section className="section-padding bg-gray-50">
        <div className="container-max">
          <LoadingSpinner />
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="section-padding bg-gray-50">
        <div className="container-max">
          <Alert type="error" message={error} />
        </div>
      </section>
    )
  }

  // ПУНКТ 5: Если нет сервисов - показываем пустое состояние
  if (!services || services.length === 0) {
    return (
      <section className="section-padding bg-gray-50">
        <div className="container-max">
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg">No services available at the moment.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="section-padding bg-gray-50">
      <div className="container-max">
        <div className="grid gap-8">
          {services.map((service) => (
            <div
              key={service.id}
              className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-200"
            >
              <div className="p-8">
                <div className="flex flex-col lg:flex-row lg:items-start lg:space-x-8">
                  <div className="flex-shrink-0 mb-6 lg:mb-0">
                    <div className="w-20 h-20 bg-primary-100 rounded-lg flex items-center justify-center">
                      {service.iconUrl ? (
                        <img src={service.iconUrl} alt={service.title} className="w-12 h-12" />
                      ) : (
                        <svg className="w-12 h-12 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex-1">
                    <div className="mb-2">
                      <span className="text-sm font-medium text-primary-600 uppercase tracking-wide">
                        {service.category}
                      </span>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">
                      {service.title}
                    </h3>
                    {service.excerpt && (
                      <p className="text-gray-600 mb-4">
                        {service.excerpt}
                      </p>
                    )}
                    <div 
                      className="text-gray-700 prose prose-sm max-w-none"
                      dangerouslySetInnerHTML={{ __html: service.content }}
                    />
                  </div>
                  
                  <div className="flex-shrink-0 mt-6 lg:mt-0">
                    <Link
                      href={`/${lang}/contact`}
                      className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 transition-colors duration-200"
                    >
                      Get Consultation
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-16">
          <div className="bg-white p-8 rounded-lg shadow-md">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Need a Custom Solution?
            </h3>
            <p className="text-gray-600 mb-6">
              We understand that every business is unique. Contact us to discuss your specific requirements 
              and how we can tailor our services to meet your needs.
            </p>
            <Link
              href={`/${lang}/contact`}
              className="btn-primary"
            >
              Contact Our Experts
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
