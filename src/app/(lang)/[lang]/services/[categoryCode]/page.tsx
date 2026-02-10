import { Metadata } from 'next'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import CategoryHeader from '@/components/services/CategoryHeader'
import CategorySidebar from '@/components/services/CategorySidebar'
import ServicesList from '@/components/services/ServicesList'

interface CategoryPageProps {
  params: Promise<{
    lang: string
    categoryCode: string
  }>
}

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://tnc.az'

// Category titles for metadata
const categoryTitles: Record<string, { en: string; az: string; ru: string }> = {
  consulting: { 
    en: 'Tax Consulting Services', 
    az: 'Vergi Məsləhətləri', 
    ru: 'Налоговый Консалтинг' 
  },
  accounting: { 
    en: 'Accounting Services', 
    az: 'Mühasibat Xidmətləri', 
    ru: 'Бухгалтерские Услуги' 
  },
  legal: { 
    en: 'Legal Services', 
    az: 'Hüquqi Xidmətlər', 
    ru: 'Юридические Услуги' 
  },
  audit: { 
    en: 'Audit Services', 
    az: 'Audit Xidmətləri', 
    ru: 'Аудиторские Услуги' 
  },
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { lang, categoryCode } = await params
  const category = categoryTitles[categoryCode]
  
  if (!category) {
    return {
      title: 'Services | TnC Tax & Consulting',
    }
  }

  const title = `${category[lang as keyof typeof category] || category.en} | TnC Tax & Consulting`
  const description = `Professional ${category.en.toLowerCase()} for businesses and individuals in Azerbaijan. Expert guidance with integrity and excellence.`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${siteUrl}/${lang}/services/${categoryCode}`,
      images: [{ url: `${siteUrl}/og-image.svg`, width: 1200, height: 630 }],
    },
    twitter: {
      title,
      description,
      images: [`${siteUrl}/og-image.svg`],
    },
  }
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { categoryCode } = await params

  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <CategoryHeader categoryCode={categoryCode} />
        <section className="section-padding bg-gray-50">
          <div className="container-max">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Sidebar */}
              <aside className="lg:w-64 flex-shrink-0">
                <CategorySidebar currentCategoryCode={categoryCode} />
              </aside>

              {/* Services List */}
              <div className="flex-1">
                <ServicesList categoryCode={categoryCode} />
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
