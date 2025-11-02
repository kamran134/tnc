'use client'

import { useState, useEffect } from 'react'
import { CoreValueDto } from '@/types/api'
import { coreValuesService } from '@/lib/api'
import { LoadingSpinner, Alert } from '@/components/ui'

export default function CoreValues() {
  const [values, setValues] = useState<CoreValueDto[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadCoreValues()
  }, [])

  const loadCoreValues = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await coreValuesService.getAll('az')
      setValues(data)
    } catch (err) {
      console.error('Failed to load core values:', err)
      setError('Failed to load core values')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <section className="section-padding bg-white">
        <div className="container-max">
          <LoadingSpinner />
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="section-padding bg-white">
        <div className="container-max">
          <Alert type="error" message={error} />
        </div>
      </section>
    )
  }

  // ПУНКТ 5: Если нет данных - не показываем секцию
  if (!values || values.length === 0) {
    return null;
  }

  return (
    <section className="section-padding bg-white">
      <div className="container-max">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Our Core Values
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our core values are important to us as they define who we are and how we do business.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {values.map((value) => (
            <div
              key={value.id}
              className="bg-gray-50 p-8 rounded-lg hover:shadow-lg transition-shadow duration-200"
            >
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mr-4">
                  {value.icon ? (
                    <span className="text-3xl">{value.icon}</span>
                  ) : (
                    <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                    </svg>
                  )}
                </div>
                <h3 className="text-xl font-bold text-gray-900">
                  {value.title}
                </h3>
              </div>
              <p className="text-gray-700 leading-relaxed">
                {value.content}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
