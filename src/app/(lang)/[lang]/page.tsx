import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import Hero from '@/components/home/Hero'
import Memberships from '@/components/home/Memberships'
import Mission from '@/components/home/Mission'
import Vision from '@/components/home/Vision'
import CoreValues from '@/components/home/CoreValues'

interface HomePageProps {
  params: Promise<{
    lang: string;
  }>;
}

export default async function HomePage({ params }: HomePageProps) {
  const { lang } = await params;
  
  return (
    <div className="min-h-screen">
      <Header />
      <main className="snap-y snap-mandatory overflow-y-scroll" style={{ height: 'calc(100vh - 73px)' }}>
        <Hero />
        <Memberships lang={lang} />
        <Mission lang={lang} />
        <Vision lang={lang} />
        <CoreValues lang={lang} />
        <Footer />
      </main>
    </div>
  )
}
