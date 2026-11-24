import { Metadata } from 'next'
import SiteShell from '@/components/site/SiteShell'
import { AllServicesView } from '@/components/site/services/ServicesViews'
import az from '@/locales/az.json'
import en from '@/locales/en.json'
import ru from '@/locales/ru.json'

type Locale = 'az' | 'en' | 'ru'

interface AllServicesPageProps {
  params: Promise<{
    lang: Locale
  }>
}

const translations = { az, en, ru }
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://tnc.az'

export async function generateMetadata({ params }: AllServicesPageProps): Promise<Metadata> {
  const { lang } = await params
  const t = translations[lang]

  return {
    title: `${t.services.allServicesTitle} | TnC Tax & Consulting`,
    description: t.services.allServicesDescription,
    openGraph: {
      title: `${t.services.allServicesTitle} | TnC Tax & Consulting`,
      description: t.services.allServicesDescription,
      url: `${siteUrl}/${lang}/services/all`,
      images: [{ url: `${siteUrl}/og-image.svg`, width: 1200, height: 630 }],
    },
    twitter: {
      title: `${t.services.allServicesTitle} | TnC Tax & Consulting`,
      description: t.services.allServicesDescription,
      images: [`${siteUrl}/og-image.svg`],
    },
  }
}

export default function AllServicesPage() {
  return (
    <SiteShell>
      <AllServicesView />
    </SiteShell>
  )
}
