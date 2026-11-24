'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { Facebook, Instagram, Linkedin, Mail, MapPin, Phone } from 'lucide-react';
import { useTranslations } from '@/hooks/useTranslations';
import { useCompanyInfo, useServiceCategories } from '@/hooks/queries';
import { resolveImageUrl } from '@/lib/utils/image';
import { formatPhone, phoneHref } from '@/lib/utils/phone';
import type { LanguageCode } from '@/types/api';

export default function SiteFooter() {
  const { t } = useTranslations();
  const params = useParams();
  const lang = ((params.lang as string) || 'az') as LanguageCode;
  const { data: companyInfo } = useCompanyInfo(lang);
  const { data: categories = [] } = useServiceCategories(lang);
  const year = new Date().getFullYear();

  const quickLinks = [
    { name: t('nav.about'), href: `/${lang}/about` },
    { name: t('nav.services'), href: `/${lang}/services` },
    { name: t('nav.team'), href: `/${lang}/team` },
    { name: t('nav.news'), href: `/${lang}/news` },
    { name: t('nav.careers'), href: `/${lang}/careers` },
    { name: t('nav.contact'), href: `/${lang}/contact` },
  ];

  const linkClass =
    'inline-flex min-h-[44px] items-center text-navy-muted transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-navy-accent';

  const socials = [
    { url: companyInfo?.linkedinUrl, Icon: Linkedin, label: 'LinkedIn' },
    { url: companyInfo?.facebookUrl, Icon: Facebook, label: 'Facebook' },
    { url: companyInfo?.instagramUrl, Icon: Instagram, label: 'Instagram' },
  ].filter((s) => !!s.url);

  return (
    <footer className="border-t border-navy-line bg-navy-900 text-[15px] text-navy-muted">
      <div className="site-wrap flex flex-wrap gap-x-14 gap-y-12 pb-14 pt-[72px]">
        <div className="flex max-w-[360px] flex-1 basis-[280px] flex-col gap-[18px]">
          <Link
            href={`/${lang}`}
            className="flex items-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-navy-accent"
          >
            {companyInfo?.logoUrl ? (
              <Image
                src={resolveImageUrl(companyInfo.logoUrl)!}
                alt={companyInfo.companyName}
                width={160}
                height={96}
                className="h-12 w-auto object-contain brightness-0 invert"
              />
            ) : (
              <span className="text-[22px] font-semibold tracking-tight text-white">TnC</span>
            )}
          </Link>
          <p className="m-0">{t('footer.description')}</p>
          {socials.length > 0 && (
            <div className="flex gap-1">
              {socials.map(({ url, Icon, label }) => (
                <a
                  key={label}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-md text-navy-muted transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-navy-accent"
                >
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </a>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-1 basis-[180px] flex-col gap-1">
          <h3 className="m-0 mb-2 text-base font-semibold text-navy-text">{t('footer.quickLinks')}</h3>
          {quickLinks.map((link) => (
            <Link key={link.href} href={link.href} className={linkClass}>
              {link.name}
            </Link>
          ))}
        </div>

        <div className="flex flex-1 basis-[240px] flex-col gap-1">
          <h3 className="m-0 mb-2 text-base font-semibold text-navy-text">{t('footer.ourServices')}</h3>
          {categories.map((category) => (
            <Link key={category.id} href={`/${lang}/services/${category.code}`} className={linkClass}>
              {category.name}
            </Link>
          ))}
        </div>

        <div className="flex flex-1 basis-[260px] flex-col gap-3.5">
          <h3 className="m-0 mb-1 text-base font-semibold text-navy-text">{t('footer.contactInfo')}</h3>
          {companyInfo?.address && (
            <span className="flex items-start gap-3.5">
              <MapPin className="mt-1 h-5 w-5 flex-none text-navy-accent" aria-hidden="true" />
              <span>{companyInfo.address}</span>
            </span>
          )}
          {companyInfo?.phone && (
            <a href={phoneHref(companyInfo.phone)} className={`${linkClass} gap-3.5`}>
              <Phone className="h-5 w-5 flex-none text-navy-accent" aria-hidden="true" />
              {formatPhone(companyInfo.phone)}
            </a>
          )}
          {companyInfo?.email && (
            <a href={`mailto:${companyInfo.email}`} className={`${linkClass} gap-3.5`}>
              <Mail className="h-5 w-5 flex-none text-navy-accent" aria-hidden="true" />
              {companyInfo.email}
            </a>
          )}
        </div>
      </div>

      <div className="border-t border-navy-line">
        <div className="site-wrap flex flex-wrap items-center justify-between gap-x-6 gap-y-2 py-4 text-sm">
          <span>
            &copy; {year} {companyInfo?.companyName || 'TnC'}. {t('footer.allRightsReserved')}
          </span>
          <span className="flex flex-wrap items-center gap-x-3">
            <span>{t('footer.privacyPolicy')}</span>
            <span aria-hidden="true">·</span>
            <span>{t('footer.termsOfService')}</span>
          </span>
        </div>
      </div>
    </footer>
  );
}
