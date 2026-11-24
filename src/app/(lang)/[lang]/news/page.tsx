'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import SiteShell from '@/components/site/SiteShell'
import SitePageHero from '@/components/site/SitePageHero'
import { NewsCard } from '@/components/site/SiteBits'
import { LanguageCode, NewsDto } from '@/types/api'
import { useTranslations } from '@/hooks/useTranslations'
import { useNewsListQuery } from '@/hooks/queries'

export default function NewsPage() {
  const { t } = useTranslations();
  const params = useParams();
  const lang = (params.lang as LanguageCode) || 'az';
  const [currentPage, setCurrentPage] = useState(0);
  const [allArticles, setAllArticles] = useState<NewsDto[]>([]);

  const { data, isLoading: loading, error } = useNewsListQuery({ lang, page: currentPage, size: 6 });

  useEffect(() => {
    setCurrentPage(0);
    setAllArticles([]);
  }, [lang]);

  useEffect(() => {
    if (data?.content) {
      setAllArticles(prev =>
        currentPage === 0 ? data.content : [...prev, ...data.content]
      );
    }
  }, [data, currentPage]);

  const totalElements = data?.totalElements || 0;
  const hasMore = totalElements > 6 && !data?.last;

  const loadMore = () => {
    if (hasMore && !loading) {
      setCurrentPage(prev => prev + 1)
    }
  }

  const [featured, ...rest] = allArticles;

  return (
    <SiteShell>
      <SitePageHero
        pageTag="NEWS"
        breadcrumb={t('nav.news')}
        fallbackTitle={t('news.latestNews')}
        fallbackDescription={t('news.description')}
      />

      <section className="site-wrap flex flex-col gap-8 pb-16 pt-14 md:pb-[112px]">
        {loading && currentPage === 0 ? (
          <div className="flex flex-col gap-8" aria-hidden="true">
            <div className="aspect-[16/6] animate-pulse rounded-[10px] bg-navy-800" />
            <div className="grid grid-cols-[repeat(auto-fit,minmax(min(300px,100%),1fr))] gap-6">
              {[0, 1, 2].map((i) => (
                <div key={i} className="aspect-[16/10] animate-pulse rounded-[10px] bg-navy-800" />
              ))}
            </div>
          </div>
        ) : error ? (
          <p role="alert" className="text-navy-text2">
            {error instanceof Error ? error.message : t('news.errorLoading')}
          </p>
        ) : allArticles.length === 0 && !loading ? (
          <p className="py-12 text-center text-navy-muted">{t('news.noArticles')}</p>
        ) : (
          <>
            {featured && <NewsCard article={featured} lang={lang} readMore={t('common.readMore')} featured />}

            {rest.length > 0 && (
              <div className="grid grid-cols-[repeat(auto-fit,minmax(min(300px,100%),1fr))] gap-x-6 gap-y-8 pt-4">
                {rest.map((article) => (
                  <NewsCard key={article.id} article={article} lang={lang} readMore={t('common.readMore')} />
                ))}
              </div>
            )}

            {hasMore && (
              <div className="flex justify-center pt-6">
                <button
                  type="button"
                  onClick={loadMore}
                  disabled={loading}
                  className="inline-flex min-h-[56px] cursor-pointer items-center justify-center rounded-md border border-[rgba(234,241,246,0.4)] bg-transparent px-8 font-semibold text-navy-text transition-colors hover:border-white hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy-accent disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? t('common.loading') : t('news.loadMore')}
                </button>
              </div>
            )}

            {!hasMore && allArticles.length > 0 && (
              <p className="pt-4 text-center text-navy-muted">{t('news.endOfNews')}</p>
            )}
          </>
        )}
      </section>
    </SiteShell>
  )
}
