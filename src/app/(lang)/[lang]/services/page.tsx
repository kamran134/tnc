import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import ServiceHero from '@/components/services/ServiceHero'
import ServicesList from '@/components/services/ServicesList'

export default function ServicesPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <ServiceHero />
        <ServicesList />
      </main>
      <Footer />
    </div>
  )
}
