'use client';

import { useLanguage } from '@/contexts/LanguageContext';

const LANGUAGES = [
  { code: 'az' as const, label: 'AZ' },
  { code: 'en' as const, label: 'EN' },
  { code: 'ru' as const, label: 'RU' },
];

/** Segmented AZ / EN / RU control for the light header (desktop and mobile panel). */
export default function SiteLanguageSwitcher() {
  const { locale, setLocale } = useLanguage();

  return (
    <div
      role="group"
      aria-label="Language"
      className="inline-flex items-center gap-0.5 rounded-lg border border-navy-hairline bg-white p-0.5"
    >
      {LANGUAGES.map((l) => {
        const active = locale === l.code;
        return (
          <button
            key={l.code}
            type="button"
            onClick={() => setLocale(l.code)}
            aria-pressed={active}
            className={`inline-flex min-h-[40px] min-w-[44px] items-center justify-center rounded-md px-2.5 font-plexmono text-[13px] font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-navy-petrol ${
              active ? 'bg-navy-petrol text-white' : 'text-navy-slate hover:bg-navy-mist hover:text-navy-petrol'
            }`}
          >
            {l.label}
          </button>
        );
      })}
    </div>
  );
}
