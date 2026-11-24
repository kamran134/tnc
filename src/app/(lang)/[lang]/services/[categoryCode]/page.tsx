import { Metadata } from 'next'
import SiteShell from '@/components/site/SiteShell'
import { ServiceCategoryView } from '@/components/site/services/ServicesViews'

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
    <SiteShell>
      <ServiceCategoryView categoryCode={categoryCode} />
    </SiteShell>
  )
}
