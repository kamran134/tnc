'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import TeamMemberCard from '@/components/team/TeamMemberCard';
import { teamService, TeamMemberDto } from '@/lib/api';
import { LoadingSpinner, Alert } from '@/components/ui';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

interface TeamPageProps {
  params: Promise<{
    lang: string;
  }>;
}

export default function TeamPage({ params }: TeamPageProps) {
  const [lang, setLang] = useState<string>('az');
  const [teamMembers, setTeamMembers] = useState<TeamMemberDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { ref, isVisible } = useScrollAnimation();

  useEffect(() => {
    params.then(({ lang: resolvedLang }) => {
      setLang(resolvedLang);
      loadTeamMembers(resolvedLang);
    });
  }, [params]);

  const loadTeamMembers = async (language: string) => {
    try {
      setIsLoading(true);
      const data = await teamService.getAll(language as 'az' | 'en' | 'ru');
      setTeamMembers(data);
      setError(null);
    } catch (err) {
      setError('Failed to load team members');
      console.error('Team members error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Header />
      <main>
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-blue-600 to-blue-800 text-white py-24">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="container-max relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                {lang === 'az' ? 'Bizim Komanda' : lang === 'ru' ? 'Наша Команда' : 'Our Team'}
              </h1>
              <p className="text-xl text-primary-100">
                {lang === 'az'
                  ? 'Peşəkar komandamızla tanış olun - uğurunuzun arxasındakı mütəxəssislər'
                  : lang === 'ru'
                  ? 'Познакомьтесь с нашей профессиональной командой - экспертами вашего успеха'
                  : 'Meet our professional team - the experts behind your success'}
              </p>
            </div>
          </div>
        </section>

        {/* Team Members Section */}
        <section ref={ref as any} className="section-padding bg-gray-50">
          <div className="container-max">
            {isLoading ? (
              <div className="flex justify-center py-20">
                <LoadingSpinner />
              </div>
            ) : error ? (
              <div className="max-w-2xl mx-auto">
                <Alert type="error" message={error} />
              </div>
            ) : teamMembers.length === 0 ? (
              <div className="text-center py-20">
                <svg
                  className="mx-auto h-16 w-16 text-gray-400 mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                <p className="text-xl text-gray-600">
                  {lang === 'az'
                    ? 'Komanda üzvləri tapılmadı'
                    : lang === 'ru'
                    ? 'Члены команды не найдены'
                    : 'No team members found'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {teamMembers.map((member, index) => (
                  <TeamMemberCard
                    key={member.id}
                    member={member}
                    index={index}
                    isVisible={isVisible}
                  />
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
