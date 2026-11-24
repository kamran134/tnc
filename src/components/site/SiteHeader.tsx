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

/**
 * Floating frosted-glass "island" header, fixed over the page.
 *
 * The glass is light (>= 80% white), so the logos keep their original brand
 * colours and dark text stays >= 4.5:1 even over the darkest hero. Layout space
 * is reserved by `.site-main` (--site-header-h); heroes opt in to run under the
 * island with `.site-under-header`.
 */
export default function SiteHeader() {
  const params = useParams();
  const pathname = usePathname() || '';
  const lang = (params.lang as string) || 'az';
  const { t } = useTranslations();
  const { data: companyInfo } = useCompanyInfo(lang as LanguageCode);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
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

  const focusRing =
    'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy-petrol';

  const logo = companyInfo?.logoUrl ? (
    <Image
      src={resolveImageUrl(companyInfo.logoUrl)!}
      alt={companyInfo.companyName}
      width={160}
      height={96}
      priority
      className="h-10 w-auto object-contain xl:h-11"
    />
  ) : (
    <span className="text-2xl font-semibold tracking-tight text-navy-petrol">TnC</span>
  );

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50 pt-3 xl:pt-4">
      <div className="site-wrap">
        <div className="site-glass pointer-events-auto relative rounded-2xl text-navy-950">
          {/* Denser glass + shadow once content scrolls under the island (opacity only) */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 rounded-[inherit] bg-white/60 shadow-[0_14px_36px_rgba(7,27,46,0.30)] transition-opacity duration-300 ease-out motion-reduce:transition-none"
            style={{ opacity: scrolled || menuOpen ? 1 : 0 }}
          />

          <div className="relative flex h-[60px] items-center justify-between gap-6 pl-4 pr-2 sm:pl-5">
            <div className="flex flex-none items-center gap-3 sm:gap-3.5">
              <Link href={`/${lang}`} className={`flex flex-none items-center rounded-sm ${focusRing}`}>
                {logo}
              </Link>
              <span aria-hidden="true" className="h-7 w-px flex-none bg-navy-950/15" />
              <Image
                src="/images/aga-members.svg"
                alt="AGA Members"
                width={267}
                height={58}
                unoptimized
                className="h-6 w-auto flex-none sm:h-7"
              />
            </div>

            <nav aria-label="Main" className="hidden items-center gap-x-5 whitespace-nowrap text-[15px] font-medium xl:flex">
              {navigation.map((item) =>
                item.dropdown ? (
                  <SiteServicesDropdown key={item.key} active={isActive(item.href)} />
                ) : (
                  <Link
                    key={item.key}
                    href={item.href}
                    aria-current={isActive(item.href) ? 'page' : undefined}
                    className={`site-nav-link inline-flex min-h-[44px] items-center border-b-2 transition-colors ${focusRing} ${
                      isActive(item.href)
                        ? 'border-navy-petrol text-navy-petrol'
                        : 'border-transparent text-navy-slate hover:text-navy-petrol'
                    }`}
                  >
                    {item.name}
                  </Link>
                )
              )}
            </nav>

            <div className="hidden flex-none items-center gap-1.5 xl:flex">
              <SiteLanguageSwitcher />
              <Link
                href={`/${lang}/contact`}
                className={`inline-flex min-h-[44px] items-center whitespace-nowrap rounded-xl bg-navy-950 px-5 text-[15px] font-semibold text-white transition-colors hover:bg-navy-petrol ${focusRing}`}
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
              className={`inline-flex h-11 w-11 flex-none items-center justify-center rounded-xl text-navy-950 transition-colors hover:bg-navy-950/5 ${focusRing} xl:hidden`}
            >
              {menuOpen ? <X className="h-6 w-6" aria-hidden="true" /> : <Menu className="h-6 w-6" aria-hidden="true" />}
            </button>
          </div>

          {menuOpen && (
            <div
              id="site-mobile-nav"
              className="relative max-h-[calc(100dvh-96px)] overflow-y-auto border-t border-navy-950/10 xl:hidden"
            >
              <nav aria-label="Main" className="flex flex-col px-4 py-3 sm:px-5">
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
                      className={`inline-flex min-h-[44px] items-center text-[17px] ${focusRing} ${
                        isActive(item.href) ? 'font-semibold text-navy-petrol' : 'text-navy-950'
                      }`}
                    >
                      {item.name}
                    </Link>
                  )
                )}
                <div className="flex flex-wrap items-center justify-between gap-4 pb-2 pt-4">
                  <SiteLanguageSwitcher inline />
                  <Link
                    href={`/${lang}/contact`}
                    onClick={() => setMenuOpen(false)}
                    className={`inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-navy-950 px-5 font-semibold text-white ${focusRing}`}
                  >
                    {t('home.hero.getInTouch')}
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                </div>
              </nav>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
