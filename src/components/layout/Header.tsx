'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import LanguageSwitcher from './LanguageSwitcher'
import ServicesDropdown from './ServicesDropdown'
import { useTranslations } from '@/hooks/useTranslations'
import { CompanyInfoDto, LanguageCode } from '@/types/api'
import { companyInfoService } from '@/lib/api'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [companyInfo, setCompanyInfo] = useState<CompanyInfoDto | null>(null)
  const params = useParams();
  const lang = (params.lang as string) || 'az';
  const { t } = useTranslations();

  useEffect(() => {
    const fetchCompanyInfo = async () => {
      try {
        const data = await companyInfoService.getCompanyInfo(lang as LanguageCode);
        setCompanyInfo(data);
      } catch (error) {
        console.error('Failed to load company info:', error);
      }
    };
    fetchCompanyInfo();
  }, [lang]);

  const navigation = [
    { name: t('nav.home'), href: `/${lang}`, hasDropdown: false },
    { name: t('nav.services'), href: `/${lang}/services`, hasDropdown: true },
    { name: t('nav.team'), href: `/${lang}/team`, hasDropdown: false },
    { name: t('nav.news'), href: `/${lang}/news`, hasDropdown: false },
    { name: t('nav.careers'), href: `/${lang}/careers`, hasDropdown: false },
    { name: t('nav.contact'), href: `/${lang}/contact`, hasDropdown: false },
    // Dashboard скрыт - доступ только через прямой URL /dashboard
  ]

  return (
    <header className="bg-white sticky top-0 z-50">
      <nav className="container-max">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link href={`/${lang}`} className="flex items-center">
            {companyInfo?.logoUrl ? (
              <img
                src={companyInfo.logoUrl}
                alt={companyInfo.companyName}
                className="h-24 w-auto object-contain absolute"
              />
            ) : (
              <span className="text-2xl font-bold text-primary-700">TnC</span>
            )}
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              item.hasDropdown ? (
                <ServicesDropdown key={item.name} />
              ) : (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-gray-700 hover:text-primary-600 font-medium transition-colors duration-200"
                >
                  {item.name}
                </Link>
              )
            ))}
            <LanguageSwitcher />
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
              />
            </svg>
          </button>
        </div>

        {/* Moitem.hasDropdown ? (
                <ServicesDropdown 
                  key={item.name}
                  isMobile={true}
                  onItemClick={() => setIsMenuOpen(false)}
                />
              ) : (
                <Link
                  key={item.name}
                  href={item.href}
                  className="block py-2 text-gray-700 hover:text-primary-600 font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              )Name="block py-2 text-gray-700 hover:text-primary-600 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <div className="pt-2 border-t">
              <LanguageSwitcher />
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}
