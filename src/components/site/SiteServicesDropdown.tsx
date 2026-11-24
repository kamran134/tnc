'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ChevronDown } from 'lucide-react';
import { useServiceCategories } from '@/hooks/queries';
import { useTranslations } from '@/hooks/useTranslations';
import { getServiceCategoryIconByName } from '@/lib/icons/service-category-icons';

interface SiteServicesDropdownProps {
  isMobile?: boolean;
  active?: boolean;
  onItemClick?: () => void;
}

export default function SiteServicesDropdown({ isMobile = false, active = false, onItemClick }: SiteServicesDropdownProps) {
  const params = useParams();
  const lang = (params.lang as string) || 'az';
  const { t } = useTranslations();
  const { data: categories = [], isLoading } = useServiceCategories(lang);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const sorted = [...categories].sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));

  useEffect(() => {
    if (!open || isMobile) return;
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open, isMobile]);

  useEffect(() => () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
  }, []);

  const handleItem = () => {
    setOpen(false);
    onItemClick?.();
  };

  const list = (
    <>
      {isLoading ? (
        <div className="px-4 py-3 text-sm text-navy-muted">{t('common.loading')}</div>
      ) : sorted.length === 0 ? (
        <div className="px-4 py-3 text-sm text-navy-muted">{t('services.noCategories')}</div>
      ) : (
        sorted.map((category) => {
          const Icon = getServiceCategoryIconByName(category.iconUrl);
          return (
            <Link
              key={category.id}
              href={`/${lang}/services/${category.code}`}
              onClick={handleItem}
              className="flex min-h-[44px] items-center gap-3 px-4 py-2 text-[15px] text-navy-text2 transition-colors hover:bg-navy-700 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-navy-accent"
            >
              {Icon && <Icon className="h-5 w-5 flex-none text-navy-accent" aria-hidden="true" />}
              <span>{category.name}</span>
            </Link>
          );
        })
      )}
      <Link
        href={`/${lang}/services/all`}
        onClick={handleItem}
        className="flex min-h-[44px] items-center gap-3 border-t border-navy-line px-4 py-2 text-[15px] font-semibold text-navy-accent transition-colors hover:bg-navy-700 focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-navy-accent"
      >
        {t('services.viewAll')}
      </Link>
    </>
  );

  if (isMobile) {
    return (
      <div>
        <div className="flex items-center justify-between">
          <Link
            href={`/${lang}/services`}
            onClick={handleItem}
            className={`inline-flex min-h-[44px] flex-1 items-center text-[17px] ${active ? 'text-navy-accent' : 'text-navy-text'}`}
          >
            {t('nav.services')}
          </Link>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label={t('nav.services')}
            className="inline-flex h-11 w-11 items-center justify-center text-navy-muted focus-visible:outline focus-visible:outline-2 focus-visible:outline-navy-accent"
          >
            <ChevronDown className={`h-5 w-5 transition-transform ${open ? 'rotate-180' : ''}`} aria-hidden="true" />
          </button>
        </div>
        {open && <div className="mb-2 ml-2 border-l border-navy-line">{list}</div>}
      </div>
    );
  }

  const scheduleClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setOpen(false), 150);
  };
  const cancelClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = null;
  };

  return (
    <div
      ref={ref}
      className="relative"
      onMouseEnter={() => {
        cancelClose();
        setOpen(true);
      }}
      onMouseLeave={scheduleClose}
    >
      <div className={`inline-flex min-h-[44px] items-center gap-1 border-b-2 ${active ? 'border-navy-accent text-navy-accent' : 'border-transparent'}`}>
        <Link
          href={`/${lang}/services`}
          aria-current={active ? 'page' : undefined}
          className="inline-flex min-h-[44px] items-center transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-navy-accent"
        >
          {t('nav.services')}
        </Link>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label={t('nav.services')}
          className="inline-flex h-8 w-6 items-center justify-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-navy-accent"
        >
          <ChevronDown className={`h-4 w-4 transition-transform ${open ? 'rotate-180' : ''}`} aria-hidden="true" />
        </button>
      </div>
      {open && (
        <div className="absolute left-0 top-full z-50 w-80 pt-2">
          <div className="overflow-hidden rounded-lg border border-navy-line bg-navy-900 py-1 shadow-xl">{list}</div>
        </div>
      )}
    </div>
  );
}
