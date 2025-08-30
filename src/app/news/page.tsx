import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

export default function NewsPage() {
  const newsArticles = [
    {
      id: 1,
      title: 'New Tax Regulations in Azerbaijan: What Businesses Need to Know',
      summary: 'Important updates to tax legislation that will affect businesses starting next quarter.',
      date: '2024-03-15',
      category: 'Tax Updates',
      readTime: '5 min read'
    },
    {
      id: 2,
      title: 'TnC Expands Legal Services Division',
      summary: 'We are pleased to announce the expansion of our legal services with new expert attorneys.',
      date: '2024-03-10',
      category: 'Company News',
      readTime: '3 min read'
    },
    {
      id: 3,
      title: 'International Tax Planning Strategies for 2024',
      summary: 'Key strategies for multinational companies to optimize their tax planning.',
      date: '2024-03-05',
      category: 'Tax Advisory',
      readTime: '7 min read'
    }
  ]

  return (
    <div className="min-h-screen">
      <Header />
      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-primary-600 to-primary-700 text-white section-padding">
          <div className="container-max">
            <div className="text-center max-w-4xl mx-auto">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                News & Insights
              </h1>
              <p className="text-xl md:text-2xl text-primary-100">
                Stay updated with the latest tax, legal, and business insights
              </p>
            </div>
          </div>
        </section>

        {/* News Articles */}
        <section className="section-padding bg-gray-50">
          <div className="container-max">
            <div className="grid gap-8 md:gap-12">
              {newsArticles.map((article) => (
                <article
                  key={article.id}
                  className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden"
                >
                  <div className="p-8">
                    <div className="flex flex-wrap items-center gap-4 mb-4">
                      <span className="bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-sm font-medium">
                        {article.category}
                      </span>
                      <span className="text-gray-500 text-sm">{article.date}</span>
                      <span className="text-gray-500 text-sm">{article.readTime}</span>
                    </div>
                    
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 hover:text-primary-600 cursor-pointer">
                      {article.title}
                    </h2>
                    
                    <p className="text-gray-600 text-lg leading-relaxed mb-6">
                      {article.summary}
                    </p>
                    
                    <button className="text-primary-600 font-semibold hover:text-primary-700 transition-colors duration-200">
                      Read More →
                    </button>
                  </div>
                </article>
              ))}
            </div>
            
            <div className="text-center mt-12">
              <button className="btn-primary">
                Load More Articles
              </button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
