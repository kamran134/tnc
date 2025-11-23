'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { LoadingSpinner, Alert } from '@/components/ui';
import { CareerDto } from '@/types/api';

export default function CareerDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const lang = params.lang as string;
  
  const [career, setCareer] = useState<CareerDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCareer = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(`/api/careers/${slug}?lang=${lang}`);
        
        if (response.ok) {
          const data = await response.json();
          setCareer(data);
        } else if (response.status === 404) {
          setError('Job posting not found');
        } else {
          setError('Failed to load job posting');
        }
      } catch (err) {
        console.error('Error loading career:', err);
        setError('Network error. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (slug && lang) {
      loadCareer();
    }
  }, [slug, lang]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getEmploymentTypeLabel = (type?: string) => {
    const types: { [key: string]: string } = {
      'FULL_TIME': 'Full Time',
      'PART_TIME': 'Part Time',
      'CONTRACT': 'Contract',
      'REMOTE': 'Remote'
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
            <Alert type="error" message={error || 'Job posting not found'} />
            <button
              onClick={() => router.push('/careers')}
              className="mt-6 text-primary-600 hover:text-primary-700 font-medium"
            >
              ← Back to Careers
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
        {/* Job Header */}
        <article className="section-padding bg-white">
          <div className="container-max max-w-4xl">
            {/* Breadcrumbs */}
            <nav className="mb-8 text-sm">
              <ol className="flex items-center space-x-2 text-gray-500">
                <li>
                  <Link href="/" className="hover:text-primary-600">Home</Link>
                </li>
                <li>/</li>
                <li>
                  <Link href="/careers" className="hover:text-primary-600">Careers</Link>
                </li>
                <li>/</li>
                <li className="text-gray-900">{career.title}</li>
              </ol>
            </nav>

            {/* Title */}
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              {career.title}
            </h1>

            {/* Job Details Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 pb-8 border-b border-gray-200">
              <div className="flex flex-col">
                <span className="text-sm text-gray-500 mb-1">Location</span>
                <span className="font-medium text-gray-900">{career.location}</span>
              </div>
              
              {career.employmentType && (
                <div className="flex flex-col">
                  <span className="text-sm text-gray-500 mb-1">Type</span>
                  <span className="font-medium text-gray-900">
                    {getEmploymentTypeLabel(career.employmentType)}
                  </span>
                </div>
              )}
              
              {career.salaryRange && (
                <div className="flex flex-col">
                  <span className="text-sm text-gray-500 mb-1">Salary</span>
                  <span className="font-medium text-gray-900">{career.salaryRange}</span>
                </div>
              )}
              
              <div className="flex flex-col">
                <span className="text-sm text-gray-500 mb-1">Posted</span>
                <span className="font-medium text-gray-900">{formatDate(career.postDate)}</span>
              </div>
            </div>

            {/* Excerpt */}
            {career.excerpt && (
              <div className="text-xl text-gray-700 leading-relaxed mb-8 font-medium border-l-4 border-primary-500 pl-6">
                {career.excerpt}
              </div>
            )}

            {/* Job Description */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Job Description</h2>
              <div 
                className="prose prose-lg max-w-none text-gray-700 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: career.content }}
              />
            </div>

            {/* Requirements */}
            {career.requirements && (
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Requirements</h2>
                <div 
                  className="prose prose-lg max-w-none text-gray-700 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: career.requirements }}
                />
              </div>
            )}

            {/* Expiry Notice */}
            {career.expiryDate && new Date(career.expiryDate) > new Date() && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-8">
                <p className="text-amber-800">
                  <span className="font-semibold">Application Deadline:</span> {formatDate(career.expiryDate)}
                </p>
              </div>
            )}

            {/* Apply Section */}
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Interested in this position?</h2>
              <p className="text-gray-700 mb-6">
                We&apos;d love to hear from you! Click the button below to get in touch with us.
              </p>
              <button
                onClick={() => router.push('/contact')}
                className="bg-purple-600 text-white px-8 py-3 rounded-lg hover:bg-purple-700 transition-colors font-semibold"
              >
                Apply Now
              </button>
            </div>

            {/* Back Button */}
            <div className="pt-8 border-t border-gray-200">
              <button
                onClick={() => router.push('/careers')}
                className="inline-flex items-center text-primary-600 hover:text-primary-700 font-semibold transition-colors"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Careers
              </button>
            </div>
          </div>
        </article>
      </main>

      <Footer />
    </div>
  );
}
