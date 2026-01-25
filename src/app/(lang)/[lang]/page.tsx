import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import Hero from '@/components/home/Hero'
import Memberships from '@/components/home/Memberships'
import Mission from '@/components/home/Mission'
import Vision from '@/components/home/Vision'
import CoreValues from '@/components/home/CoreValues'
import { companyInfoService } from '@/lib/api'
import { LanguageCode } from '@/types/api'

interface HomePageProps {
  params: Promise<{
    lang: string;
  }>;
}

export default async function HomePage({ params }: HomePageProps) {
  const { lang } = await params;
  
  // Load company info on server
  let companyInfo = null;
  try {
    companyInfo = await companyInfoService.getCompanyInfo(lang as LanguageCode);
  } catch (error) {
    console.error('Failed to load company info:', error);
  }
  
  return (
    <div className="min-h-screen">
      <Header />
      <main className="snap-y snap-mandatory overflow-y-scroll" style={{ height: 'calc(100vh - 73px)' }}>
        <Hero companyInfo={companyInfo} />
        <Memberships lang={lang} />
        <Mission lang={lang} companyInfo={companyInfo} />
        <Vision lang={lang} companyInfo={companyInfo} />
        <CoreValues lang={lang} companyInfo={companyInfo} />
        <Footer />
      </main>
    </div>
  )
}
