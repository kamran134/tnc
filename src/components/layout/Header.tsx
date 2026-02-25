'use client'

import { useState, useEffect } from 'react'
import { useParams, usePathname } from 'next/navigation'
import Link from 'next/link'
import LanguageSwitcher from './LanguageSwitcher'
import ServicesDropdown from './ServicesDropdown'
import { useTranslations } from '@/hooks/useTranslations'
import { CompanyInfoDto, LanguageCode } from '@/types/api'
import { companyInfoService } from '@/lib/api'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [companyInfo, setCompanyInfo] = useState<CompanyInfoDto | null>(null)
  const [scrolled, setScrolled] = useState(false)
  const params = useParams();
  const pathname = usePathname();
  const lang = (params.lang as string) || 'az';
  const { t } = useTranslations();

  // Transparent only on home pages (e.g. /az, /en, /ru)
  const isHeroPage = /^\/(az|en|ru)\/?$/.test(pathname ?? '');

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

  // On non-hero pages always solid; on hero page track the snap-scroll container
  useEffect(() => {
    if (!isHeroPage) {
      setScrolled(true);
      return;
    }
    setScrolled(false);
    const main = document.querySelector('main');
    if (!main) return;
    const handleScroll = () => setScrolled(main.scrollTop > 80);
    main.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => main.removeEventListener('scroll', handleScroll);
  }, [isHeroPage]);

  const isTransparent = isHeroPage && !scrolled;

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
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isTransparent ? 'bg-transparent' : 'bg-white shadow-md'
      }`}
    >
      <nav className="container-max">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link href={`/${lang}`} className="flex items-center">
            {companyInfo?.logoUrl ? (
              <img
                src={companyInfo.logoUrl}
                alt={companyInfo.companyName}
                className="h-24 w-auto object-contain absolute"
                style={isTransparent ? { filter: 'brightness(0) invert(1) drop-shadow(0 1px 4px rgba(0,0,0,0.5))' } : undefined}
              />
            ) : (
              <span className={`text-2xl font-bold ${isTransparent ? 'text-white [text-shadow:0_1px_3px_rgba(0,0,0,0.5)]' : 'text-sky-700'}`}>TnC</span>
            )}
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              item.hasDropdown ? (
                <ServicesDropdown key={item.name} isTransparent={isTransparent} />
              ) : (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`font-medium transition-colors duration-200 ${
                    isTransparent
                      ? 'text-white hover:text-sky-200 [text-shadow:0_1px_3px_rgba(0,0,0,0.5)]'
                      : 'text-gray-700 hover:text-sky-600'
                  }`}
                >
                  {item.name}
                </Link>
              )
            ))}
            <LanguageSwitcher isTransparent={isTransparent} />
          </div>

          {/* Mobile menu button */}
          <button
            className={`md:hidden p-2 ${isTransparent ? 'text-white' : 'text-gray-700'}`}
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

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className={`md:hidden py-4 border-t space-y-2 ${
            isTransparent
              ? 'border-white/30 bg-black/50 backdrop-blur-sm'
              : 'border-gray-100 bg-white'
          }`}>
            {navigation.map((item) => (
              item.hasDropdown ? (
                <ServicesDropdown 
                  key={item.name}
                  isMobile={true}
                  isTransparent={isTransparent}
                  onItemClick={() => setIsMenuOpen(false)}
                />
              ) : (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`block py-2 font-medium ${
                    isTransparent ? 'text-white hover:text-sky-200' : 'text-gray-700 hover:text-sky-600'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              )
            ))}
            <div className="pt-2 border-t border-inherit">
              <LanguageSwitcher isTransparent={isTransparent} />
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}
