'use client'

import { useState, useEffect, useRef } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ServiceCategoryUserDto, LanguageCode } from '@/types/api'
import { serviceCategoriesService } from '@/lib/api'
import { useTranslations } from '@/hooks/useTranslations'

interface ServicesDropdownProps {
  isMobile?: boolean
  onItemClick?: () => void
}

export default function ServicesDropdown({ isMobile = false, onItemClick }: ServicesDropdownProps) {
  const [categories, setCategories] = useState<ServiceCategoryUserDto[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const params = useParams()
  const lang = (params.lang as LanguageCode) || 'az'
  const { t } = useTranslations()

  useEffect(() => {
    loadCategories()
  }, [lang])

  useEffect(() => {
    if (!isMobile) {
      const handleClickOutside = (event: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
          setIsOpen(false)
        }
      }

      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isMobile])

  const loadCategories = async () => {
    try {
      setLoading(true)
      const data = await serviceCategoriesService.getAll(lang)
      // Сортируем по sortOrder
      const sorted = [...data].sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0))
      setCategories(sorted)
    } catch (error) {
      console.error('Failed to load service categories:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleItemClick = () => {
    setIsOpen(false)
    onItemClick?.()
  }

  // Desktop версия - dropdown с hover
  if (!isMobile) {
    return (
      <div
        ref={dropdownRef}
        className="relative"
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
      >
        {/* Trigger */}
        <Link
          href={`/${lang}/services`}
          className="text-gray-700 hover:text-primary-600 font-medium transition-colors duration-200 flex items-center gap-1"
        >
          {t('nav.services')}
          <svg
            className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </Link>

        {/* Dropdown */}
        {isOpen && (
          <div className="absolute top-full left-0 mt-2 w-72 bg-white rounded-lg shadow-xl border border-gray-100 py-2 z-50">
            {loading ? (
              <div className="px-4 py-3 text-gray-500 text-sm">
                {t('common.loading')}...
              </div>
            ) : categories.length === 0 ? (
              <div className="px-4 py-3 text-gray-500 text-sm">
                {t('services.noCategories')}
              </div>
            ) : (
              <>
                {categories.map((category) => (
                  <Link
                    key={category.id}
                    href={`/${lang}/services/${category.code}`}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors duration-150"
                    onClick={handleItemClick}
                  >
                    {category.iconUrl ? (
                      <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center">
                        <img
                          src={category.iconUrl}
                          alt={category.name}
                          className="w-6 h-6 object-contain"
                        />
                      </div>
                    ) : (
                      <div className="flex-shrink-0 w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center">
                        <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                    <span className="text-gray-700 font-medium">{category.name}</span>
                  </Link>
                ))}
                
                {/* Разделитель и ссылка на все услуги */}
                <div className="border-t border-gray-100 mt-2 pt-2">
                  <Link
                    href={`/${lang}/services/all`}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors duration-150 text-primary-600 font-medium"
                    onClick={handleItemClick}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    <span>{t('services.viewAll')}</span>
                  </Link>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    )
  }

  // Mobile версия - аккордеон
  return (
    <div>
      {/* Trigger */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between py-2 text-gray-700 hover:text-primary-600 font-medium"
      >
        <span>{t('nav.services')}</span>
        <svg
          className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Аккордеон */}
      {isOpen && (
        <div className="pl-4 space-y-1 pb-2">
          {loading ? (
            <div className="py-2 text-gray-500 text-sm">
              {t('common.loading')}...
            </div>
          ) : categories.length === 0 ? (
            <div className="py-2 text-gray-500 text-sm">
              {t('services.noCategories')}
            </div>
          ) : (
            <>
              {/* Ссылка на главную страницу услуг */}
              <Link
                href={`/${lang}/services`}
                className="block py-2 text-gray-600 hover:text-primary-600 text-sm"
                onClick={handleItemClick}
              >
                {t('services.allCategories')}
              </Link>
              
              {/* Категории */}
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/${lang}/services/${category.code}`}
                  className="flex items-center gap-2 py-2 text-gray-600 hover:text-primary-600 text-sm"
                  onClick={handleItemClick}
                >
                  {category.iconUrl && (
                    <img
                      src={category.iconUrl}
                      alt={category.name}
                      className="w-4 h-4 object-contain"
                    />
                  )}
                  <span>{category.name}</span>
                </Link>
              ))}
              
              {/* Все услуги */}
              <Link
                href={`/${lang}/services/all`}
                className="block py-2 text-primary-600 hover:text-primary-700 text-sm font-medium"
                onClick={handleItemClick}
              >
                → {t('services.viewAll')}
              </Link>
            </>
          )}
        </div>
      )}
    </div>
  )
}
