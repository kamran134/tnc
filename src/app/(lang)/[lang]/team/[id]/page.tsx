'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { Mail, Phone } from 'lucide-react';
import SiteShell from '@/components/site/SiteShell';
import { TeamCard } from '@/components/site/SiteBits';
import { useTeamList, useTeamMemberQuery } from '@/hooks/site/useSiteQueries';
import { useTranslations } from '@/hooks/useTranslations';
import { resolveImageUrl } from '@/lib/utils/image';
import { formatPhone, phoneHref } from '@/lib/utils/phone';
import type { LanguageCode } from '@/types/api';

const paragraphs = (text?: string | null) =>
  (text ?? '')
    .split(/\r?\n+/)
    .map((p) => p.trim())
    .filter(Boolean);

export default function TeamMemberPage() {
  const params = useParams();
  const lang = ((params.lang as string) || 'az') as LanguageCode;
  const id = Number(params.id);
  const { t } = useTranslations();
  const { data: member, isLoading } = useTeamMemberQuery(id, lang);
  const { data: allMembers = [] } = useTeamList(lang);

  const others = allMembers.filter((m) => m.id !== id).slice(0, 4);
  const found = !!member?.fullName;
  const photo = resolveImageUrl(member?.imageUrl);
  const rowLink =
    'flex min-h-[44px] items-center gap-3.5 transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-navy-accent';

  return (
    <SiteShell>
      <section className="site-wrap flex flex-col gap-10 pb-24 pt-10">
        <Link
          href={`/${lang}/team`}
          className="inline-flex min-h-[44px] items-center gap-2 self-start font-semibold text-navy-accent transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-navy-accent"
        >
          <span aria-hidden="true">←</span> {t('nav.team')}
        </Link>

        {isLoading ? (
          <div className="flex flex-wrap gap-14" aria-hidden="true">
            <div className="aspect-[4/5] max-w-[520px] flex-[1_1_380px] animate-pulse rounded-[10px] bg-navy-800" />
            <div className="h-64 min-w-0 flex-[999_1_560px] animate-pulse rounded-[10px] bg-navy-800" />
          </div>
        ) : !found || !member ? (
          <p className="m-0 text-navy-text2">{t('common.noResults')}</p>
        ) : (
          <div className="flex flex-wrap items-start gap-14">
            <div className="flex max-w-[520px] flex-[1_1_380px] flex-col gap-6">
              <div className="relative aspect-[4/5] overflow-hidden rounded-[10px] bg-[#0B2E4F]">
                {photo && (
                  <Image
                    src={photo}
                    alt={member.fullName}
                    fill
                    priority
                    sizes="(min-width: 1024px) 40vw, 100vw"
                    className="object-cover"
                  />
                )}
                <span
                  aria-hidden="true"
                  className="absolute inset-x-0 bottom-0 h-[30%]"
                  style={{ background: 'linear-gradient(0deg, rgba(5,20,36,0.7) 0%, rgba(5,20,36,0) 100%)' }}
                />
              </div>
              {(member.email || member.phone) && (
                <div className="flex flex-col gap-1">
                  {member.email && (
                    <a href={`mailto:${member.email}`} className={`${rowLink} break-all`}>
                      <Mail className="h-[22px] w-[22px] flex-none text-navy-accent" strokeWidth={1.6} aria-hidden="true" />
                      {member.email}
                    </a>
                  )}
                  {member.phone && (
                    <a href={phoneHref(member.phone)} className={rowLink}>
                      <Phone className="h-[22px] w-[22px] flex-none text-navy-accent" strokeWidth={1.6} aria-hidden="true" />
                      {formatPhone(member.phone)}
                    </a>
                  )}
                </div>
              )}
            </div>

            <div className="flex min-w-0 flex-[999_1_560px] flex-col gap-5">
              <h1 className="m-0 text-[clamp(38px,4.6vw,60px)] font-semibold leading-[1.05] tracking-[-0.03em]">
                {member.fullName}
              </h1>
              {member.position && <p className="m-0 text-xl font-medium text-navy-accent">{member.position}</p>}
              {paragraphs(member.positionDescription).length > 0 && (
                <>
                  <h2 className="mb-0 mt-6 text-[26px] font-semibold tracking-[-0.015em]">{t('team.positionDescription')}</h2>
                  {paragraphs(member.positionDescription).map((p, i) => (
                    <p key={i} className="m-0 text-navy-text2">
                      {p}
                    </p>
                  ))}
                </>
              )}
              {paragraphs(member.bio).length > 0 && (
                <>
                  <h2 className="mb-0 mt-6 text-[26px] font-semibold tracking-[-0.015em]">{t('team.bio')}</h2>
                  {paragraphs(member.bio).map((p, i) => (
                    <p key={i} className="m-0 text-navy-text2">
                      {p}
                    </p>
                  ))}
                </>
              )}
            </div>
          </div>
        )}
      </section>

      {others.length > 0 && (
        <section className="border-t border-navy-line bg-navy-900">
          <div className="site-wrap flex flex-col gap-9 pb-24 pt-16 md:pt-[88px]">
            <h2 className="site-h2">{t('nav.team')}</h2>
            <div className="grid grid-cols-[repeat(auto-fill,minmax(min(220px,100%),1fr))] gap-4">
              {others.map((m) => (
                <TeamCard key={m.id} member={m} lang={lang} compact />
              ))}
            </div>
          </div>
        </section>
      )}
    </SiteShell>
  );
}
