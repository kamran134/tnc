'use client';

import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { LoadingSpinner, Alert } from '@/components/ui';
import { LanguageCode } from '@/types/api';
import { useTranslations } from '@/hooks/useTranslations';
import { useCareerBySlugQuery } from '@/hooks/queries';
import { sanitizeHtml } from '@/lib/sanitize';

const localeMap: Record<string, string> = {
  az: 'az-AZ',
  en: 'en-US',
  ru: 'ru-RU',
};

export default function CareerDetail() {
  const { t } = useTranslations();
  const params = useParams();
  const router = useRouter();
  const lang = params.lang as LanguageCode;
  const slug = params.slug as string;
  
  const { data: career, isLoading: loading, error } = useCareerBySlugQuery(slug, lang);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(localeMap[lang] || 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getEmploymentTypeLabel = (type?: string) => {
    const types: Record<string, string> = {
      'FULL_TIME': t('careers.fullTime'),
      'PART_TIME': t('careers.partTime'),
      'CONTRACT': t('careers.contract'),
      'REMOTE': t('careers.remote'),
    };
    return type ? types[type] || type : '';
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

  if (error || !career) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="section-padding">
          <div className="container-max">
            <Alert type="error" message={(error instanceof Error ? error.message : error) || t('careers.notFound')} />
            <button
              onClick={() => router.push(`/${lang}/careers`)}
              className="mt-6 text-sky-600 hover:text-sky-700 font-medium"
            >
              ← {t('careers.backToCareers')}
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
                  <Link href={`/${lang}`} className="hover:text-sky-600">{t('nav.home')}</Link>
                </li>
                <li>/</li>
                <li>
                  <Link href={`/${lang}/careers`} className="hover:text-sky-600">{t('nav.careers')}</Link>
                </li>
                <li>/</li>
                <li className="text-gray-900">{career.title}</li>
              </ol>
            </nav>

            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              {career.title}
            </h1>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 pb-8 border-b border-gray-200">
              <div className="flex flex-col">
                <span className="text-sm text-gray-500 mb-1">{t('careers.location')}</span>
                <span className="font-medium text-gray-900">{career.location}</span>
              </div>
              
              {career.employmentType && (
                <div className="flex flex-col">
                  <span className="text-sm text-gray-500 mb-1">{t('careers.type')}</span>
                  <span className="font-medium text-gray-900">
                    {getEmploymentTypeLabel(career.employmentType)}
                  </span>
                </div>
              )}
              
              {career.salaryRange && (
                <div className="flex flex-col">
                  <span className="text-sm text-gray-500 mb-1">{t('careers.salary')}</span>
                  <span className="font-medium text-gray-900">
                    {career.salaryRange === 'BY_NEGOTIATION' ? t('careers.byNegotiation') : career.salaryRange}
                  </span>
                </div>
              )}

              {career.company && (
                <div className="flex flex-col">
                  <span className="text-sm text-gray-500 mb-1">{t('careers.company')}</span>
                  <span className="font-medium text-gray-900">{career.company}</span>
                </div>
              )}

              {career.department && (
                <div className="flex flex-col">
                  <span className="text-sm text-gray-500 mb-1">{t('careers.department')}</span>
                  <span className="font-medium text-gray-900">{career.department}</span>
                </div>
              )}
              
              <div className="flex flex-col">
                <span className="text-sm text-gray-500 mb-1">{t('careers.posted')}</span>
                <span className="font-medium text-gray-900">{formatDate(career.postDate)}</span>
              </div>
            </div>

            {career.excerpt && (
              <div className="text-xl text-gray-700 leading-relaxed mb-8 font-medium border-l-4 border-sky-500 pl-6">
                {career.excerpt}
              </div>
            )}

            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('careers.jobDescription')}</h2>
              <div 
                className="prose prose-lg max-w-none text-gray-700 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: sanitizeHtml(career.content) }}
              />
            </div>

            {career.requirements && (
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('careers.requirements')}</h2>
                <div 
                  className="prose prose-lg max-w-none text-gray-700 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: sanitizeHtml(career.requirements) }}
                />
              </div>
            )}

            {career.expiryDate && new Date(career.expiryDate) > new Date() && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-8">
                <p className="text-amber-800">
                  <span className="font-semibold">{t('careers.applicationDeadline')}:</span> {formatDate(career.expiryDate)}
                </p>
              </div>
            )}

            <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('careers.interestedInPosition')}</h2>
              <p className="text-gray-700 mb-6">
                {t('careers.interestedDescription')}
              </p>
              <button
                onClick={() => router.push(`/${lang}/contact`)}
                className="bg-sky-600 text-white px-8 py-3 rounded-lg hover:bg-sky-700 transition-colors font-semibold"
              >
                {t('careers.applyNow')}
              </button>
            </div>

            <div className="pt-8 border-t border-gray-200">
              <button
                onClick={() => router.push(`/${lang}/careers`)}
                className="inline-flex items-center text-sky-600 hover:text-sky-700 font-semibold transition-colors"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                {t('careers.backToCareers')}
              </button>
            </div>
          </div>
        </article>
      </main>

      <Footer />
    </div>
  );
}
