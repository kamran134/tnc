import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import Hero from '@/components/home/Hero'
import Memberships from '@/components/home/Memberships'
import Mission from '@/components/home/Mission'
import Vision from '@/components/home/Vision'
import CoreValues from '@/components/home/CoreValues'

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Hero />
        <Memberships />
        <Mission />
        <Vision />
        <CoreValues />
      </main>
      <Footer />
    </div>
  )
}
