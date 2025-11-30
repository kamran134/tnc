'use client';

import { useState, useEffect } from 'react';
import { membershipsService, MembershipDto } from '@/lib/api';
import { LoadingSpinner, Alert } from '@/components/ui';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { LanguageCode } from '@/types/api';

interface MembershipsProps {
  lang?: string;
}

export default function Memberships({ lang = 'az' }: MembershipsProps) {
  const [memberships, setMemberships] = useState<MembershipDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { ref, isVisible } = useScrollAnimation();

  useEffect(() => {
    loadMemberships();
  }, [lang]);

  const loadMemberships = async () => {
    try {
      setIsLoading(true);
      const data = await membershipsService.getAll(lang as LanguageCode);
      console.log('Memberships - Loaded data:', data);
      setMemberships(data);
      setError(null);
    } catch (err) {
      setError('Failed to load memberships');
      console.error('Memberships error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <section className="snap-start section-padding bg-gray-50 flex items-center" style={{ minHeight: '100vh' }}>
        <div className="container-max">
          <LoadingSpinner />
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="snap-start section-padding bg-gray-50 flex items-center" style={{ minHeight: '100vh' }}>
        <div className="container-max">
          <Alert type="error" message={error} />
        </div>
      </section>
    );
  }

  if (memberships.length === 0) {
    return null; // Don't show section if no memberships
  }

  return (
    <section ref={ref as any} className="snap-start section-padding bg-gray-50 flex items-center" style={{ minHeight: '100vh' }}>
      <div className="container-max">
        <div className={`text-center mb-12 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Our Professional Memberships
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We are proud members of leading international business organizations, ensuring we stay connected 
            with global best practices and opportunities.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {memberships.map((membership, index) => (
            <div
              key={membership.id}
              className={`bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-all duration-1000 ease-out ${isVisible ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 rotate-12 scale-75'}`}
              style={{ transitionDelay: `${index * 200}ms`, transformOrigin: 'bottom center' }}>
              <div className="text-center">
                {membership.logoUrl ? (
                  <div className="w-16 h-16 mx-auto mb-4">
                    <img 
                      src={membership.logoUrl} 
                      alt={membership.title}
                      className="w-full h-full object-contain"
                    />
                  </div>
                ) : (
                  <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg
                      className="w-8 h-8 text-primary-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                      />
                    </svg>
                  </div>
                )}
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {membership.title}
                </h3>
                {membership.description && (
                  <p className="text-sm text-gray-600 mb-3">
                    {membership.description}
                  </p>
                )}
                {membership.partnershipType && (
                  <p className="text-sm text-primary-600 font-semibold mb-3">
                    {membership.partnershipType}
                  </p>
                )}
                {membership.websiteUrl && (
                  <a
                    href={membership.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block mt-4 text-primary-600 hover:text-primary-700 text-sm font-medium"
                  >
                    Visit Website →
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

