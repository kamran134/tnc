'use client';

import { useParams } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import SiteShell from '@/components/site/SiteShell';
import { NewsCard } from '@/components/site/SiteBits';
import { LanguageCode } from '@/types/api';
import { useNewsBySlugQuery, useNewsListQuery } from '@/hooks/queries';
import { newsService } from '@/lib/api';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTranslations } from '@/hooks/useTranslations';
import { sanitizeHtml } from '@/lib/sanitize';
import { resolveImageUrl } from '@/lib/utils/image';
import { formatDateDMY } from '@/lib/utils/date';

export default function NewsDetail() {
  const params = useParams();
  const lang = params.lang as LanguageCode;
  const slug = params.slug as string;
  const { t } = useTranslations();

  const { data: news, isLoading: loading, error } = useNewsBySlugQuery(slug, lang);
  const { data: latest } = useNewsListQuery({ lang, page: 0, size: 4 });
  const { setSlugResolver } = useLanguage();

  // Register a slug resolver so language switching navigates to the correct slug
  useEffect(() => {
    if (!news) {
      setSlugResolver(null);
      return;
    }
    const newsId = news.id;
    setSlugResolver(async (newLocale: LanguageCode) => {
      try {
        const translated = await newsService.getById(newsId, newLocale);
        return `/${newLocale}/news/${translated.slug}`;
      } catch {
        return `/${newLocale}/news`;
      }
    });
    return () => {
      setSlugResolver(null);
    };
  }, [news, setSlugResolver]);

  const related = (latest?.content ?? []).filter((a) => a.slug !== slug).slice(0, 3);
  const image = resolveImageUrl(news?.imageUrl);

  const backLink = (
    <Link
      href={`/${lang}/news`}
      className="inline-flex min-h-[44px] items-center gap-2 self-start font-semibold text-navy-accent transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-navy-accent"
    >
      <span aria-hidden="true">←</span> {t('nav.news')}
    </Link>
  );

  return (
    <SiteShell>
      <section className="site-wrap flex flex-col gap-10 pb-24 pt-10">
        {backLink}

        {loading ? (
          <div className="mx-auto flex w-full max-w-[760px] flex-col gap-6" aria-hidden="true">
            <div className="h-4 w-40 animate-pulse rounded bg-navy-800" />
            <div className="h-16 animate-pulse rounded-lg bg-navy-800" />
            <div className="aspect-video animate-pulse rounded-[10px] bg-navy-800" />
          </div>
        ) : error || !news ? (
          <p role="alert" className="m-0 text-navy-text2">
            {t('news.errorLoading')}
          </p>
        ) : (
          <article className="mx-auto flex w-full max-w-[760px] flex-col gap-7">
            <span className="font-plexmono text-[13px] text-navy-muted">
              {t('news.publishedOn')} {formatDateDMY(news.publishDate)}
            </span>
            <h1 className="m-0 text-[clamp(32px,4vw,54px)] font-semibold leading-[1.1] tracking-[-0.03em]">
              {news.title}
            </h1>
            {image && (
              <div className="relative aspect-video w-full overflow-hidden rounded-[10px] bg-navy-800">
                <Image src={image} alt={news.title} fill priority sizes="(min-width: 800px) 760px, 100vw" className="object-cover" />
              </div>
            )}
            <div
              className="site-prose text-lg"
              dangerouslySetInnerHTML={{ __html: sanitizeHtml(news.content) }}
            />
            {news.tags && (
              <div className="flex flex-wrap gap-2 border-t border-navy-line pt-6">
                {news.tags
                  .split(',')
                  .map((tag) => tag.trim())
                  .filter(Boolean)
                  .map((tag) => (
                    <span key={tag} className="rounded-full bg-navy-700 px-3 py-1.5 text-[13px] text-navy-text2">
                      #{tag}
                    </span>
                  ))}
              </div>
            )}
          </article>
        )}
      </section>

      {related.length > 0 && (
        <section className="border-t border-navy-line bg-navy-900">
          <div className="site-wrap flex flex-col gap-9 pb-24 pt-16 md:pt-[88px]">
            <h2 className="site-h2">{t('news.latestNews')}</h2>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(min(300px,100%),1fr))] gap-6">
              {related.map((article) => (
                <NewsCard key={article.id} article={article} lang={lang} readMore={t('common.readMore')} />
              ))}
            </div>
          </div>
        </section>
      )}
    </SiteShell>
  );
}
