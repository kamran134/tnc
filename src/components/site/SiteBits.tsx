import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { resolveImageUrl } from '@/lib/utils/image';
import { formatDateDMY } from '@/lib/utils/date';
import type { NewsDto, TeamMemberDto } from '@/types/api';

/** Accent text link with a trailing arrow (44px touch target). */
export function ArrowLink({ href, children, className = '' }: { href: string; children: React.ReactNode; className?: string }) {
  return (
    <Link
      href={href}
      className={`inline-flex min-h-[44px] items-center gap-2 font-semibold text-navy-accent transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-navy-accent ${className}`}
    >
      {children}
      <ArrowRight className="h-[18px] w-[18px]" aria-hidden="true" />
    </Link>
  );
}

/** Primary (accent-filled) call-to-action link. */
export function PrimaryLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="inline-flex min-h-[56px] items-center gap-2.5 rounded-md bg-navy-accent px-7 font-semibold text-navy-950 transition-colors hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
    >
      {children}
      <ArrowRight className="h-[18px] w-[18px]" aria-hidden="true" />
    </Link>
  );
}

/** Square team portrait with the name and position overlaid at the bottom. */
export function TeamCard({ member, lang, compact = false }: { member: TeamMemberDto; lang: string; compact?: boolean }) {
  const img = resolveImageUrl(member.imageUrl);
  return (
    <Link
      href={`/${lang}/team/${member.id}`}
      className="group relative block aspect-[4/5] overflow-hidden rounded-[10px] bg-[#0B2E4F] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy-accent"
    >
      {img && (
        <Image
          src={img}
          alt={member.fullName}
          fill
          sizes="(min-width: 1280px) 25vw, (min-width: 640px) 33vw, 100vw"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />
      )}
      <span
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-[55%]"
        style={{ background: 'linear-gradient(0deg, rgba(5,20,36,0.95) 0%, rgba(5,20,36,0) 100%)' }}
      />
      <span className={`absolute inset-x-0 bottom-0 flex flex-col gap-1 ${compact ? 'p-4' : 'p-5'}`}>
        <span className={`${compact ? 'text-lg' : 'text-xl'} font-semibold text-navy-text`}>{member.fullName}</span>
        {member.position && (
          <span className={`${compact ? 'text-[13px]' : 'text-sm'} text-navy-text2`}>{member.position}</span>
        )}
      </span>
    </Link>
  );
}

/** News card for list/teaser grids. `featured` renders the wide image + text variant. */
export function NewsCard({ article, lang, readMore, featured = false }: { article: NewsDto; lang: string; readMore: string; featured?: boolean }) {
  const img = resolveImageUrl(article.imageUrl);
  const href = `/${lang}/news/${article.slug}`;
  const date = formatDateDMY(article.publishDate);

  if (featured) {
    return (
      <Link
        href={href}
        className="group flex flex-wrap overflow-hidden rounded-[10px] border border-navy-line bg-navy-800 transition-colors hover:border-[#3A6688] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy-accent"
      >
        <span className="relative block aspect-[16/10] min-w-0 flex-[1_1_420px] bg-navy-700">
          {img && <Image src={img} alt="" fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />}
        </span>
        <span className="box-border flex min-w-0 flex-[1_1_420px] flex-col justify-center gap-4 p-[clamp(24px,4vw,56px)]">
          {date && <span className="font-plexmono text-[13px] text-navy-muted">{date}</span>}
          <span className="text-[clamp(28px,3.2vw,42px)] font-semibold leading-[1.15] tracking-[-0.02em]">{article.title}</span>
          {article.excerpt && <span className="line-clamp-4 text-navy-text2">{article.excerpt}</span>}
          <span className="inline-flex min-h-[44px] items-center gap-2 font-semibold text-navy-accent">
            {readMore}
            <ArrowRight className="h-[18px] w-[18px]" aria-hidden="true" />
          </span>
        </span>
      </Link>
    );
  }

  return (
    <Link
      href={href}
      className="group flex flex-col gap-3.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-navy-accent"
    >
      <span className="relative block aspect-[16/10] w-full overflow-hidden rounded-[10px] bg-navy-700">
        {img && (
          <Image
            src={img}
            alt=""
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        )}
      </span>
      {date && <span className="font-plexmono text-[13px] text-navy-muted">{date}</span>}
      <span className="text-[22px] font-semibold leading-tight">{article.title}</span>
      {article.excerpt && <span className="line-clamp-3 text-[15px] text-navy-muted">{article.excerpt}</span>}
      <span className="inline-flex min-h-[44px] items-center gap-2 font-semibold text-navy-accent">
        {readMore}
        <ArrowRight className="h-[18px] w-[18px]" aria-hidden="true" />
      </span>
    </Link>
  );
}
