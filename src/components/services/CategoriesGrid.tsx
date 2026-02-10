'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ServiceCategoryUserDto, LanguageCode } from '@/types/api'
import { serviceCategoriesService } from '@/lib/api'
import { useTranslations } from '@/hooks/useTranslations'
import { LoadingSpinner, Alert } from '@/components/ui'
import { getServiceCategoryIconByName } from '@/lib/icons/service-category-icons'

export default function CategoriesGrid() {
  const [categories, setCategories] = useState<ServiceCategoryUserDto[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const params = useParams()
  const lang = (params.lang as LanguageCode) || 'az'
  const { t } = useTranslations()

  useEffect(() => {
    loadCategories()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang])

  const loadCategories = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await serviceCategoriesService.getAll(lang)
      // Сортируем по sortOrder
      const sorted = [...data].sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0))
      setCategories(sorted)
    } catch (err) {
      console.error('Failed to load service categories:', err)
      setError('Failed to load service categories')
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

  if (!categories || categories.length === 0) {
    return (
      <section className="section-padding bg-gray-50">
        <div className="container-max">
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg">{t('services.noCategories')}</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="section-padding bg-gray-50">
      <div className="container-max">
        {/* Заголовок секции */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {t('services.title')}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {t('services.selectCategory')}
          </p>
        </div>

        {/* Сетка категорий */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category) => {
            const Icon = getServiceCategoryIconByName(category.iconUrl);
            
            return (
              <Link
                key={category.id}
                href={`/${lang}/services/${category.code}`}
                className="group"
              >
                <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 h-full flex flex-col items-center text-center">
                  {/* Иконка категории */}
                  <div className="w-24 h-24 mb-6 bg-gradient-to-br from-sky-100 to-sky-50 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    {Icon ? (
                      <Icon className="w-16 h-16 text-sky-500" />
                    ) : (
                      <svg 
                        className="w-16 h-16 text-sky-500" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth={2} 
                          d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" 
                        />
                      </svg>
                    )}
                  </div>

                {/* Название категории */}
                <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-sky-500 transition-colors duration-300">
                  {category.name}
                </h3>

                {/* Описание (если есть) */}
                {category.description && (
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {category.description}
                  </p>
                )}

                {/* Стрелка для визуального эффекта */}
                <div className="mt-auto pt-4">
                  <span className="inline-flex items-center text-sky-500 font-semibold group-hover:translate-x-2 transition-transform duration-300">
                    {t('services.viewDetails')}
                    <svg 
                      className="w-5 h-5 ml-2" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M9 5l7 7-7 7" 
                      />
                    </svg>
                  </span>
                </div>
              </div>
            </Link>
            );
          })}
        </div>

        {/* Кнопка "Все услуги" */}
        <div className="text-center mt-12">
          <Link
            href={`/${lang}/services/all`}
            className="inline-flex items-center gap-2 bg-sky-500 hover:bg-sky-600 text-white font-semibold px-8 py-4 rounded-lg transition-colors duration-300 shadow-lg hover:shadow-xl"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <span>{t('services.viewAll')}</span>
          </Link>
        </div>
      </div>
    </section>
  )
}
