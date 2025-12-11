'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { PageHero, LoadingSpinner, Alert, Button, Card, EmptyState } from '@/components/ui'
import { LanguageCode } from '@/types/api'
import { useTranslations } from '@/hooks/useTranslations'
import { useNewsListQuery } from '@/hooks/queries'

export default function NewsPage() {
  const { t } = useTranslations();
  const params = useParams();
  const lang = (params.lang as LanguageCode) || 'az';
  const [currentPage, setCurrentPage] = useState(0);

  const { data, isLoading: loading, error } = useNewsListQuery({ lang, page: currentPage, size: 10 });
  
  const newsArticles = data?.content || [];
  const totalPages = data?.totalPages || 0;
  const hasMore = !data?.last;



  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const loadMore = () => {
    if (hasMore && !loading) {
      setCurrentPage(prev => prev + 1)
    }
  }

  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <PageHero 
          pageTag="NEWS"
          fallbackTitle={t('news.latestNews')}
          fallbackDescription={t('news.description')}
        />

        <section className="section-padding">
          <div className="container-max">
            {loading && currentPage === 0 ? (
              <div className="flex justify-center py-12">
                <LoadingSpinner size="lg" />
              </div>
            ) : error ? (
              <Alert type="error" message={error instanceof Error ? error.message : String(error)} className="mb-6" />
            ) : newsArticles.length === 0 ? (
              <EmptyState message={t('news.noArticles')} />
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {newsArticles.map((article) => (
                    <Card key={article.id} hover className="overflow-hidden">
                      {article.imageUrl && (
                        <div className="relative h-48 w-full">
                          <Image
                            src={article.imageUrl}
                            alt={article.title}
                            fill
                            className="object-cover"
                            unoptimized
                          />
                        </div>
                      )}
                      <div className="p-6">
                        <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                          {article.publishDate && (
                            <time>{formatDate(article.publishDate)}</time>
                          )}
                          {article.category && (
                            <>
                              <span>•</span>
                              <span className="text-primary-600 font-medium">{article.category}</span>
                            </>
                          )}
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-3 line-clamp-2">
                          {article.title}
                        </h3>
                        {article.excerpt && (
                          <p className="text-gray-600 mb-4 line-clamp-3">
                            {article.excerpt}
                          </p>
                        )}
                        <Link href={`/${lang}/news/${article.slug}`}>
                          <Button variant="outline" size="sm" fullWidth>
                            {t('common.readMore')}
                          </Button>
                        </Link>
                      </div>
                    </Card>
                  ))}
                </div>

                {hasMore && (
                  <div className="flex justify-center mt-12">
                    <Button
                      onClick={loadMore}
                      disabled={loading}
                      size="lg"
                    >
                      {loading ? t('common.loading') : t('news.loadMore')}
                    </Button>
                  </div>
                )}

                {!hasMore && newsArticles.length > 0 && (
                  <p className="text-center text-gray-500 mt-8">
                    {t('news.endOfNews')}
                  </p>
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
