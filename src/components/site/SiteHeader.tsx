'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams, usePathname } from 'next/navigation';
import { ArrowRight, Menu, X } from 'lucide-react';
import SiteLanguageSwitcher from './SiteLanguageSwitcher';
import SiteServicesDropdown from './SiteServicesDropdown';
import { useTranslations } from '@/hooks/useTranslations';
import { useCompanyInfo } from '@/hooks/queries';
import { resolveImageUrl } from '@/lib/utils/image';
import type { LanguageCode } from '@/types/api';

interface SiteHeaderProps {
  /** Transparent header floating over the hero (home page). */
  overlay?: boolean;
}

export default function SiteHeader({ overlay = false }: SiteHeaderProps) {
  const params = useParams();
  const pathname = usePathname() || '';
  const lang = (params.lang as string) || 'az';
  const { t } = useTranslations();
  const { data: companyInfo } = useCompanyInfo(lang as LanguageCode);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close the mobile panel on navigation
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  const navigation = [
    { key: 'home', name: t('nav.home'), href: `/${lang}`, dropdown: false },
    { key: 'about', name: t('nav.about'), href: `/${lang}/about`, dropdown: false },
    { key: 'services', name: t('nav.services'), href: `/${lang}/services`, dropdown: true },
    { key: 'team', name: t('nav.team'), href: `/${lang}/team`, dropdown: false },
    { key: 'news', name: t('nav.news'), href: `/${lang}/news`, dropdown: false },
    { key: 'careers', name: t('nav.careers'), href: `/${lang}/careers`, dropdown: false },
    { key: 'contact', name: t('nav.contact'), href: `/${lang}/contact`, dropdown: false },
  ];

  const isActive = (href: string) => {
    if (href === `/${lang}`) return pathname === href || pathname === `${href}/`;
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const solid = !overlay || scrolled || menuOpen;
  const positionClass = overlay ? 'fixed inset-x-0 top-0' : 'sticky top-0';
  const surfaceClass = solid ? 'border-b border-navy-line bg-navy-950' : 'border-b border-transparent bg-transparent';

  const logo = companyInfo?.logoUrl ? (
    <Image
      src={resolveImageUrl(companyInfo.logoUrl)!}
      alt={companyInfo.companyName}
      width={160}
      height={96}
      priority
      className="h-12 w-auto object-contain brightness-0 invert sm:h-14"
    />
  ) : (
    <span className="text-2xl font-semibold tracking-tight text-white">TnC</span>
  );

  return (
    <header className={`${positionClass} z-50 transition-colors duration-200 ${surfaceClass}`}>
      <div className="site-wrap flex items-center justify-between gap-4 py-3 xl:py-4">
        <div className="flex min-w-0 items-center gap-3 sm:gap-4">
          <Link
            href={`/${lang}`}
            className="flex items-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-navy-accent"
          >
            {logo}
          </Link>
          <Image
            src="/images/aga-members.svg"
            alt="AGA Members"
            width={267}
            height={58}
            unoptimized
            className="h-7 w-auto brightness-0 invert sm:h-10"
          />
        </div>

        <nav aria-label="Main" className="hidden items-center gap-x-6 text-[15px] xl:flex">
          {navigation.map((item) =>
            item.dropdown ? (
              <SiteServicesDropdown key={item.key} active={isActive(item.href)} />
            ) : (
              <Link
                key={item.key}
                href={item.href}
                aria-current={isActive(item.href) ? 'page' : undefined}
                className={`inline-flex min-h-[44px] items-center border-b-2 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-navy-accent ${
                  isActive(item.href)
                    ? 'border-navy-accent text-navy-accent'
                    : 'border-transparent text-navy-text hover:text-white'
                }`}
              >
                {item.name}
              </Link>
            )
          )}
        </nav>

        <div className="hidden items-center gap-3 xl:flex">
          <SiteLanguageSwitcher />
          <Link
            href={`/${lang}/contact`}
            className="inline-flex min-h-[44px] items-center whitespace-nowrap rounded-md bg-navy-accent px-5 text-[15px] font-semibold text-navy-950 transition-colors hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            {t('home.hero.getInTouch')}
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Menu"
          aria-expanded={menuOpen}
          aria-controls="site-mobile-nav"
          className="inline-flex h-11 w-11 flex-none items-center justify-center rounded-md border border-navy-line text-navy-text transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-navy-accent xl:hidden"
        >
          {menuOpen ? <X className="h-6 w-6" aria-hidden="true" /> : <Menu className="h-6 w-6" aria-hidden="true" />}
        </button>
      </div>

      {menuOpen && (
        <div
          id="site-mobile-nav"
          className="max-h-[calc(100vh-72px)] overflow-y-auto border-t border-navy-line bg-navy-950 xl:hidden"
        >
          <nav aria-label="Main" className="site-wrap flex flex-col py-4">
            {navigation.map((item) =>
              item.dropdown ? (
                <SiteServicesDropdown
                  key={item.key}
                  isMobile
                  active={isActive(item.href)}
                  onItemClick={() => setMenuOpen(false)}
                />
              ) : (
                <Link
                  key={item.key}
                  href={item.href}
                  aria-current={isActive(item.href) ? 'page' : undefined}
                  onClick={() => setMenuOpen(false)}
                  className={`inline-flex min-h-[44px] items-center text-[17px] ${
                    isActive(item.href) ? 'text-navy-accent' : 'text-navy-text'
                  }`}
                >
                  {item.name}
                </Link>
              )
            )}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-4">
              <SiteLanguageSwitcher inline />
              <Link
                href={`/${lang}/contact`}
                onClick={() => setMenuOpen(false)}
                className="inline-flex min-h-[44px] items-center gap-2 rounded-md bg-navy-accent px-5 font-semibold text-navy-950"
              >
                {t('home.hero.getInTouch')}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
