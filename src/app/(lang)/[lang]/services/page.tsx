import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import ServiceHero from '@/components/services/ServiceHero'
import CategoriesGrid from '@/components/services/CategoriesGrid'

export default function ServicesPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <ServiceHero />
        <CategoriesGrid />
      </main>
      <Footer />
    </div>
  )
}
