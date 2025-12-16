'use client';

import { useState, memo } from 'react';

type LanguageCode = 'az' | 'en' | 'ru';

interface LanguageTabsProps {
  children: (activeLanguage: LanguageCode, languageIndex: number) => React.ReactNode;
}

const LANGUAGES = [
  { code: 'az' as LanguageCode, label: 'Azərbaycan' },
  { code: 'en' as LanguageCode, label: 'English' },
  { code: 'ru' as LanguageCode, label: 'Русский' },
];

function LanguageTabs({ children }: LanguageTabsProps) {
  const [activeLanguage, setActiveLanguage] = useState<LanguageCode>('az');

  const activeIndex = LANGUAGES.findIndex(lang => lang.code === activeLanguage);

  return (
    <div>
      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          {LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              type="button"
              onClick={() => setActiveLanguage(lang.code)}
              className={`
                whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                ${activeLanguage === lang.code
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }
              `}
            >
              {lang.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      <div>
        {children(activeLanguage, activeIndex)}
      </div>
    </div>
  );
}

export default memo(LanguageTabs);
