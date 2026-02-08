'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ServiceCategoryUserDto, LanguageCode } from '@/types/api'
import { serviceCategoriesService } from '@/lib/api'
import { useTranslations } from '@/hooks/useTranslations'

interface CategoryHeaderProps {
  categoryCode: string
}

export default function CategoryHeader({ categoryCode }: CategoryHeaderProps) {
  const [category, setCategory] = useState<ServiceCategoryUserDto | null>(null)
  const [loading, setLoading] = useState(true)
  const params = useParams()
  const lang = (params.lang as LanguageCode) || 'az'
  const { t } = useTranslations()

  useEffect(() => {
    loadCategory()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoryCode, lang])

  const loadCategory = async () => {
    try {
      setLoading(true)
      const data = await serviceCategoriesService.getByCode(categoryCode, lang)
      setCategory(data)
    } catch (error) {
      console.error('Failed to load category:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <section className="bg-gradient-to-r from-primary-600 to-primary-700 text-white py-12">
        <div className="container-max">
          <div className="animate-pulse">
            <div className="h-4 bg-white/20 rounded w-64 mb-6"></div>
            <div className="h-10 bg-white/30 rounded w-96 mb-4"></div>
            {category?.description && (
              <div className="h-6 bg-white/20 rounded w-full max-w-2xl"></div>
            )}
          </div>
        </div>
      </section>
    )
  }

  if (!category) {
    return (
      <section className="bg-gradient-to-r from-primary-600 to-primary-700 text-white py-12">
        <div className="container-max">
          <p className="text-white/90">{t('services.categoryNotFound')}</p>
        </div>
      </section>
    )
  }

  return (
    <section className="bg-gradient-to-r from-primary-600 to-primary-700 text-white py-12">
      <div className="container-max">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-sm mb-6 text-white/80">
          <Link 
            href={`/${lang}`} 
            className="hover:text-white transition-colors"
          >
            {t('breadcrumbs.home')}
          </Link>
          <span>/</span>
          <Link 
            href={`/${lang}/services`} 
            className="hover:text-white transition-colors"
          >
            {t('breadcrumbs.services')}
          </Link>
          <span>/</span>
          <span className="text-white font-medium">{category.name}</span>
        </nav>

        {/* Category Title */}
        <div className="flex items-center gap-6">
          {/* Icon */}
          {category.iconUrl && (
            <div className="hidden md:block w-20 h-20 bg-white/10 backdrop-blur-sm rounded-2xl p-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={category.iconUrl}
                alt={category.name}
                className="w-full h-full object-contain"
              />
            </div>
          )}

          {/* Title and Description */}
          <div className="flex-1">
            <h1 className="text-3xl md:text-4xl font-bold mb-3">
              {category.name}
            </h1>
            {category.description && (
              <p className="text-lg md:text-xl text-white/90 max-w-3xl">
                {category.description}
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
