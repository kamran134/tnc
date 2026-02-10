'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ServiceCategoryUserDto, LanguageCode } from '@/types/api'
import { serviceCategoriesService } from '@/lib/api'
import { useTranslations } from '@/hooks/useTranslations'
import { getServiceCategoryIconByName } from '@/lib/icons/service-category-icons'

interface CategorySidebarProps {
  currentCategoryCode: string
}

export default function CategorySidebar({ currentCategoryCode }: CategorySidebarProps) {
  const [categories, setCategories] = useState<ServiceCategoryUserDto[]>([])
  const [loading, setLoading] = useState(true)
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
      const data = await serviceCategoriesService.getAll(lang)
      const sorted = [...data].sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0))
      setCategories(sorted)
    } catch (error) {
      console.error('Failed to load categories:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
      {/* Title */}
      <h3 className="text-lg font-bold text-gray-900 mb-4 pb-3 border-b border-gray-200">
        {t('services.categories')}
      </h3>

      {/* Categories List */}
      <nav className="space-y-1">
        {/* Link to all services */}
        <Link
          href={`/${lang}/services`}
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
          <span className="font-medium">{t('services.allCategories')}</span>
        </Link>

        {/* Category links */}
        {categories.map((category) => {
          const isActive = category.code === currentCategoryCode
          const Icon = getServiceCategoryIconByName(category.iconUrl);
          
          return (
            <Link
              key={category.id}
              href={`/${lang}/services/${category.code}`}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-sky-50 text-sky-700 font-semibold'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              {Icon ? (
                <Icon className="w-5 h-5 text-current" />
              ) : (
                <div className="w-5 h-5 bg-gray-200 rounded"></div>
              )}
              <span>{category.name}</span>
            </Link>
          )
        })}

        {/* Link to all services (at bottom) */}
        <div className="pt-3 mt-3 border-t border-gray-200">
          <Link
            href={`/${lang}/services/all`}
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-sky-600 hover:bg-sky-50 transition-colors font-medium"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <span>{t('services.viewAll')}</span>
          </Link>
        </div>
      </nav>
    </div>
  )
}
