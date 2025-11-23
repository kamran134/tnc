'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { PageHero, LoadingSpinner, Alert, Button, Card, EmptyState } from '@/components/ui'
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
        {/* Hero Section - Refactored to use PageHero component */}
        <PageHero 
          title="News & Insights"
          description="Stay updated with the latest tax, legal, and business insights"
        />

        {/* News Articles */}
        <section className="section-padding bg-gray-50">
          <div className="container-max">
            {loading && currentPage === 0 ? (
              <LoadingSpinner />
            ) : error ? (
              <Alert type="error" message={error} />
            ) : newsArticles.length === 0 ? (
              <EmptyState message="No news articles available" />
            ) : (
              <>
                <div className="grid gap-8 md:gap-12">
                  {newsArticles.map((article) => {
                    const href = article.languageCode === 'az'
                      ? `/news/${article.slug}`
                      : `/${article.languageCode}/news/${article.slug}`;
                    
                    return (
                    <Link 
                      key={article.id}
                      href={href}
                      className="block"
                    >
                      <Card hover padding="none" className="overflow-hidden h-full transition-transform hover:scale-[1.02]">
                        {article.imageUrl && (
                          <div className="relative w-full h-64 bg-gray-200">
                            <Image
                              src={article.imageUrl}
                              alt={article.title}
                              fill
                              className="object-cover"
                              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                              unoptimized
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
                          
                          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 hover:text-primary-600">
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
                          
                          <span className="text-primary-600 font-semibold hover:text-primary-700 transition-colors duration-200 inline-flex items-center">
                            Read More 
                            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </span>
                        </div>
                      </Card>
                    </Link>
                    );
                  })}
                </div>
                
                {hasMore && (
                  <div className="text-center mt-12">
                    <Button 
                      onClick={loadMore}
                      disabled={loading}
                    >
                      {loading ? 'Loading...' : 'Load More Articles'}
                    </Button>
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
