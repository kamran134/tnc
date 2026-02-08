import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import CategoryHeader from '@/components/services/CategoryHeader'
import CategorySidebar from '@/components/services/CategorySidebar'
import ServicesList from '@/components/services/ServicesList'

interface CategoryPageProps {
  params: {
    lang: string
    categoryCode: string
  }
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const { categoryCode } = params

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
