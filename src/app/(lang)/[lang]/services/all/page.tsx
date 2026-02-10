import { Metadata } from 'next'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import ServicesList from '@/components/services/ServicesList'
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

export default async function AllServicesPage({ params }: AllServicesPageProps) {
  const { lang } = await params
  const t = translations[lang]

  return (
    <div className="min-h-screen">
      <Header />
      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-sky-400 to-sky-500 text-white py-16">
          <div className="container-max">
            <div className="text-center max-w-3xl mx-auto">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                {t.services.allServicesTitle}
              </h1>
              <p className="text-lg md:text-xl text-white/90">
                {t.services.allServicesDescription}
              </p>
            </div>
          </div>
        </section>

        {/* Services List */}
        <section className="section-padding bg-gray-50">
          <div className="container-max">
            <ServicesList />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
