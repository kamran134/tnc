'use client';

import { useEffect, useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const LANGUAGES = [
  { code: 'az' as const, label: 'AZ' },
  { code: 'en' as const, label: 'EN' },
  { code: 'ru' as const, label: 'RU' },
];

interface SiteLanguageSwitcherProps {
  /** Render the three codes inline (mobile panel) instead of a dropdown. */
  inline?: boolean;
}

export default function SiteLanguageSwitcher({ inline = false }: SiteLanguageSwitcherProps) {
  const { locale, setLocale } = useLanguage();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
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
  }, [open]);

  if (inline) {
    return (
      <div className="flex items-center gap-2" role="group" aria-label="Language">
        {LANGUAGES.map((l) => (
          <button
            key={l.code}
            type="button"
            onClick={() => setLocale(l.code)}
            aria-pressed={locale === l.code}
            className={`inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-md border px-3 font-plexmono text-[13px] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-navy-accent ${
              locale === l.code
                ? 'border-navy-accent text-navy-accent'
                : 'border-navy-line text-navy-muted hover:text-white'
            }`}
          >
            {l.label}
          </button>
        ))}
      </div>
    );
  }

  const current = LANGUAGES.find((l) => l.code === locale) ?? LANGUAGES[0];

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="true"
        aria-expanded={open}
        aria-label="Language"
        className="inline-flex min-h-[44px] items-center gap-1.5 rounded-md px-2 font-plexmono text-[13px] text-navy-muted transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-navy-accent"
      >
        {current.label}
        <ChevronDown className={`h-4 w-4 transition-transform ${open ? 'rotate-180' : ''}`} aria-hidden="true" />
      </button>
      {open && (
        <div className="absolute right-0 top-full z-50 mt-1 min-w-[96px] overflow-hidden rounded-md border border-navy-line bg-navy-900 py-1 shadow-xl">
          {LANGUAGES.map((l) => (
            <button
              key={l.code}
              type="button"
              onClick={() => {
                setLocale(l.code);
                setOpen(false);
              }}
              aria-current={locale === l.code ? 'true' : undefined}
              className={`flex min-h-[44px] w-full items-center px-4 font-plexmono text-[13px] transition-colors hover:bg-navy-700 focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-navy-accent ${
                locale === l.code ? 'text-navy-accent' : 'text-navy-text2'
              }`}
            >
              {l.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
