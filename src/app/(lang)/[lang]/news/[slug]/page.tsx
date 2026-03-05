'use client';

import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { LoadingSpinner, Alert } from '@/components/ui';
import { LanguageCode } from '@/types/api';
import { useNewsBySlugQuery } from '@/hooks/queries';
import { sanitizeHtml } from '@/lib/sanitize';

export default function NewsDetail() {
  const params = useParams();
  const router = useRouter();
  const lang = params.lang as LanguageCode;
  const slug = params.slug as string;
  
  const { data: news, isLoading: loading, error } = useNewsBySlugQuery(slug, lang);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="section-padding">
          <div className="container-max">
            <LoadingSpinner />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !news) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="section-padding">
          <div className="container-max">
            <Alert type="error" message={(error instanceof Error ? error.message : error) || 'News not found'} />
            <button
              onClick={() => router.push(`/${lang}/news`)}
              className="mt-6 text-sky-600 hover:text-sky-700 font-medium"
            >
              ← Back to News
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header />
      
      <main>
        <article className="section-padding bg-white">
          <div className="container-max max-w-4xl">
            <nav className="mb-8 text-sm">
              <ol className="flex items-center space-x-2 text-gray-500">
                <li>
                  <Link href={`/${lang}`} className="hover:text-sky-600">Home</Link>
                </li>
                <li>/</li>
                <li>
                  <Link href={`/${lang}/news`} className="hover:text-sky-600">News</Link>
                </li>
                <li>/</li>
                <li className="text-gray-900">{news.title}</li>
              </ol>
            </nav>

            {news.category && (
              <div className="mb-4">
                <span className="inline-block bg-sky-100 text-sky-700 px-4 py-1 rounded-full text-sm font-medium">
                  {news.category}
                </span>
              </div>
            )}

            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              {news.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-gray-600 mb-8 pb-8 border-b border-gray-200">
              {news.author && (
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span>By {news.author}</span>
                </div>
              )}
              
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <time dateTime={news.publishDate}>{formatDate(news.publishDate)}</time>
              </div>

              {news.readTimeMinutes && (
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{news.readTimeMinutes} min read</span>
                </div>
              )}
            </div>

            {news.imageUrl && (
              <div className="relative w-full h-96 mb-12 rounded-xl overflow-hidden">
                <Image
                  src={news.imageUrl}
                  alt={news.title}
                  fill
                  className="object-cover"
                  priority
                  unoptimized
                />
              </div>
            )}

            {news.excerpt && (
              <div
                className="text-xl text-gray-700 leading-relaxed mb-8 font-medium border-l-4 border-sky-500 pl-6 italic rich-text-content"
                dangerouslySetInnerHTML={{ __html: sanitizeHtml(news.excerpt) }}
              />
            )}

            <div className="prose prose-lg max-w-none">
              <div 
                className="text-gray-700 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: sanitizeHtml(news.content) }}
              />
            </div>

            {news.tags && (
              <div className="mt-12 pt-8 border-t border-gray-200">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Tags:</h3>
                <div className="flex flex-wrap gap-2">
                  {news.tags.split(',').map((tag, index) => (
                    <span
                      key={index}
                      className="inline-block bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                    >
                      #{tag.trim()}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-12 pt-8 border-t border-gray-200">
              <button
                onClick={() => router.push(`/${lang}/news`)}
                className="inline-flex items-center text-sky-600 hover:text-sky-700 font-semibold transition-colors"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to News
              </button>
            </div>
          </div>
        </article>
      </main>

      <Footer />
    </div>
  );
}
