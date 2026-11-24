'use client'

import { useParams } from 'next/navigation'
import { ArrowRight, Mail, MapPin, Phone } from 'lucide-react'
import SiteShell from '@/components/site/SiteShell'
import SitePageHero from '@/components/site/SitePageHero'
import SiteContactForm from '@/components/site/SiteContactForm'
import { LanguageCode } from '@/types/api'
import { useTranslations } from '@/hooks/useTranslations'
import { useCompanyInfo } from '@/hooks/queries'
import { formatPhone, phoneHref } from '@/lib/utils/phone'

function InfoRow({
  icon,
  label,
  children,
  href,
}: {
  icon: React.ReactNode
  label: string
  children: React.ReactNode
  href?: string
}) {
  const content = (
    <>
      <span className="flex h-11 w-11 flex-none items-center justify-center rounded-lg bg-navy-700 text-navy-accent">
        {icon}
      </span>
      <span className="flex min-w-0 flex-col">
        <span className="text-sm text-navy-muted">{label}</span>
        <span className="break-words">{children}</span>
      </span>
    </>
  )
  return href ? (
    <a
      href={href}
      className="flex items-start gap-4 transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy-accent"
    >
      {content}
    </a>
  ) : (
    <div className="flex items-start gap-4">{content}</div>
  )
}

export default function ContactPage() {
  const { t } = useTranslations();
  const params = useParams();
  const lang = ((params.lang as string) || 'az') as LanguageCode;
  const { data: companyInfo } = useCompanyInfo(lang);

  const address = companyInfo?.address || t('footer.location');

  return (
    <SiteShell>
      <SitePageHero
        pageTag="CONTACT"
        breadcrumb={t('nav.contact')}
        fallbackTitle={t('contact.title')}
        fallbackDescription={t('contact.getInTouch')}
      />

      <section className="site-wrap flex flex-wrap items-start gap-12 pb-16 pt-14 md:pb-[112px]">
        <div className="flex min-w-0 flex-[1_1_380px] flex-col gap-6">
          <div className="flex flex-col gap-6 rounded-[10px] border border-navy-line bg-navy-800 p-6 sm:p-8">
            <h2 className="m-0 text-[26px] font-semibold tracking-[-0.015em]">{t('contact.contactInformation')}</h2>
            <InfoRow icon={<MapPin className="h-[22px] w-[22px]" strokeWidth={1.6} aria-hidden="true" />} label={t('contact.address')}>
              {address}
            </InfoRow>
            {companyInfo?.phone && (
              <InfoRow
                icon={<Phone className="h-[22px] w-[22px]" strokeWidth={1.6} aria-hidden="true" />}
                label={t('footer.phone')}
                href={phoneHref(companyInfo.phone)}
              >
                {formatPhone(companyInfo.phone)}
              </InfoRow>
            )}
            {companyInfo?.email && (
              <InfoRow
                icon={<Mail className="h-[22px] w-[22px]" strokeWidth={1.6} aria-hidden="true" />}
                label={t('footer.email')}
                href={`mailto:${companyInfo.email}`}
              >
                {companyInfo.email}
              </InfoRow>
            )}
          </div>

          <div className="flex flex-col gap-4 rounded-[10px] border border-navy-line bg-navy-800 p-6 sm:p-8">
            <h3 className="m-0 text-xl font-semibold">{t('contact.businessHours')}</h3>
            <div className="flex flex-wrap justify-between gap-x-4 gap-y-1 border-b border-navy-line pb-3">
              <span className="text-navy-text2">{t('contact.mondayFriday')}</span>
              <span className="font-plexmono text-sm">9:00 AM - 6:00 PM</span>
            </div>
            <div className="flex flex-wrap justify-between gap-x-4 gap-y-1">
              <span className="text-navy-text2">{t('contact.saturday')}</span>
              <span className="font-plexmono text-sm">10:00 AM - 2:00 PM</span>
            </div>
          </div>
        </div>

        <SiteContactForm />
      </section>

      <section className="border-t border-navy-line bg-navy-900">
        <div className="site-wrap flex flex-wrap items-center justify-between gap-x-12 gap-y-7 py-16 md:py-[88px]">
          <div className="flex flex-[1_1_420px] flex-col gap-3.5">
            <h2 className="site-h2">{t('contact.scheduleConsultation')}</h2>
            <p className="m-0 max-w-[640px] text-navy-text2">{t('contact.consultationDescription')}</p>
          </div>
          <a
            href="#contact-form"
            className="inline-flex min-h-[56px] items-center gap-2.5 rounded-md bg-navy-accent px-7 font-semibold text-navy-950 transition-colors hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            {t('contact.bookConsultation')}
            <ArrowRight className="h-[18px] w-[18px]" aria-hidden="true" />
          </a>
        </div>
      </section>
    </SiteShell>
  )
}
