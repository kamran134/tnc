'use client'

import { useParams } from 'next/navigation'
import Link from 'next/link'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { PageHero, LoadingSpinner, Alert, Button, Card, EmptyState } from '@/components/ui'
import { LanguageCode } from '@/types/api'
import { useTranslations } from '@/hooks/useTranslations'
import { useCareersListQuery } from '@/hooks/queries'
import { sanitizeHtml } from '@/lib/sanitize'

export default function CareersPage() {
  const { t } = useTranslations();
  const params = useParams();
  const lang = (params.lang as LanguageCode) || 'az';
  
  const { data, isLoading: loading, error } = useCareersListQuery(lang);
  
  const jobOpenings = data?.content || [];

  const localeMap: Record<string, string> = { az: 'az-AZ', en: 'en-US', ru: 'ru-RU' };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(localeMap[lang] || 'en-US', {
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
          pageTag="CAREER"
          fallbackTitle={t('careers.workingAtTnc')}
          fallbackDescription={t('careers.heroDescription')}
        />

        {/* Why Work With Us */}
        <section className="section-padding bg-white">
          <div className="container-max">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                {t('careers.whyWorkWithUs')}
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
              <div className="text-center">
                <div className="w-16 h-16 bg-sky-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{t('careers.professionalGrowth')}</h3>
                <p className="text-gray-600">
                  {t('careers.professionalGrowthDesc')}
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-sky-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{t('careers.expertTeam')}</h3>
                <p className="text-gray-600">
                  {t('careers.expertTeamDesc')}
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-sky-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{t('careers.innovation')}</h3>
                <p className="text-gray-600">
                  {t('careers.innovationDesc')}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Current Openings */}
        <section className="section-padding bg-gray-50">
          <div className="container-max">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {t('careers.currentOpenings')}
              </h2>
              <p className="text-xl text-gray-600">
                {t('careers.joinTeam')}
              </p>
            </div>
            
            {loading ? (
              <LoadingSpinner />
            ) : error ? (
              <Alert type="error" message={error instanceof Error ? error.message : String(error)} />
            ) : jobOpenings.length === 0 ? (
              <EmptyState message={t('careers.noOpenings')} />
            ) : (
              <div className="grid gap-6">
                {jobOpenings.map((job) => (
                  <Card
                    key={job.id}
                    hover
                  >
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
                      <div className="flex-1">
                        <Link href={`/${lang}/careers/${job.slug}`}>
                          <h3 className="text-2xl font-bold text-gray-900 mb-2 hover:text-sky-600 transition-colors cursor-pointer">
                            {job.title}
                          </h3>
                        </Link>
                        
                        <div className="flex flex-wrap gap-4 mb-4 text-sm text-gray-600">
                          <span className="flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            {job.location}
                          </span>
                          {job.employmentType && (
                            <span className="flex items-center">
                              <svg className="w-4 h-4 mr-1 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              {job.employmentType}
                            </span>
                          )}
                          {job.company && (
                            <span className="flex items-center">
                              <svg className="w-4 h-4 mr-1 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                              </svg>
                              {job.company}
                            </span>
                          )}
                          {job.department && (
                            <span className="flex items-center">
                              <svg className="w-4 h-4 mr-1 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                              </svg>
                              {job.department}
                            </span>
                          )}
                          {job.salaryRange && (
                            <span className="flex items-center">
                              <svg className="w-4 h-4 mr-1 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              {job.salaryRange === 'BY_NEGOTIATION' ? t('careers.byNegotiation') : job.salaryRange}
                            </span>
                          )}
                          <span className="flex items-center">
                            <svg className="w-4 h-4 mr-1 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            {t('careers.posted')}: {formatDate(job.postDate)}
                          </span>
                        </div>
                        
                        {job.excerpt && (
                          <p className="text-gray-700 mb-4">
                            {job.excerpt}
                          </p>
                        )}
                        
                        {job.requirements && (
                          <div className="mb-6">
                            <h4 className="font-semibold text-gray-900 mb-2">{t('careers.requirements')}:</h4>
                            <div 
                              className="text-gray-700 prose prose-sm max-w-none"
                              dangerouslySetInnerHTML={{ __html: sanitizeHtml(job.requirements) }}
                            />
                          </div>
                        )}
                      </div>
                      
                      <div className="lg:ml-8">
                        <Link href={`/${lang}/careers/${job.slug}`}>
                          <Button>
                            {t('careers.viewDetails')}
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
            
            {/* <div className="text-center mt-12">
              <Card>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  {t('careers.noRightPosition')}
                </h3>
                <p className="text-gray-600 mb-6">
                  {t('careers.submitResumeDesc')}
                </p>
                <Button variant="secondary">
                  {t('careers.submitResume')}
                </Button>
              </Card>
            </div> */}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
