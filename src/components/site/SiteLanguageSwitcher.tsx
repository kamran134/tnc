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
  /** Segmented AZ / EN / RU row (mobile panel) instead of the compact dropdown. */
  inline?: boolean;
}

const focusRing = 'focus-visible:outline focus-visible:outline-2 focus-visible:outline-navy-petrol';

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
      <div role="group" aria-label="Language" className="inline-flex items-center gap-0.5 rounded-xl bg-navy-950/5 p-1">
        {LANGUAGES.map((l) => {
          const active = locale === l.code;
          return (
            <button
              key={l.code}
              type="button"
              onClick={() => setLocale(l.code)}
              aria-pressed={active}
              className={`inline-flex min-h-[40px] min-w-[44px] items-center justify-center rounded-lg px-2.5 font-plexmono text-[13px] font-semibold transition-colors ${focusRing} ${
                active ? 'bg-white text-navy-petrol shadow-sm' : 'text-navy-slate hover:text-navy-petrol'
              }`}
            >
              {l.label}
            </button>
          );
        })}
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
        className={`inline-flex min-h-[44px] items-center gap-1 rounded-xl px-3 font-plexmono text-[13px] font-semibold text-navy-slate transition-colors hover:bg-navy-950/5 hover:text-navy-petrol ${focusRing}`}
      >
        {current.label}
        <ChevronDown className={`h-4 w-4 transition-transform ${open ? 'rotate-180' : ''}`} aria-hidden="true" />
      </button>
      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 min-w-[96px] overflow-hidden rounded-xl border border-navy-hairline bg-white py-1 shadow-[0_12px_32px_rgba(7,27,46,0.18)]">
          {LANGUAGES.map((l) => (
            <button
              key={l.code}
              type="button"
              onClick={() => {
                setLocale(l.code);
                setOpen(false);
              }}
              aria-current={locale === l.code ? 'true' : undefined}
              className={`flex min-h-[44px] w-full items-center px-4 font-plexmono text-[13px] font-semibold transition-colors hover:bg-navy-mist focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-navy-petrol ${
                locale === l.code ? 'text-navy-petrol' : 'text-navy-slate'
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
