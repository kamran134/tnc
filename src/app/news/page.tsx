'use client'

import { useState, useEffect } from 'react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { NewsDto } from '@/types/api'
import { newsService } from '@/lib/api'

export default function NewsPage() {
  const [newsArticles, setNewsArticles] = useState<NewsDto[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [hasMore, setHasMore] = useState(false)

  const loadNews = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await newsService.getAll({
        lang: 'az',
        page: currentPage,
        size: 10
      })
      
      if (currentPage === 0) {
        setNewsArticles(response.content)
      } else {
        setNewsArticles(prev => [...prev, ...response.content])
      }
      
      setTotalPages(response.totalPages)
      setHasMore(!response.last)
    } catch (err) {
      console.error('Failed to load news:', err)
      setError('Failed to load news articles')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadNews()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage])

  const loadMore = () => {
    if (hasMore && !loading) {
      setCurrentPage(prev => prev + 1)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <div className="min-h-screen">
      <Header />
      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-sky-400 to-sky-500 text-white section-padding">
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
            {loading && currentPage === 0 ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <p className="text-red-600">{error}</p>
              </div>
            ) : newsArticles.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600">No news articles available</p>
              </div>
            ) : (
              <>
                <div className="grid gap-8 md:gap-12">
                  {newsArticles.map((article) => (
                    <article
                      key={article.id}
                      className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden"
                    >
                      {article.imageUrl && (
                        <div className="w-full h-64 bg-gray-200">
                          <img
                            src={article.imageUrl}
                            alt={article.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <div className="p-8">
                        <div className="flex flex-wrap items-center gap-4 mb-4">
                          {article.category && (
                            <span className="bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-sm font-medium">
                              {article.category}
                            </span>
                          )}
                          <span className="text-gray-500 text-sm">{formatDate(article.publishDate)}</span>
                          {article.readTimeMinutes && (
                            <span className="text-gray-500 text-sm">{article.readTimeMinutes} min read</span>
                          )}
                        </div>
                        
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 hover:text-primary-600 cursor-pointer">
                          {article.title}
                        </h2>
                        
                        {article.excerpt && (
                          <p className="text-gray-600 text-lg leading-relaxed mb-6">
                            {article.excerpt}
                          </p>
                        )}
                        
                        {article.author && (
                          <p className="text-sm text-gray-500 mb-4">
                            By {article.author}
                          </p>
                        )}
                        
                        <button className="text-primary-600 font-semibold hover:text-primary-700 transition-colors duration-200">
                          Read More →
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
                
                {hasMore && (
                  <div className="text-center mt-12">
                    <button 
                      className="btn-primary"
                      onClick={loadMore}
                      disabled={loading}
                    >
                      {loading ? 'Loading...' : 'Load More Articles'}
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
