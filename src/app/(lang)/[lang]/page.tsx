'use client';

import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import Hero from '@/components/home/Hero'
import Memberships from '@/components/home/Memberships'
import Mission from '@/components/home/Mission'
import Vision from '@/components/home/Vision'
import CoreValues from '@/components/home/CoreValues'
import { useParams } from 'next/navigation'
import { LanguageCode } from '@/types/api'
import { useCompanyInfo } from '@/hooks/queries'

export default function HomePage() {
  const params = useParams();
  const lang = (params.lang as string) || 'az';
  
  // Use React Query hook - data will be cached and shared with Footer and other components
  const { data: companyInfo } = useCompanyInfo(lang as LanguageCode);
  
  return (
    <div className="min-h-screen">
      <Header />
      <main className="snap-y snap-mandatory overflow-y-scroll" style={{ height: 'calc(100vh - 73px)' }}>
        <Hero companyInfo={companyInfo || null} />
        <Memberships lang={lang} />
        <Mission lang={lang} companyInfo={companyInfo || null} />
        <Vision lang={lang} companyInfo={companyInfo || null} />
        <CoreValues lang={lang} companyInfo={companyInfo || null} />
        <Footer />
      </main>
    </div>
  )
}
